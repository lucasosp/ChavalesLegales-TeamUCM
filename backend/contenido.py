"""Contenido de los tres modos de juego (historia, preguntas, cooperativo)."""

# Modo historia: escenas con decisiones. Cada opción lleva a otra escena.
HISTORIA = {
    "inicio": "mensaje",
    "escenas": {
        "mensaje": {
            "texto": "Te llega un WhatsApp: «¡Has ganado un móvil! Pulsa aquí y pon tu contraseña». ¿Qué haces?",
            "opciones": [
                {"texto": "Pulso el enlace, ¡quiero el móvil!", "va_a": "trampa"},
                {"texto": "No pulso y se lo cuento a un adulto", "va_a": "foto"},
            ],
        },
        "trampa": {
            "texto": "¡Era phishing! Te han robado la cuenta. Engañar así es un delito de estafa (art. 249 del Código Penal).",
            "final": True, "bien": False,
        },
        "foto": {
            "texto": "¡Bien hecho! Más tarde, alguien de clase comparte una foto falsa de un compañero hecha con IA. ¿Qué haces?",
            "opciones": [
                {"texto": "La reenvío al grupo, es graciosa", "va_a": "reenvio"},
                {"texto": "No la reenvío y aviso a un profe", "va_a": "heroe"},
            ],
        },
        "reenvio": {
            "texto": "Reenviar fotos falsas que humillan a alguien también es delito (art. 197.7 CP). ¡Y le hace mucho daño!",
            "final": True, "bien": False,
        },
        "heroe": {
            "texto": "¡Eres un Chaval Legal! Has protegido tu cuenta y a tu compañero. Si necesitas ayuda, llama al 017.",
            "final": True, "bien": True,
        },
    },
}

# Modo preguntas: quiz con explicación.
PREGUNTAS = [
    {
        "pregunta": "Un mensaje te pide tu contraseña para darte un premio. ¿Es seguro?",
        "opciones": ["Sí, si el premio es bueno", "No, nunca se da la contraseña", "Solo si es de un amigo"],
        "correcta": 1,
        "explica": "Nadie de confianza te pedirá tu contraseña. Eso es phishing.",
    },
    {
        "pregunta": "Alguien te escribe todo el rato, sabe dónde estás y te da miedo. ¿Qué es?",
        "opciones": ["Acoso o acecho", "Una broma", "Algo normal en redes"],
        "correcta": 0,
        "explica": "Vigilar y perseguir a alguien es delito (art. 172 ter CP). Cuéntaselo a un adulto.",
    },
    {
        "pregunta": "¿Qué es un deepfake?",
        "opciones": ["Un videojuego", "Una foto o vídeo falso hecho con IA", "Un tipo de virus"],
        "correcta": 1,
        "explica": "Parecen reales, pero son falsos. Compartirlos para humillar a alguien es delito.",
    },
    {
        "pregunta": "¿A qué número puedes llamar si tienes un problema en internet?",
        "opciones": ["112 solo", "017", "No hay ninguno"],
        "correcta": 1,
        "explica": "El 017 es la línea de ayuda en ciberseguridad. ¡Es gratis!",
    },
]

# Modo cooperativo: dos jugadores se turnan; el equipo suma puntos juntos.
COOPERATIVO = [
    {
        "caso": "Un compañero recibe insultos en un grupo de clase.",
        "opciones": ["Nos reímos", "Le apoyamos y avisamos a un profe", "Salimos del grupo sin decir nada"],
        "correcta": 1,
    },
    {
        "caso": "Una amiga recibe un enlace raro de su «banco».",
        "opciones": ["Le decimos que no lo abra", "Que pruebe a ver qué pasa", "Que ponga sus datos rápido"],
        "correcta": 0,
    },
    {
        "caso": "Vemos un vídeo falso de un profe circulando.",
        "opciones": ["Lo compartimos", "Lo denunciamos y no lo reenviamos", "Hacemos otro"],
        "correcta": 1,
    },
    {
        "caso": "Alguien desconocido quiere quedar con un amigo que conoció online.",
        "opciones": ["Que vaya solo", "Que se lo cuente a sus padres", "Que no diga nada"],
        "correcta": 1,
    },
]
