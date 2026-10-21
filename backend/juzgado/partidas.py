"""Estado de las partidas y corrección de los sellos.

La partida vive en memoria del servidor: el navegador pide el caso actual
(`siguiente`) y manda cada sello a `verificar`, que corrige y lleva la puntuación.
Limitación: las partidas se pierden al reiniciar el backend (válido para la demo).
"""
from __future__ import annotations

import random
import uuid
from collections import OrderedDict
from dataclasses import dataclass, field

from .constantes import LEYES_SIMPLIFICADAS, RECURSOS_JUSTICIA
from .textos import adaptar_texto, mensaje, pildoras_ayuda

ESTRELLAS_MAX = 3      # por caso; cada intento fallido resta una
PARTIDAS_MAX = 500     # se descartan las más antiguas
N_OPCIONES = 3         # tarjetas en la zona «¿A quién acudir?»


@dataclass
class EstadoCaso:
    fallos: int = 0
    revelado: bool = False   # ya se ha entregado la información que faltaba
    resuelto: bool = False
    estrellas: int = 0
    opciones: list[dict] = field(default_factory=list)


@dataclass
class Partida:
    id: str
    edad: int
    casos: list[dict]
    estados: list[EstadoCaso] = field(default_factory=list)

    @property
    def puntos(self) -> int:
        return sum(e.estrellas for e in self.estados)

    @property
    def actual(self) -> int | None:
        """Índice del primer caso sin resolver, o None si la partida ha terminado."""
        return next((i for i, e in enumerate(self.estados) if not e.resuelto), None)


PARTIDAS: "OrderedDict[str, Partida]" = OrderedDict()


def _recurso(rid):
    return next((r for r in RECURSOS_JUSTICIA if r["id"] == rid), None)


def opciones_recurso(caso: dict, rng: random.Random) -> list[dict]:
    """El recurso correcto y dos señuelos, barajados."""
    if not caso["requiresJusticeInfo"]:
        return []
    correcto = _recurso(caso["expectedJusticeResource"])
    senuelos = rng.sample([r for r in RECURSOS_JUSTICIA if r["id"] != correcto["id"]], N_OPCIONES - 1)
    opciones = [correcto, *senuelos]
    rng.shuffle(opciones)
    return opciones


def crear_partida(edad: int, casos: list[dict]) -> Partida:
    rng = random.Random()
    estados = [EstadoCaso(opciones=opciones_recurso(c, rng)) for c in casos]
    partida = Partida(uuid.uuid4().hex, edad, casos, estados)
    PARTIDAS[partida.id] = partida
    while len(PARTIDAS) > PARTIDAS_MAX:
        PARTIDAS.popitem(last=False)
    return partida


def _leyes_libro(caso: dict, edad: int) -> list[dict]:
    """Leyes del tema + las del caso, sin repetir, con el texto adaptado a la edad."""
    vistas, leyes = set(), []
    for ley in [*LEYES_SIMPLIFICADAS.get(caso["topic"], []), *caso["boeLaws"]]:
        if ley["code"] not in vistas:
            vistas.add(ley["code"])
            leyes.append({**ley, "simplified": adaptar_texto(ley["simplified"], edad)})
    return leyes


def vista_publica(partida: Partida, i: int) -> dict:
    """Lo que ve el jugador: sin soluciones ni la información que falta."""
    caso, edad = partida.casos[i], partida.edad
    return {
        "indice": i, "total": len(partida.casos), "puntos": partida.puntos,
        "id": caso["id"], "topic": caso["topic"], "difficulty": caso["difficulty"],
        "caseSummary": caso["caseSummary"], "verdictQuestion": caso["verdictQuestion"],
        "people": caso["people"], "extraDocuments": caso["extraDocuments"],
        "laws": _leyes_libro(caso, edad),
        "requiresJusticeInfo": caso["requiresJusticeInfo"],
        "clientRequest": adaptar_texto(caso["clientRequest"], edad) if caso["clientRequest"] else None,
        "resourceOptions": partida.estados[i].opciones,
        "helpPills": pildoras_ayuda(edad),
    }


def siguiente(partida: Partida) -> dict:
    i = partida.actual
    return {"fin": i is None, "caso": None if i is None else vista_publica(partida, i), "puntos": partida.puntos}


def verificar(partida: Partida, sello: str, recurso: str | None) -> dict:
    i = partida.actual
    if i is None:
        raise ValueError("La partida ya ha terminado")
    caso, estado, edad = partida.casos[i], partida.estados[i], partida.edad
    falta_pendiente = caso["missingInfo"] is not None and not estado.revelado

    def respuesta(tipo, correcto, texto, **extra):
        if not correcto:
            estado.fallos += 1
        return {"tipo": tipo, "correcto": correcto, "mensaje": texto, "fallos": estado.fallos,
                "puntos": partida.puntos, **extra}

    # 1) Sello «Falta información».
    if sello == "falta_info":
        if not falta_pendiente:
            return respuesta("nada_falta", False, mensaje("nada_falta", edad))
        estado.revelado = True
        info = caso["missingInfo"]
        return respuesta("falta_ok", True, f'{mensaje("falta_ok", edad)} {adaptar_texto(info["reason"], edad)}',
                         revelado={"person": info["person"], "document": info["document"]})

    # 2) Veredicto con información incompleta.
    if falta_pendiente:
        return respuesta("falta_pendiente", False, mensaje("falta_pendiente", edad))

    # 3) Veredicto legal / ilegal (+ recurso si el caso lo pide).
    veredicto_ok = (sello == "legal") == caso["isLegal"]
    recurso_ok = not caso["requiresJusticeInfo"] or recurso == caso["expectedJusticeResource"]
    if not (veredicto_ok and recurso_ok):
        texto = adaptar_texto(caso["hint"], edad) if not veredicto_ok else mensaje("recurso_mal", edad)
        return respuesta("incorrecto", False, texto, veredictoOk=veredicto_ok, recursoOk=recurso_ok)

    estado.resuelto = True
    estado.estrellas = max(0, ESTRELLAS_MAX - estado.fallos)
    return respuesta(
        "correcto", True, caso["explanation"],
        veredictoOk=True, recursoOk=True, estrellas=estado.estrellas,
        leyes=caso["boeLaws"],
        recurso=_recurso(caso["expectedJusticeResource"]) if caso["requiresJusticeInfo"] else None,
        finPartida=partida.actual is None,
    )
