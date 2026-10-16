"""Modelos de datos compartidos entre extracción y generación de juegos."""

from .sentencia import Sentencia
from .juego import Juego, Pregunta, Opcion

__all__ = ["Sentencia", "Juego", "Pregunta", "Opcion"]
