# LegalinStory

Novela visual de Chavales Legales construida con JavaScript y Vite. Se abre
directamente **No lo reenvíes**, la experiencia principal. El contenido vive en
JSON y las ilustraciones en `public/assets`. Las historias de ejemplo anteriores
se conservan como fixtures de regresión, fuera del catálogo publicado.

Contenido conservado en el repositorio:

- **Between the Lines** — a short chapter about a girl, a poem, and an open door.
- **The Locker Note** — a side story about a note that was never meant to be read.
- **No lo reenvíes** — an educational visual novel about bullying, non-consensual
  image sharing, protection of minors, and access to justice. It includes
  messaging scenes, a perspective switch, a decision menu, an information
  minigame, four endings, and a rights/resources screen.
- **No soy yo** — una historia complementaria sobre ciberacoso, identidad y
  pedir ayuda. La entrada principal sigue siendo **No lo reenvíes**.

## Run it

Con Node.js compatible con Vite 8:

```bash
npm install
npm run dev
```

La plataforma Next.js integra la experiencia en `/novela`. Ejecuta también
`npm install` en `frontend/`; sus comandos `dev` y `build` compilan la novela
automáticamente a `frontend/public/novela` (artefactos ignorados por Git).
La partida se guarda localmente, sin enviar decisiones al backend. La pantalla
integrada enlaza al módulo existente `/necesito-ayuda`.

En uso independiente, `VITE_PLATFORM_URL` configura el destino del botón Salir;
en localhost apunta por defecto al frontend en el puerto 3000. Integrada en la
plataforma, el botón comunica la salida al contenedor mediante `postMessage`
con comprobación de origen y ventana emisora.

Los apoyos de Sara se marcan juntos y se confirman una vez. No se puntúan.
La actividad de evidencias permite corregir la selección y continuar tras
comprobarla; modificar tarjetas invalida la comprobación anterior.

Pruebas: `npm test` y `npm run build`. No hay scripts de lint ni typecheck.
La batería recorre 270 rutas completas y comprueba los cuatro finales. Para
pruebas de navegador opcionales instala Playwright y Chromium fuera del proyecto
y ejecuta `scripts/browser-smoke.mjs` con `PLAYWRIGHT_MODULE_PATH` apuntando a
`playwright/index.mjs` y `PLAYWRIGHT_BROWSERS_PATH` a sus navegadores.
Ver el informe de auditoría en `docs/visual-novel-audit.md`.

Alternativa con Nix/pnpm:

```bash
devenv shell
pnpm install
pnpm dev
```

Open the printed URL. The main story opens directly. Progress is saved to
`localStorage` per story, so returning to a story resumes where you left off.
El botón **Salir** vuelve a la plataforma; **Reiniciar** limpia las decisiones
y empieza de nuevo.

`pnpm dev` validates all content **before** Vite starts. The same check runs
before `pnpm build`. If a sprite, background, scene, node link, cast entry, or
expression is missing, the server refuses to start and prints every problem it
found.

Production build:

```bash
pnpm build
pnpm preview
```

## Content layout

```
public/
├── content/
│   ├── index.json                     # registry: every playable story
│   ├── shared/
│   │   └── assets.json                # shared asset catalog
│   └── stories/
│       ├── between-the-lines/
│       │   ├── novel.json             # manifest: entry node, stage, save key
│       │   ├── story.json             # story graph
│       │   └── scene.json             # scene graph
│       ├── the-locker-note/
│       │   ├── novel.json
│       │   ├── story.json
│       │   └── scene.json
│       └── no-lo-reenvies/
│           ├── novel.json
│           ├── story.json
│           ├── scene.json
│           └── rights.json            # shared rights/resources screen
└── assets/
    ├── backgrounds/
    │   ├── classroom-dusk.svg
    │   ├── hallway-dusk.svg
    │   ├── clubroom.svg
    │   ├── hallway-day.svg
    │   ├── classroom-day.svg
    │   ├── bedroom-evening.svg
    │   ├── patio-day.svg
    │   ├── orientation-office.svg
    │   └── quiet-room.svg
    └── characters/
        ├── hana/
        │   ├── neutral.svg
        │   ├── smile.svg
        │   ├── happy.svg
        │   ├── sad.svg
        │   └── surprised.svg
        ├── sara/
        ├── julia/
        ├── sergio/
        ├── hugo/
        └── marina/
```

Each generated cast folder contains `neutral`, `smile`, `happy`, `sad`, and
`surprised` variants.

Story and scene files never contain file paths. They reference ids:

```json
{
  "type": "dialogue",
  "scene": "clubroom",
  "cast": { "hana": "happy" },
  "speaker": "Hana",
  "text": "Here we are. Welcome to the literature club.",
  "next": "ending"
}
```

Only `assets.json` maps ids to files:

```json
{
  "basePath": "assets",
  "characters": {
    "hana": {
      "defaultExpression": "neutral",
      "expressions": {
        "neutral": "characters/hana/neutral.svg",
        "happy": "characters/hana/happy.svg"
      }
    }
  },
  "backgrounds": {
    "clubroom": { "src": "backgrounds/clubroom.svg" }
  }
}
```

See [`docs/content-format.md`](docs/content-format.md) for the full format.

### Presentation nodes

Besides `dialogue`, `choice`, `branch`, and `ending`, the runtime understands:

- `chat` — a phone-style conversation with timed message reveal, system
  notices, and hidden/deleted content. Sensitive content is never rendered.
- `interstitial` — a full-screen chapter or perspective card.
- `minigame` — a multi-select card activity with feedback. **No lo reenvíes**
  uses it to practise identifying useful information without redistributing
  intimate content.

An ending can point at a story-wide `rights.json` through
`novel.json.content.rights`; the ending screen then exposes a **Conoce tus
derechos** panel with the legal/educational summary and support resources.

## Validation

```bash
pnpm validate
```

The validator checks, among other things:

- every registry manifest exists and every manifest field is well formed;
- every `next`, `then`, `else`, and choice option points to a real node;
- every `scene` and `cast` reference resolves;
- every character expression exists;
- every scene layer asset, position preset, and transition preset resolves;
- every file in the asset catalog exists on disk;
- conditions are well formed and reference flags or seen nodes correctly;
- unreachable nodes and conditions reading flags that are never set are
  reported as warnings.

All errors are collected and reported together:

```
Content validation failed with 2 error(s):
  - content/index.json.stories[0].cover: missing file public/assets/backgrounds/classroom-dusk.svg
  - [between-the-lines] asset "backgrounds/classroom-dusk": missing file public/assets/backgrounds/classroom-dusk.svg
```

The validator is wired into Vite in `vite.config.js`, so `pnpm dev` and
`pnpm build` cannot start with broken content.

## Adding a story

1. Create `public/content/stories/<id>/` with `novel.json`, `story.json`, and
   `scene.json` (copy an existing story as a starting point). Optionally add a
   `rights.json` for the ending rights panel.
2. Point `novel.json.content.assets` at the shared catalog, or give the story
   its own `assets.json`. Point `content.rights` at the rights file if used.
3. Add the story to `public/content/index.json` with its title, subtitle,
   manifest path, and cover.
4. Run `pnpm validate`, then `pnpm dev`.

The current runtime renders one character per beat, applies its left/center/right
`at` position preset, and uses the first image layer of a scene as the
background. It also supports `chat`, `interstitial`, `minigame`, and `rights`
content nodes. Scene groups, effects, extra character layers, and audio are
validated for future use, but are not composited or played yet.

## Architecture

```
vite.config.js                    # content validator plugin for dev/build

src/
├── main.js                       # entry: primary story loading, composition
├── app/
│   └── App.js                    # composition root, input -> engine commands
├── core/
│   ├── EventBus.js               # tiny pub/sub boundary
│   ├── VisualNovelEngine.js      # story graph, flags, seen set, persistence
│   └── conditions.js             # safe data-only condition evaluator
├── content/
│   ├── contentLoader.js          # fetch registry/manifest, resolve asset URLs
│   └── compileStory.js           # JSON story/scene/cast -> engine nodes
├── services/
│   └── saveStores.js             # LocalStorage + in-memory SaveStore adapters
├── ui/
│   ├── StorySelector.js          # library screen
│   ├── VisualNovelView.js        # DOM renderer + view-specific input
│   ├── Typewriter.js             # text reveal with skip support
│   └── templates.js              # novel shell markup
└── styles/
    └── main.css                  # scenes, typography, library, layout

scripts/
├── validate-content.mjs          # startup/build content validator
├── build-hana-svgs.mjs           # regenerates Hana's five SVGs
├── build-character-svgs.mjs      # regenerates the No lo reenvíes cast
├── build-no-lo-reenvies.mjs      # regenerates the story/scene/rights JSON
├── validation-smoke.mjs          # proves missing assets fail validation
├── ui-smoke.mjs                  # engine/view smoke test
├── library-smoke.mjs             # published story HTTP loader + assets
└── no-lo-reenvies-smoke.mjs      # chat, minigame, ending, rights coverage
```

### Design notes

- **Single responsibility** — the engine walks the graph, the view renders, the
  loader fetches and compiles, the validator checks references.
- **Open/closed** — node presentation is registered in a handler map
  (`registerNodeType`), so new beat types can be added without rewriting the
  engine's flow.
- **Dependency inversion** — the engine receives `story`, `bus`, and `saveStore`
  through its constructor; `main.js` chooses the concrete adapters.
- **Content is data** — conditions are a small object DSL (`flag`, `seen`,
  `not`, `all`, `any`, comparisons), never JavaScript strings.

### Tests

```bash
pnpm test
```

Runs the validator, a missing-asset validation test, the engine/view smoke test,
an HTTP test that starts Vite and loads the published story, and a
full playthrough of **No lo reenvíes** covering messaging scenes, the perspective
switch, the multi-select needs menu, the minigame, the ending router, and the
rights panel. Also explores all 270 complete decision routes and checks
animation cleanup, restart and migration of saved progress.

### Regenerating art and content

Hana and the **No lo reenvíes** cast are generated from shared SVG templates:

```bash
pnpm assets:build
```

`assets:build` runs both `build-hana-svgs.mjs` and
`build-character-svgs.mjs`. The long branching graph for **No lo reenvíes** is
generated by a small authoring script:

```bash
pnpm story:build
```

Edit `scripts/build-no-lo-reenvies.mjs` (or the generated JSON directly) and run
the command. The validator will catch dangling links or missing assets after any
change.
