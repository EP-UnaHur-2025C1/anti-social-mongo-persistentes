const { Router } = require("express");
const router = Router();
const {tagControllers} = require("../controllers");
const { tagSchema } = require("../joiSchemas/index.schema");
const { schemaValidator, existsSchemaById } = require("../middlewares");
const { tag } = require("../db/mongoSchemas");



router.get("/", tagControllers.getTags);

router.get("/:id", existsSchemaById(tag), tagControllers.getTagPorId);

router.post("/", schemaValidator(tagSchema), tagControllers.crearTag);

router.put("/:id", existsSchemaById(tag), tagControllers.modificarTag)

router.delete("/:id", existsSchemaById(tag), tagControllers.eliminarTagPorId);

module.exports = router;