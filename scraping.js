const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

async function scrapearNoticias() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    let noticias = [];
    
    $('.listado-noticias .item').each((index, element) => {
      const titulo = $(element).find('.titular').text().trim();
      const descripcion = $(element).find('.sumario').text().trim();
      const enlace = $(element).find('a').attr('href');
      const imagen = $(element).find('img').attr('src');
      
      const noticia = {
        titulo,
        descripcion,
        enlace,
        imagen
      };
      
      noticias.push(noticia);
    });
    
    // Guardar los datos en noticias.json
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    console.log('Noticias escrapeadas y guardadas en noticias.json');
  } catch (error) {
    console.error('Error en el scraping:', error.message);
  }
}

// No se llama aquí la función, solo se exporta
module.exports = scrapearNoticias;


