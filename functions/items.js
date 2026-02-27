const axios = require('axios');
const csv = require('csv-parser');
const { Readable } = require('stream');

// 📊 URL del CSV en Google Sheets
const CSV_URL = 'https://docs.google.com/spreadsheets/d/1wCeeO7EnrESFsCdEFN-5oTPyHCXAEjypiaIDYgTnXl4/export?format=csv';

// 🔧 Funciones auxiliares

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
    const response = await axios.get(CSV_URL, {
      responseType: 'arraybuffer',
      headers: {
        'Accept-Charset': 'utf-8'
      }
    });
    
    // Decodificar el buffer como UTF-8
    let csvData = Buffer.from(response.data, 'utf-8').toString('utf-8');
    
    // Eliminar BOM si existe
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.slice(1);
    }
    
    const items = [];
    
    return new Promise((resolve, reject) => {
      Readable.from([csvData])
        .pipe(csv({
          mapHeaders: ({header}) => header.trim(), // Eliminar espacios en nombres de columna
          mapValues: ({value}) => value.trim() // Trimear todos los valores
        }))
        .on('data', (row) => {
          const fixedRow = {};
          Object.keys(row).forEach(key => {
            let value = row[key] || '';
            // Preservar saltos de línea en "Detalle de lavado"
            // Convertir \r\n a \n y también preservar saltos literales
            if (key.toLowerCase().includes('detalle')) {
              value = value.replace(/\r\n/g, '\n');
            }
            fixedRow[key] = value;
          });
          console.log(`📦 Item parseado: ${fixedRow['Nombre de lavado']} - Detalle length: ${fixedRow['Detalle de lavado']?.length || 0}`);
          items.push(fixedRow);
        })
        .on('end', () => {
          console.log(`✅ Total items parseados: ${items.length}`);
          console.log('🔍 COLUMNAS DISPONIBLES:', items.length > 0 ? Object.keys(items[0]) : []);
          items.forEach((item, idx) => {
            console.log(`\n📌 Item ${idx}:`);
            console.log(`   Nombre: "${item['Nombre de lavado']}"`);
            console.log(`   Tipo: "${item['Tipo de lavado']}"`);
            console.log(`   Detalle (${item['Detalle de lavado']?.length || 0} chars): "${item['Detalle de lavado']?.substring(0, 80) || 'VACÍO'}"...`);
          });
          resolve(items);
        })
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
    
    console.log('\n📊 === RESPUESTA API ===');
    console.log(`Total items: ${items.length}`);
    console.log(`Tipo Estandar: ${grouped['Estandar']?.length || 0}`);
    console.log(`Tipo Premium: ${grouped['Premium']?.length || 0}`);
    
    // Validar que cada item tiene detalle
    items.forEach((item, idx) => {
      const hasDetalle = item['Detalle de lavado'] && item['Detalle de lavado'].trim().length > 0;
      console.log(`  [${idx}] ${item['Nombre de lavado']} (${item['Tipo de lavado']}) - ¿Tiene detalle?: ${hasDetalle ? '✅' : '❌'}`);
    });
    
    return {
      statusCode: 200,
      headers: {
          'Content-Type': 'application/json; charset=utf-8',
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
