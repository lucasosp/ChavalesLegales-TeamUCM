"""Scraper de CENDOJ (Centro de Documentación Judicial, CGPJ).

CENDOJ es el buscador oficial de jurisprudencia española:
https://www.poderjudicial.es/search/

NOTA (importante para el equipo): el buscador público de CENDOJ no ofrece una
API abierta y protege el acceso automatizado (formularios, sesión, a veces
captcha). Este scraper deja la ESTRUCTURA lista y documentada, pero los
selectores concretos deben ajustarse y probarse contra el HTML real antes de
usarse en serio. Mientras tanto, `buscar()` admite trabajar sobre HTML ya
descargado a mano (parámetro `html`) para desarrollar el parseo sin depender
de la red.
"""

from __future__ import annotations

from bs4 import BeautifulSoup

from ..modelos import Sentencia
from .base import ScraperBase

URL_BUSCADOR = "https://www.poderjudicial.es/search/indexAN.jsp"


class ScraperCendoj(ScraperBase):
    fuente = "cendoj"

    def buscar(
        self,
        consulta: str,
        limite: int = 20,
        html: str | None = None,
    ) -> list[Sentencia]:
        """Busca jurisprudencia por texto (p. ej. "ciberacoso menor").

        Args:
            consulta: términos de búsqueda.
            limite: nº máximo de resultados a devolver.
            html: si se pasa, se parsea ese HTML en lugar de hacer la petición
                  (útil para desarrollar/probar el parseo sin red).
        """
        if html is None:
            self.log.warning(
                "Petición en vivo a CENDOJ no implementada (requiere ajustar el "
                "formulario y gestionar la sesión). Pasa `html=` para parsear."
            )
            return []

        return self._parsear_resultados(html, limite)

    def _parsear_resultados(self, html: str, limite: int) -> list[Sentencia]:
        """Extrae las resoluciones de la página de resultados.

        TODO(equipo): ajustar los selectores a la estructura real de CENDOJ.
        """
        sopa = BeautifulSoup(html, "html.parser")
        resultados: list[Sentencia] = []

        # Placeholder de selector: cada resultado suele ser un bloque con enlace
        # a la resolución y su metainformación (órgano, fecha, ROJ...).
        for bloque in sopa.select(".resultado")[:limite]:
            enlace = bloque.select_one("a")
            resultados.append(
                Sentencia(
                    id=(enlace.get("data-roj") if enlace else "") or "",
                    fuente=self.fuente,
                    titulo=(enlace.get_text(strip=True) if enlace else ""),
                    url=(enlace.get("href") if enlace else "") or "",
                )
            )
        self.log.info("Parseadas %d resoluciones de CENDOJ", len(resultados))
        return resultados
