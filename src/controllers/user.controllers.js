const { request } = require("express");
const { mongoose, schema, user, post,comment } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")
const TTL =  process.env.TTL ?? 60

const getUsers = async (_, res) => {
  const redisKey = 'Users:todos';
  try {
   
    
    const User = await user.find()
      .select('nickName email')
      .populate({path:'posteos', select: 'Descripcion FechaDeCreacion -_id'})
      .populate({
        path:'comentarios',
        match:{visibilidad:true},
        select: 'mensaje FechaDePublicacion -_id',
        populate:{path:'posteo',select:'Descripcion -_id'}
      });
    await rediscache.set(redisKey, JSON.stringify(User), { EX: TTL });
    res.status(200).json(User);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getUserPorId = async (req, res) => {
  const id = req.params.id;
  const redisKey = `Users:${id}`;

  try {
  
    const usuario = await user.findById(id)
    .populate({path:'posteos', select: 'Descripcion FechaDeCreacion -_id'})
    .populate({
        path:'comentarios',
        match:{visibilidad:true},
        select: 'mensaje FechaDePublicacion -_id',
        populate:{path:'posteo',select:'Descripcion -_id'}
      });
    if (!usuario) {
      return res.status(404).json({ message: 'No se encontro el user' });
    }
    await rediscache.set(redisKey, JSON.stringify(usuario), { EX: TTL });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const crearUser = async (req, res) => {
  try {
    const newUser = new user(req.body);
    await newUser.save();
    await rediscache.del('Users:todos');
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
};

const modificarUser = async (req, res) => {
  try {
    const userActualizado = await user.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!userActualizado) {
      return res.status(404).json({ message: 'user no encontrado' });
    }

    await rediscache.del(`Users:${req.params.id}`);
    await rediscache.del('Users:todos');
    await rediscache.del('Posteos:todos');
    await rediscache.del('Tags:todos');
    await rediscache.del('Comentarios:todos');

    if (userActualizado.posteos.length) {
         for (const post of userActualizado.posteos) {
           await rediscache.del(`Posteos:${post}`);
         }
        }
   if (userActualizado.comentarios.length) {
         for (const comentario of userActualizado.comentarios) {
           await rediscache.del(`Comentarios:${comentario}`);
         }
        }
    res.status(200).json({ mensaje: 'user actualizado', user: userActualizado });
  
}catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el user', error: error.message });
  }
};

const eliminarUserPorId = async (req, res) => {
  try {
    const userId = req.params.id;
    await post.deleteMany({usuario: userId})
    await comment.deleteMany({usuario: userId})
    if (!user.findById(userId)) {
      return res.status(404).json({ mensaje: 'User no encontrado' });
    }
    const userEliminado = await user.findByIdAndDelete(userId);
    
    await rediscache.del(`Users:${req.params.id}`);
    await rediscache.del('Users:todos');
    await rediscache.del('Posteos:todos');
    await rediscache.del('Tags:todos');
    await rediscache.del('Comentarios:todos');

    if (userEliminado.posteos.length) {
         for (const post of userEliminado.posteos) {
           await rediscache.del(`Posteos:${post}`);
         }
        }
   if (userEliminado.comentarios.length) {
         for (const comentario of userEliminado.comentarios) {
           await rediscache.del(`Comentarios:${comentario}`);
         }
        }

    res.status(200).json({ mensaje: 'User eliminado', user: userEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el User', error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserPorId,
  crearUser,
  modificarUser,
  eliminarUserPorId
};