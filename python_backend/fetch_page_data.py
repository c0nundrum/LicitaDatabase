from pathlib import Path
import re
import requests
from bs4 import BeautifulSoup
import os
from time import sleep
from random import randint

# Base URLs
url = 'http://comprasnet.gov.br/ConsultaLicitacoes/ConsLicitacao_Relacao.asp'
details_url = 'http://comprasnet.gov.br/ConsultaLicitacoes/download/download_editais_detalhe.asp'

'ConsLicitacao_Relacao.asp?numprp=&dt_publ_ini=01/06/2024&dt_publ_fim=14/06/2024&chkModalidade=5&chk_concor=&chk_pregao=&chk_rdc=&optTpPesqMat=M&optTpPesqServ=S&chkTodos=&chk_concorTodos=&chk_pregaoTodos=&txtlstUf=&txtlstMunicipio=&txtlstUasg=&txtlstGrpMaterial=&txtlstClasMaterial=&txtlstMaterial=&txtlstGrpServico=&txtlstServico=&txtObjeto=&numpag=" + i; '
# Form data
data = {
    'numprp': '',
    'dt_publ_ini': '01/06/2024',
    'dt_publ_fim': '15/06/2024',
    'txtObjeto': '',
    'chkModalidade': '5',
    'optTpPesqMat': 'M',
    'optTpPesqServ': 'S',
    'txtlstUasg': '',
    'txtlstUf': '',
    'txtlstMunicipio': '',
    'txtlstModalidade': '',
    'txtlstTpPregao': '',
    'txtlstConcorrencia': '',
    'txtlstGrpMaterial': '',
    'txtlstClasMaterial': '',
    'txtlstMaterial': '',
    'txtlstGrpServico': '',
    'txtlstServici': '',
    'Origem': 'F'
}

# Headers
headers = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US,en;q=0.9,pt;q=0.8,la;q=0.7',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}

def extract_coduasg_from_forms(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    extracted_values = []

    for form in soup.find_all('form'):
        form_name = form.get('name')
        if form_name and 'Form' in form_name:
            input_element = form.find('input', {'name': 'itens'})
            if input_element and input_element.get('onclick'):
                match = re.search(r"VisualizarItens\(document\.[^,]+,'\?([^']+)'", input_element['onclick'])
                if match:
                    extracted_values.append(match.group(1))
    return extracted_values

def fetch_and_save_details(parameter):
    coduasg_match = re.search(r'coduasg=(\d+)', parameter)
    numprp_match = re.search(r'numprp=(\d+)', parameter)
    folder_path = Path('./details') / coduasg_match.group(1)

    desired_path = Path(folder_path) / f"{numprp_match.group(1)}.html"
    if desired_path.exists():
        print(f"{desired_path} already exists")
        return

    response = requests.get(f'{details_url}?{parameter}', headers=headers)
    html = response.content.decode('latin1')
    filename = f"{numprp_match.group(1)}.html" if numprp_match else 'unknown.html'
    os.makedirs(folder_path, exist_ok=True)
    file_path = os.path.join(folder_path, filename)
    with open(file_path, 'w', encoding='utf8') as file:
        file.write(html)
    print(f'Saved: {file_path}')

def process_html(html_content) -> bool:
    parameters = extract_coduasg_from_forms(html_content)
    if len(parameters) == 0:
        return False
    
    for parameter in parameters:
        fetch_and_save_details(parameter)
        sleep(randint(1, 3))
    
    return True

def main():
    for i in range(1, 500):
        response = requests.post(url, data=data, headers=headers, params={'numpag':i})
        if response.status_code == 200:
            if not process_html(response.content.decode('latin1')):
                break
        else:
            print('Failed to fetch page')

if __name__ == '__main__':
    main()
