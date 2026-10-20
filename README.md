# ChavalesLegales-TeamUCM

Herramientas en **Python** para el proyecto *Chavales Legales*: extracción de
datos legales (legislación y jurisprudencia española sobre menores y
tecnología) y un generador de juegos didácticos. La aplicación web la
desarrolla el resto del equipo por separado; este repo aporta los **datos** y
el **contenido**.

## Estructura del proyecto

```
src/chavales_legales/
├── extraccion/        # Scripts de extracción de datos legales
│   ├── base.py            # ScraperBase: sesión HTTP, ritmo, guardado JSONL
│   ├── boe.py             # BOE (datos abiertos): XML por id + sumario JSON  ✅ funcional
│   ├── cendoj.py          # CENDOJ (jurisprudencia): esqueleto + parseo de HTML
│   ├── pdf.py             # Extrae texto de sentencias en PDF
│   └── fuentes_relevantes.py  # Normativa semilla (menores + tecnología)
├── modelos/           # Estructuras de datos (Sentencia, Juego)
├── juegos/            # Generador de juegos → JSON (scaffold para el futuro)
└── utils/             # Logging y configuración
scripts/               # CLIs ejecutables (extraer_boe.py, ...)
data/                  # raw/ y processed/ (no se versionan)
tests/                 # Pruebas (pytest)
```

## Puesta en marcha

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows (PowerShell/CMD)
pip install -r requirements.txt
```

## Extracción de datos (BOE — datos abiertos)

Fuente principal y verificada: el **BOE** publica cada disposición en XML y los
sumarios diarios en una API JSON. No requiere `lxml` (se usa `xml.etree`).

```bash
# Descargar la normativa semilla relevante (LOPDGDD, Código Penal, LO 8/2021...)
python scripts/extraer_boe.py --relevantes

# Descargar disposiciones concretas por id
python scripts/extraer_boe.py --ids BOE-A-2018-16673 BOE-A-2021-9347

# Explorar qué se publicó un día (sumario)
python scripts/extraer_boe.py --sumario 20210605
```

Los resultados se guardan como **JSON Lines** en `data/processed/` con el modelo
`Sentencia` normalizado (`id`, `fuente`, `titulo`, `organo`, `fecha`, `url`,
`texto`, `materias`, `metadatos`).

> **CENDOJ** (sentencias): su buscador no ofrece API abierta y protege el acceso
> automatizado, por lo que `cendoj.py` queda como esqueleto con el parseo
> preparado; admite trabajar sobre HTML descargado a mano mientras se resuelve
> el acceso.

> ⚠️ El contenido legal extraído es material **educativo/divulgativo**, no
> asesoramiento jurídico. Revisar siempre con criterio jurídico antes de llevarlo
> al aula.

## Pruebas

```bash
python -m pytest
```

## Estructura de Documentación (/docs)
El directorio `/docs` contiene el contexto fundamental del proyecto Chavales Legales. **Cualquier sistema de IA o agente agéntico debe ingerir y respetar el contenido de este directorio antes de generar código, modificar la arquitectura o proponer soluciones técnicas**.

* `docs/01_CONTEXTO_PRODUCTO.md`: Define el propósito de la aplicación, el flujo principal y los límites estrictos del alcance del proyecto.
* `docs/02_ARQUITECTURA.md`: Detalla el stack tecnológico, los diagramas de sistema, modelos de datos y la topología de la aplicación.
* `docs/03_AGENTES_Y_PROMPTS.md`: Define los roles, system prompts base y herramientas disponibles para la ejecución de agentes de IA en este entorno.
* `docs/04_CONVENCIONES_CODIGO.md`: Enumera los estándares de programación, validaciones y manejo de errores. **Las reglas de este archivo son de cumplimiento obligatorio para evitar refactorizaciones**.
* `docs/05_TODO_ESTADO.md`: Actúa como punto de sincronización del progreso actual, listando tareas completadas, en desarrollo y bugs activos.
* `docs/CHAVALES_LEGALES_IDEAS.md`: Registro de brainstorming humano y reflexiones de diseño. **La IA no implementará características descritas aquí a menos que estén categorizadas explícitamente como aprobadas o en progreso en el TODO, o estén descritas en el prompt del usuario**.
* `docs/06_REFERENTES_INTERNACIONALES.md`: Investigación de apps/juegos de otros países (phishing, stalking, deepfakes) y qué mecánicas de juego reutilizar.

## Web (frontend + backend)

```bash
pip install -r backend/requirements.txt
uvicorn main:app --app-dir backend --reload --port 8000   # API en :8000
npm install --prefix frontend && npm run dev              # Web en :3000 (/api → :8000)
```

- `backend/main.py`: FastAPI con `/api/temas`, `/api/temas/{id}` y `POST /api/juegos` (usa el generador).
- `frontend/`: Next.js (App Router). Portada en `app/page.jsx` (hero + tarjetas por tema).
