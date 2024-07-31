const fs = require('fs');
const path = require('path');

function parseCSV(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const result = {};
    headers.forEach((header, index) => {
      const keys = header.split('.');
      let current = result;
      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          current[key] = values[index];
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });
    });
    return result;
  });
}

module.exports = parseCSV;
