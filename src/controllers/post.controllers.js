const { request } = require("express");
const { mongoose, schema, post, user, tag, comment, post_Image } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")

const getPosts = async (_, res) => {
  const redisKey = 'Posteos:todos';
  try {


    const Post = await post.find()
      .select('Descripcion FechaDeCreacion')
      .populate({ path: 'usuario', select: 'nickName email -_id' })
      .populate({ path: 'comentarios', match: { visibilidad: true }, select: 'mensaje FechaDePublicacion -_id' })
      .populate({ path: 'imagenes', select: 'url -_id' })
      .populate({ path: 'etiquetas', select: 'name -_id' });
    await rediscache.set(redisKey, JSON.stringify(Post), { EX: 300 });
    res.status(200).json(Post);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getPostPorId = async (req, res) => {
  const id = req.params.id;
  const redisKey = `Posteos:${id}`;


  try {

    const posteo = await post.findById(id)
      .populate({ path: 'usuario', select: 'nickName email -_id' })
      .populate({ path: 'comentarios', match: { visibilidad: true }, select: 'mensaje FechaDePublicacion -_id' })
      .populate({ path: 'imagenes', select: 'url -_id' })
      .populate({ path: 'etiquetas', select: 'name -_id' });
    if (!posteo) {
      return res.status(404).json({ message: 'No se encontro el post' });
    }
    await rediscache.set(redisKey, JSON.stringify(posteo), { EX: 300 });
    res.status(200).json(JSON.parse(JSON.stringify(posteo)));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const crearPost = async (req, res) => {
  try {
    const { Descripcion, FechaDeCreacion, userId } = req.body
    const usuarioCreador = await user.findById(userId)

    if (!usuarioCreador) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const newPost = new post({
      Descripcion,
      FechaDeCreacion,
      usuario: usuarioCreador
    });

    await newPost.save();

    usuarioCreador.posteos.push(newPost._id)
    await usuarioCreador.save()
    await rediscache.del('Posteos:todos');
    await rediscache.del('Users:todos');
    await rediscache.del(`Users:${usuarioCreador}`);

    res.status(201).json(JSON.parse(JSON.stringify(newPost)));
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const modificarPost = async (req, res) => {
  const usuarioCreador = await user.findOne({ posteos: req.params.id })
  const postOriginal = await post.findById(req.params.id)
  try {
    const postActualizado = await post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!postActualizado) {
      return res.status(404).json({ message: 'post no encontrado' });
    }

  
   await rediscache.del('Posteos:todos');
   await rediscache.del(`Posteos:${req.params.id}`);
   await rediscache.del('Users:todos');
   await rediscache.del(`Users:${usuarioCreador}`);
   await rediscache.del('Tags:todos');
   if (postOriginal.etiquetas.length) {
     for (const tag of postOriginal.tags) {
       await rediscache.del(`Tag:${tag}`);
     }
    res.status(200).json({ mensaje: 'post actualizado ', post: postActualizado });
  }
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el post', error: error.message });
  }
};

const agregarTagAlPost = async (req, res) => {
  const usuarioCreador = await user.findOne({ posteos: req.params.id })
  try {
    const postId = await req.params.id
    const tagAgregado = await tag.findById(req.body.etiquetas)
    const postActualizado = await post.findByIdAndUpdate(postId, req.body, { new: true })
    if (!postActualizado) {
      return res.status(404).json({ message: 'post no encontrado' });
    }



    tagAgregado.posteos.push(postActualizado._id);
    await tagAgregado.save()

    await rediscache.del('Posteos:todos');
    await rediscache.del('Users:todos');
    await rediscache.del(`Users:${usuarioCreador}`);
    await rediscache.del(`Tag:${tagAgregado}`);
    await rediscache.del('Tags:todos');
    res.status(200).json({ mensaje: 'tag agregado al post ', post: postActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el post', error: error.message });
  }
}

const eliminarPostPorId = async (req, res) => {
  const usuarioCreador = await user.findOne({ posteos: req.params.id })
  try {
    const postId = req.params.id;

    await comment.deleteMany({ posteo: postId })
    await post_Image.deleteMany({ posteo: postId })
    const postEliminado = await post.findByIdAndDelete(postId);
    if (!postEliminado) {
      return res.status(404).json({ mensaje: 'Post no encontrado' });
    }

    await user.findByIdAndUpdate(
      postEliminado.user,
      { $pull: { posteos: postEliminado._id } }
    );


    await rediscache.del(`Posteos:${postId}`);
    await rediscache.del('Posteos:todos');
    await rediscache.del('Users:todos');
    await rediscache.del(`Users:${usuarioCreador}`);


    res.status(200).json({ mensaje: 'Post eliminado', post: postEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el Post', error: error.message });
  }
};


module.exports = {
  getPosts,
  getPostPorId,
  crearPost,
  modificarPost,
  eliminarPostPorId,
  agregarTagAlPost
};