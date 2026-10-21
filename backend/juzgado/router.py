"""Endpoints del juego «Juzgado de Legalín» (Reto 2 - Infancia y juventud)."""
from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool

from .constantes import config_publica
from .generador import generar_casos, ia_disponible, temas_permitidos
from .partidas import PARTIDAS, Partida, crear_partida, siguiente, verificar
from .schemas import (PeticionInicio, PeticionVerificar, RespuestaInicio,
                      RespuestaSiguiente, ResultadoVerificacion)

router = APIRouter(prefix="/api/cases", tags=["juzgado"])


def _partida(partida_id: str) -> Partida:
    partida = PARTIDAS.get(partida_id)
    if partida is None:
        raise HTTPException(404, "La partida ha caducado. Empieza otra.")
    return partida


@router.get("/config")
def config():
    return config_publica(ia_disponible())


@router.post("/start", response_model=RespuestaInicio)
async def start(p: PeticionInicio):
    temas = temas_permitidos(p.edad, p.temas)
    if not temas:
        raise HTTPException(422, "Elige al menos un tema disponible para tu edad")
    # La llamada a la IA es bloqueante: se ejecuta fuera del bucle de eventos.
    generado = await run_in_threadpool(generar_casos, p.edad, temas, p.n)
    partida = crear_partida(p.edad, generado["casos"])
    return {"partidaId": partida.id, "total": len(partida.casos),
            "fuente": generado["fuente"], "aviso": generado["aviso"]}


@router.get("/next", response_model=RespuestaSiguiente)
def next_case(partida: str):
    return siguiente(_partida(partida))


@router.post("/verify", response_model=ResultadoVerificacion)
def verify(p: PeticionVerificar):
    try:
        return verificar(_partida(p.partidaId), p.sello, p.recurso)
    except ValueError as e:
        raise HTTPException(409, str(e))
