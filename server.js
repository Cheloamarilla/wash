const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar la función de las funciones de Netlify
const { handler: itemsHandler } = require('./functions/items');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// CSP Header para permitir Tailwind CDN y fuentes externas
app.use((req, res, next) => {
  res.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:;"
  );
  next();
});

// 🔥 RUTAS DE API - ANTES DEL STATIC MIDDLEWARE
const handleItemsRequest = async (req, res) => {
  try {
    console.log('📡 Procesando solicitud a /items...');
    const result = await itemsHandler({});
    res.status(result.statusCode);
    Object.entries(result.headers || {}).forEach(([key, value]) => {
      res.set(key, value);
    });
    res.send(result.body);
  } catch (error) {
    console.error('❌ Error en items:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

app.get('/items', handleItemsRequest);
app.get('/.netlify/functions/items', handleItemsRequest);

// STATIC FILES - DESPUÉS DE LAS RUTAS DE API
app.use(express.static(path.join(__dirname, 'public')));

// Servir index.html para todas las otras rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✨ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/.netlify/functions/items`);
});
