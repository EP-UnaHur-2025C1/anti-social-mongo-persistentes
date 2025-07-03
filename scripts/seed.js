require('dotenv').config();
const conectarDB = require('../src/db/mongodb');
const { user, post, comment, tag, post_Image } = require('../src/db/mongoSchemas');

async function seed() {
  try {
    await conectarDB();

    // 1. Eliminar datos existentes
    await Promise.all([
      user.deleteMany(),
      post.deleteMany(),
      comment.deleteMany(),
      tag.deleteMany(),
      post_Image.deleteMany()
    ]);

    // 2. Crear usuarios
    const users = await user.insertMany([
      { nickName: 'gonzager', email: 'gonzager@gmail.com' },
      { nickName: 'lucasFig', email: 'lucasFig@gmail.com' },
      {nickName: 'francoZero', email: 'francozero@gmail.com'},
      {nickName: 'diegoOne', email:'diegoOne@gmail.com'},
      {nickName:'luanaOne', email:'luanaOne@gmail'},
      {nickName:'facuOne',email:"facuOne@gmail.com"}

    ]);

    // 3. Crear tags
    const tags = await tag.insertMany([
      { name: 'programación' },
      { name: 'diseño' },
    ]);

    // 4. Crear posts
    const posts = await post.insertMany([
      {
        Descripcion: 'Posteo 1',
        FechaDeCreacion: new Date('2025-06-24'),
        usuario: users[0]._id,
        etiquetas: [tags[0]._id]
      },
      {
        Descripcion: 'Hola mundo',
        FechaDeCreacion: new Date('2025-06-25'),
        usuario: users[1]._id,
        etiquetas: [tags[1]._id]
      },
      { Descripcion: 'posteo de Franco ',
        FechaDeCreacion: new Date('2025-06-25'),
        usuario: users[2]._id,
        etiquetas: [tags[0]._id]},
      {
        Descripcion: 'posteo de Diego ',
        FechaDeCreacion: new Date('2025-06-25'),
        usuario: users[3]._id,
        etiquetas: [tags[1]._id]},
      {
        Descripcion: 'posteo de Luana ',
        FechaDeCreacion: new Date('2025-06-31'),
        usuario: users[4]._id,
        etiquetas: [tags[1]._id]},
      {
        Descripcion: 'posteo de Facu ',
        FechaDeCreacion: new Date('2025-06-06'),
        usuario: users[5]._id,
        etiquetas: [tags[1]._id]}

      
    ]);

    // Actualizar relaciones en usuario y tag
    users[0].posteos.push(posts[0]._id);
    users[1].posteos.push(posts[1]._id);
    tags[0].posteos.push(posts[0]._id);
    tags[1].posteos.push(posts[1]._id);
    users[2].posteos.push(posts[2]._id);
    users[3].posteos.push(posts[3]._id);
    users[4].posteos.push(posts[4]._id);
    users[5].posteos.push(posts[5]._id)

    await Promise.all([users[0].save(), users[1].save(), tags[0].save(), tags[1].save(),users[2].save(),users[3].save()
, users[4].save(), users[5].save()]);

    // 5. Crear comentarios
    const comentarios = await comment.insertMany([
      {
        mensaje: 'Este es un comentario de ejemplo',
        FechaDePublicacion: new Date('2025-06-25'),
        visibilidad: true,
        usuario: users[0]._id,
        posteo: posts[0]._id
      },
      {
        mensaje: 'Este es un segundo comentario de ejemplo',
        FechaDePublicacion: new Date('2020-06-20'),
        visibilidad: false,
        usuario: users[1]._id,
        posteo: posts[1]._id
      }
    ]);

    // Agregar comentarios a usuarios y posts
    posts[0].comentarios.push(comentarios[0]._id);
    posts[1].comentarios.push(comentarios[1]._id);
    users[0].comentarios.push(comentarios[0]._id);
    users[1].comentarios.push(comentarios[1]._id);
    await Promise.all([posts[0].save(), posts[1].save(), users[0].save(), users[1].save()]);

    // 6. Crear imágenes
    const imagenes = await post_Image.insertMany([
      { url: 'https://picsum.photos/200', posteo: posts[0]._id },
      { url: 'https://picsum.photos/200', posteo: posts[1]._id },
      { url: 'https://unavatar.io/github/francoluiscantero', posteo: posts[2]._id},
      { url: 'https://unavatar.io/github/darconk751', posteo: posts[3]._id },
      { url: 'https://unavatar.io/github/luanacalderon', posteo: posts[4]._id },
      { url: 'https://unavatar.io/github/gabrielfacundogutierrez', posteo: posts[5]._id }
      

    ]);

    posts[0].imagenes.push(imagenes[0]._id);
    posts[1].imagenes.push(imagenes[1]._id);
    posts[2].imagenes.push(imagenes[2]._id);
    posts[3].imagenes.push(imagenes[3]._id);
    posts[4].imagenes.push(imagenes[4]._id);
    posts[5].imagenes.push(imagenes[5]._id);
    await Promise.all([posts[0].save(), posts[1].save(),posts[2].save(),posts[3].save(),posts[4].save(),posts[5].save()]);

    console.log('✅ Base de datos poblada exitosamente.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al hacer seed:', err);
    process.exit(1);
  }
}

seed();