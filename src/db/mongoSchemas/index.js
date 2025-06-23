const mongoose = require('mongoose');
const {Schema} = require("mongoose")
const {comment} = require("./commentSchema")
const {post_Image} = require("./post_imagesSchema")
const {post} = require("./postSchema")
const {tag} = require("./tagSchema")
const {user} = require("./userSchema")

module.exports = {
    mongoose,
    Schema,
    comment,
    post_Image,
    post,
    tag,
    user
}