const {mongoose} = require("../db/mongodb")
const {Schema} = require("mongoose")
const posteos = require("./postSchema")

const tagSchema = new mongoose.Schema(
    {
        name:{
            type: Schema.Types.String,
            require: true
        },
        
        posteos:{
            posteos
        }
    }
)


module.exports = {
    tagSchema
}