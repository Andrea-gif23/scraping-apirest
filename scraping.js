const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

async function scrapearNoticias() {
  try {
    // Hacemos la petición a la URL
    const response = await axios.get(url);
    console.log('HTML de la página:', response.data); // Verifica si estamos obteniendo el HTML correctamente

    // Cargamos el HTML con Cheerio
    const $ = cheerio.load(response.data);
    
    let noticias = [];
    
    // Revisa los selectores, puede que necesiten ser actualizados dependiendo del sitio
    $('.listado-noticias .item').each((index, element) => {
      const titulo = $(element).find('.titular').text().trim();
      const descripcion = $(element).find('.sumario').text().trim();
      const enlace = $(element).find('a').attr('href');
      const imagen = $(element).find('img').attr('src');

      // Verificamos si los valores no están vacíos antes de agregarlos
      if (titulo && descripcion && enlace && imagen) {
        const noticia = {
          titulo,
          descripcion,
          enlace,
          imagen
        };
        noticias.push(noticia);
      }
    });
    
    // Si hay noticias, las guardamos en el archivo
    if (noticias.length > 0) {
      fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
      console.log('Noticias escrapeadas y guardadas en noticias.json');
    } else {
      console.log('No se encontraron noticias para guardar.');
    }

  } catch (error) {
    console.error('Error en el scraping:', error.message);
  }
}

// No se llama aquí la función, solo se exporta para usarla en app.js
module.exports = scrapearNoticias;

