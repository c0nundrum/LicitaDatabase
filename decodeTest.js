const fs = require('fs');

// Function to URL-decode the text
function decodeText(text) {
    return decodeURIComponent(text).replace(/&nbsp;/g, ' ');
}

// Recursive function to decode all fields in an object
function decodeFields(data) {
    if (typeof data === 'string') {
        return decodeText(data);
    } else if (Array.isArray(data)) {
        return data.map(item => decodeFields(item));
    } else if (typeof data === 'object' && data !== null) {
        const decodedObject = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                decodedObject[key] = decodeFields(data[key]);
            }
        }
        return decodedObject;
    }
    return data;
}

function decodeJson() {
    // Read the JSON data from the file
    const jsonData = fs.readFileSync('parsedData.json', 'utf8');
    const parsedData = JSON.parse(jsonData);

    // Decode each field in the parsedData array
    const decodedData = decodeFields(parsedData);

    // Convert the decoded data back to JSON
    const decodedJsonData = JSON.stringify(decodedData, null, 2);

    // Save the decoded JSON data to a new file
    fs.writeFileSync('decodedData.json', decodedJsonData, 'latin1');

    console.log('Data has been decoded and saved to decodedData.json');
}

// Export the decodeJson function
module.exports = decodeJson;