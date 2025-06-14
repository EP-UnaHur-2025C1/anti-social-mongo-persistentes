const express = require("express");
const app = express()
const PORT = process.env.PORT ?? 3001



app.use(express.json());


app.listen(PORT, async () => {
  //console.log(`La app arrancó en el puerto ${PORT}.`);
  //console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
  
   await db.sequelize.sync({ force: true });
});
