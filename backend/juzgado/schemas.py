"""Contratos de la API del Veredicto Legal (/api/cases/*).

El navegador nunca recibe soluciones: ni el veredicto correcto, ni el recurso
esperado, ni la información oculta. Todo eso se queda en `partidas.py`.
"""
from typing import Optional

from pydantic import BaseModel, Field

from .modelos import DocumentoExtra, FichaPersona, LeyBOE, Sello


# -- Peticiones ---------------------------------------------------------------

class PeticionInicio(BaseModel):
    edad: int = Field(ge=7, le=16)
    temas: list[str]
    n: int = Field(ge=3, le=10)


class PeticionVerificar(BaseModel):
    partidaId: str
    sello: Sello
    recurso: Optional[str] = None   # id del recurso entregado en la bandeja


# -- Respuestas ---------------------------------------------------------------

class RespuestaInicio(BaseModel):
    partidaId: str
    total: int
    fuente: str                  # "ia" | "ejemplo"
    aviso: Optional[str]


class OpcionRecurso(BaseModel):
    id: str
    nombre: str
    contacto: str
    cuando: str


class CasoPublico(BaseModel):
    """Lo que ve el jugador de un caso."""
    indice: int
    total: int
    puntos: int
    id: str
    topic: str
    difficulty: str
    caseSummary: str
    verdictQuestion: str
    people: list[FichaPersona]
    extraDocuments: list[DocumentoExtra]
    laws: list[LeyBOE]           # Páginas del libro: leyes del tema + las del caso, adaptadas a la edad
    requiresJusticeInfo: bool
    clientRequest: Optional[str]
    resourceOptions: list[OpcionRecurso]   # Exactamente 3 si el caso pide recurso; si no, vacío
    helpPills: list[str]


class RespuestaSiguiente(BaseModel):
    fin: bool
    caso: Optional[CasoPublico]
    puntos: int
    racha: int = 0
    mejorRacha: int = 0


class Revelado(BaseModel):
    person: Optional[FichaPersona]
    document: Optional[DocumentoExtra]


class ResultadoVerificacion(BaseModel):
    tipo: str                    # correcto | incorrecto | falta_ok | falta_pendiente | nada_falta
    correcto: bool
    mensaje: str
    fallos: int
    puntos: int
    veredictoOk: Optional[bool] = None
    recursoOk: Optional[bool] = None
    revelado: Optional[Revelado] = None
    estrellas: Optional[int] = None
    leyes: Optional[list[LeyBOE]] = None
    recurso: Optional[OpcionRecurso] = None
    finPartida: bool = False
    racha: int = 0               # aciertos seguidos a la primera
    mejorRacha: int = 0
    bonus: int = 0               # estrella extra ganada por racha en este sello
