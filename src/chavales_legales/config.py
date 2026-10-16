"""Configuración central del proyecto.

Lee variables de entorno (ver `.env.example`) con valores por defecto sensatos,
y expone las rutas de datos ya resueltas a rutas absolutas.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # dotenv es opcional; si no está, se usan solo las env vars del sistema.
    pass

# Raíz del repositorio (este archivo está en src/chavales_legales/config.py).
RAIZ_PROYECTO = Path(__file__).resolve().parents[2]


def _ruta(valor: str, por_defecto: str) -> Path:
    bruto = os.getenv(valor, por_defecto)
    ruta = Path(bruto)
    return ruta if ruta.is_absolute() else RAIZ_PROYECTO / ruta


RUTA_DATOS_RAW: Path = _ruta("RUTA_DATOS_RAW", "data/raw")
RUTA_DATOS_PROCESSED: Path = _ruta("RUTA_DATOS_PROCESSED", "data/processed")

DELAY_SEGUNDOS: float = float(os.getenv("EXTRACCION_DELAY_SEGUNDOS", "1.5"))
USER_AGENT: str = os.getenv(
    "EXTRACCION_USER_AGENT",
    "ChavalesLegales-TeamUCM/0.1 (proyecto educativo UCM)",
)
