const express = require('express');
const fs = require('fs');
const scrapearNoticias = require('./scraping');
const app = express();
const PORT = 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let noticias = [];

app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Noticias');
});

app.get('/scraping', async (req, res) => {
  await scrapearNoticias(); 
  leerDatos(); 
  res.send('Scraping en curso... las noticias se han guardado en noticias.json');
});

app.get('/noticias', (req, res) => {
  leerDatos(); 
  res.json(noticias); 
});

app.post('/noticias', (req, res) => {
  const nuevaNoticia = req.body;
  noticias.push(nuevaNoticia);
  guardarDatos();
  res.status(201).json({ mensaje: 'Noticia creada', noticia: nuevaNoticia });
});

app.put('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);
  if (indice >= 0 && indice < noticias.length) {
    noticias[indice] = req.body;
    guardarDatos();
    res.json({ mensaje: 'Noticia actualizada', noticia: noticias[indice] });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

app.delete('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);
  if (indice >= 0 && indice < noticias.length) {
    const noticiaEliminada = noticias.splice(indice, 1);
    guardarDatos();
    res.json({ mensaje: 'Noticia eliminada', noticia: noticiaEliminada });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

function leerDatos() {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8');
    noticias = JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}

function guardarDatos() {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
