const {mongoose} = require("../db/mongodb")
const {Schema} = require("mongoose")
const {userSchema} = require("./userSchema")
const {postSchema} = require("./postSchema")

const commentSchema = new mongoose.Schema(
    {
        mensaje:{
            type: Schema.Types.String,
            require: true
        },

        FechaDePublicación:{
            type: Schema.Types.Date,
            require: true
        },

        user:{
            userSchema
        },
        
        posteo:{
            postSchema
        }
    }
)

module.exports = {
    commentSchema
}