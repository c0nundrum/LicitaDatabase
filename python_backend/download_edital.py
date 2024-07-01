from pathlib import Path
import re
import requests
import zipfile
import rarfile
import os
import fitz  # PyMuPDF
from rapidfuzz.distance import DamerauLevenshtein

def download_file(url) -> Path:
    # Send a GET request to the URL
    response = requests.get(url, stream=True)
    response.raise_for_status()  # Check if the request was successful

    # Extract filename from the Content-Disposition header
    content_disposition = response.headers.get('Content-Disposition')
    if content_disposition:
        filename = content_disposition.split('filename=')[1].strip('\"')
    else:
        filename = 'downloaded_file.bin'  # Fallback filename

    print(f"trying to get session info from: {filename}")

    complete_path = Path("compiled") / Path("editais") / filename
    # Write the response content to a local file
    with open(complete_path, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    return complete_path

def extract_files(archive_path):
    files = []
    if archive_path.endswith('.zip'):
        with zipfile.ZipFile(archive_path, 'r') as zip_ref:
            zip_ref.extractall('temp')
            files = zip_ref.namelist()
    elif archive_path.endswith('.rar'):
        with rarfile.RarFile(archive_path, 'r') as rar_ref:
            rar_ref.extractall('temp')
            files = rar_ref.namelist()
    return files

def find_edital_file(files):
    for file in files:
        if 'edital' in file.lower():
            return os.path.join('temp', file)
    return None

def search_string_in_file(file_path):
    pdf_document = fitz.open(file_path)
    date_pattern = re.compile(r'\b\d{2}/\d{2}/\d{4}\b')
    target_words = ["sessão", "sessao"]
    closest_line = None
    closest_distance = float('inf')

    for page_num in range(len(pdf_document)):
        page = pdf_document.load_page(page_num)
        text = page.get_text()
        lines = text.splitlines()

        for i, line in enumerate(lines):
            for target_word in target_words:
                if target_word in line.lower():
                    date_match = date_pattern.search(line)
                    if date_match:
                        date_str = date_match.group(0)
                        word_pos = line.find(target_word)
                        date_pos = date_match.start()
                        distance = abs(date_pos - word_pos)
                        
                        if distance < closest_distance:
                            closest_distance = distance
                            closest_line = line

    return closest_line

def get_public_session_date(url):
    downloaded_file = download_file(url)
    if downloaded_file.suffix == '.pdf':
        edital_file = downloaded_file
    elif downloaded_file.suffix == '.zip' or downloaded_file.suffix == '.rar':
      files = extract_files(downloaded_file)
      edital_file = find_edital_file(files)
    
    if edital_file:
        best_match = search_string_in_file(edital_file)
        return best_match 
    else:
        return None 

if __name__ == "__main__":
    url = "https://pncp.gov.br/pncp-api/v1/orgaos/76920826000130/compras/2024/15/arquivos/1"  # Replace with the actual URL
    best_match = get_public_session_date(url)
    
    if best_match:
        print(f"Best match: {best_match}")
    else:
        print("No file with 'edital' in the name found.")
