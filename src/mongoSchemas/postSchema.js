const {mongoose} = require("../db/mongodb")
const {Schema} = require("mongoose")
const {userSchema} = require("./userSchema")


const postSchema = new mongoose.Schema(
    {Descripcion:{ 
        type: Schema.Types.String,
        require: true},
    FechaDeCreacion:{
        type: Schema.Types.Date,
        require: true

    },
    user:{
       userSchema
    }

    }
    
)


module.exports = {
    postSchema
}