"""API de Chavales Legales: sirve el contenido de los tres modos de juego."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from contenido import COOPERATIVO, HISTORIA, JUICIO, PREGUNTAS
from juzgado.router import router as juzgado_router

app = FastAPI(title="Chavales Legales API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(juzgado_router)  # Juzgado de Legalín: /api/cases/*

JUEGOS = {
    "historia": HISTORIA,
    "preguntas": PREGUNTAS,
    "cooperativo": COOPERATIVO,
    "juicio": JUICIO,
}


@app.get("/")
def root():
    return {"status": "ok", "message": "Chavales Legales API is running"}


@app.get("/api/juegos/{modo}")
def juego(modo: str):
    if modo not in JUEGOS:
        raise HTTPException(404, "Modo no encontrado")
    return JUEGOS[modo]
