//const {mongoose, schema, comment, post_images, post, tag, user} = require("../db/mongoSchemas/index")

const { mongoose, schema, post_images } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")

const getPostImages = async (_, res) => {
  const redisKey = 'PostImages:todos';
  try {
    const cachedPostImages = await rediscache.get(redisKey);
    if (cachedPostImages) {
      return res.status(200).json(JSON.parse(cachedPostImages));
    }

    const postImages = await post_images.find()
      .select('url')
      .populate('post.Descripcion post.FechaDeCreacion')
    await rediscache.set(redisKey, JSON.stringify(postImages), { EX: 300 });
    res.status(200).json(postImages);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getPostImagePorId = async (req, res) => {
  const id = req.params.id;
  const redisKey = `PostImage:${id};`

  try {
    const cachedPostImages = await rediscache.get(redisKey);
    if (cachedPostImages) {
      return res.status(200).json(JSON.parse(cachedPostImages));
    }
    const postImage = await post_images.findById(id);
    if (!postImage) {
      return res.status(404).json({ message: 'No se encontro la imagen' });
    }
    await rediscache.set(redisKey, JSON.stringify(postImage), { EX: 300 });
    res.status(200).json(postImage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const crearPostImage = async (req, res) => {
  try {
    const newPostImage = new post_images(req.body);
    await newPostImage.save();
    await rediscache.del('PostImages:todos');
    res.status(201).json(newPostImage);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const modificarPostImage = async (req, res) => {
  try {
    const postImageActualizada = await post_images.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!postImageActualizada) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    await rediscache.del(`PostImage:${req.params.id}`);
    await rediscache.del('PostImages:todos');
    res.status(200).json({ mensaje: 'Imagen actualizada', post_image: postImageActualizada });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la imagen', error: error.message });
  }
};

const eliminarPostImagePorId = async (req, res) => {
  try {
    const postImagesId = req.params.id;

    const postImageEliminada = await post_images.findByIdAndDelete(post_imagesId);
    if (!postImageEliminada) {
      return res.status(404).json({ mensaje: 'Imagen no encontrada' });
    }

    await rediscache.del(`PostImage:${postImagesId}`);
    await rediscache.del('PostImages:todos');

    res.status(200).json({ mensaje: 'Imagen eliminada', post_image: postImageEliminada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la imagen', error: error.message });
  }
};

module.exports = {
  getPostImages,
  getPostImagePorId,
  crearPostImage,
  modificarPostImage,
  eliminarPostImagePorId
};