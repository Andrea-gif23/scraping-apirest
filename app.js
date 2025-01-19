const express = require('express');
const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let noticias = [];


app.get('/noticias', (req, res) => {
  res.json(noticias);
});


app.post('/noticias', (req, res) => {
  const nuevaNoticia = req.body;
  noticias.push(nuevaNoticia);
  res.status(201).json({ mensaje: 'Noticia creada', noticia: nuevaNoticia });
});


app.put('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);

  if (indice >= 0 && indice < noticias.length) {
    noticias[indice] = req.body;
    res.json({ mensaje: 'Noticia actualizada', noticia: noticias[indice] });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});


app.delete('/noticias/:indice', (req, res) => {
  const indice = parseInt(req.params.indice);

  if (indice >= 0 && indice < noticias.length) {
    const noticiaEliminada = noticias.splice(indice, 1);
    res.json({ mensaje: 'Noticia eliminada', noticia: noticiaEliminada });
  } else {
    res.status(404).json({ mensaje: 'Noticia no encontrada' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

