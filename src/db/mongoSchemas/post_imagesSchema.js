const mongoose = require('mongoose');
const {Schema} = require("mongoose")


const post_ImageSchema = new mongoose.Schema(
    {
        url:{
            type: Schema.Types.String,
            required: true
        },
        
        posteo:{
           type: Schema.Types.ObjectId, 
           ref: 'post' 
        }
    }
)

const post_Image = mongoose.model("post_Image", post_ImageSchema);
module.exports = {post_Image};