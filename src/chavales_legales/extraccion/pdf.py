"""Extracción de texto de sentencias en PDF.

Muchas resoluciones de CENDOJ se descargan como PDF. Esta utilidad extrae su
texto para poder analizarlo más adelante.

`pdfplumber` se importa de forma diferida: así el resto del paquete funciona
aunque no esté instalado (solo hace falta si vas a procesar PDFs).
"""

from __future__ import annotations

from pathlib import Path

from ..utils import obtener_logger

log = obtener_logger("extraccion.pdf")


def extraer_texto(ruta_pdf: str | Path) -> str:
    """Devuelve el texto plano de todas las páginas de un PDF."""
    try:
        import pdfplumber
    except ImportError as exc:  # pragma: no cover
        raise ImportError(
            "Falta 'pdfplumber'. Instálalo con: pip install pdfplumber"
        ) from exc

    ruta = Path(ruta_pdf)
    if not ruta.exists():
        raise FileNotFoundError(f"No existe el PDF: {ruta}")

    partes: list[str] = []
    with pdfplumber.open(ruta) as pdf:
        for i, pagina in enumerate(pdf.pages, start=1):
            texto = pagina.extract_text() or ""
            partes.append(texto)
            log.debug("Página %d: %d caracteres", i, len(texto))

    completo = "\n".join(partes)
    log.info("Extraídos %d caracteres de %s", len(completo), ruta.name)
    return completo
