const { request } = require("express");
const { mongoose, schema, user } = require("../db/mongoSchemas/index")
const rediscache = require("../db/rediscache")

const getUsers = async (_, res) => {
  const redisKey = 'Users:todos';
  try {
    const cachedUser = await rediscache.get(redisKey);
    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }
    
    const User = await user.find()
      .select('nickName email')
      .populate('posteos')
      .populate('comentarios');
    await rediscache.set(redisKey, JSON.stringify(User), { EX: 300 });
    res.status(200).json(User);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getUserPorId = async (req, res) => {
  const id = req.params.id;
  const redisKey = `User:${id}`;

  try {
    const cachedUser = await rediscache.get(redisKey);
    if (cachedUser) {
      return res.status(200).json(JSON.parse(cachedUser));
    }
    const usuario = await user.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'No se encontro el user' });
    }
    await rediscache.set(redisKey, JSON.stringify(usuario), { EX: 300 });
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

    await rediscache.del(`User:${req.params.id}`);
    await rediscache.del('Users:todos');
    res.status(200).json({ mensaje: 'user actualizado', user: userActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar el user', error: error.message });
  }
};

const eliminarUserPorId = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!user.findById(userId)) {
      return res.status(404).json({ mensaje: 'User no encontrado' });
    }
    const userEliminado = await user.findByIdAndDelete(userId);
    

    await rediscache.del(`User:${userId}`);
    await rediscache.del('Users:todos');

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