const { Router } = require("express");
const router = Router();
const {postControllers} = require("../controllers");
const { postSchema } = require("../joiSchemas/index.schema");
const { schemaValidator, existsSchemaById } = require("../middlewares");
const { post } = require("../db/mongoSchemas");
const {checkCachePostById,checkCacheAllPosts} = require("../middlewares/redis.middleware")



router.get("/", checkCacheAllPosts,postControllers.getPosts);

router.get("/:id", existsSchemaById(post),checkCachePostById, postControllers.getPostPorId);

router.post("/", schemaValidator(postSchema), postControllers.crearPost);

router.put("/:id", existsSchemaById(post), postControllers.modificarPost)

router.put("/addTag/:id", existsSchemaById(post), postControllers.agregarTagAlPost)

router.delete("/:id", existsSchemaById(post), postControllers.eliminarPostPorId);

module.exports = router;