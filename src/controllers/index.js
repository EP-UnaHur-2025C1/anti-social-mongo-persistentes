const postControllers = require("./post.controllers");
const userControllers = require("./user.controllers");
const commentControllers = require("./comment.controllers");
const tagControllers = require("./tag.controllers");
const post_imagesControllers = require("./post_images.controllers");


module.exports = {
    postControllers,
    userControllers,
    commentControllers,
    tagControllers,
    post_imagesControllers
}