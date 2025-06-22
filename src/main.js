const { userRoute, postRoute, commentRoute, tagRoute, post_imageRoute} = require("./routes");
const express = require("express");
const conectarDB = require("../src/db/mongodb")
const app = express()
const PORT = process.env.PORT ?? 3000
const rediscache = require("../src/db/rediscache")
const dotenv = require('dotenv')

dotenv.config();

app.use(express.json());
app.use("/comment",commentRoute);
app.use('/user',userRoute);
app.use('/post',postRoute);
app.use('/tag',tagRoute);
app.use('/postImage',post_imageRoute);

conectarDB()

rediscache.connect()
    .then(() => console.log('Conectado a Redis'))
    .catch(console.error)



app.listen(PORT, () => {
    console.log("Servidor escuchando en http://localhost:${PORT}")
})

console.log('MONGO_URI:', process.env.MONGO_URI);