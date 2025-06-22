const mongoose = require('mongoose');

const {Schema} = require("mongoose")


const postSchema = new mongoose.Schema(
    {
        Descripcion:{ 
            type: Schema.Types.String,
            required: true
        },

        FechaDeCreacion:{
            type: Schema.Types.Date,
            required: true
        },

        usuario:{
            type: Schema.Types.ObjectId, 
           ref: "user" 
        },

        comentarios:[{
           type: Schema.Types.ObjectId, 
           ref: "comment" ,
           options: {strictPopulate: false}
        }],

        imagenes:[{
           type: Schema.Types.ObjectId, 
           ref: "post_Image",
           options: {strictPopulate: false}
        }],

        etiquetas:[{
            type: Schema.Types.ObjectId, 
           ref: "tag",
           options: {strictPopulate: false}
        }]
    }
)


const post = mongoose.model("post", postSchema);
module.exports = {post};