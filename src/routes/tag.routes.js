const { Router } = require("express");
const router = Router();
const tagControllers = require("../controllers/tag.controllers");



router.get("/", tagControllers.getTags);

router.get("/:id", tagControllers.getTagPorId);

router.post("/", tagControllers.crearTag);

router.put("/:id", tagControllers.modificarTag)

router.delete("/:id", tagControllers.eliminarTagPorId);

module.exports = router;