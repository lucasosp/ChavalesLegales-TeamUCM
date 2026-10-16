"""Tests offline del parseo del BOE (sin tocar la red)."""

from chavales_legales.extraccion.boe import (
    ScraperBoe,
    _como_lista,
    _items_de_seccion,
)


def test_fecha_iso_valida():
    assert ScraperBoe._fecha_iso("20210604") == "2021-06-04"


def test_fecha_iso_invalida():
    assert ScraperBoe._fecha_iso("") is None
    assert ScraperBoe._fecha_iso("2021") is None


def test_como_lista_normaliza():
    assert _como_lista(None) == []
    assert _como_lista({"a": 1}) == [{"a": 1}]
    assert _como_lista([1, 2]) == [1, 2]


def test_items_de_seccion_un_item():
    seccion = {
        "nombre": "I. Disposiciones generales",
        "departamento": {
            "nombre": "Jefatura del Estado",
            "item": {"identificador": "BOE-A-2021-9347", "titulo": "LO 8/2021"},
        },
    }
    items = _items_de_seccion(seccion)
    assert items == [
        {
            "id": "BOE-A-2021-9347",
            "titulo": "LO 8/2021",
            "seccion": "I. Disposiciones generales",
        }
    ]


def test_items_de_seccion_varios_items_y_epigrafes():
    seccion = {
        "nombre": "III. Otras disposiciones",
        "departamento": {
            "epigrafe": [
                {"item": [{"identificador": "A", "titulo": "t1"}]},
                {"item": {"identificador": "B", "titulo": "t2"}},
            ]
        },
    }
    ids = sorted(i["id"] for i in _items_de_seccion(seccion))
    assert ids == ["A", "B"]
