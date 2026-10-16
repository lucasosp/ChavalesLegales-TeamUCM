"""Semilla de disposiciones del BOE relevantes para el proyecto.

Normativa española que sostiene el contenido sobre derechos digitales y
protección de menores frente a riesgos tecnológicos. Son puntos de partida
verificados; el equipo puede ampliar la lista.
"""

# id BOE -> descripción breve de por qué es relevante.
NORMAS_MENORES_TECNOLOGIA: dict[str, str] = {
    "BOE-A-2018-16673": "LO 3/2018 (LOPDGDD): protección de datos y garantía de derechos digitales (incluye derechos digitales de los menores).",
    "BOE-A-1996-1069": "LO 1/1996 de protección jurídica del menor.",
    "BOE-A-2021-9347": "LO 8/2021 de protección integral a la infancia y la adolescencia frente a la violencia (incluye violencia digital).",
    "BOE-A-1995-25444": "LO 10/1995, Código Penal (ciberacoso, grooming, difusión de imágenes, etc.).",
}

IDS_RELEVANTES = list(NORMAS_MENORES_TECNOLOGIA)
