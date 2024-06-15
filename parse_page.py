import json
import pprint
import re
from bs4 import BeautifulSoup, NavigableString
import os
import codecs

# Assuming you have the HTML content stored in a directory called 'details/'
html_files = os.listdir('details/')

# Helper function to determine if a string contains any of the provided keywords
def contains_any(string, keywords):
    return any(keyword in string for keyword in keywords)

# Function to print only direct text of a tag
def print_direct_text(tag, header_text, should_print, joiner:str =''):
    direct_text = joiner.join(child for child in tag.children if isinstance(child, str))
    if direct_text.strip():
        if should_print:
          print(f"{tag.name}: {direct_text.strip()}")

        header_text.append(direct_text.strip())

# Recursive function to walk through each tag
def walk_html_tree(tag, header_text, should_print=True, joiner:str =''):
    # Process the current tag
    print_direct_text(tag, header_text, should_print, joiner)
    
    # Iterate over all children of the current tag that are also tags
    for child in tag.children:
        if child.name is not None:  # Check if the child is a tag
            walk_html_tree(child, header_text, should_print)

def handle_header_info(soup):
    header_text = []

    # Find all tags with direct text
    walk_html_tree(soup, header_text, False)

    result = {
      "ministry": header_text[0] if len(header_text) > 0 else None,  # First item for ministry
      "uasg": header_text[-1] if len(header_text) > 1 else None,  # Last item for uasg
      "additionalInfo": header_text[1:-1] if len(header_text) > 2 else []  # Middle items for additionalInfo
    }

    return result

def get_all_text_array(soup: BeautifulSoup):
    full_text = soup.get_text(separator='\n--@--\n', strip=True)

    return [re.sub(r'\s+', ' ', dirty_text) for dirty_text in full_text.split('\n--@--\n')]

def extract_text(sibling):
    text = []
    while sibling:
        # Check if the sibling is a NavigableString and not part of another tag
        if not isinstance(sibling, NavigableString):
            break

        text_content = sibling.string.strip()
        if text_content:  # Check if the text content is not just empty or whitespace
            text.append(text_content)
        sibling = sibling.next_sibling
    
    cleaned_text = ' '.join(text).strip()
    # Remove newlines and multiple spaces
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text.replace('\n', ' '))
    return cleaned_text

def handle_body_data(soup):
  container = soup.find('td', class_='tex3')

  # Dictionary to store the extracted information
  data = {}

  # Find all <b> tags and iterate over them
  current = container.find('b')
  while current:
      key = current.get_text(strip=True).replace(':', '')
      value = extract_text(current.next_sibling) if isinstance(current.next_sibling, str) else ''
      data[key] = value
      current = current.find_next('b')
  
  return data

def handle_footer_info(soup):
    # Find the relevant container
    container = soup.find('table', width='100%')

    # Replace <br> tags with '\n'
    for br in container.find_all('br'):
        br.replace_with('\n')

    # Extract text
    extracted_text = container.get_text(strip=False)

    return extracted_text if extracted_text else ''

# Function to extract data
def parse_html(html_string):
    # Load the HTML content into BeautifulSoup
    soup = BeautifulSoup(html_string, 'html.parser')

    json_data = {
        'ministry': '',
        'additionalInfo': [],
        'uasg': '',
        'auctionInfo': '',
        'object': '',
        'startDate': '',
        'Address': '',
        'telephone': None,
        'fax': None,
        'proposalDelivery': '',
        'serviceItems': ''
    }

    # Navigate to the specific table
    # Step 1: Select the third table in the body
    table = soup.find('body').find_all('table', recursive=False)[1]  # Since indexing is zero-based
    main_tr = table.find_all('tr', recursive=False)[1]
    aligned_td = main_tr.find_all('td', recursive=False)[0]
    main_info_table = aligned_td.find_all('table', recursive=False)[1]
    main_info_header = main_info_table.find_all('tr', recursive=False)[0]

    main_info_body = main_info_table.find_all('tr', recursive=False)[1]

    main_info_footer = main_info_table.find_all('tr', recursive=False)[2]

    # header_info = handle_header_info(main_info_header)
    # json_data['ministry'] = header_info['ministry']
    # json_data['additionalInfo'] = header_info['additionalInfo']
    # json_data['uasg'] = header_info['uasg']

    # body_info = handle_body_data(main_info_body)
    # json_data['object'] = body_info['Objeto']
    # json_data['startDate'] = body_info['Edital a partir de']
    # json_data['Address'] = body_info['Endereço']
    # json_data['telephone'] = body_info['Telefone']
    # json_data['fax'] = body_info['Fax']
    # json_data['proposalDelivery'] = body_info['Entrega da Proposta']

    # json_data['serviceItems'] = handle_footer_info(main_info_footer)



    json_data = {}
    # json_data['header'] = handle_footer_info(main_info_header)
    # json_data['body'] = handle_footer_info(main_info_body)
    # json_data['footer'] = handle_footer_info(main_info_footer)

    print("Header:")
    header_arr = get_all_text_array(main_info_header)
    pprint.pp(header_arr)
    print('\n\n\n')
    print("Body:")
    body_arr = get_all_text_array(main_info_body)
    pprint.pp(body_arr)

    print('\n\n\n')
    print("Footer:")
    footer_arr = get_all_text_array(main_info_footer)
    pprint.pp(footer_arr)
    print('======')

    json_data['header'] = header_arr 
    json_data['body'] = body_arr 
    json_data['footer'] = footer_arr 

    return json_data

def save_data_as_json(data, filename):
    # Saving the data into a JSON file with indentation for readability
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# for html_file in html_files:
#   file_path = os.path.join('details', html_file)
#   with codecs.open(file_path, 'r', 'utf-8') as file:
#       html_content = file.read()
#       parsed_data = parse_html(html_content)
#       # Save each parsed data into a JSON file
#       json_filename = os.path.splitext(html_file)[0] + '.json'
#       json_path = os.path.join('decoded', json_filename)  # save JSON in a subdirectory 'json'
#       save_data_as_json(parsed_data, json_path)

details_dir = 'details'
decoded_dir = 'decoded'

for root, dirs, files in os.walk(details_dir):
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            with codecs.open(file_path, 'r', 'utf-8') as html_file:
                html_content = html_file.read()
                parsed_data = parse_html(html_content)
                
                # Construct the new JSON path
                relative_path = os.path.relpath(file_path, details_dir)
                json_filename = os.path.splitext(file)[0] + '.json'
                json_path = os.path.join(decoded_dir, os.path.dirname(relative_path), json_filename)
                
                # Create directories if they don't exist
                os.makedirs(os.path.dirname(json_path), exist_ok=True)
                
                # Save the parsed data as JSON
                save_data_as_json(parsed_data, json_path)
