"""Datos estáticos del Veredicto Legal: temas, franjas de edad, leyes y recursos."""

BOE_CP = "Ley Orgánica 10/1995, del Código Penal (BOE-A-1995-25444)"
BOE_LOPIVI = "Ley Orgánica 8/2021, de protección integral a la infancia y la adolescencia frente a la violencia (BOE-A-2021-9347)"
BOE_LOPJM = "Ley Orgánica 1/1996, de Protección Jurídica del Menor (BOE-A-1996-1069)"
BOE_HONOR = "Ley Orgánica 1/1982, de protección civil del derecho al honor, a la intimidad y a la propia imagen (BOE-A-1982-11196)"
BOE_LOPDGDD = "Ley Orgánica 3/2018, de Protección de Datos y garantía de los derechos digitales (BOE-A-2018-16673)"
BOE_LORPM = "Ley Orgánica 5/2000, reguladora de la responsabilidad penal de los menores (BOE-A-2000-641)"
BOE_CC = "Real Decreto de 24 de julio de 1889, Código Civil (BOE-A-1889-4763)"
BOE_CE = "Constitución Española (BOE-A-1978-31229)"


# Temas con la edad mínima a la que se muestran (decisión: los más delicados, desde 10).
TEMAS = [
    {"id": "ciberacoso", "nombre": "Ciberacoso", "emoji": "📱", "minEdad": 7},
    {"id": "desplazamiento_familiar", "nombre": "Cambios de hogar y familia", "emoji": "🏠", "minEdad": 7},
    {"id": "autolesiones", "nombre": "Cuidarse y no hacerse daño", "emoji": "🩹", "minEdad": 7},
    {"id": "deepfake_sexual", "nombre": "Fotos falsas con IA", "emoji": "🤖", "minEdad": 10},
    {"id": "conductas_suicidas_menores", "nombre": "Pedir ayuda cuando todo pesa", "emoji": "💛", "minEdad": 10},
]

# Temas que muestran siempre el aviso de líneas de ayuda.
TEMAS_SENSIBLES = {"autolesiones", "conductas_suicidas_menores", "deepfake_sexual"}

FRANJAS = {
    "7-9": {
        "nombre": "Peques (7-9)",
        "lenguaje": "Frases muy cortas y palabras sencillas, como en un cuento. Sin tecnicismos: si nombras una ley, explícala con un ejemplo cotidiano. Trata los temas delicados con muchísimo tacto: nada de detalles de daño, solo la idea de que está mal y de pedir ayuda a un adulto.",
        "dificultad": "Casi todos fáciles; como mucho alguno medio.",
        "instrucciones": "¡Hoy eres juez o jueza! Lee lo que ha pasado, mira las leyes fáciles y pulsa si lo que hicieron está BIEN (legal) o MAL (ilegal). Si fallas, ¡puedes volver a intentarlo!",
    },
    "10-12": {
        "nombre": "Medianos (10-12)",
        "lenguaje": "Frases cortas y claras. Puedes usar palabras jurídicas básicas (denuncia, juez, delito) explicándolas. Sin detalles gráficos ni métodos de daño.",
        "dificultad": "Mezcla de fáciles y medios, y algún difícil.",
        "instrucciones": "Revisa cada expediente como un juez de verdad: lee el caso, pide más documentos si los hay y consulta las leyes simplificadas. A veces la familia te pedirá a quién acudir: ¡elige el recurso correcto!",
    },
    "13-16": {
        "nombre": "Mayores (13-16)",
        "lenguaje": "Lenguaje cercano y juvenil pero preciso. Puedes usar términos jurídicos (Fiscalía de Menores, prueba, difusión no consentida) explicándolos en una frase. Sin detalles gráficos ni métodos de daño.",
        "dificultad": "Sobre todo medios y difíciles.",
        "instrucciones": "Cada expediente puede esconder un giro: pide la documentación antes de decidir. Juzga la conducta de quien actúa, cita la norma que aplica y deriva a la familia al recurso oficial adecuado. Cada intento fallido resta estrellas.",
    },
}


def franja(edad: int) -> str:
    return "7-9" if edad <= 9 else "10-12" if edad <= 12 else "13-16"


# Leyes simplificadas por tema. El LLM debe elegir preferentemente de aquí
# (reduce artículos inventados) y el frontend las muestra en el desplegable.
LEYES_SIMPLIFICADAS = {
    "ciberacoso": [
        {"code": "Código Penal art. 172 ter", "officialRef": f"{BOE_CP}, art. 172 ter",
         "simplified": "Perseguir, vigilar o escribir a alguien sin parar hasta cambiarle la vida y darle miedo es delito (acoso)."},
        {"code": "Código Penal art. 173.1", "officialRef": f"{BOE_CP}, art. 173.1",
         "simplified": "Humillar gravemente a alguien y hacerle sentir que no vale nada es delito (trato degradante)."},
        {"code": "Ley 1/1982 art. 7", "officialRef": f"{BOE_HONOR}, art. 7",
         "simplified": "Usar tu imagen o decir cosas que dañan tu honor sin tu permiso va contra tus derechos."},
        {"code": "LO 8/2021 (LOPIVI) art. 15", "officialRef": f"{BOE_LOPIVI}, art. 15",
         "simplified": "Si ves que hacen daño a un niño o niña, contarlo a un adulto o a las autoridades es un deber, no chivarse."},
        {"code": "LO 5/2000 art. 3", "officialRef": f"{BOE_LORPM}, art. 3",
         "simplified": "Si quien hace daño tiene menos de 14 años no va a juicio, pero lo que hace sigue estando mal y los adultos deben protegerte."},
    ],
    "autolesiones": [
        {"code": "Código Penal art. 156 ter", "officialRef": f"{BOE_CP}, art. 156 ter",
         "simplified": "Difundir por internet vídeos o mensajes que animan a niños y niñas a hacerse daño es delito."},
        {"code": "Código Penal art. 361 bis", "officialRef": f"{BOE_CP}, art. 361 bis",
         "simplified": "Difundir contenidos que animan a menores a dejar de comer o a ponerse en peligro con la comida es delito."},
        {"code": "LO 8/2021 (LOPIVI) art. 15", "officialRef": f"{BOE_LOPIVI}, art. 15",
         "simplified": "Si ves que alguien se hace daño o lo están animando a hacerlo, contarlo a un adulto es lo correcto."},
    ],
    "conductas_suicidas_menores": [
        {"code": "Código Penal art. 143 bis", "officialRef": f"{BOE_CP}, art. 143 bis",
         "simplified": "Difundir por internet contenidos que animan a menores a quitarse la vida es delito."},
        {"code": "Código Penal art. 143.1", "officialRef": f"{BOE_CP}, art. 143.1",
         "simplified": "Empujar o convencer a otra persona para que se quite la vida es un delito muy grave."},
        {"code": "Código Penal art. 195", "officialRef": f"{BOE_CP}, art. 195",
         "simplified": "Si alguien está en peligro grave y puedes ayudar o avisar sin ponerte en riesgo, la ley te pide que lo hagas."},
        {"code": "LO 8/2021 (LOPIVI) art. 15", "officialRef": f"{BOE_LOPIVI}, art. 15",
         "simplified": "Contar a un adulto que un amigo está en peligro no es traicionarle: es protegerle."},
    ],
    "deepfake_sexual": [
        {"code": "Código Penal art. 189.1", "officialRef": f"{BOE_CP}, art. 189.1",
         "simplified": "Crear o difundir imágenes sexuales de menores es delito, también si son falsas pero parecen reales (hechas con IA)."},
        {"code": "Código Penal art. 197.7", "officialRef": f"{BOE_CP}, art. 197.7",
         "simplified": "Pasar a otros fotos o vídeos íntimos de alguien sin su permiso es delito."},
        {"code": "Código Penal art. 173.1", "officialRef": f"{BOE_CP}, art. 173.1",
         "simplified": "Humillar gravemente a alguien, por ejemplo con montajes, es delito (trato degradante)."},
        {"code": "LO 3/2018 (LOPDGDD) art. 7", "officialRef": f"{BOE_LOPDGDD}, art. 7",
         "simplified": "Tu cara y tu imagen son datos personales: antes de los 14 años, para usarlos hace falta permiso de tu familia."},
        {"code": "Ley 1/1982 art. 7", "officialRef": f"{BOE_HONOR}, art. 7",
         "simplified": "Nadie puede usar tu imagen para burlarse de ti o dañarte sin tu permiso."},
    ],
    "desplazamiento_familiar": [
        {"code": "Código Penal art. 225 bis", "officialRef": f"{BOE_CP}, art. 225 bis",
         "simplified": "Si un padre o una madre se lleva a su hijo o hija a vivir a otro sitio sin permiso del otro ni del juez, es delito (sustracción de menores)."},
        {"code": "Código Civil art. 156", "officialRef": f"{BOE_CC}, art. 156",
         "simplified": "Las decisiones importantes, como mudarse lejos, las toman los dos progenitores juntos. Si no se ponen de acuerdo, decide un juez."},
        {"code": "Código Civil art. 154", "officialRef": f"{BOE_CC}, art. 154",
         "simplified": "Tus padres deben cuidarte y, si tienes madurez suficiente, escucharte antes de decidir cosas que te afectan."},
        {"code": "LO 1/1996 art. 9", "officialRef": f"{BOE_LOPJM}, art. 9",
         "simplified": "Tienes derecho a ser escuchado y a que tu opinión cuente en lo que te afecta, también ante un juez."},
        {"code": "Constitución art. 27", "officialRef": f"{BOE_CE}, art. 27",
         "simplified": "Todos los niños y niñas tienen derecho a ir al colegio, también si se cambian de ciudad o de país."},
    ],
}

def ley(code: str) -> dict:
    """Busca una ley simplificada por su código en cualquier tema."""
    return next(l for leyes in LEYES_SIMPLIFICADAS.values() for l in leyes if l["code"] == code)


# Recursos de la Administración y de ayuda para el desplegable del cliente.
RECURSOS_JUSTICIA = [
    {"id": "024", "nombre": "Línea 024", "contacto": "024", "cuando": "Atención a la conducta suicida. Gratis, 24 h y confidencial."},
    {"id": "anar", "nombre": "Fundación ANAR", "contacto": "900 20 20 10 · 116 111", "cuando": "Niños, niñas y adolescentes que necesitan hablar con alguien. Gratis y confidencial."},
    {"id": "017", "nombre": "INCIBE - Tu Ayuda en Ciberseguridad", "contacto": "017", "cuando": "Problemas en internet: cuentas falsas, acoso online, privacidad."},
    {"id": "aepd", "nombre": "AEPD - Canal Prioritario", "contacto": "aepd.es", "cuando": "Pedir que se retiren rápido fotos o vídeos íntimos o violentos publicados sin permiso."},
    {"id": "fiscalia_menores", "nombre": "Fiscalía de Menores", "contacto": "Fiscalía provincial", "cuando": "Investiga los delitos cometidos por chicos y chicas de 14 a 17 años y protege a los menores."},
    {"id": "policia", "nombre": "Policía Nacional / Guardia Civil", "contacto": "091 · 062", "cuando": "Poner una denuncia por un delito."},
    {"id": "112", "nombre": "Emergencias", "contacto": "112", "cuando": "Peligro inmediato para la vida o la salud de alguien."},
    {"id": "servicios_sociales", "nombre": "Servicios Sociales", "contacto": "Ayuntamiento", "cuando": "Situaciones de desprotección o riesgo de un menor en su familia."},
    {"id": "juzgado_guardia", "nombre": "Juzgado de Guardia", "contacto": "Juzgado de la localidad", "cuando": "Pedir a un juez que actúe con urgencia, a cualquier hora."},
    {"id": "016", "nombre": "Línea 016", "contacto": "016", "cuando": "Violencia de género y violencia contra las mujeres. No deja rastro en la factura."},
    {"id": "centro_educativo", "nombre": "Dirección del centro educativo", "contacto": "Tutor/a y dirección", "cuando": "Activar el protocolo de acoso escolar del colegio o instituto."},
]

LINEAS_AYUDA = "Si te pasa algo parecido, no estás solo/a: llama al 024 o a ANAR (900 20 20 10). Es gratis y confidencial. Si hay peligro ahora mismo, llama al 112."


def config_publica(ia_disponible: bool) -> dict:
    return {
        "temas": TEMAS,
        "temasSensibles": sorted(TEMAS_SENSIBLES),
        "franjas": {k: {"nombre": v["nombre"], "instrucciones": v["instrucciones"]} for k, v in FRANJAS.items()},
        "lineasAyuda": LINEAS_AYUDA,
        "iaDisponible": ia_disponible,
    }
