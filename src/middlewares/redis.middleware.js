const client = require("../db/rediscache");

// CACHE DE USUARIOS:
const checkCacheUserById = async (req, res, next) => {
  const id = `User:${req.params.id}`;
  const data = await client.get(id);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

const checkCacheAllUsers = async (req, res, next) => {
  const allUser = "Users:Todos"
  const data = await client.get(allUser);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

//CACHE DE POST
const checkCachePostById = async (req, res, next) => {
  const id = `Posteos${req.params.id}`;
  const data = await client.get(id);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

const checkCacheAllPosts = async (req, res, next) => {
  const allUser = "Posteos:todos"
  const data = await client.get(allUser);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

//CACHE DE COMMENT:
const checkCacheCommentById = async (req, res, next) => {
  const id = `Comentarios${req.params.id}`;
  const data = await client.get(id);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

const checkCacheAllComments = async (req, res, next) => {
  const allUser = "Comentarios:todos"
  const data = await client.get(allUser);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

//CACHE DE TAG

const checkCacheTagById = async (req, res, next) => {
  const id = `Tags${req.params.id}`;
  const data = await client.get(id);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

const checkCacheAllTags = async (req, res, next) => {
  const allUser = "Tags:todos"
  const data = await client.get(allUser);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

//CACHE POSTIMAGE
const checkCachePostImageById = async (req, res, next) => {
  const id = `PostImages${req.params.id}`;
  const data = await client.get(id);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};

const checkCacheAllPostImages = async (req, res, next) => {
  const allUser = "PostImages:todos"
  const data = await client.get(allUser);
  if (data) {
    return res.status(200).json(JSON.parse(data));
  }

 
  next();
};



module.exports = {  
     checkCacheUserById,
     checkCacheAllUsers,
     checkCachePostById,
     checkCacheAllPosts,
     checkCacheCommentById,
     checkCacheAllComments,
     checkCacheTagById,
     checkCacheAllTags,
     checkCachePostImageById,
     checkCacheAllPostImages
     };