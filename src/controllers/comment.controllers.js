const { mongoose, schema, comment, user, post } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")

const getComentarios = async (_, res) => {
  //const redisKey = 'Comentarios:todos';
  try {
    //const cachedComments = await rediscache.get(redisKey);
    //if (cachedComments) {
    // return res.status(200).json(JSON.parse(cachedComments));
    //}

    const comentarios = await comment.find()
      .select('mensaje FechaDePublicacion')
      .populate({ path: 'usuario', select: 'nickName email -_id' })
      .populate({ path: 'posteo', select: 'Descripcion FechaDeCreacion -_id' })
    //await rediscache.set(redisKey, JSON.stringify(comentarios), { EX: 300 });
    res.status(200).json(comentarios);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getComentarioPorId = async (req, res) => {
  const id = req.params.id;
  // const redisKey = `Comentario:${id};`

  try {
    // const cachedComments = await rediscache.get(redisKey);
    //if (cachedComments) {
    //  return res.status(200).json(JSON.parse(cachedComments));
    //}
    const comentario = await comment.findById(id)
      .select('mensaje FechaDePublicacion')
      .populate({ path: 'usuario', select: 'nickName email -_id' })
      .populate({ path: 'posteo', select: 'Descripcion FechaDeCreacion -_id' })
    if (!comentario) {
      return res.status(404).json({ message: 'No se encontro el comentario' });
    }
    //await rediscache.set(redisKey, JSON.stringify(comentario), { EX: 300 });
    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const crearComentario = async (req, res) => {
  try {
    const { mensaje, FechaDePublicacion, usuario, posteo } = req.body;
    const usuarioCreador = await user.findById(usuario)
    const posteoDelComentario = await post.findById(posteo)

    if (!usuarioCreador) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const newComment = new comment({
      mensaje,
      FechaDePublicacion,
      usuario,
      posteo

    })
    usuarioCreador.comentarios.push(newComment._id)
    await usuarioCreador.save()
    posteoDelComentario.comentarios.push(newComment._id)
    await posteoDelComentario.save()
    await newComment.save();


    //await rediscache.del('Comentarios:todos');
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const modificarComentario = async (req, res) => {
  try {
    const comentarioActualizado = await comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!comentarioActualizado) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    //await rediscache.del(`Comentario:${req.params.id}`);
    //await rediscache.del('Comentarios:todos');
    res.status(200).json({ mensaje: 'Comentario actualizado', comentario: comentarioActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el comentario', error: error.message });
  }
};

const eliminarComentarioPorId = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comentarioEliminado = await comment.findByIdAndDelete(commentId);
    if (!comentarioEliminado) {
      return res.status(404).json({ mensaje: 'Comentario no encontrado' });
    }

    // await rediscache.del(`Comentario:${commentId}`);
    //await rediscache.del('Comentarios:todos');

    res.status(200).json({ mensaje: 'Comentario eliminado', comentario: comentarioEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el comentario', error: error.message });
  }
};

module.exports = {
  getComentarios,
  getComentarioPorId,
  crearComentario,
  modificarComentario,
  eliminarComentarioPorId
};