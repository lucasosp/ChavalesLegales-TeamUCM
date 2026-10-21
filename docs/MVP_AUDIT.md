# Sara · auditoría inicial

## Estado comprobado

- Next.js 14 / React 18 en `frontend/`; App Router, CSS propio y componentes de portada, juzgado, juegos y salas. `/novela` integra mediante iframe la aplicación Vite 8 / JavaScript de `LegalinStory/`.
- FastAPI sirve juegos, salas REST/WebSocket y `/api/cases/*`. Los generadores Python y el juzgado tratan principalmente derechos digitales; no son necesarios para jugar Sara.
- `LegalinStory` tiene un motor de grafos independiente del DOM, compilador JSON, condiciones declarativas, eventos y guardado inyectable. Los diálogos, decisiones, capítulos, chats, actividades y finales funcionan: `npm test` inicial pasa, incluidas 270 rutas de la historia anterior.
- El motor carece de retroceso y pausa. El iframe borra los guardados antiguos al entrar. El progreso opcional, mapa, fichas y cuaderno del nuevo caso todavía no existen.
- Los recursos de ayuda del frontend contienen destinos verificados, pero `/necesito-ayuda` redirige actualmente a portada. Sara necesita un acceso propio que realmente muestre los recursos.
- Existen cinco expresiones SVG de Sara y fondos de instituto, dormitorio, orientación y sala tranquila. No hay retratos de Paula, Laura, Irene, Dani o Javier ni un juzgado ilustrado específico. No se usará otro personaje haciéndolo pasar por ellos.
- Se han leído los documentos de `docs/`: varios archivos de contexto/convenios/TODO están vacíos; arquitectura contiene datos básicos del servidor. El dossier PDF existe y se extrajo su texto: phishing, acecho y deepfakes. No se encontró `20261018_DATATHON - Retos de Brecha Judicial.pdf`.
- Git ya contiene modificaciones de la intervención anterior en la novela y `backend/frontend/` sin seguimiento. Se conservan. No se cambian secretos ni despliegue.

## Inventario de reutilización

| Elemento | Ubicación | Estado | Reutilizable | Adaptaciones |
| --- | --- | --- | --- | --- |
| Motor / condiciones / eventos | `LegalinStory/src/core/` | Funcional y probado | Directamente | Historial reversible y estado inicial configurado |
| Compilador / carga JSON | `LegalinStory/src/content/` | Funcional | Con modificaciones | Metadatos de capítulo, cuaderno y legal separados |
| Diálogos, tarjetas, capítulos, finales | `LegalinStory/src/ui/VisualNovelView.js` | Funcional | Directamente | Contenedor Sara y controles accesibles |
| Tipografía, colores, responsive | `LegalinStory/src/styles/main.css` | Comprobado en navegador anteriormente | Con modificaciones | Diseño móvil del nuevo menú y portada |
| Sara y sus expresiones | `LegalinStory/public/assets/characters/sara/` | Cinco SVG reales | Directamente | Pequeña discrepancia con descripción artística final |
| Fondos | `LegalinStory/public/assets/backgrounds/` | SVG y fotos locales | Directamente | Priorizar SVG coherentes; sala judicial provisional identificada |
| Personajes secundarios | Sin retratos propios | No existe | Placeholder | Tarjetas con iniciales, nombre y función |
| Persistencia | `src/services/saveStores.js` | Memoria y localStorage | Con modificaciones | Consentimiento opcional, versión y borrado |
| Ruta / preparación de assets | `frontend/app/novela/`, `frontend/scripts/prepare-novel.mjs` | Funcional | Directamente | Sara como entrada predeterminada |
| Mapa, fichas, cuaderno | No existe para este caso | No existe | Nuevo módulo pequeño | Sobre el motor actual, sin backend |
| Historia anterior / generadores de quiz | `public/content/`, Python | Temática incompatible | Solo mecánicas | Conservar las otras historias y escribir Sara aparte |
| Pruebas y validador | `LegalinStory/scripts/` | Suite inicial pasa | Con modificaciones | Añadir recorrido Sara, retroceso y navegación web |

## Solución mínima

Añadir una historia declarativa de seis capítulos al catálogo existente, reutilizar `App` y `VisualNovelView`, ampliar el motor con instantáneas para volver atrás y añadir un controlador de experiencia para portada, pausa, mapa, fichas y cuaderno. Guardado solo local y opcional; ninguna elección se envía al backend. Textos jurídicos y fuentes en un JSON separado de la ficción. Un recorrido principal, pequeñas ramas que reconvergen y referencias posteriores; resolución fijada por la demo, independiente de decisiones emocionales.

## Comprobaciones y límites

La auditoría inicial ejecutó la suite real de la novela. No hay scripts específicos de lint ni typecheck en esa aplicación JavaScript. La integración y los controles nuevos se comprobarán tras implementarlos. Faltan ilustraciones específicas, validación jurídica profesional y pruebas de comprensión con adolescentes. Estas revisiones humanas se documentarán como requisito anterior al uso con menores reales.
