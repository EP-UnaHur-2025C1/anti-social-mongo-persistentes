const { Router } = require("express");
const router = Router();
const userControllers = require("../controllers/user.controllers");



router.get("/", userControllers.getUsers);

router.get("/:id", userControllers.getUserPorId);

router.post("/", userControllers.crearUser);

router.put("/:id", userControllers.modificarUser)

router.delete("/:id", userControllers.eliminarUserPorId);

module.exports = router;