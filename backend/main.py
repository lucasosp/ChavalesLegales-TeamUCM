"""API de Chavales Legales: expone temas, catálogo de juegos y el generador."""
import sys
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from chavales_legales.juegos.generador import GeneradorJuegos, ParametrosJuego  # noqa: E402

app = FastAPI(title="Chavales Legales API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMAS = {
    "phishing": {
        "titulo": "Phishing",
        "resumen": "Mensajes trampa que roban cuentas y datos.",
        "ley": "Art. 249 CP (estafa informática)",
        "juegos": ["Caza-phishing", "Inspector de enlaces", "Blindaje de cuenta"],
    },
    "acecho": {
        "titulo": "Acecho online",
        "resumen": "Vigilar, perseguir o controlar a alguien por redes.",
        "ley": "Arts. 172 ter y 183 CP",
        "juegos": ["Decide y descubre", "Huella bajo control", "¿Amigo o anzuelo?"],
    },
    "deepfakes": {
        "titulo": "Deepfakes",
        "resumen": "Imágenes y vídeos falsos creados con IA.",
        "ley": "Arts. 197.7 y 189 CP",
        "juegos": ["Detector de deepfakes", "Stop al reenvío", "¿Real o IA?"],
    },
    "cooperativo": {
        "titulo": "Modo cooperativo",
        "resumen": "Juegos por parejas y en aula para ayudar a otros.",
        "ley": "LORPM (responsabilidad penal del menor)",
        "juegos": ["Dúo legal", "No te calles", "Cadena de ayuda"],
    },
}


@app.get("/")
def root():
    return {"status": "ok", "message": "Chavales Legales API is running"}


@app.get("/api/temas")
def temas():
    return [{"id": k, **v} for k, v in TEMAS.items()]


@app.get("/api/temas/{tema_id}")
def tema(tema_id: str):
    if tema_id not in TEMAS:
        raise HTTPException(404, "Tema no encontrado")
    return {"id": tema_id, **TEMAS[tema_id]}


@app.post("/api/juegos")
def generar_juego(params: dict):
    try:
        juego = GeneradorJuegos().generar(ParametrosJuego(**params))
    except (TypeError, ValueError) as e:
        raise HTTPException(400, str(e))
    return juego.a_dict()
