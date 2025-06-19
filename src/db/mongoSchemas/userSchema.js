const mongoose = require('mongoose');
const {Schema} = require("mongoose")


const userSchema = new mongoose.Schema(
    {
      nickName:{
        type: Schema.Types.String,
        required: true,
        unique: true
      },

      email:{
        type: Schema.Types.String,
        required: true,
        unique: true
      },

      posteos:{
           type: Schema.Types.ObjectId, 
           ref: 'post' 
      },
      
      comentarios:{
           type: Schema.Types.ObjectId, 
           ref: "Comment" 
      }
    }
)


const user = mongoose.model("user", userSchema);
module.exports = user;