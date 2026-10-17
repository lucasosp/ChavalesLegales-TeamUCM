# Referentes internacionales: cómo otros países enseñan seguridad y derechos digitales a menores con juegos

> Investigación de apoyo para el hackatón. Foco acordado por el equipo:
> **phishing, stalking/acecho y deepfakes** (el *cyberbullying* se descarta porque
> ya se trabaja en los centros). Objetivo: ver cómo plantean los **juegos e
> interacciones** y qué podemos reutilizar en *Chavales Legales*.
>
> Fecha: 2026-10-17. Las fuentes están al final. Nota: varios programas enmarcan
> el "stalking" dentro de *grooming / contacto no deseado / huella digital*, no
> como categoría propia (ver §4.2).

---

## 1. Resumen ejecutivo (lo que funciona)

De todo lo revisado, los programas que mejor "enganchan" y que tienen evidencia
de eficacia comparten **cuatro patrones de mecánica**:

1. **Clasificar "real vs. falso"** (phishing y deepfakes). El jugador decide si un
   email / web / imagen / vídeo es legítimo o un fraude, y **recibe explicación
   inmediata** de las pistas que lo delatan. Ej.: *Anti-Phishing Phil* (CMU),
   *Phishing Quiz* de Google Jigsaw, *Detect Fakes* (MIT/Northwestern), módulo
   "Don't Fall for Fake" de *Be Internet Awesome*.
2. **Inoculación / "pre-bunking"**: el jugador se mete en la piel del atacante y
   construye el engaño, para aprender a reconocerlo después. Ej.: *Bad News*,
   *Harmony Square*, *Go Viral* (Cambridge + DROG). Es el enfoque con más respaldo
   académico.
3. **Narrativa ramificada / dilemas** ("elige tu propia aventura"): escenarios
   realistas donde cada decisión tiene consecuencias. Ideal para stalking,
   contacto no deseado y huella digital. Ej.: *Band Runner* (CEOP/UK),
   *NetSmartz Cyber Detective*, *Are You Cyber Safe?*, *Jo Cool or Jo Fool*.
4. **Repetición de la misma situación en contextos distintos** para fijar el
   hábito, y un **mentor/personaje** al que acudir que refuerza el mensaje
   "pregunta a un adulto de confianza" (CEOP, MediaSmarts).

**Conclusión para nosotros:** el patrón 1 (real/falso con feedback) y el 3
(dilemas ramificados) son los más fáciles de generar automáticamente desde un
JSON de configuración, y cubren bien los tres topics. El patrón 2 (inoculación)
es el más original y el que más diferencia, pero cuesta más de diseñar.

---

## 2. Patrones de mecánica (detalle)

| Patrón | Qué hace el jugador | Encaja con | Facilidad de autogenerar |
|---|---|---|---|
| **Clasificar real/falso + feedback** | Decide si algo es legítimo o fraude; ve las pistas | Phishing, Deepfakes | Alta (pregunta + opciones + explicación) |
| **Inoculación / pre-bunking** | Crea el engaño desde dentro | Deepfakes, desinformación | Media-baja (requiere guion) |
| **Narrativa ramificada / dilema** | Elige entre opciones con consecuencias | Stalking, grooming, huella | Alta (árbol de decisiones en JSON) |
| **Quiz / trivia con recompensa** | Responde y gana piezas/puntos | Todos (refuerzo) | Muy alta |
| **Arcade + micro-dilema** | Juego de habilidad que se interrumpe con preguntas | Enganche para primaria | Media (necesita motor arcade) |

---

## 3. Programas por país (cómo plantean los juegos)

### 3.1 Estados Unidos — Google *Be Internet Awesome* + *Interland*
- **Formato:** currículo de aula + videojuego de navegador gratuito. Mundo con
  cuatro "tierras", cada una sobre un tema (hackers/phishers, sobreexposición,
  compartir con criterio, amabilidad).
- **Phishing:** módulo *"Don't Fall for Fake"* — el niño decide si una web o email
  parece real o falso. Mecánica = **clasificar real/falso**.
- **Privacidad:** *"Share with Care"* — revisar un perfil ficticio y tachar lo que
  no deberías publicar. En el juego, una "tierra" convierte compartir con la
  audiencia correcta en un puzle espacial.
- **Reutilizable:** la estructura "currículo para el profe + juego para el alumno"
  es exactamente nuestro público (profesores de cole/insti).

### 3.2 Reino Unido — CEOP *Thinkuknow* (*Band Runner*, *Jessie & Friends*)
- Gestionado por la National Crime Agency. Material por franjas de edad.
- ***Band Runner* (8–10):** juego arcade (corres y saltas obstáculos) que **se
  interrumpe con un dilema de seguridad online**; si fallas, resuelves el dilema
  para seguir. **Repite** las mismas situaciones a propósito para fijarlas.
- ***Jessie & Friends* (4–7):** dibujos + actividades sobre a quién contar algo que
  te preocupa (adulto de confianza), consentimiento y confianza.
- **Reutilizable:** el patrón "arcade + micro-dilema" para enganchar a los más
  pequeños; y el enfoque por edades.

### 3.3 Canadá — MediaSmarts (*Privacy Pirates*, *Data Defenders*)
- ***Privacy Pirates* (7–9):** construyes un mapa del tesoro respondiendo preguntas
  de privacidad; aciertas → ganas piezas del mapa. Tiene **personaje mentor** al
  que pedir consejo (refuerza "pregunta si dudas").
- ***Data Defenders* (4º–6º):** emparejar fichas; muestra cómo los *ad brokers*
  recopilan tus datos y cómo protegerlos. Incluye guía de profe + plan de lección.
- **Reutilizable:** recompensa por acierto (piezas/puntos) + mentor integrado;
  material docente de acompañamiento.

### 3.4 Unión Europea — *Better Internet for Kids* (BIK)
- Directorio de recursos de los *Safer Internet Centres* nacionales, con fuerte
  apuesta por **game-based learning**:
  - **Juegos de mesa imprimibles** (Letonia): memory, serpiente de palabras,
    rebus, temas de debate. Barato y sin pantallas.
  - **Spoofy** (Lituania): juego gratuito e inclusivo sobre riesgos online.
  - **MediaMasters** (Países Bajos): *serious game* para primaria (alfabetización
    mediática, privacidad).
  - **Through the Wild Web Woods** (Consejo de Europa, 7–10): juego tipo cuento +
    guía con 8 lecciones (privacidad, identidad online).
  - **Growing up on a Safer Internet** (Croacia): los alumnos **crean sus propios
    juegos** de seguridad con un manual.
- **Reutilizable:** la línea "imprimible / sin pantalla" como complemento de aula,
  y la idea de que los propios alumnos diseñen retos.

### 3.5 Australia — *eSafety Commissioner*
- Regulador estatal con el programa *"Playing IT Safe"* (juegos y actividades,
  5–12 años) y materiales para *Early Years*.
- Enfoque fuerte en **grooming / contacto no deseado** (en 2026 requirió a Roblox,
  Minecraft, Fortnite y Steam explicaciones sobre grooming y otros riesgos).
- **Hallazgo clave para "stalking":** no tienen una categoría "stalking" como tal;
  lo cubren vía *grooming*, abuso basado en imágenes y contacto no deseado.

### 3.6 Finlandia — modelo nacional de alfabetización mediática
- Referencia mundial (nº1 europeo en resiliencia a *fake news* varios años). Más
  que juegos concretos, es **currículo transversal** desde infantil (vía juego y
  experimentación) hasta secundaria, con preguntas críticas sobre quién produce
  la información y con qué intención.
- **Reutilizable:** el marco de "preguntas críticas" como base de los dilemas, y
  la idea de competencia cívica (no solo técnica).

---

## 4. Enfoque por topic (phishing, stalking, deepfakes)

### 4.1 Phishing — mecánica ganadora: **clasificar real/falso + feedback**
- ***Anti-Phishing Phil* (Carnegie Mellon):** controlas un pez que inspecciona URLs;
  si "muerde" una dirección fraudulenta, pica el anzuelo y un pez sabio explica el
  error. Enseña a leer URLs y buscar la web legítima. **Evidencia:** precisión del
  69% → 87% tras 15 min; mejor que leer tutoriales.
- ***Phishing Quiz* de Google Jigsaw:** 8 emails reales/falsos; **mete tu nombre y
  correo en los ejemplos** para hacerlo verosímil; tras responder, explica las
  pistas (dominios imitados tipo `drive--google.com` o `efacks.com`, enlaces,
  remitente). Basado en formaciones a ~10.000 periodistas y activistas.
- **Para nosotros:** banco de emails/webs/SMS falsos vs. legítimos, con campo
  "pistas que lo delatan" por opción. Encaja perfecto con nuestro modelo
  `Pregunta → Opciones → retroalimentación`. Añadir el ángulo **legal español**:
  qué delito es, cómo denunciar.

### 4.2 Stalking / acecho — mecánica ganadora: **narrativa ramificada / dilemas**
- **Aviso importante:** casi ningún programa internacional usa "stalking" como
  categoría para menores; lo enmarcan en **huella digital, contacto no deseado,
  grooming y acoso**. Conviene que lo definamos bien (en España el *acecho/stalking*
  es el art. 172 ter del Código Penal) para diferenciarnos.
- Referentes de mecánica:
  - ***NetSmartz Cyber Detective* (EE. UU.):** formato misterio; reúnes pistas y
    tus decisiones cambian el final (privacidad, contraseñas, reconocer conductas
    sospechosas).
  - **Digital Footprint Trail (Cyber Vault):** cómo se crea tu huella y cómo tomar
    mejores decisiones.
  - ***Are You Cyber Safe?* (Banzai) / LifeQuest:** simulaciones de 5–10 min con
    dilemas (incluye escenarios tipo "deepfake de ti", seguridad de cuentas,
    riesgo de capturas).
  - **Digital Footprint (Playversity):** *escape game* colaborativo presencial.
- **Para nosotros:** escenario "alguien recopila tus datos / te localiza / te
  contacta de forma insistente" → árbol de decisiones (bloquear, guardar pruebas,
  contar a un adulto, denunciar) con consecuencias y encuadre legal.

### 4.3 Deepfakes — mecánicas ganadoras: **real/falso** + **inoculación**
- ***Detect Fakes* (MIT → Northwestern/Kellogg):** juzgas si una imagen/vídeo es
  generado por IA y puntúas tu confianza; puedes explicar tu razonamiento.
  (Nota: el estudio original es para +18, habría que adaptar edad.)
- **Lecciones de aula** (SchoolAI, guías escolares): detectar **señales** (sync de
  labios, iluminación/ sombras incoherentes, manos, parpadeo) y usar herramientas
  (búsqueda inversa de imágenes, InVID). Escalable por edad: observación básica en
  primaria → análisis técnico en secundaria.
- **Inoculación** (*Go Viral* y familia *Bad News*): crear/entender cómo se fabrica
  el engaño para reconocerlo.
- **Contexto de riesgo real:** en 2026 se alertó de que fotos de alumnos y personal
  sacadas de webs escolares se usan para crear deepfakes → gancho de actualidad.
- **Para nosotros:** galería "¿real o IA?" con explicación de señales + ángulo
  legal (difusión no consentida de imágenes íntimas, art. 197.7 CP; derechos de
  imagen de menores). Cuidado ético al usar imágenes de personas reales.

---

## 5. Recomendaciones para *Chavales Legales*

1. **Dos formatos de juego de salida**, ambos generables desde JSON:
   - **"¿Real o trampa?"** (clasificación real/falso con feedback) → cubre
     *phishing* y *deepfakes*. Ya encaja con nuestro `banco_preguntas` +
     `generador`.
   - **"Decide y descubre"** (narrativa ramificada con consecuencias) → cubre
     *stalking*/contacto no deseado y huella digital. Requiere ampliar el modelo
     de datos a un **árbol de decisiones** (nodo → opciones → nodo/resultado).
2. **Diferenciador frente a los referentes:** todos enseñan la *conducta segura*,
   pero casi ninguno conecta con la **ley concreta**. Nuestro valor = cada
   pregunta/escenario cita la norma española y "qué puedo hacer / cómo denuncio".
3. **Material para el profe** (como Google/CEOP/MediaSmarts): además del juego,
   una guía corta de lección por topic. Encaja con que nuestro público son
   profesores.
4. **Modo accesible** (ya en nuestras ideas): textos simples y ajustables para
   dislexia/neurodivergencia; alinea con el enfoque inclusivo de la UE.
5. **Repetición intencionada** (CEOP): reutilizar la misma situación en contextos
   distintos para fijar el aprendizaje.
6. **Pre-bunking como fase 2** (Bad News/Go Viral): un mini-reto "monta tú el
   engaño" es el toque más memorable si da tiempo en el hackatón.

### Siguiente paso técnico sugerido
Ampliar `modelos/juego.py` con un tipo **`escenario`** (árbol de nodos) para
soportar la narrativa ramificada, además del `quiz` actual. El resto
(clasificación real/falso) ya se cubre con lo que hay.

---

## 6. Fuentes

**Be Internet Awesome / Interland**
- https://teachnet.ie/be-internet-awesome/
- https://better-internet-for-kids.europa.eu/en/resource-directory/adventure-packed-online-game-interland

**CEOP / Thinkuknow (UK)**
- https://www.thinkuknow.co.uk/parents/articles/band-runner
- https://prod.thinkuknow.co.uk/professionals/resources/band-runner
- https://www.tpximpact.com/knowledge-hub/our-work/protecting-children-online-through-the-power-of-play/

**MediaSmarts (Canadá)**
- https://mediasmarts.ca/digital-media-literacy/educational-games/privacy-pirates
- https://mediasmarts.ca/digital-media-literacy/educational-games/privacy-pirates-guide
- https://mediasmarts.ca/press-centre/new-game-uses-pirates-teach-privacy-protection-skills-canadian-children

**Better Internet for Kids / Consejo de Europa (UE)**
- https://better-internet-for-kids.europa.eu/en/resource-directory/printable-board-games-children-about-internet-safety
- https://www.coe.int/en/web/children/through-the-wild-web-woods

**eSafety Commissioner (Australia)**
- https://www.dollysdream.org.au/blog/what-is-the-esafety-commissioner-and-how-can-it-help-me-
- https://dig.watch/updates/esafety-notices-roblox-minecraft-fortnite-steam

**Finlandia (alfabetización mediática)**
- https://www.scmp.com/lifestyle/arts-culture/article/3293151/disinformation-fake-news-scams-finland-young-people-are-learning-how-spot-them
- https://fortune.com/2025/01/29/finland-teaches-6-year-olds-to-spot-disinformationand-internet-hoaxes-media-literacy

**Phishing (juegos y quiz)**
- https://www.cmu.edu/iso/aware/phil/index.html
- https://www.sciencedaily.com/releases/2007/09/070925110204.htm (evidencia Anti-Phishing Phil)
- https://9to5google.com/2019/01/22/google-jigsaw-phishing-emails/

**Inoculación / pre-bunking (Bad News, Harmony Square, Go Viral)**
- https://www.gamesforchange.org/blog_posts/harmony-square-exposing-disinformation-tactics-and-techniques/
- https://misinforeview.hks.harvard.edu/article/breaking-harmony-square-a-game-that-inoculates-against-political-misinformation/

**Deepfakes (detección y aula)**
- https://detectfakes.media.mit.edu/about
- https://detectfakes.kellogg.northwestern.edu/about
- https://schoolai.com/blog/teaching-media-literacy-age-deepfakes-generative-ai
- https://www.fastvue.co/fastvue/blog/deepfakes-in-schools/

**Escenarios ramificados / huella digital (teens)**
- https://www.tandfonline.com/doi/full/10.1080/10494820.2023.2265424 (game-based learning, privacidad y seguridad)
- https://www.cybervaultfoundation.org/digital-safety-games/
- https://life-quests.com/
