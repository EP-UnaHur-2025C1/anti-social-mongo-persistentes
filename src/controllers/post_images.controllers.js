//const {mongoose, schema, comment, post_images, post, tag, user} = require("../db/mongoSchemas/index")

const { mongoose, schema, post_Image, post } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")

const getPostImages = async (_, res) => {
  //const redisKey = 'PostImages:todos';
  try {
    //const cachedPostImages = await rediscache.get(redisKey);
    //if (cachedPostImages) {
     // return res.status(200).json(JSON.parse(cachedPostImages));
    //}

    const postImages = await post_Image.find()
      .select('url')
      .populate({ path: 'posteo', select: 'Descripcion FechaDeCreacion -_id' })
    //await rediscache.set(redisKey, JSON.stringify(postImages), { EX: 300 });
    res.status(200).json(postImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostImagePorId = async (req, res) => {
  const id = req.params.id;
  //const redisKey = `PostImage:${id}`;

  try {
    //const cachedPostImages = await rediscache.get(redisKey);
    //if (cachedPostImages) {
      //return res.status(200).json(JSON.parse(cachedPostImages));
    //}
    const postImage = await post_Image.findById(id)
      .select('url')
      .populate({ path: 'posteo', select: 'Descripcion FechaDeCreacion -_id' });
    if (!postImage) {
      return res.status(404).json({ message: 'No se encontro el post' });
    }
    //await rediscache.set(redisKey, JSON.stringify(postImage), { EX: 300 });
    res.status(200).json(postImage);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la imagen', error: error.message});
  }
};

const crearPostImage = async (req, res) => {
  try {
    
    const { url, posteo } = req.body;
    const posteoDeLaImagen = await post.findById(posteo)
    if (!posteoDeLaImagen) {
      return res.status(404).json({ error: 'Posteo al que se quiere asignar la imagen no encontrado' });
    }
    const newPostImage = new post_Image({
      url,
      posteo: posteoDeLaImagen
    });
    posteoDeLaImagen.imagenes.push(newPostImage._id)
    await posteoDeLaImagen.save()

    await newPostImage.save();


    //await rediscache.del('PostImages:todos');
    res.status(201).json(newPostImage);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const modificarPostImage = async (req, res) => {
  try {
    const postImageActualizada = await post_Image.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!postImageActualizada) {
      return res.status(404).json({ message: 'Posteo al que se quiere asignar la imagen no encontrado' });
    }

    //await rediscache.del(`PostImage:${req.params.id}`);
    //await rediscache.del('PostImages:todos');
    res.status(200).json({ mensaje: 'Imagen actualizada', post_image: postImageActualizada });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la imagen', error: error.message });
  }
};

const eliminarPostImagePorId = async (req, res) => {
  try {
    const postImagesId = req.params.id;

    const postImageEliminada = await post_Image.findByIdAndDelete(postImagesId);
    if (!postImageEliminada) {
      return res.status(404).json({ mensaje: 'Posteo al que se quiere asignar la imagen no encontrado' });
    }

    //await rediscache.del(`PostImage:${postImagesId}`);
    //await rediscache.del('PostImages:todos');

    res.status(200).json({ mensaje: 'Imagen eliminada', post_Image: postImageEliminada });
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
