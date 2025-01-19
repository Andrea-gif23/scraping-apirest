const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

async function scrapearNoticias() {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      console.error('Error al obtener la página:', response.status);
      return;
    }

    console.log('HTML de la página:', response.data);
    const $ = cheerio.load(response.data);

    let noticias = [];

    $('.listado-noticias .item').each((index, element) => {
      const titulo = $(element).find('.titular').text().trim();
      const descripcion = $(element).find('.sumario').text().trim();
      const enlace = $(element).find('a').attr('href');
      const imagen = $(element).find('img').attr('src');

    
      const enlaceCompleto = enlace.startsWith('http') ? enlace : `https://elpais.com${enlace}`;
      const imagenCompleta = imagen.startsWith('http') ? imagen : `https://elpais.com${imagen}`;

      if (titulo && descripcion && enlaceCompleto && imagenCompleta) {
        const noticia = {
          titulo,
          descripcion,
          enlace: enlaceCompleto,
          imagen: imagenCompleta
        };
        noticias.push(noticia);
      }
    });

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

module.exports = scrapearNoticias;
