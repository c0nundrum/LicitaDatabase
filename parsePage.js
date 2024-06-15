const cheerio = require('cheerio');
const iconv = require('iconv-lite');

function parseHtmlToJsonString(htmlString) {
  // Decode the HTML string with the correct encoding
  const html = iconv.decode(Buffer.from(htmlString, 'binary'), 'latin1');

  // Load the HTML into cheerio
  const $ = cheerio.load(html);

  // Initialize an array to hold the parsed data
  const parsedData = [];

  const keys = ['UASG', 'Telefone', 'Fax', 'Pregão Eletrônico', 'Objeto', 'Edital a partir', 'Endereço', 'Entrega da Proposta', 'Abertura da Proposta']; // keys you want to extract

  $('tr').each((index, tr) => {
    const tdElements = $(tr).children('td');
    if (tdElements.length === 2 && $(tdElements[0]).attr('width') === '20') {
        const forms = $(tdElements[1]).find('form');
        forms.each((formIndex, form) => {
            const formData = {};
            const formElement = $(form);

            // Extract form information
            formData.location = encodeURIComponent(formElement.find('td.td_titulo_campo').eq(1).text().trim().replace('&nbsp;', ''));
            const infoText = formElement.find('tr.tex3').html().trim();

            // Extract specific parts from the infoText
            const lines = infoText.split('<br>').map(line => line.replace(/<[^>]+>/g, '').trim().replace('&nbsp;', ''));
            const info = {};

            lines.forEach(line => {
              if(!line) 
                console.log("empty line");
              else
                console.log(line);

                keys.forEach(key => {
                    if (line.includes(iconv.decode(Buffer.from(key), 'latin1'))) {
                        info[key] = encodeURIComponent(line);
                    }
                });
            });

            formData.info = info;
            parsedData.push(formData);
        });
    }
  });

  // Convert the parsed data to JSON
  const jsonData = JSON.stringify(parsedData, null, 2);

  return jsonData;
}

// Export the function
module.exports = parseHtmlToJsonString;
