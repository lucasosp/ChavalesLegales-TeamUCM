"""Generador automático de juegos didácticos.

Toma unos parámetros (tema, edad, tipo de juego, dificultad, nº de preguntas)
y produce un `Juego` que se serializa a JSON. Ese JSON es lo que consumirá el
motor de la web.

Fuente de las preguntas: por ahora un banco semilla (`banco_preguntas.py`)
curado a partir de la legislación española sobre menores y tecnología. Cuando
la extracción (`extraccion/`) esté lista, este generador podrá construir
preguntas también a partir de las sentencias/normas extraídas.
"""

from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Any

from ..modelos import Juego, Opcion, Pregunta
from ..utils import obtener_logger
from .banco_preguntas import BANCO

TIPOS_VALIDOS = {"quiz", "verdadero_falso", "escenario"}
DIFICULTADES = {"facil", "media", "dificil"}

log = obtener_logger("juegos.generador")


@dataclass
class ParametrosJuego:
    """Parámetros de entrada que definen el juego a generar."""

    tema: str = "ciberacoso"
    tipo: str = "quiz"
    edad_min: int = 10
    edad_max: int = 14
    dificultad: str = "media"
    n_preguntas: int = 5
    accesible: bool = False
    semilla: int | None = None  # Para reproducibilidad en los tests/demos.
    metadatos: dict[str, Any] = field(default_factory=dict)

    def validar(self) -> None:
        if self.tipo not in TIPOS_VALIDOS:
            raise ValueError(f"tipo inválido: {self.tipo!r}. Usa {TIPOS_VALIDOS}.")
        if self.dificultad not in DIFICULTADES:
            raise ValueError(
                f"dificultad inválida: {self.dificultad!r}. Usa {DIFICULTADES}."
            )
        if self.edad_min > self.edad_max:
            raise ValueError("edad_min no puede ser mayor que edad_max.")
        if self.n_preguntas < 1:
            raise ValueError("n_preguntas debe ser >= 1.")


class GeneradorJuegos:
    """Construye objetos `Juego` a partir de `ParametrosJuego`."""

    def generar(self, params: ParametrosJuego) -> Juego:
        params.validar()
        rng = random.Random(params.semilla)

        candidatas = self._seleccionar_preguntas(params, rng)
        preguntas = [self._a_pregunta(item, params, rng) for item in candidatas]

        juego = Juego(
            id=self._id_juego(params, rng),
            titulo=self._titulo(params),
            tipo=params.tipo,
            tema=params.tema,
            edad_min=params.edad_min,
            edad_max=params.edad_max,
            dificultad=params.dificultad,
            preguntas=preguntas,
            accesible=params.accesible,
            metadatos={"version_generador": "0.1.0", **params.metadatos},
        )
        log.info(
            "Generado juego '%s' (%s, %d preguntas)",
            juego.titulo,
            juego.tipo,
            len(juego.preguntas),
        )
        return juego

    # -- internos ---------------------------------------------------------

    def _seleccionar_preguntas(
        self, params: ParametrosJuego, rng: random.Random
    ) -> list[dict[str, Any]]:
        pool = [p for p in BANCO if p["tema"] == params.tema]
        if not pool:
            log.warning(
                "No hay preguntas para el tema %r; usando todo el banco.", params.tema
            )
            pool = list(BANCO)

        # Prioriza la dificultad pedida pero completa con el resto si faltan.
        preferidas = [p for p in pool if p["dificultad"] == params.dificultad]
        resto = [p for p in pool if p["dificultad"] != params.dificultad]
        rng.shuffle(preferidas)
        rng.shuffle(resto)
        ordenadas = preferidas + resto
        return ordenadas[: params.n_preguntas]

    def _a_pregunta(
        self, item: dict[str, Any], params: ParametrosJuego, rng: random.Random
    ) -> Pregunta:
        opciones = [
            Opcion(
                texto=o["texto"],
                correcta=o.get("correcta", False),
                retroalimentacion=o.get("retroalimentacion", ""),
            )
            for o in item["opciones"]
        ]
        rng.shuffle(opciones)
        return Pregunta(
            enunciado=item["enunciado"],
            opciones=opciones,
            fuente_legal=item.get("fuente_legal", ""),
            dificultad=item.get("dificultad", params.dificultad),
        )

    def _titulo(self, params: ParametrosJuego) -> str:
        return f"Chavales Legales — {params.tema.replace('_', ' ').capitalize()}"

    def _id_juego(self, params: ParametrosJuego, rng: random.Random) -> str:
        return f"{params.tema}-{params.tipo}-{rng.randint(1000, 9999)}"
