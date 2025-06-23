const { request } = require("express");
const { mongoose, schema, tag } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")

const getTags = async (_, res) => {
  const redisKey = 'Tags:todos';
  try {
    

    const Tag = await tag.find()
      .select('name')
      .populate({
        path: 'posteos',
        select: 'Descripcion FechaDeCreacion usuario -_id',
        populate: { path: 'usuario', select: 'nickName email -_id' }
      })
    await rediscache.set(redisKey, JSON.stringify(Tag), { EX: 60 });
    res.status(200).json(Tag);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTagPorId = async (req, res) => {
  const id = req.params.id;
  const redisKey = `Tags:${id}`;

  try {
    
    const etiqueta = await tag.findById(id)
      .select('name')
      .populate({
        path: 'posteos',
        select: 'Descripcion FechaDeCreacion usuario -_id',
        populate: { path: 'usuario', select: 'nickName email -_id' }
      });
    if (!etiqueta) {
      return res.status(404).json({ message: 'No se encontro el tag' });
    }
    await rediscache.set(redisKey, JSON.stringify(etiqueta), { EX: 60 });
    res.status(200).json(etiqueta);
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

    await rediscache.del(`Tags:${req.params.id}`);
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