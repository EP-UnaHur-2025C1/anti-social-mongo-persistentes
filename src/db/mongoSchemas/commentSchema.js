const mongoose = require('mongoose');
const {Schema} = require("mongoose")


const commentSchema = new mongoose.Schema(
    {
        mensaje:{
            type: Schema.Types.String,
            required: true
        },

        FechaDePublicacion:{
            type: Schema.Types.Date,
            required: true
        },

        usuario:{
           type: Schema.Types.ObjectId, 
           required: true,
           ref: "user" ,
           options: {strictPopulate: false}
        },
        
        posteo:{
           type: Schema.Types.ObjectId,
           required: true, 
           ref: 'post',
           options: {strictPopulate: false}
        }
    }
)

const comment = mongoose.model("comment", commentSchema);
module.exports = {comment};