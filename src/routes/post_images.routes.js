const { Router } = require("express");
const router = Router();
const {post_imagesControllers} = require("../controllers");
const { postImagesSchema } = require("../joiSchemas/index.schema");
const { schemaValidator, existsSchemaById } = require("../middlewares");
const { post_Image } = require("../db/mongoSchemas");
const {checkCachePostImageById,checkCacheAllPostImages} = require("../middlewares/redis.middleware")


router.get("/", checkCacheAllPostImages,post_imagesControllers.getPostImages);

router.get("/:id", existsSchemaById(post_Image),checkCachePostImageById, post_imagesControllers.getPostImagePorId);

router.post("/", schemaValidator(postImagesSchema), post_imagesControllers.crearPostImage);

router.put("/:id", existsSchemaById(post_Image), post_imagesControllers.modificarPostImage)

router.delete("/:id", existsSchemaById(post_Image), post_imagesControllers.eliminarPostImagePorId);

module.exports = router;