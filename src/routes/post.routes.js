const { Router } = require("express");
const router = Router();
const postControllers = require("../controllers/post.controllers");



router.get("/", postControllers.getPosts);

router.get("/:id", postControllers.getPostPorId);

router.post("/", postControllers.crearPost);

router.put("/:id", postControllers.modificarPost)

router.delete("/:id", postControllers.eliminarPostPorId);

module.exports = router;