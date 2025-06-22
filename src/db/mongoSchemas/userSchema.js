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

      posteos:[{
           type: Schema.Types.ObjectId, 
           ref: 'post',
           options: {strictPopulate: false}
      }],
      
      comentarios:[{
           type: Schema.Types.ObjectId, 
           ref: "comment" ,
           options: {strictPopulate: false}
      }]
    }
)


const user = mongoose.model("user", userSchema);
module.exports = {user};