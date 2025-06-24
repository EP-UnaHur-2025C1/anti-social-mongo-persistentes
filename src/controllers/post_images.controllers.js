//const {mongoose, schema, comment, post_images, post, tag, user} = require("../db/mongoSchemas/index")

const { mongoose, schema, post_Image, post, user } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")
const TTL =  process.env.TTL ?? 60

const getPostImages = async (_, res) => {
  const redisKey = 'PostImages:todos';
  try {
   

    const postImages = await post_Image.find()
      .select('url')
      .populate({ path: 'posteo', select: 'Descripcion FechaDeCreacion -_id' })
    await rediscache.set(redisKey, JSON.stringify(postImages), { EX: TTL });
    res.status(200).json(postImages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPostImagePorId = async (req, res) => {
  const id = req.params.id;
  const redisKey = `PostImages:${id}`;

  try {
    
    const postImage = await post_Image.findById(id)
      .select('url')
      .populate({ path: 'posteo', select: 'Descripcion FechaDeCreacion -_id' });
    if (!postImage) {
      return res.status(404).json({ message: 'No se encontro el post' });
    }
    await rediscache.set(redisKey, JSON.stringify(postImage), { EX: TTL });
    res.status(200).json(postImage);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la imagen', error: error.message});
  }
};

const crearPostImage = async (req, res) => {
  try {
    
    const { url, posteo } = req.body;
    const posteoDeLaImagen = await post.findById(posteo)
    const usuarioDelPosteo = await user.findOne({posteos: posteoDeLaImagen._id})
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


    await rediscache.del('PostImages:todos');
    await rediscache.del('Posteos:Todos');
    await rediscache.del(`Posteos:${posteoDeLaImagen}`)
    await rediscache.del('Users:Todos');
    await rediscache.del(`Users:${usuarioDelPosteo}`)


    res.status(201).json(newPostImage);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const modificarPostImage = async (req, res) => {
  const posteoDeLaImagen = await post.findOne({posteo: await post_Image.findById(req.params.id)})
  const usuarioDelPosteo = await user.findOne({posteos: posteoDeLaImagen})
  try {
    const postImageActualizada = await post_Image.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!postImageActualizada) {
      return res.status(404).json({ message: 'Posteo al que se quiere asignar la imagen no encontrado' });
    }

    await rediscache.del(`PostImages:${req.params.id}`);
    await rediscache.del('PostImages:todos');
    await rediscache.del(`Posteos:${posteoDeLaImagen}`)
    await rediscache.del('Users:Todos');
    await rediscache.del(`Users:${usuarioDelPosteo}`)
    res.status(200).json({ mensaje: 'Imagen actualizada', post_image: postImageActualizada });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar la imagen', error: error.message });
  }
};

const eliminarPostImagePorId = async (req, res) => {
  const postImagesId = req.params.id;
  const posteoDeLaImagen = await post.findOne({posteo: await post_Image.findById(postImagesId)})
  const usuarioDelPosteo = await user.findOne({posteos: posteoDeLaImagen})
  try {

    const postImageEliminada = await post_Image.findByIdAndDelete(postImagesId);
    if (!postImageEliminada) {
      return res.status(404).json({ mensaje: 'Posteo al que se quiere asignar la imagen no encontrado' });
    }

    await rediscache.del(`PostImages:${postImagesId}`);
    await rediscache.del('PostImages:todos');
    await rediscache.del(`Posteos:${posteoDeLaImagen}`)
    await rediscache.del('Users:Todos');
    await rediscache.del(`Users:${usuarioDelPosteo}`)

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
