"""Tests del juego «Juzgado de Legalín» (backend/juzgado)."""
import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from main import app  # noqa: E402
from juzgado.casos_mock import CASOS_MOCK  # noqa: E402
from juzgado.partidas import crear_partida, siguiente, verificar  # noqa: E402
from juzgado.textos import adaptar_texto, pildoras_ayuda  # noqa: E402

SOLUCIONES = ("isLegal", "expectedJusticeResource", "missingInfo", "explanation", "hint")


def caso(id_):
    return next(c for c in CASOS_MOCK if c["id"] == id_)


def test_caso_publico_no_revela_soluciones_y_trae_tres_opciones():
    p = crear_partida(11, [caso("mock-despl-2")])
    publico = siguiente(p)["caso"]
    assert not any(k in publico for k in SOLUCIONES)
    ids = [o["id"] for o in publico["resourceOptions"]]
    assert len(ids) == 3 and len(set(ids)) == 3 and "juzgado_guardia" in ids


def test_falta_info_flujo_completo():
    p = crear_partida(11, [caso("mock-despl-2")])
    # Dictar sentencia sin la información que falta penaliza.
    r = verificar(p, "ilegal", "juzgado_guardia")
    assert r["tipo"] == "falta_pendiente" and r["fallos"] == 1
    # Sellar «Falta información» entrega el documento sin penalizar.
    r = verificar(p, "falta_info", None)
    assert r["tipo"] == "falta_ok" and r["revelado"]["document"]["docTitle"] == "Sentencia de separación"
    assert r["fallos"] == 1
    # Volver a sellarlo ya no tiene sentido.
    assert verificar(p, "falta_info", None)["tipo"] == "nada_falta"
    r = verificar(p, "ilegal", "juzgado_guardia")
    assert r["tipo"] == "correcto" and r["estrellas"] == 1 and r["finPartida"]
    assert siguiente(p)["fin"]
    with pytest.raises(ValueError):
        verificar(p, "ilegal", "juzgado_guardia")


def test_racha_de_tres_da_estrella_extra_y_un_fallo_la_rompe():
    p = crear_partida(9, [caso("mock-despl-1"), caso("mock-ciber-1"), caso("mock-auto-1"), caso("mock-despl-2")])
    assert verificar(p, "legal", None)["racha"] == 1
    assert verificar(p, "ilegal", None)["racha"] == 2
    r = verificar(p, "ilegal", None)
    assert r["racha"] == 3 and r["bonus"] == 1 and r["puntos"] == 10 and "🔥" in r["mensaje"]
    r = verificar(p, "legal", "juzgado_guardia")  # falta información: es un fallo
    assert r["racha"] == 0 and r["mejorRacha"] == 3
    assert siguiente(p)["mejorRacha"] == 3


def test_partida_por_http():
    c = TestClient(app)
    inicio = c.post("/api/cases/start", json={"edad": 9, "temas": ["desplazamiento_familiar"], "n": 3}).json()
    pid = inicio["partidaId"]
    assert inicio["total"] == 2
    primero = c.get("/api/cases/next", params={"partida": pid}).json()["caso"]
    assert primero["id"] == "mock-despl-1" and primero["resourceOptions"] == []
    r = c.post("/api/cases/verify", json={"partidaId": pid, "sello": "ilegal"}).json()
    assert r["tipo"] == "incorrecto" and not r["veredictoOk"]
    r = c.post("/api/cases/verify", json={"partidaId": pid, "sello": "legal"}).json()
    assert r["estrellas"] == 2 and not r["finPartida"]
    assert c.get("/api/cases/next", params={"partida": pid}).json()["caso"]["indice"] == 1
    assert c.get("/api/cases/next", params={"partida": "no-existe"}).status_code == 404


def test_adaptacion_por_edad():
    texto = "Primera frase. Segunda frase. Tercera frase."
    assert adaptar_texto(texto, 8) == "Primera frase."
    assert adaptar_texto(texto, 11) == "Primera frase. Segunda frase."
    assert len(pildoras_ayuda(8)) == 2 and len(pildoras_ayuda(15)) == 3
