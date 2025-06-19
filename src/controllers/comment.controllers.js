const {mongoose, schema, comment} = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")

const getComentarios = async (_, res) => {
    const redisKey = 'comentarios:todos';
    try {
      const cachedComments = await rediscache.get(redisKey);
      if (cachedComments) {
        return res.status(200).json(JSON.parse(cachedComments));
      }
  
      const comentarios = await comment.find()
      .select('mensaje FechaDePublicacion')
      .populate('user.nickName user.email')
      .populate('post.Descripcion post.FechaDeCreacion')
      await rediscache.set(redisKey, JSON.stringify(comentarios), { EX: 300 });
      res.status(200).json(comentarios);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  const getComentarioPorId = async (req, res) => {
    const id = req.params.id;
    const redisKey = `comentario:${id};`
  
    try {
      const cachedComments = await rediscache.get(redisKey);
      if (cachedComments) {
        return res.status(200).json(JSON.parse(cachedComments));
      }
      const comentario = await comment.findById(id);
      if (!comentario) {
        return res.status(404).json({ message: 'No se encontro el comentario' });
      }
      await rediscache.set(redisKey, JSON.stringify(comentario), { EX: 300 });
      res.status(200).json(comentario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  const crearComentario = async (req, res) => {
    try {
      const newComment = new comment(req.body);
      await newComment.save();
      await rediscache.del('comentarios:todos');
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  };
  
  const eliminarComentarioPorId = async (req, res) => { 
    try {
      const commentId = req.params.id;
  
      const comentarioEliminado = await comment.findByIdAndDelete(commentId);
      if (!comentarioEliminado) {
        return res.status(404).json({ mensaje: 'Comentario no encontrado' });
      }
  
      await rediscache.del(`comentario:${commentId}`);
      await rediscache.del('Comentarios:todos');
  
      res.status(200).json({ mensaje: 'Comentario eliminado', comentario: comentarioEliminado });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar el comentario', error: error.message });
    }
  };
  

  const modificarComentario = async (req, res) => {
    try {
      const comentarioActualizado = await comment.findByIdAndUpdate(req.params.id, req.body, {new: true})
      if (!comentarioActualizado) {
        return res.status(404).json({ message: 'Comentario no encontrado' });
      }
  
      await rediscache.del(`comentario:${req.params.id}`);
      await rediscache.del('Comentarios:todos');
      res.status(200).json({ mensaje: 'Comentario actualizado', comentario: comentarioActualizado });
    } catch (error) {
      res.status(400).json({ mensaje: 'Error al actualizar el comentario', error: error.message });
    }
  };
  
module.exports = {
  getComentarios,
  getComentarioPorId,
  crearComentario,
  eliminarComentarioPorId,
  modificarComentario
};