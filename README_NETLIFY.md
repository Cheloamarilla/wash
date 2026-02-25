# 🚗 Wash Motors

Servicio de lavado a domicilio con reservas dinámicas.

## 🚀 Deploy en Netlify

Esta aplicación está completamente hosteada en **Netlify**:
- **Frontend estático**: Servido desde `/public`
- **Backend serverless**: Netlify Functions en `/functions`

### Estructura del Proyecto

```
wash/
├── functions/
│   └── items.js          # API serverless (Netlify Functions)
├── public/
│   ├── index.html        # Frontend principal
│   ├── css/styles.css    # Estilos
│   ├── js/script.js      # Lógica del cliente
│   └── img/              # Imágenes
├── netlify.toml          # Configuración de Netlify
├── package.json          # Dependencias
└── README.md
```

## 📦 Dependencias

```bash
npm install
```

## 👨‍💻 Desarrollo Local

```bash
npm run dev
```

Abre `http://localhost:3000`

## 🌐 Variables del CSV

Los datos se cargan desde una **Google Sheet** con columnas:
- `Nombre de lavado`
- `Tipo de lavado` (Estandar/Premium)
- `Precio`
- `Demora`
- `Descripcion`
- `Detalle de lavado`

## 📡 API Endpoint

**Netlify Functions**: `/.netlify/functions/items`

Retorna JSON con:
```json
{
  "items": [...],
  "grouped": { "Estandar": [...], "Premium": [...] },
  "max_price": 0
}
```

## 🎯 Features

✅ Carga dinámica de servicios desde Google Sheets  
✅ Tarjetas interactivas con flip animation  
✅ Responsive design  
✅ Deploy automático en Netlify  
✅ Sin backend externo requerido  

---

**Deploy**: [Netlify](https://netlify.com)  
**Repo**: [GitHub - Cheloamarilla/wash](https://github.com/Cheloamarilla/wash)
