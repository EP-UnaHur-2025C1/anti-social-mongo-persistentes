const {mongoose} = require("../db/mongodb")
const {Schema} = require("mongoose")
const posteos = require("./postSchema")

const userSchema = new mongoose.Schema(
    {
      nickName:{
        type: Schema.Types.String,
        require: true,
      },
      email:{
        type: Schema.Types.String,
        require: true

      },
      posteos:{
          posteos
      }

    }
)


module.exports = {
         userSchema
}