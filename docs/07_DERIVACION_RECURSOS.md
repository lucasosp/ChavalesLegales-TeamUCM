# Derivación a recursos de ayuda

La ruta `/necesito-ayuda` usa `AyudaDerivacion` como componente reutilizable. El catálogo está en `frontend/lib/derivacion/recursos.mjs` y las reglas puras en `frontend/lib/derivacion/reglas.mjs`. No hay endpoint: las respuestas se mantienen solo en estado de React durante la visita y no se envían ni almacenan. Los enlaces externos requieren una URL HTTPS de la lista cerrada de dominios y solo se abren tras pulsarlos, en una pestaña nueva sin `referrer`.

## Reglas

| Condición declarada | Principal | Complementarios |
| --- | --- | --- |
| Peligro inmediato, aunque falten otras respuestas | 112 | ANAR |
| Imágenes difundidas o falsas; publicadas en web/red social, de contenido sexual o agresión, con riesgo grave y persona afectada española o en España | AEPD Canal Prioritario | ANAR, INCIBE y canales policiales |
| Acoso, amenazas, petición de fotos o datos, imágenes difundidas o falsas que no cumplen las condiciones anteriores, o situación incierta | ANAR | INCIBE y, cuando hay hechos concretos, canales policiales |
| Cuenta robada o intento de estafa | INCIBE 017 | ANAR y canales policiales |
| Ya existe un asunto judicial | Se conserva el principal del problema | Se añaden Sede Judicial Electrónica y Carpeta Justicia para consulta, no para denunciar |

Si se seleccionan varios problemas, prevalece la emergencia; después, la posible retirada de contenido sensible; después, el apoyo especializado a menores; y finalmente la orientación técnica. La AEPD decide si una solicitud cumple realmente los requisitos. Una respuesta «No lo sé» nunca activa esa derivación específica. La opción de situación incierta es exclusiva.

La interfaz pregunta primero por peligro inmediato y mantiene el acceso al 112 en todos los pasos. La pregunta sobre imágenes solo aparece cuando se selecciona difusión o imagen falsa. El catálogo distingue orientación, apoyo, retirada, atención policial y servicios judiciales. No presenta denuncias dentro de la aplicación. La orientación no constituye asesoramiento jurídico individual.

## Fuentes oficiales comprobadas el 21 de octubre de 2026

| Recurso | Fuente y límite relevante |
| --- | --- |
| INCIBE 017 | [Línea de ayuda](https://www.incibe.es/linea-de-ayuda-en-ciberseguridad): gratuita y confidencial para menores y otros usuarios; horario indicado de 8:00 a 23:00. |
| Fundación ANAR | [Línea para niños y adolescentes](https://www.anar.org/que-hacemos/telefono-chat-anar/): 900 20 20 10; apoyo gratuito y confidencial. |
| AEPD Canal Prioritario | [Página del canal](https://www.aepd.es/canalprioritario), [casos incluidos](https://www.aepd.es/preguntas-frecuentes/15-canal-prioritario-para-contenidos-sensibles-en-internet/FAQ-1502-en-que-casos-puedo-acudir-a-este-canal) y [casos excluidos](https://www.aepd.es/preguntas-frecuentes/15-canal-prioritario-para-contenidos-sensibles-en-internet/FAQ-1503-en-que-casos-no-puedo-acudir-a-este-canal): contenido sexual o de agresiones, difusión por internet y gravedad excepcional; no cubre difusión solo por mensajería o correo. |
| Policía Nacional | [Portal](https://www.policia.es/) y [limitaciones de la denuncia por internet](https://denuncias.policia.es/OVD/index.jsp?lang=es_ES): excluye a menores y hechos violentos o sexuales. |
| Guardia Civil | [Portal](https://www.guardiacivil.es/) y [denuncia telemática](https://web.guardiacivil.es/es/tramites/denuncias/denuncia-electronica/): excluye a menores y hechos violentos o sexuales. |
| Sede Judicial Electrónica | [Portal del Ministerio de Justicia](https://sedejudicial.justicia.es/): servicios judiciales sujetos a competencia y requisitos del trámite. |
| Carpeta Justicia | [Portal](https://carpeta.justicia.es/): consultas de información y expedientes judiciales; no es canal general de denuncia. |
| 112 | [Punto de Acceso General de la Administración](https://administracion.gob.es/tu-espacio-europeo/derechos-obligaciones/ciudadanos/asistencia-sanitaria/numeros-urgencia): teléfono gratuito para urgencias en toda España; información actualizada en 2026. |

No quedan recursos del catálogo pendientes de validación. Los procedimientos y la disponibilidad de los sitios pueden cambiar; conviene revisar enlaces, horarios y criterios antes de una publicación pública.

## Verificación

`node --test --test-isolation=none frontend/tests/derivacion.test.mjs` comprueba nueve escenarios: categorías, emergencia, entradas incompletas, combinaciones, prioridad, elegibilidad de AEPD, dominios permitidos, ausencia de llamadas o persistencia y transiciones del flujo. `npm run build` compila la página y ejecuta las comprobaciones de Next. Se revisaron capturas de la página de ayuda y del acceso de portada a 390 px de ancho. Antes de la demo conviene completar una pasada manual con teclado por todos los pasos.
