"""Modelos del juego didáctico generado.

El generador produce un `Juego`, que se serializa a un JSON de configuración.
Ese JSON es el contrato con el motor de la web (que construyen los compañeros):
la web solo necesita leer este JSON para renderizar y jugar.
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Any


@dataclass
class Opcion:
    """Una respuesta posible dentro de una pregunta."""

    texto: str
    correcta: bool = False
    # Explicación que se muestra tras responder (clave para enseñar la ley).
    retroalimentacion: str = ""


@dataclass
class Pregunta:
    """Una pregunta del juego, anclada opcionalmente a una fuente legal real."""

    enunciado: str
    opciones: list[Opcion] = field(default_factory=list)
    # Referencia a la norma/sentencia de la que sale la pregunta (trazabilidad).
    fuente_legal: str = ""
    dificultad: str = "media"  # "facil" | "media" | "dificil"


@dataclass
class Juego:
    """Configuración completa de un juego didáctico.

    Se serializa a JSON (ver `schemas/juego.schema.json`) para el motor web.
    """

    id: str
    titulo: str
    tipo: str  # "quiz" | "escenario" | "verdadero_falso"
    tema: str  # p. ej. "ciberacoso", "privacidad", "sexting"
    edad_min: int
    edad_max: int
    dificultad: str
    preguntas: list[Pregunta] = field(default_factory=list)
    # Ajustes de accesibilidad (dislexia/neurodivergencia), ver docs de ideas.
    accesible: bool = False
    metadatos: dict[str, Any] = field(default_factory=dict)

    def a_dict(self) -> dict[str, Any]:
        return asdict(self)
