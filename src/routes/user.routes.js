const { Router } = require("express");
const router = Router();
const {userControllers} = require("../controllers");
const { existsSchemaById, schemaValidator } = require("../middlewares");
const { user } = require("../db/mongoSchemas");
const { userSchema } = require("../joiSchemas/index.schema");



router.get("/", userControllers.getUsers);

router.get("/:id", existsSchemaById(user),  userControllers.getUserPorId);

router.post("/", schemaValidator(userSchema), userControllers.crearUser);

router.put("/:id", existsSchemaById(user), userControllers.modificarUser)

router.delete("/:id", existsSchemaById(user),userControllers.eliminarUserPorId);

module.exports = router;