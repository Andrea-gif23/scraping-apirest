const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
    return [];
  }
}


function guardarDatos(noticias) {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}


app.get('/noticias', (req, res) => {
  const noticias = leerDatos();
  res.json(noticias);
});


app.post('/noticias', (req, res) => {
  const noticias = leerDatos();
  const nuevaNoticia = req.body;
  noticias.push(nuevaNoticia);
  guardarDatos(noticias);
  res.status(201).json({ mensaje: 'Noticia creada', noticia: nuevaNoticia });
});


app.put('/noticias/:indice', (req, res) => {
  const noticias = leerDatos();
  const indice = parseInt(req.params.indice);

  if (indice >= 0 && indice < noticias.length) {
    noticias[indice] = req.body;
    guardarDatos(noticias);
    res.json({ mensaje: 'Noticia actualizada', noticia: noticias[indice] });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});


app.delete('/noticias/:indice', (req, res) => {
  const noticias = leerDatos();
  const indice = parseInt(req.params.indice);

  if (indice >= 0 && indice < noticias.length) {
    const noticiaEliminada = noticias.splice(indice, 1);
    guardarDatos(noticias);
    res.json({ mensaje: 'Noticia eliminada', noticia: noticiaEliminada });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
