const axios = require('axios');
const qs = require('qs');
const iconv = require('iconv-lite');
const fs = require('fs');

const url = 'http://comprasnet.gov.br/ConsultaLicitacoes/ConsLicitacao_Relacao.asp';

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
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

axios.post(url, data, config)
    .then(response => {
        // Convert response data to Buffer with the correct encoding
        const htmlBuffer = iconv.decode(Buffer.from(response.data), 'latin1');
        
        // Save the buffer to a file
        fs.writeFile('response.html', htmlBuffer, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('Response saved to response.html');
            }
        });
    })
    .catch(error => {
        console.error('Error making POST request:', error);
    });