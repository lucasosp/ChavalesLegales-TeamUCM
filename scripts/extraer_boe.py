#!/usr/bin/env python
"""CLI de extracción del BOE.

Ejemplos:
    # Descargar la normativa semilla relevante (menores + tecnología):
    python scripts/extraer_boe.py --relevantes

    # Descargar disposiciones concretas por id:
    python scripts/extraer_boe.py --ids BOE-A-2018-16673 BOE-A-2021-8260

    # Ver qué se publicó un día (sumario):
    python scripts/extraer_boe.py --sumario 20181206

Los resultados se guardan como JSON Lines en data/processed/.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Permite ejecutar el script directamente sin instalar el paquete.
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from chavales_legales.extraccion.boe import ScraperBoe  # noqa: E402
from chavales_legales.extraccion.fuentes_relevantes import (  # noqa: E402
    IDS_RELEVANTES,
)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Extracción de datos del BOE.")
    grupo = parser.add_mutually_exclusive_group(required=True)
    grupo.add_argument(
        "--relevantes",
        action="store_true",
        help="Descarga la normativa semilla sobre menores y tecnología.",
    )
    grupo.add_argument(
        "--ids", nargs="+", metavar="BOE-A-...", help="Ids de disposición a descargar."
    )
    grupo.add_argument(
        "--sumario", metavar="AAAAMMDD", help="Muestra el sumario de un día."
    )
    parser.add_argument(
        "--salida",
        default="boe",
        help="Nombre base del archivo .jsonl de salida (por defecto: boe).",
    )
    args = parser.parse_args(argv)

    scraper = ScraperBoe()

    if args.sumario:
        for item in scraper.obtener_sumario(args.sumario):
            print(f"{item['id']}\t{item['titulo'][:90]}")
        return 0

    ids = IDS_RELEVANTES if args.relevantes else args.ids
    sentencias = scraper.recolectar(ids)
    if sentencias:
        destino = scraper.guardar(sentencias, args.salida)
        print(f"\nGuardadas {len(sentencias)} disposiciones en {destino}")
    else:
        print("No se extrajo ninguna disposición.")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
