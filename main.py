import csv
import requests
import os
from io import StringIO
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.middleware.cors import CORSMiddleware

# 📁 Obtener ruta base del proyecto
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app = FastAPI()

# Middleware para detectar HTTPS detrás de un proxy (Railway)
class ProxyHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Railway y otros proxies establecen estos headers
        forwarded_proto = request.headers.get("x-forwarded-proto", "")
        if forwarded_proto == "https":
            request.scope["scheme"] = "https"
        response = await call_next(request)
        return response

app.add_middleware(ProxyHeadersMiddleware)

# 🔗 CORS - Permite requests desde Netlify
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, reemplazar con tu dominio de Netlify
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

# 👇 Servimos CSS, JS, imágenes, etc. con ruta absoluta
static_dir = os.path.join(BASE_DIR, "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

CSV_URL = "https://docs.google.com/spreadsheets/d/1wCeeO7EnrESFsCdEFN-5oTPyHCXAEjypiaIDYgTnXl4/export?format=csv"


def fix_encoding(text):
    """Repara strings que vienen mal codificados"""
    if text:
        try:
            return text.encode("latin1").decode("utf-8")
        except (UnicodeEncodeError, UnicodeDecodeError):
            return text
    return ""


def load_csv():
    response = requests.get(CSV_URL)
    response.raise_for_status()
    response.encoding = "utf-8"  # aseguramos que sea UTF-8

    data = []
    reader = csv.DictReader(StringIO(response.text))
    for row in reader:
        # Recorremos cada columna para reparar encoding
        fixed_row = {k: fix_encoding(v) for k, v in row.items()}
        data.append(fixed_row)

    return data


def group_by_type(items):
    """Agrupa los items por tipo de lavado"""
    grouped = {}
    for item in items:
        tipo = item.get("Tipo de lavado", "Otros")
        if tipo not in grouped:
            grouped[tipo] = []
        grouped[tipo].append(item)
    return grouped


def get_max_price(items):
    """Obtiene el precio máximo de todos los items"""
    max_price = 0
    for item in items:
        try:
            price = float(item.get("Precio", "0").replace(".", "").replace(",", ""))
            if price > max_price:
                max_price = price
        except Exception:
            pass
    return max_price


@app.get("/items")
def get_items():
    items = load_csv()
    return {
        "items": items,
        "grouped": group_by_type(items),
        "max_price": get_max_price(items),
    }


@app.get("/")
def home(request: Request):
    items = load_csv()
    grouped_items = group_by_type(items)
    max_price = get_max_price(items)
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "items": items,
            "grouped_items": grouped_items,
            "max_price": max_price,
        },
    )