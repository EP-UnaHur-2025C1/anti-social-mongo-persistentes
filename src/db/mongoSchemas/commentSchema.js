const mongoose = require('mongoose');
const {Schema} = require("mongoose")


const commentSchema = new mongoose.Schema(
    {
        mensaje:{
            type: Schema.Types.String,
            require: true
        },

        FechaDePublicación:{
            type: Schema.Types.Date,
            require: true
        },

        user:{
           type: Schema.Types.ObjectId, 
           ref: "user" 
        },
        
        posteo:{
           type: Schema.Types.ObjectId, 
           ref: 'post'
        }
    }
)

const comment = mongoose.model("Comment", commentSchema);
module.exports = comment;