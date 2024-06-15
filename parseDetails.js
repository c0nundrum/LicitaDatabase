const cheerio = require('cheerio');
const fs = require('fs');

// Assuming you have the HTML content stored in a file called 'page.html'
const htmls = fs.readdirSync('details/', 'utf-8');


// Helper function to determine if a string contains any of the provided keywords
function containsAny(str, keywords) {
  return keywords.some(keyword => str.includes(keyword));
}

// Function to extract data
function parseHTML(htmlString) {
  // Load the HTML content into Cheerio
  const $ = cheerio.load(htmlString);

  let jsonData = {
    ministry: '',
    additionalInfo: [],
    uasg: '',
    auctionInfo: '',
    object: '',
    startDate: '',
    Address: '',
    telephone: null,
    fax: null,
    proposalDelivery: '',
    serviceItems: []
  };

 
  // Select only the second inner table
  // const secondInnerTable = $('table > td[valign="top"] > table').eq(0);
  const secondInnerTable = $('body > table:nth-child(3)');

  // Iterate through the rows and cells of the selected table
  secondInnerTable.find('tr:nth-child(2) > td[valign="top"] > table:nth-child(2)').each(function() {
    $(this).find('> tr').each(function(i, el){
      console.log(i);
      console.log(el.tagName);
      console.log($(this).text().trim());
    });

    // const lines = $(this).text().trim()
    // .split(/\n| {2,}/) // Split the string into lines
    // .map(line => line.trim()) // Trim whitespace from each line
    // .filter(line => line.length > 0); // Filter out empty lines
    // console.log(lines);
  });
  return jsonData;
}

// htmls.forEach(e => parseHTML(fs.readFileSync(`details/${e}`, 'utf-8')));
parseHTML(fs.readFileSync(`details/${htmls[0]}`, 'utf-8'));
// Parse and log the JSON output
// const output = parseHTML();
// console.log(output);
