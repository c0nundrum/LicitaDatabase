const fs = require('fs');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const fixLatin1ToUtf8 = require("fix-latin1-to-utf8");

// Read the HTML file with the correct encoding
const htmlBuffer = fs.readFileSync('response.html');
const html = iconv.decode(htmlBuffer, 'latin1');

// Load the HTML into cheerio
const $ = cheerio.load(html);

// Initialize an array to hold the parsed data
const parsedData = [];

// Select the specific tr > td structure and extract form elements
$('tr').each((index, tr) => {
  const tdElements = $(tr).children('td');
  if (tdElements.length === 2 && $(tdElements[0]).attr('width') === '20') {
      const forms = $(tdElements[1]).find('form');
      forms.each((formIndex, form) => {
          const formData = {};
          const formElement = $(form);

          // Extract form information (similar to previous example)
          formData.location = encodeURIComponent(formElement.find('td.td_titulo_campo').eq(1).text().trim());
          const infoText = formElement.find('tr.tex3').html().trim();

          // Extract specific parts from the infoText
          const lines = infoText.split('<br>');
          formData.ministry = encodeURIComponent(lines[0].replace(/<[^>]+>/g, '').trim());
          formData.agency = encodeURIComponent(lines[1].replace(/<[^>]+>/g, '').trim());
          formData.base = encodeURIComponent(lines[2].replace(/<[^>]+>/g, '').trim());
          formData.code = encodeURIComponent(lines[3].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.type = encodeURIComponent(lines[4].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.subject = encodeURIComponent(lines[5].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.edictDate = encodeURIComponent(lines[6].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.address = encodeURIComponent(lines[7].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.telephone = encodeURIComponent(lines[8].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.fax = encodeURIComponent(lines[9].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.proposalDelivery = encodeURIComponent(lines[10].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.proposalOpening = encodeURIComponent(lines[11].replace(/<[^>]+>/g, '').trim().split(': ')[1]);
          formData.website = encodeURIComponent(lines[12].replace(/<[^>]+>/g, '').trim().split(': ')[1]);

          // Add the formData object to the parsedData array
          parsedData.push(formData);
      });
  }
});

// Convert the parsed data to JSON
const jsonData = JSON.stringify(parsedData, null, 2);

// Save the JSON data to a file
fs.writeFileSync('parsedData.json', jsonData, 'utf-8');

console.log('Data has been parsed and saved to parsedData.json');
