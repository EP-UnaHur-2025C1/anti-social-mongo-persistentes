const { request } = require("express");
const { mongoose, schema, tag } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")

const getTags = async (_, res) => {
  const redisKey = 'Tags:todos';
  try {
    const cachedTag = await rediscache.get(redisKey);
    if (cachedTag) {
      return res.status(200).json(JSON.parse(cachedTag));
    }

    const Tag = await tag.find()
      .select('name')
      .populate('posts.Descripcion posts.FechaDeCreacion')
    await rediscache.set(redisKey, JSON.stringify(Tag), { EX: 300 });
    res.status(200).json(Tag);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTagPorId = async (req, res) => {
  const id = req.params.id;
  const redisKey = `Tag:${id}`;

  try {
    const cachedTag = await rediscache.get(redisKey);
    if (cachedTag) {
      return res.status(200).json(JSON.parse(cachedTag));
    }
    const tag = await tag.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'No se encontro el tag' });
    }
    await rediscache.set(redisKey, JSON.stringify(tag), { EX: 300 });
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const crearTag = async (req, res) => {
  try {
    const newTag = new tag(req.body);
    await newTag.save();
    await rediscache.del('Tags:todos');
    res.status(201).json(newTag);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const modificarTag = async (req, res) => {
  try {
    const tagActualizado = await tag.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!tagActualizado) {
      return res.status(404).json({ message: 'tag no encontrado' });
    }

    await rediscache.del(`Tag:${req.params.id}`);
    await rediscache.del('Tags:todos');
    res.status(200).json({ mensaje: 'tag actualizado', tag: tagActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el tag', error: error.message });
  }
};

const eliminarTagPorId = async (req, res) => {
  try {
    const tagId = req.params.id;

    const tagEliminado = await tag.findByIdAndDelete(tagId);
    if (!tagEliminado) {
      return res.status(404).json({ mensaje: 'Tag no encontrado' });
    }

    await rediscache.del(`Tag:${tagId}`);
    await rediscache.del('Tags:todos');

    res.status(200).json({ mensaje: 'Tag eliminado', tag: tagEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el Tag', error: error.message });
  }
};

module.exports = {
  getTags,
  getTagPorId,
  crearTag,
  modificarTag,
  eliminarTagPorId
};