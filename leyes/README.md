# Leyes — contexto para agentes

Esta carpeta reúne las **7 normas** que el proyecto *Chavales Legales* usa como base legal sobre menores, protección, datos y entorno digital. Cada ley tiene su propia carpeta con:

```text
<ley>/
├── <slug>_original.pdf     # documento original (copia fiel)
├── <slug>_transcript.md    # texto completo pasado a Markdown, con títulos y marcas
├── <slug>_esencial.md      # texto normativo sin aparato no esencial (preámbulo, notas, etc.)
└── <slug>_resumen.md       # qué hace, cuándo aplica y claves para el proyecto
```

> **Aviso:** este material es de apoyo educativo y de investigación. No sustituye el asesoramiento jurídico profesional ni la consulta de la versión vigente en el BOE/DOUE.

---

## 1. Inventario

| Carpeta | Norma | Referencia | Última versión | Qué aporta |
|---|---|---|---|---|
| [ley-enjuiciamiento-criminal](ley-enjuiciamiento-criminal/) | Ley de Enjuiciamiento Criminal (LECrim) | BOE-A-1882-6036 | 09/04/2026 | Procedimiento penal, investigación, detención, prueba, medidas tecnológicas, juicio y recursos. |
| [lo-1-1982-honor-intimidad-imagen](lo-1-1982-honor-intimidad-imagen/) | LO 1/1982, de honor, intimidad y propia imagen | BOE-A-1982-11196 | 23/06/2010 | Protección civil frente a intromisiones en honor, intimidad e imagen; remedios. |
| [lo-1-1996-proteccion-juridica-menor](lo-1-1996-proteccion-juridica-menor/) | LO 1/1996, de Protección Jurídica del Menor | BOE-A-1996-1069 | 05/06/2021 | Interés superior, derechos y deberes de menores, protección, acogimiento, adopción, audiencia. |
| [lo-3-2018-proteccion-datos](lo-3-2018-proteccion-datos/) | LO 3/2018, de Protección de Datos y derechos digitales | BOE-A-2018-16673 | 27/12/2025 | Protección de datos en España y catálogo de derechos digitales; consentimiento de menores. |
| [lo-8-2021-proteccion-infancia-violencia](lo-8-2021-proteccion-infancia-violencia/) | LO 8/2021, de protección integral a la infancia frente a la violencia | BOE-A-2021-9347 | Sin modificaciones | Prevención, detección, comunicación, asistencia y protección frente a toda violencia, incluida la digital. |
| [convencion-derechos-nino](convencion-derechos-nino/) | Convención sobre los Derechos del Niño (CDN) | Tratado ONU, 1989 | Edición UNICEF 2006 | Marco internacional de derechos de la infancia; incluye dos protocolos facultativos. |
| [rgpd-ue-2016-679](rgpd-ue-2016-679/) | Reglamento (UE) 2016/679 (RGPD) | DOUE L 119/1, 04/05/2016 | Aplicable desde 25/05/2018 | Régimen europeo de protección de datos, derechos, obligaciones, seguridad y sanciones. |

---

### 1.1. Resumen en una frase

- **LECrim:** regula cómo se investiga, se prueba y se enjuicia un delito en España.
- **LO 1/1982:** protege civilmente el honor, la intimidad y la propia imagen frente a intromisiones ilegítimas.
- **LO 1/1996:** fija el marco general de derechos, deberes y protección de las personas menores de edad.
- **LO 3/2018:** desarrolla la protección de datos en España y garantiza los derechos digitales.
- **LO 8/2021:** crea un sistema integral de prevención, detección y protección frente a toda violencia sobre la infancia.
- **CDN:** establece el marco internacional de derechos de la infancia y sirve de interpretación para el resto de normas.
- **RGPD:** regula el tratamiento de datos personales en la UE y las obligaciones de quienes los tratan.

---

## 2. Cómo leer esta carpeta

Para un agente nuevo, el orden recomendado es:

1. **Este README** para tener el mapa general.
2. El **`*_resumen.md`** de la ley que interese: contiene qué hace, cuándo aplica y artículos clave.
3. El **`*_esencial.md`** para el núcleo práctico: qué es legal o ilegal, penas o consecuencias y medios de denuncia o protección.
4. El **`*_transcript.md`** cuando necesites el texto completo, literalidad o contexto.
5. El **`*_original.pdf`** para verificar la fuente oficial.

### Nomenclatura

- `*_original.pdf`: copia del PDF de origen.
- `*_transcript.md`: transcripción completa con estructura Markdown (`#`, `##`, `###`), títulos y artículos.
- `*_esencial.md`: selección práctica centrada en legalidad/ilegalidad, penas o consecuencias y denuncia/protección. No es el texto completo: para el articulado íntegro, usa el transcript.
- `*_resumen.md`: resumen funcional para agentes y para el equipo.

### Cómo citar

- **LECrim:** `art. 13 LECrim (BOE-A-1882-6036)`.
- **LO 1/1982:** `art. 7 LO 1/1982 (BOE-A-1982-11196)`.
- **LO 1/1996:** `art. 2 LO 1/1996 (BOE-A-1996-1069)`.
- **LO 3/2018:** `art. 7 LOPDGDD (BOE-A-2018-16673)`.
- **LO 8/2021:** `art. 19 LO 8/2021 (BOE-A-2021-9347)`.
- **CDN:** `art. 3 CDN`; para los protocolos, indica el protocolo y el artículo.
- **RGPD:** `art. 8 RGPD` o `considerando 38 RGPD` (DOUE L 119/1).

---

## 3. Mapa por problema

| Problema o caso de uso | Normas principales | Normas complementarias |
|---|---|---|
| *Sexting* no consentido, *revenge porn*, difusión de imágenes íntimas | LO 1/1982; LO 8/2021; Código Penal (no incluido) | LO 1/1996; LOPDGDD/RGPD |
| *Deepfakes* sexuales o vejatorios, suplantación de imagen | LO 1/1982; LO 8/2021; Código Penal (no incluido) | LOPDGDD/RGPD; CDN |
| *Stalking*, acoso, *grooming*, ciberacoso | LO 8/2021; LECrim; Código Penal (no incluido) | LO 1/1996; CDN |
| *Phishing*, fraude, delitos económicos online | LECrim; Código Penal (no incluido) | RGPD/LOPDGDD si hay datos personales |
| Protección de datos de menores, apps, plataformas, colegios | RGPD; LOPDGDD | LO 1/1996; LO 8/2021 |
| Edad de consentimiento digital y consentimiento parental | LOPDGDD (art. 7); RGPD (art. 8) | LO 1/1996 |
| Protocolos escolares, detección y comunicación de violencia | LO 8/2021 | LO 1/1996 |
| Derecho a ser oído, interés superior, participación | LO 1/1996; CDN | LO 8/2021 |
| Derecho al olvido, rectificación y actualización en Internet | LOPDGDD; RGPD | LO 1/1982 |
| Detención, investigación policial, prueba digital, medidas tecnológicas | LECrim | LO 8/2021; LO 5/2000 (no incluida) |
| Marco internacional y estándares de derechos del niño | CDN y protocolos facultativos | LO 1/1996; LO 8/2021 |

> **Huecos importantes:** no están incluidos el **Código Penal**, la **LO 5/2000** de responsabilidad penal de menores, la **Ley 34/2002 (LSSI)**, la **Directiva ePrivacy**, la **Ley 4/2015 del Estatuto de la víctima** ni la normativa autonómica. Para un análisis completo hay que incorporarlos.

### 3.1. Mapa rápido: legalidad, penas y denuncia

| Norma | Qué es ilegal / cuándo hay infracción | Penas / consecuencias | Denuncia / protección |
|---|---|---|---|
| **LECrim** | No define delitos: regula el proceso. Las conductas delictivas están en el Código Penal. | No contiene penas criminales. Detención, prisión provisional, fianza y medidas cautelares. | Denuncia ante Juzgado, Ministerio Fiscal o Policía Judicial; órdenes de protección (arts. 544 bis/ter); retirada de contenidos online (art. 13). |
| **LO 1/1982** | Intromisiones ilegítimas en honor, intimidad o propia imagen (art. 7). | No contiene penas criminales. Cese, indemnización, publicación de la sentencia y medidas cautelares (art. 9). | Reclamación civil; Ministerio Fiscal en defensa de menores. |
| **LO 1/1996** | No es ley penal. Regula derechos y situaciones de riesgo/desamparo. | No contiene penas. Medidas de protección: tutela, guarda, acogimiento, adopción. | Comunicación de riesgo/desamparo (art. 13); Ministerio Fiscal, servicios sociales y Defensor del Pueblo (art. 10). |
| **LO 3/2018** | Tratamiento de datos sin base jurídica; datos de menores sin consentimiento cuando se exige; difusión ilícita de datos/imágenes. | Sanciones administrativas (arts. 71-76); multas según el art. 83 RGPD: hasta 20 M € o 4 % del volumen de negocio. | Reclamación ante la AEPD (arts. 63-69); derechos de los arts. 12-18; olvido (arts. 93-94). |
| **LO 8/2021** | Violencia en sentido amplio (art. 1), incluida la digital. No es código penal. | No contiene catálogo propio de penas; las penas están en el Código Penal, modificado por la DF sexta. | Deberes de comunicación (arts. 15-19); protocolos educativos (art. 34); policía especializada (art. 49); AEPD (art. 52); registro (art. 56). |
| **CDN** | No es código penal. Prohíbe violencia, explotación, trata y explotación sexual; los protocolos obligan a criminalizar la venta de niños, prostitución, pornografía y reclutamiento. | No establece penas para personas; el Protocolo de venta exige penas adecuadas a la gravedad (art. 3.3). | Comité de los Derechos del Niño (arts. 43-45); protección de víctimas (Protocolo de venta, art. 8); canales nacionales. |
| **RGPD** | Tratamiento sin base jurídica (art. 6), sin condiciones para categorías especiales (art. 9) o sin respetar derechos. | Sanciones administrativas: hasta 20 M € o 4 % del volumen de negocio mundial (art. 83). | Reclamación ante la autoridad de control (art. 77); recurso judicial (art. 79); brechas (arts. 33-34); DPO (art. 37). |

**Canales que aparecen en las leyes:** Juzgado de Instrucción, Ministerio Fiscal, Policía Judicial y Fuerzas y Cuerpos de Seguridad, servicios sociales, Oficinas de Asistencia a las Víctimas, AEPD, Defensor del Pueblo y Comité de los Derechos del Niño. La LO 8/2021 obliga además a disponer de canales de denuncia de contenidos ilícitos en Internet (art. 19) y de una línea de ayuda sobre uso seguro de Internet (art. 45).

---

## 4. Claves transversales

### 4.1. Menor de edad

- La CDN y la LO 1/1996 fijan el marco: **menor de 18 años**, interés superior, no discriminación, participación y derecho a ser oído.
- La LO 1/1996 concreta el interés superior y los derechos en el ordenamiento español.
- La LO 8/2021 añade el sistema integral frente a la violencia, con deberes de comunicación y protocolos.

### 4.2. Entorno digital

- La **LOPDGDD** y el **RGPD** regulan el tratamiento de datos, el consentimiento de menores, la protección en Internet, el derecho al olvido y la seguridad.
- La **LO 8/2021** incorpora la violencia digital (ciberacoso, *grooming*, *sexting*, contenidos sexuales, etc.) y obliga a protocolos y formación.
- La **LO 1/1982** ofrece la vía civil frente a la difusión de imágenes y datos que lesionan honor, intimidad o propia imagen.

### 4.3. Proceso penal

- La **LECrim** regula la investigación y el enjuiciamiento; es clave para denuncias, prueba digital, detención y medidas cautelares.
- Para menores infractores, la norma específica es la **LO 5/2000**, que no está en esta carpeta.

### 4.4. Datos y edad

- RGPD: 16 años como regla general para el consentimiento en servicios de la sociedad de la información, con posibilidad de bajarlo a 13.
- España lo bajó a **14 años** en el art. 7 LOPDGDD.
- Por debajo de esa edad, se exige el consentimiento del titular de la patria potestad o tutela.

---

## 5. Notas metodológicas

- Los PDF del BOE se convirtieron con `pdftotext` y se reestructuraron con un parser propio para detectar libros, títulos, capítulos, artículos y disposiciones.
- La CDN se extrajo de la edición UNICEF con `pdftohtml`, separando el texto principal de los recuadros laterales y reconstruyendo las columnas de los protocolos.
- El RGPD se convirtió desde el PDF del DOUE; se conservaron los 173 considerandos en la transcripción y se eliminaron en la versión esencial. Las notas al pie del DOUE se omitieron.
- Las notas editoriales del BOE (“Téngase en cuenta…”) se conservan en la transcripción y se eliminan en la versión esencial.
- Las versiones esenciales son **selecciones temáticas**: reproducen los artículos más directamente relacionados con legalidad/ilegalidad, penas o consecuencias y denuncia/protección. No son el articulado completo; el texto íntegro está en el `*_transcript.md`. **La reducción es orientativa** y varía según la norma:

| Norma | Reducción aproximada |
|---|---:|
| LECrim | 95,6 % |
| LO 1/1982 | 40,6 % |
| LO 1/1996 | 75,4 % |
| LO 3/2018 | 89,8 % |
| LO 8/2021 | 85,2 % |
| CDN | 74,5 % |
| RGPD | 90,1 % |

- Ahora las versiones esenciales son **selecciones temáticas**, no el articulado completo. Por eso la reducción es mucho mayor: se conservan los artículos directamente relacionados con legalidad/ilegalidad, penas o consecuencias, denuncia y protección. El texto íntegro sigue en el `*_transcript.md`.
- Las transcripciones pueden contener errores de extracción propios del PDF (saltos de línea, guiones, numeración). Para citar textualmente, contrasta con el PDF original.


---

## 6. Estado y siguientes pasos

- [x] 7 carpetas creadas.
- [x] PDF original copiado en cada carpeta.
- [x] Transcripción Markdown con títulos y artículos.
- [x] Versión esencial práctica centrada en legalidad, penas/consecuencias y denuncia/protección.
- [x] Resumen por ley.
- [x] README global de contexto.

Posibles mejoras futuras:

- Añadir el **Código Penal** y la **LO 5/2000** para completar el mapa penal.
- Incorporar la **Ley 34/2002 (LSSI)** y la normativa de servicios digitales (DSA).
- Revisar y corregir manualmente los artículos con guiones o numeración partida.
- Añadir un índice de artículos por tema (violencia digital, datos, prueba, etc.).
