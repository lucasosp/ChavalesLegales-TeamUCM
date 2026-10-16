"""Serialización y validación del JSON de juego.

El JSON resultante es el contrato con el motor web. Se valida contra
`schemas/juego.schema.json` para que la web siempre reciba una estructura
consistente.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from ..config import RAIZ_PROYECTO
from ..modelos import Juego

RUTA_SCHEMA = RAIZ_PROYECTO / "schemas" / "juego.schema.json"


def juego_a_json(juego: Juego, indent: int = 2) -> str:
    """Serializa un `Juego` a una cadena JSON legible."""
    return json.dumps(juego.a_dict(), ensure_ascii=False, indent=indent)


def guardar_juego(juego: Juego, destino: str | Path) -> Path:
    """Guarda el juego en disco como JSON."""
    ruta = Path(destino)
    ruta.parent.mkdir(parents=True, exist_ok=True)
    ruta.write_text(juego_a_json(juego), encoding="utf-8")
    return ruta


def validar_juego(juego: Juego) -> bool:
    """Valida el juego contra el JSON Schema. Devuelve True si es válido.

    Lanza `jsonschema.ValidationError` si no cumple el esquema.
    """
    import jsonschema  # import diferido: solo se necesita al validar.

    schema: dict[str, Any] = json.loads(RUTA_SCHEMA.read_text(encoding="utf-8"))
    jsonschema.validate(instance=juego.a_dict(), schema=schema)
    return True
