"""Casos de ejemplo curados. Se usan cuando no hay clave de IA o la IA falla.

Cada caso lleva `minEdad`: la edad mínima del jugador para que aparezca.
Todos los nombres, expedientes y datos son ficticios.
"""
from .constantes import ley


def _perfil(rol, exp, nombre, edad, region, seed, **datos):
    return {
        "role": rol, "expediente": exp, "fullName": nombre, "age": edad, "region": region, "avatarSeed": seed,
        "visualMetadata": [{"label": k.replace("_", " ").capitalize(), "value": v} for k, v in datos.items()],
    }


def _sin_recurso():
    return {"requiresJusticeInfo": False, "clientRequest": None, "expectedJusticeResource": None}


def _recurso(peticion, recurso):
    return {"requiresJusticeInfo": True, "clientRequest": peticion, "expectedJusticeResource": recurso}


CASOS_MOCK = [
    # --- Ciberacoso ---------------------------------------------------------
    {
        "minEdad": 7, "id": "mock-ciber-1", "topic": "ciberacoso", "difficulty": "facil",
        "caseSummary": "En el grupo de clase, Dani y dos amigos escriben todos los días mensajes riéndose de Lucas. Lo echan del grupo una y otra vez y se burlan de su ropa.",
        "verdictQuestion": "¿Es legal lo que hacen Dani y sus amigos?",
        "isLegal": False,
        "boeLaws": [ley("Código Penal art. 173.1"), ley("LO 5/2000 art. 3")],
        "people": [], "missingInfo": None, "extraDocuments": [], **_sin_recurso(),
        "hint": "Piensa en cómo se siente Lucas. ¿Hay alguna ley que hable de humillar a alguien?",
        "explanation": "¡Eso es ciberacoso! Burlarse de alguien una y otra vez le hace mucho daño. Aunque tengan menos de 14 años y no vayan a un juicio, está prohibido y los adultos del cole deben actuar. Si te pasa, cuéntaselo a un adulto de confianza.",
    },
    {
        "minEdad": 10, "id": "mock-ciber-2", "topic": "ciberacoso", "difficulty": "medio",
        "caseSummary": "Alguien ha creado en una red social la cuenta «@sara_la_rara». Publica fotos de Sara retocadas para que parezca fea y escribe comentarios inventados sobre ella.",
        "verdictQuestion": "¿Es legal lo que hace quien gestiona la cuenta falsa?",
        "isLegal": False,
        "boeLaws": [ley("Ley 1/1982 art. 7"), ley("Código Penal art. 173.1")],
        "people": [_perfil("afectado", "EXP-2026-0101", "Sara Molina Ruiz", 12, "Castilla-La Mancha", "sara-molina", curso="6º de Primaria", dispositivo="Tablet familiar", estado="Ha dejado de ir a extraescolares")],
        "missingInfo": None, "extraDocuments": [
            {"docTitle": "Capturas aportadas por la familia", "content": "La cuenta tiene 43 seguidores, casi todos del colegio de Sara. Hay 12 publicaciones con su cara retocada y comentarios como «nadie te soporta»."},
        ],
        **_sin_recurso(),
        "hint": "Mira las leyes sobre la propia imagen y el honor. ¿Sara dio permiso para usar sus fotos así?",
        "explanation": "¡Ilegal! Usar la imagen de Sara sin permiso para burlarse de ella daña su honor y su propia imagen (Ley 1/1982) y, si la humillación es grave, puede ser delito de trato degradante. Guardar capturas como prueba fue muy buena idea.",
    },
    {
        "minEdad": 13, "id": "mock-ciber-3", "topic": "ciberacoso", "difficulty": "dificil",
        "caseSummary": "Marta (14) ha hecho capturas de los mensajes de acoso que recibe su amiga Inés y las ha enviado a la tutora. El chico que acosaba a Inés dice que Marta «ha violado su privacidad» y que eso es ilegal.",
        "verdictQuestion": "¿Es legal lo que hizo Marta?",
        "isLegal": True,
        "boeLaws": [ley("LO 8/2021 (LOPIVI) art. 15"), ley("Código Penal art. 172 ter")],
        "people": [_perfil("afectado", "EXP-2026-0102", "Inés Ortega Vidal", 14, "Comunidad de Madrid", "ines-ortega", curso="3º ESO", dispositivo="Móvil propio", situacion="Protocolo de acoso activado")],
        "missingInfo": {
            "reason": "Para saber quién lleva el caso hay que conocer la edad del chico que acosa: entre 14 y 17 años responde ante la Fiscalía de Menores.",
            "person": _perfil("implicado", "EXP-2026-0103", "Álex Ferrer Gil", 16, "Comunidad de Madrid", "alex-ferrer", curso="1º Bachillerato", relacion="Compañero del instituto"),
            "document": None,
        }, "extraDocuments": [
            {"docTitle": "Informe de la tutora", "content": "Marta entregó las capturas solo a la tutora, en privado. No las publicó ni las pasó a nadie más. El centro ha activado el protocolo de acoso."},
            {"docTitle": "Registro de mensajes", "content": "Durante 3 meses el chico escribió a Inés más de 40 veces al día, la esperaba a la salida y amenazaba con difundir rumores si le bloqueaba."},
        ],
        **_recurso("La familia de Inés quiere denunciar. ¿Quién investigará y llevará el expediente del chico?", "fiscalia_menores"),
        "hint": "Revisa los documentos: ¿a quién envió Marta las capturas? Y mira la ficha del chico para elegir el recurso.",
        "explanation": "¡Legal! Marta no difundió nada: comunicó la violencia a un adulto, que es justo lo que pide la LOPIVI (art. 15). Lo ilegal es lo que hacía el chico: acoso (art. 172 ter CP). Como tiene entre 14 y 17 años, su caso lo lleva la Fiscalía de Menores.",
    },
    # --- Autolesiones -------------------------------------------------------
    {
        "minEdad": 7, "id": "mock-auto-1", "topic": "autolesiones", "difficulty": "facil",
        "caseSummary": "Un canal de vídeos publica «retos» que animan a niños y niñas a hacerse daño y grabarlo para conseguir más «me gusta».",
        "verdictQuestion": "¿Es legal publicar vídeos que animan a niños a hacerse daño?",
        "isLegal": False,
        "boeLaws": [ley("Código Penal art. 156 ter")],
        "people": [], "missingInfo": None, "extraDocuments": [], **_sin_recurso(),
        "hint": "¿Hay alguna ley que hable de animar a menores a hacerse daño por internet?",
        "explanation": "¡Ilegal! Difundir contenidos que animan a menores a hacerse daño es delito. Ningún «me gusta» vale más que tú. Si ves un reto así, no lo hagas y enséñaselo a un adulto.",
    },
    {
        "minEdad": 10, "id": "mock-auto-2", "topic": "autolesiones", "difficulty": "medio",
        "caseSummary": "Una cuenta anónima envía a Nerea consejos para dejar de comer y la reta a mandar fotos para «comprobar sus progresos».",
        "verdictQuestion": "¿Es legal lo que hace la cuenta anónima?",
        "isLegal": False,
        "boeLaws": [ley("Código Penal art. 361 bis"), ley("LO 8/2021 (LOPIVI) art. 15")],
        "people": [_perfil("afectado", "EXP-2026-0201", "Nerea Castillo Paz", 13, "Andalucía", "nerea-castillo", curso="1º ESO", dispositivo="Móvil propio", apoyo="Su amiga Lola lo ha detectado")],
        "missingInfo": None, "extraDocuments": [
            {"docTitle": "Mensajes enseñados por Lola", "content": "La cuenta escribe: «si de verdad quieres ser perfecta, sáltate la cena» y «manda foto cada mañana». Tiene 2.000 seguidores, muchos de 12 a 15 años."},
        ],
        **_recurso("Lola pregunta: ¿a dónde puede llamar Nerea para hablar con alguien ahora, gratis y sin que se entere nadie?", "anar"),
        "hint": "Busca la ley sobre contenidos que ponen en peligro a menores con la comida. Para hablar: ¿qué línea es para niños y adolescentes?",
        "explanation": "¡Ilegal! Animar a menores a dejar de comer es delito (art. 361 bis CP). Lola hizo muy bien en contarlo. ANAR atiende gratis y en confidencia a niños, niñas y adolescentes que necesitan hablar.",
    },
    # --- Conductas suicidas -------------------------------------------------
    {
        "minEdad": 10, "id": "mock-suic-1", "topic": "conductas_suicidas_menores", "difficulty": "medio",
        "caseSummary": "El administrador de un grupo público en una red social comparte mensajes que presentan el hacerse daño para siempre como «una salida». En el grupo hay muchos chavales de 12 a 15 años.",
        "verdictQuestion": "¿Es legal lo que hace el administrador del grupo?",
        "isLegal": False,
        "boeLaws": [ley("Código Penal art. 143 bis")],
        "people": [_perfil("afectado", "EXP-2026-0301", "Alba Serrano Gil", 13, "Comunidad Valenciana", "alba-serrano", curso="2º ESO", aviso="Su amigo Teo está preocupado", grupo="900 miembros")],
        "missingInfo": None, "extraDocuments": [
            {"docTitle": "Informe de moderación", "content": "La red social confirma que el grupo es público y que el administrador anima a menores a unirse. Ya se ha pedido su cierre."},
        ],
        **_sin_recurso(),
        "hint": "¿Hay una ley sobre difundir por internet contenidos peligrosos para menores?",
        "explanation": "¡Ilegal! Difundir contenidos que animan a menores a quitarse la vida es delito (art. 143 bis CP). Teo hizo bien en preocuparse por Alba: hablar con un adulto o llamar al 024 puede ayudar muchísimo.",
    },
    {
        "minEdad": 13, "id": "mock-suic-2", "topic": "conductas_suicidas_menores", "difficulty": "dificil",
        "caseSummary": "Hugo (15) ve que su mejor amigo publica mensajes de despedida. Hace capturas y se las enseña a sus padres, que avisan a emergencias. Después, el amigo le dice que ha «traicionado su confianza» y que difundir sus mensajes es ilegal.",
        "verdictQuestion": "¿Es legal lo que hizo Hugo?",
        "isLegal": True,
        "boeLaws": [ley("Código Penal art. 195"), ley("LO 8/2021 (LOPIVI) art. 15")],
        "people": [_perfil("afectado", "EXP-2026-0302", "Rubén Lozano Mar", 15, "Aragón", "ruben-lozano", curso="4º ESO", situacion="Recibiendo atención sanitaria", aviso="Hugo, su mejor amigo")],
        "missingInfo": None, "extraDocuments": [
            {"docTitle": "Registro de la llamada al 112", "content": "El equipo sanitario llegó en 15 minutos. Rubén está bien y recibiendo ayuda profesional."},
            {"docTitle": "Declaración de Hugo", "content": "Hugo solo enseñó las capturas a sus padres y a emergencias. No las publicó ni las pasó a nadie más."},
        ],
        **_recurso("La familia de Rubén quiere apoyo continuado y orientación. ¿Qué línea especializada en conducta suicida pueden usar?", "024"),
        "hint": "Lee los documentos: ¿a quién enseñó Hugo las capturas? Hay una ley que pide ayudar a quien está en peligro.",
        "explanation": "¡Legal y valiente! Hugo no difundió nada: avisó para salvar a su amigo, como pide la ley (art. 195 CP y art. 15 LOPIVI). La línea 024 atiende la conducta suicida 24 h, gratis y en confidencia; si el peligro es inmediato, el 112.",
    },
    # --- Deepfake sexual ----------------------------------------------------
    {
        "minEdad": 10, "id": "mock-deep-1", "topic": "deepfake_sexual", "difficulty": "medio",
        "caseSummary": "Unos chicos de 2º de ESO han usado una app de inteligencia artificial para crear una foto falsa en la que parece que Carla sale sin ropa, y la han pasado por un grupo.",
        "verdictQuestion": "¿Es legal lo que hicieron los chicos?",
        "isLegal": False,
        "boeLaws": [ley("Código Penal art. 189.1"), ley("Código Penal art. 197.7")],
        "people": [_perfil("afectado", "EXP-2026-0401", "Carla Méndez Ríos", 13, "Extremadura", "carla-mendez", curso="2º ESO", dispositivo="Foto sacada de su perfil", difusion="3 grupos de mensajería")],
        "missingInfo": None, "extraDocuments": [
            {"docTitle": "Informe del instituto", "content": "La foto original de Carla era normal, de una excursión. La app la transformó. La imagen ha llegado a 3 grupos con más de 100 personas."},
        ],
        **_recurso("La familia de Carla quiere que la foto desaparezca de internet cuanto antes. ¿Qué canal oficial pueden usar?", "aepd"),
        "hint": "¿Importa que la foto sea falsa? Mira qué dice la ley sobre imágenes que «parecen reales».",
        "explanation": "¡Ilegal! Aunque la foto sea falsa, crear o difundir imágenes sexuales de menores que parecen reales es delito (art. 189.1 CP). El Canal Prioritario de la AEPD sirve para pedir que se retiren rápido. ¡Nunca reenvíes una imagen así!",
    },
    {
        "minEdad": 13, "id": "mock-deep-2", "topic": "deepfake_sexual", "difficulty": "dificil",
        "caseSummary": "A Jaime (16) le llega por un grupo un vídeo falso íntimo de una compañera. Un amigo dice que Jaime «también lo tiene» y que por eso es igual de culpable que quien lo creó.",
        "verdictQuestion": "¿Es legal lo que hizo Jaime?",
        "isLegal": True,
        "boeLaws": [ley("Código Penal art. 189.1"), ley("LO 8/2021 (LOPIVI) art. 15")],
        "people": [_perfil("afectado", "EXP-2026-0402", "Lucía Prieto Sanz", 15, "Galicia", "lucia-prieto", curso="4º ESO", contenido="Vídeo falso creado con IA", aviso="Jaime, compañero"),
                   _perfil("implicado", "EXP-2026-0403", "Jaime Ruiz Costa", 16, "Galicia", "jaime-ruiz", curso="1º Bachillerato", movil="Vídeo borrado")],
        "missingInfo": None, "extraDocuments": [
            {"docTitle": "Declaración de Jaime", "content": "Jaime borró el vídeo nada más verlo, sin reenviarlo. Hizo una captura solo del nombre del grupo y de quién lo compartió."},
            {"docTitle": "Comunicación al centro", "content": "Esa misma tarde Jaime informó a la dirección del instituto, que avisó a la familia de Lucía."},
        ],
        **_recurso("El vídeo se sigue difundiendo. ¿A quién llama la familia de Lucía para denunciarlo y que investiguen?", "policia"),
        "hint": "Pide los documentos: ¿qué hizo Jaime con el vídeo y a quién avisó?",
        "explanation": "¡Legal! Recibir algo sin pedirlo no te hace culpable: Jaime lo borró, no lo reenvió y avisó a un adulto (art. 15 LOPIVI). Lo ilegal es crear y difundir ese vídeo (art. 189.1 CP). Para denunciar, Policía Nacional (091) o Guardia Civil (062).",
    },
    # --- Desplazamiento familiar -------------------------------------------
    {
        "minEdad": 7, "id": "mock-despl-1", "topic": "desplazamiento_familiar", "difficulty": "facil",
        "caseSummary": "La familia de Nora se muda a otra ciudad porque a su madre le han dado un trabajo nuevo. Su padre y su madre están de acuerdo, le han explicado el cambio y le han preguntado cómo se siente.",
        "verdictQuestion": "¿Es legal esta mudanza?",
        "isLegal": True,
        "boeLaws": [ley("Código Civil art. 156"), ley("LO 1/1996 art. 9")],
        "people": [], "missingInfo": None, "extraDocuments": [], **_sin_recurso(),
        "hint": "¿Están de acuerdo los dos? ¿Han escuchado a Nora?",
        "explanation": "¡Legal! Mudarse es una decisión importante, y la toman los dos juntos. Además han escuchado a Nora, que es su derecho. Cambiar de casa da un poco de miedo, ¡pero hablarlo ayuda mucho!",
    },
    {
        "minEdad": 7, "id": "mock-despl-2", "topic": "desplazamiento_familiar", "difficulty": "medio",
        "caseSummary": "Los padres de Iván están separados y comparten su cuidado. Un día, el padre se lleva a Iván a vivir a otro país. La madre dice que nadie le preguntó.",
        "verdictQuestion": "¿Es legal lo que hizo el padre de Iván?",
        "isLegal": False,
        "boeLaws": [ley("Código Penal art. 225 bis"), ley("Código Civil art. 156")],
        "people": [_perfil("afectado", "EXP-2026-0501", "Iván Rojas Blanco", 11, "Castilla y León", "ivan-rojas", curso="5º de Primaria", custodia="Compartida", colegio="Ha dejado de ir"),
                   _perfil("implicado", "EXP-2026-0502", "Mario Rojas León", 42, "Castilla y León", "mario-rojas", relacion="Padre de Iván", destino="Otro país")],
        "missingInfo": {
            "reason": "Sin la sentencia de separación no sabíamos qué habían decidido los jueces sobre dónde vive Iván.",
            "person": None,
            "document": {"docTitle": "Sentencia de separación", "content": "El juzgado decidió que Iván vive una semana con cada progenitor y que ninguno puede llevarlo a vivir fuera de España sin el acuerdo del otro o de un juez. El padre no pidió ese permiso."},
        },
        "extraDocuments": [
            {"docTitle": "Aviso del colegio", "content": "Iván no ha vuelto a clase desde hace dos semanas. Su madre no sabía que se había ido del país."},
        ],
        **_recurso("La madre de Iván necesita que un juez actúe ya, aunque sea de noche. ¿A dónde debe ir?", "juzgado_guardia"),
        "hint": "¿Pidió permiso el padre? Busca la ley sobre llevarse a un hijo sin permiso.",
        "explanation": "¡Ilegal! Llevarse a un hijo a vivir a otro sitio sin permiso del otro progenitor ni del juez es sustracción de menores (art. 225 bis CP). El Juzgado de Guardia atiende urgencias a cualquier hora.",
    },
]
