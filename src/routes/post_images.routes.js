const { Router } = require("express");
const router = Router();
const postImageControllers = require("../controllers/post_images.controllers");



router.get("/", postImageControllers.getPostImages);

router.get("/:id", postImageControllers.getPostImagePorId);

router.post("/", postImageControllers.crearPostImage);

router.put("/:id", postImageControllers.modificarPostImage)

router.delete("/:id", postImageControllers.eliminarPostImagePorId);

module.exports = router;