import os
import json
import re

decoded_dir = 'data/decoded'
transformed_dir = 'data/transformed'

# Helper function to parse the body field
def parse_body(body):
    parsed_body = {}
    key = None

    for i, item in enumerate(body):
        if item.strip().endswith(':'):
            if key:  # Previous key without a value
                parsed_body[key] = ''
            key = item.split(':')[0].strip()
            value = item.split(':')[1].strip() if ':' in item else ''
            if value:
                parsed_body[key] = value
                key = None  # Reset key
        else:
            if key:
                parsed_body[key] = item.strip()
                key = None
            else:
                parsed_body[f'field_{i}'] = item.strip()
    
    if key:  # Last key without a value
        parsed_body[key] = ''
    
    return parsed_body

# Helper function to parse the footer field
def parse_footer(footer):
    parsed_footer = {}
    key = None
    value_lines = []

    for item in footer[1:]:  # Skip the first item "Itens de material"
        match = re.match(r'^\d+ - ', item)
        if match:
            if key:  # Save the previous key-value pair
                parsed_footer[key] = '\n'.join(value_lines)
            key = item
            value_lines = []
        else:
            value_lines.append(item.strip())
    
    if key:  # Save the last key-value pair
        parsed_footer[key] = '\n'.join(value_lines)
    
    return parsed_footer

# Helper function to transform JSON data
def transform_json_data(json_data, file_path):
    transformed_data = {}
    additional_info = []

    if 'header' in json_data:
        header = json_data['header']
        uasg_number = None
        title = None
        title_found = False

        # Extract UASG number, title, and additional information
        for item in header:
            if not title_found and 'UASG' not in item:
                title = item.strip()
                title_found = True
            elif 'UASG' in item:
                uasg_number = item.split(':')[-1].strip()
                break
            else:
                if title_found:
                    additional_info.append(item.strip())
        
        if uasg_number:
            transformed_data['uasg_number'] = uasg_number
        if title:
            transformed_data['title'] = title
        if additional_info:
            transformed_data['additional_info'] = additional_info
    
    if 'body' in json_data:
        body = json_data['body']
        if len(body) > 0 and 'Pregão Eletrônico' in body[0]:
            identifier = body[0]
            if len(body) > 1 and 'Lei' in body[1]:
                identifier += ' - ' + body[1]
            transformed_data['identifier'] = identifier

        transformed_body = parse_body(body)
        transformed_data.update(transformed_body)
    
    if 'footer' in json_data:
        footer = json_data['footer']
        transformed_footer = parse_footer(footer)
        transformed_data['itens'] = transformed_footer

    return transformed_data

# Create the transformed directory if it does not exist
os.makedirs(transformed_dir, exist_ok=True)

# Walk through the decoded directory and process each JSON file
for root, dirs, files in os.walk(decoded_dir):
    for file in files:
        if file.endswith('.json'):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as json_file:
                json_data = json.load(json_file)
                transformed_data = transform_json_data(json_data, file_path)
                
                # Construct the same file path under transformed directory
                relative_path = os.path.relpath(file_path, decoded_dir)
                transformed_path = os.path.join(transformed_dir, relative_path)
                
                # Create directories if they don't exist
                os.makedirs(os.path.dirname(transformed_path), exist_ok=True)
                
                # Save the transformed data as JSON
                with open(transformed_path, 'w', encoding='utf-8') as output_json_file:
                    json.dump(transformed_data, output_json_file, ensure_ascii=False, indent=4)
                    
