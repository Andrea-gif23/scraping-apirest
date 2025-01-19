const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://elpais.com/ultimas-noticias/';

async function scrape() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const noticias = [];

  
    $('article').each((index, element) => {
      const titulo = $(element).find('h2').text().trim();
      const descripcion = $(element).find('p').text().trim();
      const enlace = $(element).find('a').attr('href');
      const imagen = $(element).find('img').attr('src');

      if (titulo && descripcion && enlace && imagen) {
        const noticia = {
          titulo: titulo,
          descripcion: descripcion,
          enlace: enlace,
          imagen: imagen
        };
        noticias.push(noticia);
      }
    });


    console.log('Noticias obtenidas:', noticias);
    
   
    return noticias;

  } catch (error) {
    console.error('Error durante el scraping:', error.message);
  }
}

scrape();
