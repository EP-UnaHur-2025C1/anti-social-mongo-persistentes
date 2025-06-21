const mongoose = require('mongoose');

const {Schema} = require("mongoose")


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
            type: Schema.Types.ObjectId, 
           ref: "user" 
        },

        comentarios:{
           type: Schema.Types.ObjectId, 
           ref: "Comment" 
        },

        imagenes:{
           type: Schema.Types.ObjectId, 
           ref: "post_Image",
        },

        etiquetas:{
            type: Schema.Types.ObjectId, 
           ref: "tag"
        }
    }
)

const post = mongoose.model("post", postSchema);
module.exports = {post};