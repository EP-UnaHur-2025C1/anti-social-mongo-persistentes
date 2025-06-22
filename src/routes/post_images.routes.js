const { Router } = require("express");
const router = Router();
const {post_imagesControllers} = require("../controllers");



router.get("/", post_imagesControllers.getPostImages);

router.get("/:id", post_imagesControllers.getPostImagePorId);

router.post("/", post_imagesControllers.crearPostImage);

router.put("/:id", post_imagesControllers.modificarPostImage)

router.delete("/:id", post_imagesControllers.eliminarPostImagePorId);

module.exports = router;