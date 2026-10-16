"""Modelo de una resolución judicial / legal extraída de una fuente pública.

Es el formato común al que normalizan todos los scrapers (CENDOJ, BOE, ...),
independientemente del origen, para que el resto del proyecto trabaje igual
con cualquier fuente.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Any


@dataclass
class Sentencia:
    """Una resolución (sentencia, auto, disposición) normalizada.

    Attributes:
        id: Identificador único (p. ej. ROJ de CENDOJ o id de BOE).
        fuente: Origen de los datos ("cendoj", "boe", ...).
        titulo: Título o encabezado de la resolución.
        organo: Órgano emisor (tribunal, juzgado, ministerio...).
        fecha: Fecha en formato ISO (YYYY-MM-DD) cuando se conoce.
        url: URL pública de origen.
        texto: Texto íntegro o resumen extraído.
        materias: Etiquetas temáticas (p. ej. "ciberacoso", "sexting", "menores").
        metadatos: Campos adicionales específicos de la fuente.
    """

    id: str
    fuente: str
    titulo: str = ""
    organo: str = ""
    fecha: str | None = None
    url: str = ""
    texto: str = ""
    materias: list[str] = field(default_factory=list)
    metadatos: dict[str, Any] = field(default_factory=dict)

    def a_dict(self) -> dict[str, Any]:
        return asdict(self)
