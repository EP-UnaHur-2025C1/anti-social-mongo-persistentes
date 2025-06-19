const { userRoute, postRoute, commentRoute, tagRoute, post_imageRoute} = require("./routes");
const express = require("express");
const conectarDB = require("../src/db/mongodb")
const app = express()
const PORT = process.env.PORT ?? 3001
const rediscache = require("../src/db/rediscache")



app.use(express.json());
app.use("/comment",commentRoute);

conectarDB()

rediscache.connect()
    .then(() => console.log('Conectado a Redis'))
    .catch(console.error)



app.listen(PORT, () => {
    console.log("Servidor escuchando en http://localhost:${PORT}")
})