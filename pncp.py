import requests
import os
import json
import logging
from typing import Dict, Any

# Set up logging
logging.basicConfig(filename='pncp_api.log', level=logging.INFO, 
                    format='%(asctime)s:%(levelname)s:%(message)s')

def query_pncp_api(params: Dict[str, Any]) -> Dict[str, Any]:
    base_url = "https://pncp.gov.br/api/search/"
    response = requests.get(base_url, params=params)
    response.raise_for_status()
    return response.json()

def query_item_details(orgao_cnpj: str, ano: str, numero_sequencial: str) -> Dict[str, Any]:
    base_url = f"https://pncp.gov.br/api/pncp/v1/orgaos/{orgao_cnpj}/compras/{ano}/{numero_sequencial}"
    response = requests.get(base_url)
    response.raise_for_status()
    return response.json()

def query_item_itens(orgao_cnpj: str, ano: str, numero_sequencial: str) -> Dict[str, Any]:
    base_url = f"https://pncp.gov.br/api/pncp/v1/orgaos/{orgao_cnpj}/compras/{ano}/{numero_sequencial}/itens"
    response = requests.get(base_url)
    response.raise_for_status()
    return response.json()

def save_json_to_file(data: Dict[str, Any], filename: str):
    os.makedirs('compiled', exist_ok=True)
    with open(os.path.join('compiled', filename), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Example parameters for the initial query
params = {
    # 'q': 'materiais de consumo laboratoriais',
    'tipos_documento': 'edital',
    'ordenacao': '-data',
    'pagina': 1,
    'tam_pagina': 10,
    'status': 'todos',
    'ufs': 'GO',
    # 'municipios': 5339
}

# Get the initial list of items
initial_response = query_pncp_api(params)

# Loop through each item and get detailed information
for item in initial_response.get('items', []):
    orgao_cnpj = item.get('orgao_cnpj')
    ano = item.get('ano')
    numero_sequencial = item.get('numero_sequencial')

    if orgao_cnpj and ano and numero_sequencial:
        try:
            item_details = query_item_details(orgao_cnpj, ano, numero_sequencial)
            item_itens = query_item_itens(orgao_cnpj, ano, numero_sequencial)
            
            # Merge the item with its details and itens
            merged_data = {**item, **item_details, "itens": item_itens}
            
            # Save the merged data to a file
            filename = f"{item['id']}.json"
            save_json_to_file(merged_data, filename)
            
            logging.info(f"Item: {item}")
            logging.info(f"Details: {item_details}")
            logging.info(f"Itens: {item_itens}")
        except requests.RequestException as e:
            logging.error(f"Failed to query details for item {item}: {e}")

print("Script executed. Check 'pncp_api.log' for details and 'compiled' folder for JSON files.")


