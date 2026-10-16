"""Banco semilla de preguntas sobre derechos digitales de los menores (España).

Curado a mano a partir de la legislación española. Sirve para que el generador
funcione de principio a fin desde el primer día; más adelante se ampliará con
preguntas derivadas de la extracción (`extraccion/`).

IMPORTANTE: este contenido es educativo y divulgativo, NO asesoramiento legal.
Revisar siempre con una persona del equipo con criterio jurídico antes de usar
en aula. Cada pregunta cita su fuente legal para trazabilidad.

Formato de cada entrada:
    {
        "tema": str,
        "dificultad": "facil" | "media" | "dificil",
        "enunciado": str,
        "fuente_legal": str,
        "opciones": [{"texto": str, "correcta": bool, "retroalimentacion": str}, ...],
    }
"""

from __future__ import annotations

from typing import Any

BANCO: list[dict[str, Any]] = [
    {
        "tema": "ciberacoso",
        "dificultad": "facil",
        "enunciado": "Un compañero te insulta y amenaza por un grupo de clase. ¿Qué es lo más adecuado?",
        "fuente_legal": "Código Penal, art. 173 (trato degradante); Ley 1/1996 de protección del menor",
        "opciones": [
            {
                "texto": "Guardar capturas y contárselo a una persona adulta de confianza",
                "correcta": True,
                "retroalimentacion": "Correcto: conservar pruebas y pedir ayuda es el primer paso. El acoso también existe online.",
            },
            {
                "texto": "Responder con más insultos",
                "correcta": False,
                "retroalimentacion": "Responder así puede empeorar la situación y meterte a ti en problemas.",
            },
            {
                "texto": "No hacer nada y aguantarte",
                "correcta": False,
                "retroalimentacion": "Nadie tiene por qué aguantar el acoso: tienes derecho a pedir ayuda y a que te protejan.",
            },
        ],
    },
    {
        "tema": "privacidad",
        "dificultad": "media",
        "enunciado": "¿A partir de qué edad puede un menor consentir por sí mismo el tratamiento de sus datos personales en servicios de internet en España?",
        "fuente_legal": "LOPDGDD (LO 3/2018), art. 7",
        "opciones": [
            {
                "texto": "14 años",
                "correcta": True,
                "retroalimentacion": "Correcto: en España, a partir de los 14 años. Por debajo hace falta el consentimiento de madre/padre o tutores.",
            },
            {
                "texto": "18 años",
                "correcta": False,
                "retroalimentacion": "No: la mayoría de edad civil es 18, pero para datos el umbral en España son los 14 años.",
            },
            {
                "texto": "No hay ninguna edad mínima",
                "correcta": False,
                "retroalimentacion": "Sí la hay: la LOPDGDD fija los 14 años en España.",
            },
        ],
    },
    {
        "tema": "sexting",
        "dificultad": "dificil",
        "enunciado": "Alguien difunde sin permiso una foto íntima que otra persona le envió en confianza. ¿Qué ocurre según la ley?",
        "fuente_legal": "Código Penal, art. 197.7 (difusión no consentida de imágenes íntimas)",
        "opciones": [
            {
                "texto": "Puede ser delito aunque la foto se enviara voluntariamente al principio",
                "correcta": True,
                "retroalimentacion": "Correcto: enviar una imagen en confianza no autoriza a difundirla. Difundirla sin permiso puede ser delito.",
            },
            {
                "texto": "No pasa nada porque la foto se envió voluntariamente",
                "correcta": False,
                "retroalimentacion": "Falso: el consentimiento para enviar algo en privado no es consentimiento para difundirlo.",
            },
            {
                "texto": "Solo es un problema si la víctima es mayor de edad",
                "correcta": False,
                "retroalimentacion": "No: la protección aplica con independencia de la edad, y con menores es aún más grave.",
            },
        ],
    },
    {
        "tema": "grooming",
        "dificultad": "media",
        "enunciado": "Un adulto contacta online con un menor haciéndose pasar por otro chico para ganarse su confianza con fines sexuales. ¿Cómo se trata esto?",
        "fuente_legal": "Código Penal, art. 183 ter (ciberacoso sexual a menores / grooming)",
        "opciones": [
            {
                "texto": "Es un delito específico de acoso sexual a menores por medios digitales",
                "correcta": True,
                "retroalimentacion": "Correcto: el 'child grooming' está expresamente tipificado como delito.",
            },
            {
                "texto": "No es delito mientras no haya contacto físico",
                "correcta": False,
                "retroalimentacion": "Falso: el contacto con esa finalidad ya puede ser delito aunque no haya encuentro físico.",
            },
        ],
    },
]
