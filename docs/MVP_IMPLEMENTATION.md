# Sara · implementación

## Arquitectura y reutilización

`frontend/app/novela/page.jsx` integra el build de Vite; `/sara` es un alias.
`LegalinStory/src/main.js` carga el catálogo y abre Sara por defecto. Las otras
historias siguen disponibles mediante `?story=no-lo-reenvies` y
`?story=no-soy-yo` en la aplicación Vite.

Se reutilizan `App`, `VisualNovelEngine`, `EventBus`, `compileStory`, condiciones,
`VisualNovelView`, `Typewriter`, las tarjetas, capítulos, finales, almacenes y
assets locales. El motor añade historial de instantáneas: volver atrás recupera
nodo, variables, escenario y nodos leídos, antes de los efectos de una decisión.
El historial queda limitado a 150 pasos y se conserva en el guardado opcional.

`SaraExperience.js` es el contenedor nuevo de portada, menú, mapa de ocho etapas,
fichas, cuaderno y recursos reales. Compone el motor y la vista existentes: no
contiene un árbol paralelo de condicionales narrativos. `sara.css` adapta los
colores del proyecto, retratos, tarjetas y menús a móvil/escritorio. El juego no
carga fuentes ni scripts de terceros.

## Contenido

- Autoría: `LegalinStory/scripts/build-sara.mjs`.
- JSON generados: `public/content/stories/sara/{story,guide,scene,assets,novel}.json`.
- Fuente jurídica independiente: `legal.json`, con notas, referencias BOE,
  recursos ANAR/112, fecha de consulta y revisión profesional pendiente.
- Nodo: `type`, `chapter`, `speaker`, `text` o `prompt`, `scene`, `cast`, `next`
  u `options`. `flags` y condiciones `branch`/`when` producen consecuencias;
  `learn` enlaza explicaciones del cuaderno. El compilador también admite `a11y`.
- Cada opción tiene ID local, texto, destino y variables. No hay entradas de
  texto libre, puntuación emocional ni inferencias sobre la persona que juega.
- `initialFlags.resolution` fija la variante judicial. La portada puede cambiar
  esta configuración antes de comenzar. Ninguna opción modifica esa variable.
- Las escenas recuperan preocupaciones por Dani, privacidad, convivencia,
  explicaciones breves y actividad cotidiana. Todas reconvergen al recorrido.

Para añadir un capítulo, crear sus nodos con `chapter`, enlazar la salida del
anterior e incorporarlo a `guide.chapters`. Para añadir una rama, usar
`choice` + `option` y un destino común; para referencias posteriores, guardar una
variable y usar `branch` con una condición declarativa. Las notas legales nuevas
deben incluir fuentes y enlazarse con `learn`. Ejecutar el generador y validador.

## Estado y seguridad

La historia usa memoria por defecto. El guardado optativo utiliza únicamente
`localStorage['sara.save']`; contiene IDs, variables de ficción e historial.
Pausa permite desactivarlo, borrarlo o reiniciar. El final elimina el guardado.
No se usan las APIs de salas ni se envían elecciones. Los enlaces de ayuda solo
se abren al pulsarlos. La pausa bloquea la navegación y contiene el foco;
Escape vuelve, Tab recorre controles. Se respeta movimiento reducido.

Los retratos inexistentes son monogramas provisionales rotulados; no se hacen
pasar otros personajes por los nuevos. El entorno judicial usa una sala SVG
existente y lo identifica como ilustración provisional.

## Ejecución y validación

Desde la raíz: `npm run dev`, abrir `/novela` o `/sara`. No requiere backend.
`npm --prefix LegalinStory run story:sara` regenera el contenido. Durante Next dev,
`node frontend/scripts/prepare-novel.mjs` actualiza la copia integrada.
Si se está sirviendo producción con `next start`, reiniciar después de regenerar:
Next conserva el catálogo de archivos públicos que existía al arrancar.

`npm --prefix LegalinStory test` incluye validación de assets y grafos, pruebas
anteriores y `sara-smoke.mjs`: comprueba ciclos, salidas, referencias legales,
alcance efectivo de todas las opciones/condiciones, desenlaces, retroceso,
persistencia, reinicio, pausa y consecuencias diferidas. La exploración conserva
las variables que afectan a decisiones futuras y cubre 3.248 estados distintos.

`npm --prefix LegalinStory run test:browser` utiliza Playwright/Chromium, si está
instalado, para recorrer la historia en escritorio, móvil y horizontal, verificar
teclado, paneles, separación de decisiones, guardado y ausencia de solicitudes
externas. `PLATFORM_URL` permite comprobar también la integración de Next.
`npm run build` compila ambas aplicaciones y pasa lint/tipos de Next. La novela
JavaScript no tiene un script de lint/typecheck independiente.

Los límites y revisiones pendientes están en `MVP_GAPS.md`. El contraste de
fuentes primarias no sustituye una validación profesional del guion ni pruebas
de comprensión con adolescentes.
