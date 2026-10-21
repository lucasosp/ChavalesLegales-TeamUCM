"""Adaptación de textos a la edad del jugador. Funciones puras, sin estado."""
import re

from .constantes import franja

# Cuántas frases se muestran como máximo en pistas y mensajes, por franja.
FRASES_MAX = {"7-9": 1, "10-12": 2, "13-16": 4}
PILDORAS_MAX = {"7-9": 2, "10-12": 3, "13-16": 3}

# Píldoras del montón de ayuda: muy cortas y sin revelar la solución.
PILDORAS = {
    "7-9": ["Lee despacio qué ha pasado.", "¿Alguien lo pasa mal?", "¿Falta algo? ¡Sello amarillo!"],
    "10-12": ["Fíjate en quién hace qué.", "Busca la ley en el libro.", "¿Falta una ficha o un papel? Sello amarillo."],
    "13-16": ["Revisa todas las fichas y anexos.", "Contrasta los hechos con la norma.", "Si falta un dato clave, sella «Falta información»."],
}

MENSAJES = {
    "falta_pendiente": {
        "7-9": "Falta algo para poder decidir.",
        "10-12": "Te falta información para decidir. ¿Qué ficha o papel no está?",
        "13-16": "No puedes dictar sentencia todavía: al expediente le falta una ficha o un documento clave.",
    },
    "nada_falta": {
        "7-9": "Aquí no falta nada. ¡Ya puedes decidir!",
        "10-12": "Este expediente está completo. ¡Ya puedes decidir!",
        "13-16": "El expediente está completo: tienes todo lo necesario para dictar sentencia.",
    },
    "falta_ok": {
        "7-9": "Aquí tienes lo que faltaba.",
        "10-12": "Faltaba información. Ya la tienes en la mesa.",
        "13-16": "Has pedido lo que faltaba. Revísalo antes de decidir.",
    },
    "recurso_mal": {
        "7-9": "¿Quién ayuda en este problema? Piensa otra vez.",
        "10-12": "Ese recurso no es el mejor. ¿Quién se encarga de esto?",
        "13-16": "Ese recurso no es el adecuado. Piensa qué organismo se ocupa de este tipo de casos.",
    },
    "racha": {
        "7-9": "🔥 ¡{n} seguidos! ¡Estrella extra!",
        "10-12": "🔥 ¡Racha de {n} aciertos! Ganas una estrella extra.",
        "13-16": "🔥 Racha de {n} aciertos a la primera: +1 estrella extra.",
    },
}


def frases(texto: str) -> list[str]:
    return [f for f in re.split(r"(?<=[.!?])\s+", texto.strip()) if f]


def adaptar_texto(texto: str, edad: int) -> str:
    """Recorta el texto a las frases que caben en la franja de edad."""
    return " ".join(frases(texto)[: FRASES_MAX[franja(edad)]])


def pildoras_ayuda(edad: int) -> list[str]:
    f = franja(edad)
    return PILDORAS[f][: PILDORAS_MAX[f]]


def mensaje(clave: str, edad: int) -> str:
    return MENSAJES[clave][franja(edad)]
