const { Router } = require("express");
const router = Router();
const {commentControllers} = require("../controllers");
const { commentSchema } = require("../joiSchemas/index.schema");
const { schemaValidator, existsSchemaById } = require("../middlewares");
const { comment } = require("../db/mongoSchemas");



router.get("/", commentControllers.getComentarios);

router.get("/:id", existsSchemaById(comment), commentControllers.getComentarioPorId);

router.post("/", schemaValidator(commentSchema), commentControllers.crearComentario);

router.put("/:id", existsSchemaById(comment), commentControllers.modificarComentario)

router.delete("/:id", existsSchemaById(comment), commentControllers.eliminarComentarioPorId);

module.exports = router;