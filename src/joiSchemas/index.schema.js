const Joi = require('joi');

// USER
const userSchema = Joi.object({
  nickName: Joi.string().min(8).max(20).required(),
  email: Joi.string().email().required(),
  id: Joi.number().integer() // Completar luego con validación para tamaño de 24 caracteres
});

// COMMENT
const commentSchema = Joi.object({
  mensaje: Joi.string().max(200).required(),
  FechaDePublicacion: Joi.date().required(),
  id: Joi.number().integer().min(0)
});

// POST
const postSchema = Joi.object({
  Descripcion: Joi.string().max(200).required(),
  FechaDeCreacion: Joi.date().iso().required(),
  id: Joi.number().integer().min(0)
});

// POST_IMAGES
const postImagesSchema = Joi.object({
  url: Joi.string().uri().required(),
  id: Joi.number().integer().min(0)
});

// TAG
const tagSchema = Joi.object({
  name: Joi.string().max(20).required(), //Hacer middleware de ".pattern(/^\S+$/)"
  id: Joi.number().integer().min(0)
});

module.exports = {
  userSchema,
  commentSchema,
  postSchema,
  postImagesSchema,
  tagSchema
};