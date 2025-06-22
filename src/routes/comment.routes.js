const { Router } = require("express");
const router = Router();
const {commentControllers} = require("../controllers");



router.get("/", commentControllers.getComentarios);

router.get("/:id", commentControllers.getComentarioPorId);

router.post("/", commentControllers.crearComentario);

router.put("/:id", commentControllers.modificarComentario)

router.delete("/:id", commentControllers.eliminarComentarioPorId);

module.exports = router;