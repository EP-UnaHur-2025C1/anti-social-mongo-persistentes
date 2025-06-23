const { Router } = require("express");
const router = Router();
const {userControllers} = require("../controllers");
const { existsModelById } = require("../middlewares");
const { user } = require("../db/mongoSchemas");



router.get("/", userControllers.getUsers);

router.get("/:id", existsModelById(user),  userControllers.getUserPorId);

router.post("/", userControllers.crearUser);

router.put("/:id", userControllers.modificarUser)

router.delete("/:id",existsModelById(user),userControllers.eliminarUserPorId);

module.exports = router;