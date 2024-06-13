const fs = require('fs');

// Function to URL-decode the text
function decodeText(text) {
    return decodeURIComponent(text);
}

// Read the JSON data from the file
const jsonData = fs.readFileSync('parsedData.json', 'utf8');
const parsedData = JSON.parse(jsonData);

// Decode each field in each object of the parsedData array
const decodedData = parsedData.map(item => {
    const decodedItem = {};
    for (const key in item) {
        if (item.hasOwnProperty(key)) {
            decodedItem[key] = decodeText(item[key]);
        }
    }
    return decodedItem;
});

// Convert the decoded data back to JSON
const decodedJsonData = JSON.stringify(decodedData, null, 2);

// Save the decoded JSON data to a new file
fs.writeFileSync('decodedData.json', decodedJsonData, 'latin1');

console.log('Data has been decoded and saved to decodedData.json');
