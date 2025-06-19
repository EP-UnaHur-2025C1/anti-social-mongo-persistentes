const postRoute = require("./post.routes");
const userRoute = require("./user.routes");
const commentRoute = require("./comment.routes");
const tagRoute = require("./tag.routes");
const post_imageRoute = require("./post_images.routes")


module.exports = {
    postRoute,
    userRoute,
    commentRoute,
    tagRoute,
    post_imageRoute
}