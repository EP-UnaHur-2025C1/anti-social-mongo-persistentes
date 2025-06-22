const mongoose = require('mongoose');
const {Schema} = require("mongoose")


const commentSchema = new mongoose.Schema(
    {
        mensaje:{
            type: Schema.Types.String,
            required: true
        },

        FechaDePublicación:{
            type: Schema.Types.Date,
            required: true
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

const comment = mongoose.model("comment", commentSchema);
module.exports = {comment};