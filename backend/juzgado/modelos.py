"""Esquema de un caso del juego. Es el formato de salida estructurada que se le
pide al LLM y el que usan los casos de ejemplo. El frontend nunca recibe el caso
completo: solo la vista pública de `partidas.vista_publica` (sin soluciones).

Nota: `visualMetadata` es una lista de {label, value} y no un diccionario libre,
porque la salida estructurada exige objetos con propiedades fijas.
"""
from typing import Literal, Optional

from pydantic import BaseModel

Tema = Literal[
    "ciberacoso", "autolesiones", "conductas_suicidas_menores",
    "desplazamiento_familiar", "deepfake_sexual",
]
Dificultad = Literal["facil", "medio", "dificil"]
Rol = Literal["afectado", "implicado", "testigo"]
RecursoId = Literal[
    "024", "anar", "017", "aepd", "fiscalia_menores", "policia",
    "112", "servicios_sociales", "juzgado_guardia", "016", "centro_educativo",
]
Sello = Literal["legal", "ilegal", "falta_info"]


class LeyBOE(BaseModel):
    code: str         # "Código Penal art. 172 ter"
    officialRef: str  # Cita oficial con su identificador BOE
    simplified: str   # Explicación sencilla para el libro de leyes


class DatoVisual(BaseModel):
    label: str
    value: str


class FichaPersona(BaseModel):
    """Ficha tipo DNI de una persona del caso (datos ficticios)."""
    role: Rol         # afectado = quien sufre; implicado = quien actúa; testigo
    expediente: str   # "EXP-2026-0042"
    fullName: str
    age: int
    region: str
    avatarSeed: str
    visualMetadata: list[DatoVisual]


class DocumentoExtra(BaseModel):
    docTitle: str
    content: str


class InfoFaltante(BaseModel):
    """Ficha o documento imprescindible que NO llega con el caso. El jugador
    debe sellar «Falta información» para recibirlo antes de decidir."""
    reason: str                       # Por qué hacía falta (lo dice Legalín)
    person: Optional[FichaPersona]
    document: Optional[DocumentoExtra]


class Caso(BaseModel):
    id: str
    topic: Tema
    difficulty: Dificultad
    caseSummary: str
    verdictQuestion: str               # Siempre sobre la conducta de un tercero
    isLegal: bool
    boeLaws: list[LeyBOE]
    people: list[FichaPersona]         # Vacío en los fáciles
    extraDocuments: list[DocumentoExtra]
    missingInfo: Optional[InfoFaltante]
    requiresJusticeInfo: bool
    clientRequest: Optional[str]          # Lo que pregunta la familia/amigo
    expectedJusticeResource: Optional[RecursoId]
    hint: str                          # Pista de Legalín si se falla
    explanation: str                   # Explicación de Legalín al acertar


class LoteCasos(BaseModel):
    cases: list[Caso]
