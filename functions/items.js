const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

// 📊 URL del CSV en Google Sheets
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1wCeeO7EnrESFsCdEFN-5oTPyHCXAEjypiaIDYgTnXl4/export?format=csv';

// 🔧 Funciones auxiliares
function fixEncoding(text) {
  if (!text) return '';
  try {
    return Buffer.from(text, 'latin1').toString('utf-8');
  } catch (e) {
    return text;
  }
}

function groupByType(items) {
  const grouped = {};
  items.forEach(item => {
    const tipo = item['Tipo de lavado'] || 'Otros';
    if (!grouped[tipo]) grouped[tipo] = [];
    grouped[tipo].push(item);
  });
  return grouped;
}

function getMaxPrice(items) {
  let maxPrice = 0;
  items.forEach(item => {
    try {
      const price = parseFloat(
        item['Precio']?.toString().replace(/\./g, '').replace(/,/g, '.')
      );
      if (price > maxPrice) maxPrice = price;
    } catch (e) {}
  });
  return maxPrice;
}

// 📥 Cargar CSV desde Google Sheets
async function loadCsv() {
  try {
    const response = await axios.get(CSV_URL);
    const items = [];
    
    return new Promise((resolve, reject) => {
      Readable.from([response.data])
        .pipe(csv())
        .on('data', (row) => {
          const fixedRow = {};
          Object.keys(row).forEach(key => {
            fixedRow[key] = fixEncoding(row[key]);
          });
          items.push(fixedRow);
        })
        .on('end', () => resolve(items))
        .on('error', reject);
    });
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
}

// 🚀 Netlify Function
exports.handler = async (event, context) => {
  try {
    const items = await loadCsv();
    const grouped = groupByType(items);
    const maxPrice = getMaxPrice(items);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        items,
        grouped,
        max_price: maxPrice
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
