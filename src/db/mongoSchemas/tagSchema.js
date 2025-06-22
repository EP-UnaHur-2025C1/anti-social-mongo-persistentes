const mongoose = require('mongoose');
const {Schema} = require("mongoose")


const tagSchema = new mongoose.Schema(
    {
        name:{
            type: Schema.Types.String,
            required: true
        },
        
        posteos:[{
           type: Schema.Types.ObjectId, 
           ref: 'post',
           options: {strictPopulate: false}
        }]
    }
)


const tag = mongoose.model("tag", tagSchema)
module.exports = {tag}