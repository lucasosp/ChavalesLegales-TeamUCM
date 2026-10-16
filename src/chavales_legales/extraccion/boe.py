"""Extracción del BOE (Boletín Oficial del Estado) — datos abiertos.

El BOE ofrece datos abiertos y es la fuente MÁS fiable para automatizar:

1. XML de cada disposición (legislación consolidada / diario):
       https://www.boe.es/diario_boe/xml.php?id=BOE-A-AAAA-NNNN
   Devuelve <documento> con <metadatos>, <analisis><materias> y <texto>.

2. Sumario de un día concreto (API JSON de datos abiertos):
       https://www.boe.es/datosabiertos/api/boe/sumario/AAAAMMDD
   Permite descubrir qué se publicó ese día e ir a por sus disposiciones.

Ambos endpoints están verificados en vivo. Se usa `xml.etree` (biblioteca
estándar), así que no hace falta `lxml`.
"""

from __future__ import annotations

import xml.etree.ElementTree as ET

from ..modelos import Sentencia
from .base import ScraperBase

URL_XML = "https://www.boe.es/diario_boe/xml.php"
URL_SUMARIO = "https://www.boe.es/datosabiertos/api/boe/sumario/{fecha}"


class ScraperBoe(ScraperBase):
    fuente = "boe"

    # -- Disposición individual -------------------------------------------

    def obtener_disposicion(self, boe_id: str) -> Sentencia | None:
        """Descarga y normaliza una disposición del BOE por su id.

        Args:
            boe_id: identificador, p. ej. "BOE-A-2018-16673" (LOPDGDD).

        Returns:
            Una `Sentencia` normalizada, o None si no se pudo obtener.
        """
        try:
            resp = self._get(URL_XML, params={"id": boe_id})
        except Exception as exc:  # noqa: BLE001 - se registra y se devuelve None.
            self.log.error("No se pudo descargar %s: %s", boe_id, exc)
            return None

        try:
            raiz = ET.fromstring(resp.content)
        except ET.ParseError as exc:
            self.log.error("XML inválido para %s: %s", boe_id, exc)
            return None

        meta = raiz.find("metadatos")
        titulo = self._texto(meta, "titulo") or boe_id
        materias = [
            m.text.strip()
            for m in raiz.findall(".//analisis/materias/materia")
            if m.text
        ]
        nodo_texto = raiz.find("texto")
        texto = ""
        if nodo_texto is not None:
            parrafos = [p.text.strip() for p in nodo_texto.findall(".//p") if p.text]
            texto = "\n".join(parrafos)

        return Sentencia(
            id=boe_id,
            fuente=self.fuente,
            titulo=titulo,
            organo=self._texto(meta, "departamento"),
            fecha=self._fecha_iso(self._texto(meta, "fecha_disposicion")),
            url=self._texto(meta, "url_eli") or f"{URL_XML}?id={boe_id}",
            texto=texto,
            materias=materias,
            metadatos={
                "rango": self._texto(meta, "rango"),
                "numero_oficial": self._texto(meta, "numero_oficial"),
                "url_pdf": self._texto(meta, "url_pdf"),
            },
        )

    def recolectar(self, ids: list[str]) -> list[Sentencia]:
        """Descarga y normaliza una lista de disposiciones por sus ids."""
        resultados: list[Sentencia] = []
        for boe_id in ids:
            s = self.obtener_disposicion(boe_id)
            if s is not None:
                resultados.append(s)
                self.log.info("OK %s — %s", boe_id, s.titulo[:60])
        return resultados

    # -- Descubrimiento por sumario diario --------------------------------

    def obtener_sumario(self, fecha: str) -> list[dict]:
        """Devuelve las disposiciones publicadas un día (API JSON de sumario).

        Args:
            fecha: día en formato AAAAMMDD, p. ej. "20181206".

        Returns:
            Lista de dicts {id, titulo, seccion} de las disposiciones del día.
        """
        try:
            resp = self._get(
                URL_SUMARIO.format(fecha=fecha),
                headers={"Accept": "application/json"},
            )
            datos = resp.json()
        except Exception as exc:  # noqa: BLE001
            self.log.error("No se pudo obtener el sumario de %s: %s", fecha, exc)
            return []

        items: list[dict] = []
        sumario = datos.get("data", {}).get("sumario", {})
        for diario in _como_lista(sumario.get("diario")):
            for seccion in _como_lista(diario.get("seccion")):
                items.extend(_items_de_seccion(seccion))
        self.log.info("Sumario %s: %d disposiciones", fecha, len(items))
        return items

    def buscar(self, consulta: str, limite: int = 20) -> list[Sentencia]:
        """Interfaz homogénea con el resto de scrapers (no soportada en BOE).

        La búsqueda libre por texto del BOE no está en la API de datos
        abiertos; usa `obtener_disposicion()`, `recolectar()` u `obtener_sumario()`.
        """
        self.log.warning(
            "BOE no ofrece búsqueda libre por API; usa recolectar(ids) o "
            "obtener_sumario(fecha)."
        )
        return []

    # -- Utilidades -------------------------------------------------------

    @staticmethod
    def _texto(nodo, etiqueta: str) -> str:
        if nodo is None:
            return ""
        hijo = nodo.find(etiqueta)
        return (hijo.text or "").strip() if hijo is not None else ""

    @staticmethod
    def _fecha_iso(aaaammdd: str) -> str | None:
        if len(aaaammdd) == 8 and aaaammdd.isdigit():
            return f"{aaaammdd[:4]}-{aaaammdd[4:6]}-{aaaammdd[6:]}"
        return None


def _como_lista(valor) -> list:
    """El JSON del BOE usa objeto cuando hay 1 elemento y lista cuando hay varios."""
    if valor is None:
        return []
    return valor if isinstance(valor, list) else [valor]


def _items_de_seccion(seccion: dict) -> list[dict]:
    items: list[dict] = []
    nombre_seccion = seccion.get("nombre", "")
    # La jerarquía del sumario es: seccion > (departamento > epigrafe)? > item.
    for departamento in _como_lista(seccion.get("departamento")):
        epigrafes = _como_lista(departamento.get("epigrafe")) or [departamento]
        for epigrafe in epigrafes:
            for item in _como_lista(epigrafe.get("item")):
                items.append(
                    {
                        "id": item.get("identificador", ""),
                        "titulo": item.get("titulo", ""),
                        "seccion": nombre_seccion,
                    }
                )
    return items
