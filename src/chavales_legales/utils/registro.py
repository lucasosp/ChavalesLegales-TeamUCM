"""Logger sencillo y consistente para todo el proyecto."""

from __future__ import annotations

import logging

_FORMATO = "%(asctime)s | %(levelname)-7s | %(name)s | %(message)s"


def obtener_logger(nombre: str, nivel: int = logging.INFO) -> logging.Logger:
    """Devuelve un logger configurado una sola vez con formato homogéneo."""
    logger = logging.getLogger(nombre)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(_FORMATO))
        logger.addHandler(handler)
        logger.setLevel(nivel)
    return logger
