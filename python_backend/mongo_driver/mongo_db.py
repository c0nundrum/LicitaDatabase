import json
import os
from pymongo import MongoClient

def get_database():
    # Connect to the MongoDB server running on default port 27017
    client = MongoClient("mongodb://admin:password@localhost:27017/")
    # Select the database. If it doesn't exist, it will be created.
    db = client["mydatabase"]
    # Select the collection. If it doesn't exist, it will be created.
    return db["editals"]

def entry_exists(numeroControlePNCP):
    # Get the MongoDB collection
    collection = get_database()
    
    # Query the collection
    result = collection.find_one({"numeroControlePNCP": numeroControlePNCP})
    
    # Check if a result was found
    if result:
        print(f"Entry found for numeroControlePNCP: {numeroControlePNCP}")
        return True
    else:
        print(f"No entry found for numeroControlePNCP: {numeroControlePNCP}")
        return False

def main():
    # Path to the folder containing JSON files
    folder_path = 'compiled'
    
    # Get the MongoDB collection
    editals_collection = get_database()
    
    # Counter for successfully inserted documents
    inserted_count = 0

    # Iterate through all files in the directory
    for filename in os.listdir(folder_path):
        if filename.endswith('.json'):
            # Construct the full file path
            file_path = os.path.join(folder_path, filename)
            try:
                # Open and load the JSON file
                with open(file_path, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                # Insert the data into the MongoDB collection
                editals_collection.insert_one(data)
                inserted_count += 1
                print(f"Successfully inserted {filename}")
            except json.JSONDecodeError as e:
                print(f"Failed to decode JSON from {filename}: {e}")
            except Exception as e:
                print(f"Error inserting data from {filename}: {e}")

    print(f"Total inserted documents: {inserted_count}")

if __name__ == '__main__':
    main()
