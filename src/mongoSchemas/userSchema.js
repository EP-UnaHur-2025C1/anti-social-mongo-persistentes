const {mongoose} = require("../db/mongodb")
const {Schema} = require("mongoose")
const posteos = require("./postSchema")
const comentarios = require("./commentSchema")

const userSchema = new mongoose.Schema(
    {
      nickName:{
        type: Schema.Types.String,
        require: true,
        unique: true
      },

      email:{
        type: Schema.Types.String,
        require: true,
        unique: true
      },

      posteos:{
          posteos
      },
      
      comentarios:{
          comentarios
      }
    }
)


module.exports = {
         userSchema
}