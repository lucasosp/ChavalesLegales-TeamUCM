"""Módulo de extracción de datos legales.

Cada fuente (CENDOJ, BOE, ...) tiene su propio scraper, pero todos heredan de
`ScraperBase` y devuelven objetos `Sentencia` ya normalizados.
"""

from .base import ScraperBase

__all__ = ["ScraperBase"]
