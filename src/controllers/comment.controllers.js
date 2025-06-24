const { mongoose, schema, comment, user, post } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")
const TTL =  process.env.TTL ?? 60

const getComentarios = async (_, res) => {
  const redisKey = 'Comentarios:todos';
  try {
    
    const comentarios = await comment.find()
      .select('mensaje FechaDePublicacion visibilidad')
      .populate({ path: 'usuario', select: 'nickName email -_id' })
      .populate({ path: 'posteo', select: 'Descripcion FechaDeCreacion -_id' })
    await rediscache.set(redisKey, JSON.stringify(comentarios), { EX: TTL });
    res.status(200).json(comentarios);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getComentarioPorId = async (req, res) => {
  const id = req.params.id;
   const redisKey = `Comentarios:${id};`

  try {
  
    const comentario = await comment.findById(id)
      .select('mensaje FechaDePublicacion visibilidad')
      .populate({ path: 'usuario', select: 'nickName email -_id' })
      .populate({ path: 'posteo', select: 'Descripcion FechaDeCreacion -_id' })
    await rediscache.set(redisKey, JSON.stringify(comentario), { EX: TTL });
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
    const meses = parseInt(process.env.MESES_VISIBLES) || 6;
    const fechaLimite = new Date()
    
    

    fechaLimite.setMonth(fechaLimite.getMonth() - meses)
    
    const visibilidad =   fechaLimite < new Date(FechaDePublicacion)  ;



    if (!usuarioCreador) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (!posteoDelComentario) {
      return res.status(404).json({ error: 'Posteo no encontrado' });
    }
    const newComment = new comment({
      mensaje,
      FechaDePublicacion,
      visibilidad,
      usuario,
      posteo

    })
    
    
    usuarioCreador.comentarios.push(newComment._id)
    await usuarioCreador.save()
    posteoDelComentario.comentarios.push(newComment._id)
    await posteoDelComentario.save()
    await newComment.save();
    


    await rediscache.del('Comentarios:todos');
    await rediscache.del('Posteos:todos');
    await rediscache.del(`Posteos:${posteoDelComentario}`);
    await rediscache.del('Users:todos');
    await rediscache.del(`Users:${usuarioCreador}`);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const modificarComentario = async (req, res) => {
  const usuarioCreador = await user.findOne({comentarios:req.params.id})
  const posteoDelComentario = await post.findOne({comentarios:req.params.id})
  try {
    const comentarioActualizado = await comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!comentarioActualizado) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    await rediscache.del(`Comentarios:${req.params.id}`);
    await rediscache.del('Comentarios:todos');
    await rediscache.del('Posteos:todos');
    await rediscache.del(`posteos:${posteoDelComentario}`);
    await rediscache.del('Users:todos');
    await rediscache.del(`Users:${usuarioCreador}`);
    res.status(200).json({ mensaje: 'Comentario actualizado', comentario: comentarioActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el comentario', error: error.message });
  }
};

const eliminarComentarioPorId = async (req, res) => {
  const usuarioCreador = await user.findOne({comentarios:req.params.id})
  const posteoDelComentario = await post.findOne({comentarios:req.params.id})
  try {
    const commentId = req.params.id;

    const comentarioEliminado = await comment.findByIdAndDelete(commentId);
    if (!comentarioEliminado) {
      return res.status(404).json({ mensaje: 'Comentario no encontrado' });
    }

    await rediscache.del(`Comentarios:${req.params.id}`);
    await rediscache.del('Comentarios:todos');
    await rediscache.del('Posteos:todos');
    await rediscache.del(`posteos:${posteoDelComentario}`);
    await rediscache.del('Users:todos');
    await rediscache.del(`Users:${usuarioCreador}`);

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