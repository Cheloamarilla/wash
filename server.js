const express = require('express');
const cors = require('cors');
const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔗 CORS habilitado
app.use(cors());
app.use(express.static('public'));

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
          // Reparar encoding de cada columna
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

// 🚀 Endpoints

app.get('/items', async (req, res) => {
  const items = await loadCsv();
  const grouped = groupByType(items);
  const maxPrice = getMaxPrice(items);
  
  res.json({
    items,
    grouped,
    max_price: maxPrice
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
