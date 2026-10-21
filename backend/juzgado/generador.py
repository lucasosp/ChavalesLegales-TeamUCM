"""Genera los casos de una partida: con IA (Claude) si hay ANTHROPIC_API_KEY,
y si no, o si la IA falla, con los casos de ejemplo de `casos_mock.py`.

Todos los casos se piden en una sola llamada para no hacer peticiones durante
la partida.
"""
from __future__ import annotations

import json
import logging
import os
import random

from .casos_mock import CASOS_MOCK
from .constantes import FRANJAS, LEYES_SIMPLIFICADAS, RECURSOS_JUSTICIA, TEMAS, franja
from .modelos import Caso, LoteCasos

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:  # dotenv es opcional
    pass

log = logging.getLogger("juzgado")

MODELO = os.getenv("VEREDICTO_MODELO", "claude-opus-5-5")
ORDEN_DIFICULTAD = {"facil": 0, "medio": 1, "dificil": 2}


def ia_disponible() -> bool:
    if not os.getenv("ANTHROPIC_API_KEY"):
        return False
    try:
        import anthropic  # noqa: F401
    except ImportError:
        return False
    return True


def temas_permitidos(edad: int, temas: list[str]) -> list[str]:
    return [t["id"] for t in TEMAS if t["id"] in temas and edad >= t["minEdad"]]


def generar_casos(edad: int, temas: list[str], n: int) -> dict:
    """Devuelve {"casos": [...], "fuente": "ia" | "ejemplo", "aviso": str | None}."""
    if ia_disponible():
        try:
            return {"casos": _con_ia(edad, temas, n), "fuente": "ia", "aviso": None}
        except Exception as e:  # cualquier fallo de la IA -> casos de ejemplo
            log.warning("Fallo generando casos con IA, uso los de ejemplo: %s", e)
            aviso = "La IA no ha respondido bien; juegas con casos de ejemplo."
    else:
        aviso = None
    return {"casos": _de_ejemplo(edad, temas, n), "fuente": "ejemplo", "aviso": aviso}


# -- Casos de ejemplo ---------------------------------------------------------

def _de_ejemplo(edad: int, temas: list[str], n: int) -> list[dict]:
    pool = [c for c in CASOS_MOCK if c["topic"] in temas and edad >= c["minEdad"]]
    random.shuffle(pool)
    elegidos = sorted(pool[:n], key=lambda c: ORDEN_DIFICULTAD[c["difficulty"]])
    return [Caso.model_validate(c).model_dump() for c in elegidos]


# -- Casos con IA ---------------------------------------------------------------

def _prompt_sistema(edad: int) -> str:
    f = FRANJAS[franja(edad)]
    recursos = "\n".join(f'- "{r["id"]}": {r["nombre"]} ({r["contacto"]}). {r["cuando"]}' for r in RECURSOS_JUSTICIA)
    leyes = json.dumps(LEYES_SIMPLIFICADAS, ensure_ascii=False, indent=1)
    return f"""Eres el guionista de «Veredicto Legal», un juego educativo para niños, niñas y adolescentes de España (proyecto de un datathon sobre acceso a la Justicia de la infancia). El jugador hace de juez: lee un expediente y decide si una conducta es legal o ilegal. Lo guía Legalín, un mono juez simpático.

Contexto jurídico: jurisdicción española (Código Penal, LOPIVI, LO 1/1996, Ley 1/1982, LOPDGDD, Código Civil, LO 5/2000, Convención sobre los Derechos del Niño).

El jugador tiene {edad} años.
Lenguaje: {f["lenguaje"]}
Dificultad: {f["dificultad"]}

Reglas de cada caso:
- Todos los textos en español de España, adaptados a la edad del jugador.
- `verdictQuestion` pregunta SIEMPRE por la conducta de una persona concreta distinta de la víctima («¿Es legal lo que hizo X?»). Nunca juzgues a quien sufre o se hace daño: autolesionarse no es delito; lo ilegal es acosar, inducir o difundir contenidos que lo promueven.
- Equilibra veredictos: alrededor del 40 % de los casos con `isLegal: true` (por ejemplo, alguien que avisa a un adulto, una mudanza acordada, quien borra y denuncia).
- `boeLaws`: 1-3 normas reales. Usa preferentemente las de esta lista (copia `code`, `officialRef` y `simplified` tal cual). Si citas otra, solo artículos que existan con total certeza:
{leyes}
- Seguridad: sin detalles gráficos, sin métodos de autolesión o suicidio, sin descripciones sexuales. En deepfakes basta con «foto o vídeo falso íntimo hecho con IA».
- Nombres, expedientes y datos totalmente ficticios. `expediente` con formato EXP-2026-NNNN. `avatarSeed`: nombre en minúsculas con guiones.
- `people` son fichas tipo DNI de las personas del caso: `role` "afectado" (quien sufre), "implicado" (quien actúa) o "testigo". Incluye la del implicado cuando su edad o datos importan (por ejemplo, menor o mayor de 14 años). Cada ficha con 2-3 `visualMetadata` (curso, dispositivo, relación...).
- Según `difficulty`:
  - "facil": `people: []`, `extraDocuments: []`, `missingInfo: null`, `requiresJusticeInfo: false`.
  - "medio": 1-2 fichas, 1 documento extra.
  - "dificil": 2-3 fichas, 2 documentos extra; el resumen deja una duda y uno de los documentos es clave para acertar el veredicto (estilo «Papers, Please»). `requiresJusticeInfo: true`.
- `missingInfo` (aproximadamente en 1 de cada 4 casos medios o difíciles; nunca en fáciles): una ficha (`person`) o un documento (`document`) IMPRESCINDIBLE para decidir el veredicto o el recurso, que NO aparece en `people` ni en `extraDocuments` y cuyo contenido no se deduce del resumen. El jugador debe sellar «Falta información» para recibirlo. `reason` explica en una frase por qué hacía falta. Rellena solo uno de los dos (`person` o `document`); el otro, null. En el resto de casos, `missingInfo: null`.
- `requiresJusticeInfo` es true en todos los difíciles y en aproximadamente un tercio de los medios. Entonces `clientRequest` es lo que pregunta la familia o un amigo y `expectedJusticeResource` es el id del único recurso claramente correcto de esta lista (si no es claro, no pidas recurso):
{recursos}
  Si `requiresJusticeInfo` es false, `clientRequest` y `expectedJusticeResource` son null.
- `hint`: pista de Legalín si el jugador falla, sin revelar la respuesta.
- `explanation`: explicación de Legalín al acertar, adaptada a la edad, citando la norma y, en temas delicados, recordando que pedir ayuda está bien.
- `id`: único, por ejemplo "ia-1", "ia-2"..."""


def _con_ia(edad: int, temas: list[str], n: int) -> list[dict]:
    import anthropic

    client = anthropic.Anthropic(timeout=180.0)
    respuesta = client.messages.parse(
        model=MODELO,
        max_tokens=16000,
        system=_prompt_sistema(edad),
        messages=[{"role": "user", "content": f"Genera exactamente {n} casos repartidos entre estos temas: {', '.join(temas)}."}],
        output_format=LoteCasos,
    )
    if respuesta.stop_reason != "end_turn" or respuesta.parsed_output is None:
        raise RuntimeError(f"respuesta incompleta (stop_reason={respuesta.stop_reason})")

    casos = [_normalizar(c, i) for i, c in enumerate(respuesta.parsed_output.cases) if c.topic in temas]
    if not casos:
        raise RuntimeError("la IA no devolvió casos de los temas pedidos")
    casos.sort(key=lambda c: ORDEN_DIFICULTAD[c["difficulty"]])
    return casos[:n]


def _normalizar(caso: Caso, i: int) -> dict:
    """Corrige incoherencias que romperían la partida."""
    c = caso.model_dump()
    c["id"] = f"ia-{i + 1}"
    if not c["expectedJusticeResource"]:
        c["requiresJusticeInfo"] = False
    if not c["requiresJusticeInfo"]:
        c["clientRequest"] = c["expectedJusticeResource"] = None
    elif not c["clientRequest"]:
        c["clientRequest"] = "La familia pregunta: ¿a qué organismo o servicio debemos acudir?"
    info = c["missingInfo"]
    if c["difficulty"] == "facil" or (info and not info["person"] and not info["document"]):
        c["missingInfo"] = None
    if c["difficulty"] == "facil":
        c["extraDocuments"] = []
    return c
