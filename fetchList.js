const axios = require('axios');
const qs = require('qs');
const iconv = require('iconv-lite');
const fs = require('fs-extra');
const parseHtmlToJsonString = require('./parsePage');
const cheerio = require('cheerio');


const url = 'http://comprasnet.gov.br/ConsultaLicitacoes/ConsLicitacao_Relacao.asp';
const detailsURL = 'http://comprasnet.gov.br/ConsultaLicitacoes/download/download_editais_detalhe.asp';

const data = qs.stringify({
    numprp: '',
    dt_publ_ini: '12/06/2024',
    dt_publ_fim: '14/06/2024',
    txtObjeto: '',
    chkModalidade: '5',
    optTpPesqMat: 'M',
    optTpPesqServ: 'S',
    txtlstUasg: '',
    txtlstUf: 'GO',
    txtlstMunicipio: '',
    txtlstModalidade: '',
    txtlstTpPregao: '',
    txtlstConcorrencia: '',
    txtlstGrpMaterial: '',
    txtlstClasMaterial: '',
    txtlstMaterial: '',
    txtlstGrpServico: '',
    txtlstServico: '',
    Origem: 'F'
});

const config = {
    responseType: 'arraybuffer', // Important to get the raw binary data
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8,la;q=0.7',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Content-Length': Buffer.byteLength(data),
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie': '_ga=GA1.1.1594092333.1718218483; _ga_0FL8NGK8GW=GS1.1.1718218482.1.1.1718218684.0.0.0; ASPSESSIONIDASBBCQBC=LANAJMEBPCDNNCDMOICMFHNB; ASPSESSIONIDCSCBBTAC=EPOJKMEBJELLHPHINNKMAMPF',
      'Host': 'comprasnet.gov.br',
      'Origin': 'http://comprasnet.gov.br',
      'Referer': 'http://comprasnet.gov.br/ConsultaLicitacoes/ConsLicitacao_Filtro.asp',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
    }
};

function extractCoduasgFromForms(htmlString) {
  // Load the HTML into cheerio
  const $ = cheerio.load(htmlString);

  // Initialize an array to hold the extracted values
  const extractedValues = [];

  // Find all form elements with names matching Form0, Form1, etc.
  $('form').each((index, form) => {
    const formName = $(form).attr('name');
    if (formName && formName.match(/^Form\d+$/)) {
      // Find the input element with name "itens" within this form
      const inputElement = $(form).find('input[name="itens"]');

      // Get the value of the onclick attribute
      const onclickValue = inputElement.attr('onclick');

      // Extract the value from the onclick attribute using a regular expression
      const match = onclickValue && onclickValue.match(/VisualizarItens\(document\.[^,]+,'\?([^']+)'/);
      if (match && match[1]) {
        extractedValues.push(match[1]);
      }
    }
  });

  return extractedValues;
}

// Function to fetch details and save to a file
async function fetchAndSaveDetails(parameter) {
  try {
    const response = await axios.get(`${detailsURL}?${parameter}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8,la;q=0.7',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      }
    });

    const buffer = Buffer.from(response.data, 'binary');
    const html = iconv.decode(buffer, 'latin1');

    // Extract the coduasg value
    const coduasgMatch = parameter.match(/coduasg=(\d+)/);
    const filename = coduasgMatch ? `${coduasgMatch[1]}.html` : 'unknown.html';

    // Ensure the details folder exists
    const folderPath = './details';
    await fs.ensureDir(folderPath);

    // Save the HTML to a file
    const filePath = `${folderPath}/${filename}`;
    await fs.writeFile(filePath, html, 'utf8');
    console.log(`Saved: ${filePath}`);
  } catch (error) {
    console.error(`Failed to fetch or save details for parameter: ${parameter}`, error);
  }
}

// Function to introduce a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function to process the HTML and fetch details
async function processHtml(htmlString) {
  const parameters = extractCoduasgFromForms(htmlString);
  for (const parameter of parameters) {
    await fetchAndSaveDetails(parameter);
    // Randomized delay between 1 to 5 seconds
    const delayTime = Math.floor(Math.random() * 4000) + 1000;
    console.log(`Waiting for ${delayTime} milliseconds...`);
    await delay(delayTime);
  }
}


axios.post(url, data, config)
.then(async response => {
  const buffer = Buffer.from(response.data, 'binary');
  
  // Decode the buffer using 'latin1' encoding to handle special characters correctly
  const text = buffer.toString('binary');

  await processHtml(text);

  //   // Save the buffer to a file
  //   fs.writeFile('response.html', text, 'utf-8', (err) => {
  //     if (err) {
  //         console.error('Error writing to file:', err);
  //     } else {
  //         console.log('Response saved to response.html');
  //     }
  // });

  // const jsonData = decodeURIComponent(parseHtmlToJsonString(text));

  // // Save the buffer to a file
  // fs.writeFile('response.json', jsonData, 'utf-8', (err) => {
  //     if (err) {
  //         console.error('Error writing to file:', err);
  //     } else {
  //         console.log('Response saved to response.json');
  //     }
  // });
})
.catch(error => console.error('Error:', error));