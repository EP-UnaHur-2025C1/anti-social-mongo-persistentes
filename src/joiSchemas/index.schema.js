const Joi = require('joi');

// USER
const userSchema = Joi.object({
  nickName: Joi.string().min(8).max(20).required(),
  email: Joi.string().email().required()

});

// COMMENT
const commentSchema = Joi.object({
  mensaje: Joi.string().max(200).required(),
  FechaDePublicacion: Joi.date().required()
});

// POST
const postSchema = Joi.object({
  Descripcion: Joi.string().max(200).required(),
  FechaDeCreacion: Joi.date().iso().required()
 
});

// POST_IMAGES
const postImagesSchema = Joi.object({
  url: Joi.string().uri().required()
 
});

// TAG
const tagSchema = Joi.object({
  name: Joi.string().max(20).required()
 
});

module.exports = {
  userSchema,
  commentSchema,
  postSchema,
  postImagesSchema,
  tagSchema
};