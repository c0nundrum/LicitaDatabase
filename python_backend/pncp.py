from datetime import datetime, timedelta
import requests
import os
import json
import logging
from typing import Dict, Any, Literal
import time

from download_edital import get_public_session_date
from mongo_driver.mongo_db import entry_exists, get_database
from utils.date_time_converter import find_and_convert_datetime


# Set up logging
logging.basicConfig(filename='pncp_api.log', level=logging.INFO, 
                    format='%(asctime)s:%(levelname)s:%(message)s')


def query_session_date(orgao_cnpj: str, ano: str, numero_sequencial: str) -> Dict[str, Any]:
    try:
        base_url = f"https://pncp.gov.br/api/pncp/v1/orgaos/{orgao_cnpj}/compras/{ano}/{numero_sequencial}/arquivos/1"
        session_date = get_public_session_date(base_url)
        print(session_date)
        return session_date
    except Exception as e:
        print(f"Unable to get session date: {e}")
        
    return ""


def query_pncp_api(params: Dict[str, Any]) -> Dict[str, Any]:
    base_url = "https://pncp.gov.br/api/consulta/v1/contratacoes/publicacao"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Origin": "https://pncp.gov.br/api/consulta/swagger-ui/index.html"
    }

    max_retries = 5
    retry_delay = 1 / 1000  # 1ms in seconds

    for attempt in range(max_retries):
        try:
            response = requests.get(base_url, params=params, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            if response.status_code == 500:
                print(f"Error 500 encountered. Retrying {attempt + 1}/{max_retries}...")
                time.sleep(retry_delay)
            else:
                raise http_err
        except Exception as err:
            raise err

    raise Exception(f"Failed to fetch data after {max_retries} attempts")

def query_item_details(orgao_cnpj: str, ano: str, numero_sequencial: str) -> Dict[str, Any]:
    base_url = f"https://pncp.gov.br/api/pncp/v1/orgaos/{orgao_cnpj}/compras/{ano}/{numero_sequencial}"
    response = requests.get(base_url)
    response.raise_for_status()
    return response.json()

def query_item_itens(orgao_cnpj: str, ano: str, numero_sequencial: str) -> Dict[str, Any]:
    base_url = f"https://pncp.gov.br/api/pncp/v1/orgaos/{orgao_cnpj}/compras/{ano}/{numero_sequencial}/itens?pagina=1&tamanhoPagina=100"
    response = requests.get(base_url)
    response.raise_for_status()
    return response.json()

def save_json_to_file(data: Dict[str, Any], filename: str):
    print(f"saving {filename}")
    os.makedirs('compiled', exist_ok=True)
    with open(os.path.join('compiled', filename), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Example parameters for the initial query
params = {
    'tipos_documento': 'edital',
    'ordenacao': '-data',
    'pagina': 1,
    'tam_pagina': 10,
    'status': 'todos',
    'ufs': 'GO',
}

def query_search_api(parameters):
    initial_response = query_pncp_api(parameters)
    print(f"total de registros {initial_response['totalRegistros']}")
    print(f"total de paginas {initial_response['totalPaginas']}")
    print(f"pagina atual: {parameters['pagina']}")

    items = initial_response.get('data', [])
    print(f'Total of items in request: {len(items)}')

    if len(items) == 0:
        raise Exception("Finished scraping")
    
    # Get the MongoDB collection
    editals_collection = get_database()

    # Loop through each item and get detailed information
    for item in items:
        orgao_cnpj = item['orgaoEntidade'].get('cnpj')
        ano = item.get('anoCompra')
        numero_sequencial = item.get('sequencialCompra')
        numero_pcp = item['numeroControlePNCP']
        print(f"resolving item {numero_pcp}")

        if entry_exists(numero_pcp):
            continue

        if orgao_cnpj and ano and numero_sequencial:
            try:
                item_itens = query_item_itens(orgao_cnpj, ano, numero_sequencial)

                session_date = query_session_date(orgao_cnpj, ano, numero_sequencial)
                
                merged_data = {**item, "public_session": session_date, "itens": item_itens}

                fix_date_time(merged_data)
                merged_data = convert_dates_in_dict(merged_data)
                
                # Insert the merged data into MongoDB
                editals_collection.insert_one(merged_data)
                
                logging.info(f"Item: {item}")
                logging.info(f"Itens: {item_itens}")

            except Exception as e:
                print(f"Failed to query details for item {item}: {e}")
                logging.error(f"Failed to query details for item {item}: {e}")
        else:
            print("could not find some things")

    print("Script executed. Check 'pncp_api.log' for details and 'compiled' folder for JSON files.")

def convert_dates_in_dict(data):
    date_keys = [
        "dataInclusao",
        "dataPublicacaoPncp",
        "dataAtualizacao",
        "dataAberturaProposta",
        "dataEncerramentoProposta",
    ]
    
    non_iso_format = "%Y-%m-%d %H:%M:%S"
    
    for key in date_keys:
        if key in data:
            try:
                data[key] = datetime.fromisoformat(data[key])
            except ValueError:
                try:
                    data[key] = datetime.strptime(data[key], non_iso_format)
                except ValueError:
                    print(f"Error converting date for key {key}: invalid format {data[key]}")
    
    return data

def fix_date_time(edital_data: Dict[str, Any]):
    if not edital_data.get('public_session'):
        encerramento_str = edital_data.get('dataEncerramentoProposta', '')
        if encerramento_str:
            encerramento_datetime = datetime.fromisoformat(encerramento_str)
            public_session_datetime = encerramento_datetime + timedelta(minutes=1)
        else:
            public_session_datetime = None
    else:
        public_session_str = edital_data['public_session']
        public_session_datetime = find_and_convert_datetime(public_session_str)
    
    if public_session_datetime:
        edital_data['publicSessionDatetime'] = public_session_datetime
    else:
        edital_data['publicSessionDatetime'] = None

# 8 = Dispensa
# 6 = Pregão - Eletrônico
# 4 = Concorrência - Eletrônica
# 1 = Leilão - Eletrônico
def scrape_search_api(edital_type_code: Literal[8, 6, 4, 1] = 6):
    page_index = 1
    today = datetime.today().strftime('%Y%m%d')

    try:
        while page_index < 99999:
            contratacao_params = {
                'dataInicial': today,
                'dataFinal': today,
                'codigoModalidadeContratacao': edital_type_code,
                'pagina': page_index,
                'tamanhoPagina': 10
            }
            query_search_api(contratacao_params)
            page_index += 1
    except Exception as e:
        print(f"finished scraping: {e}")

if __name__ == "__main__":
    start_time = time.time()  # Record the start time
    scrape_search_api()
    end_time = time.time()  # Record the end time
    
    total_time = end_time - start_time
    print(f"Execution time: {total_time:.2f} seconds")
