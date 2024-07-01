import os
import json
from pathlib import Path

decoded_dir = Path('data') / 'decoded'

files_without_title = []
files_without_uasg = []
files_without_pregao = []
total_files = 0

# Helper function to check conditions
def check_conditions(json_data, file_path):
    has_title = False
    has_uasg = False
    has_pregao = False
    
    # Check header for title and UASG
    if 'header' in json_data:
        header = json_data['header']
        if len(header) > 0:
            if 'UASG' not in header[0]:
                has_title = True
            if any('UASG' in item for item in header):
                has_uasg = True
    
    # Check body for Pregão Eletrônico
    if 'body' in json_data:
        body = json_data['body']
        if any('Pregão Eletrônico' in item for item in body):
            has_pregao = True

    if not has_title:
        files_without_title.append(file_path)
    if not has_uasg:
        files_without_uasg.append(file_path)
    if not has_pregao:
        files_without_pregao.append(file_path)

# Walk through the decoded directory and process each JSON file
for root, dirs, files in os.walk(decoded_dir):
    for file in files:
        if file.endswith('.json'):
            total_files += 1
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as json_file:
                json_data = json.load(json_file)
                check_conditions(json_data, file_path)

# Display the results
print(f"Total files processed: {total_files}")
print(f"Files without title: {len(files_without_title)}")
print(f"Files without UASG: {len(files_without_uasg)}")
print(f"Files without Pregão Eletrônico: {len(files_without_pregao)}")

print("\nFiles without title:")
for path in files_without_title:
    print(path)

print("\nFiles without UASG:")
for path in files_without_uasg:
    print(path)

print("\nFiles without Pregão Eletrônico:")
for path in files_without_pregao:
    print(path)
