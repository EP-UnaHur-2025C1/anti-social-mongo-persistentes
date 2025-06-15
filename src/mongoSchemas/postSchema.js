const {mongoose} = require("../db/mongodb")
const {Schema} = require("mongoose")
const {userSchema} = require("./userSchema")
const comentarios = require("./commentSchema")
const imagenes = require("./post_imagesSchema")
const etiquetas = require("./tagSchema")

const postSchema = new mongoose.Schema(
    {
        Descripcion:{ 
            type: Schema.Types.String,
            require: true
        },

        FechaDeCreacion:{
            type: Schema.Types.Date,
            require: true
        },

        user:{
            userSchema
        },

        comentarios:{
            comentarios
        },

        imagenes:{
            imagenes
        },

        etiquetas:{
            etiquetas
        }
    }
)


module.exports = {
    postSchema
}