const { Router } = require("express");
const router = Router();
const commentControllers = require("../controllers/comment.controllers");



router.get("/", commentControllers.getComentarios);

router.get("/:id", commentControllers.getComentarioPorId);

router.post("/", commentControllers.crearComentario);

router.delete("/:id", commentControllers.eliminarComentarioPorId);

module.exports = router;