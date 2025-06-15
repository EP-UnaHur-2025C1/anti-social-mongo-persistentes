const {mongoose} = require("../db/mongodb")
const {Schema} = require("mongoose")
const {postSchema} = require("./postSchema")

const post_ImageSchema = new mongoose.Schema(
    {
        url:{
            type: Schema.Types.String,
            require: true
        },
        
        posteo:{
            postSchema
        }
    }
)

module.exports = {
    post_ImageSchema
}