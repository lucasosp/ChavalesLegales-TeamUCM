"""Clase base para los scrapers.

Centraliza lo común a todas las fuentes:
- Sesión HTTP con User-Agent identificativo.
- Ritmo entre peticiones (respeto a los servidores públicos).
- Guardado de los resultados normalizados en `data/processed`.

Cada fuente concreta implementa `buscar()`.
"""

from __future__ import annotations

import json
import time
from abc import ABC, abstractmethod
from pathlib import Path

import requests

from ..config import DELAY_SEGUNDOS, RUTA_DATOS_PROCESSED, USER_AGENT
from ..modelos import Sentencia
from ..utils import obtener_logger


class ScraperBase(ABC):
    """Base común a todos los scrapers de fuentes legales."""

    #: Nombre corto de la fuente ("cendoj", "boe", ...). Lo define cada subclase.
    fuente: str = "base"

    def __init__(self, delay: float | None = None) -> None:
        self.delay = DELAY_SEGUNDOS if delay is None else delay
        self.log = obtener_logger(f"extraccion.{self.fuente}")
        self.sesion = requests.Session()
        self.sesion.headers.update({"User-Agent": USER_AGENT})

    def _get(self, url: str, **kwargs) -> requests.Response:
        """GET con ritmo controlado y errores HTTP elevados como excepción."""
        time.sleep(self.delay)
        self.log.debug("GET %s", url)
        resp = self.sesion.get(url, timeout=30, **kwargs)
        resp.raise_for_status()
        return resp

    @abstractmethod
    def buscar(self, consulta: str, limite: int = 20) -> list[Sentencia]:
        """Busca resoluciones que coincidan con `consulta` y las normaliza.

        Debe devolver una lista de `Sentencia`. La implementación concreta
        depende de cada fuente.
        """
        raise NotImplementedError

    def guardar(self, sentencias: list[Sentencia], nombre: str) -> Path:
        """Vuelca las sentencias a un JSON Lines en `data/processed`."""
        RUTA_DATOS_PROCESSED.mkdir(parents=True, exist_ok=True)
        destino = RUTA_DATOS_PROCESSED / f"{nombre}.jsonl"
        with destino.open("w", encoding="utf-8") as f:
            for s in sentencias:
                f.write(json.dumps(s.a_dict(), ensure_ascii=False) + "\n")
        self.log.info("Guardadas %d resoluciones en %s", len(sentencias), destino)
        return destino
