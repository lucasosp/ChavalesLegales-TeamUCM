"""Tests para la lógica de salas multijugador estilo Kahoot."""
import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from rooms import RoomManager, RoomState
from fastapi.testclient import TestClient
from main import app


@pytest.mark.asyncio
async def test_crear_sala_y_unir_alumnos():
    manager = RoomManager()
    room = await manager.create_room(modo="juicio", question_duration=30)
    assert len(room.pin) == 6
    assert room.state == RoomState.LOBBY
    assert len(room.items) > 0

    # Unir un alumno
    p1 = await manager.join_player(room.pin, "Mateo G.")
    assert p1 is not None
    assert p1.nickname == "Mateo G."
    assert p1.seat_index == 0
    assert p1.score == 0

    # Unir un segundo alumno con pupitre diferente
    p2 = await manager.join_player(room.pin, "Sofía R.")
    assert p2 is not None
    assert p2.seat_index == 1
    assert p2.id != p1.id


@pytest.mark.asyncio
async def test_flujo_completo_partida_y_puntuacion():
    manager = RoomManager()
    room = await manager.create_room(modo="preguntas", question_duration=30)
    p1 = await manager.join_player(room.pin, "Alumno Veloz")
    p2 = await manager.join_player(room.pin, "Alumno Fallo")

    # Iniciar partida
    await manager.start_game(room)
    assert room.state == RoomState.QUESTION

    # Verificar que el payload del jugador en QUESTION NO contiene 'correcta'
    player_payload = manager._build_player_payload(room, p1.id)
    assert "correcta" not in player_payload["item"]

    # Alumno 1 responde la correcta
    correct_idx = room.current_item["correcta"]
    wrong_idx = (correct_idx + 1) % len(room.current_item["opciones"])

    ok1 = await manager.submit_answer(room, p1.id, correct_idx)
    assert ok1 is True
    assert p1.score > 0
    assert p1.streak == 1

    # Alumno 2 responde incorrecta
    ok2 = await manager.submit_answer(room, p2.id, wrong_idx)
    assert ok2 is True
    assert p2.score == 0
    assert p2.streak == 0

    # Revelar
    await manager.reveal_question(room)
    assert room.state == RoomState.REVEAL

    # Verificar que el payload en REVEAL ahora sí incluye la respuesta correcta y veredicto
    player_payload_reveal = manager._build_player_payload(room, p1.id)
    assert player_payload_reveal["item"]["correcta"] == correct_idx
    assert player_payload_reveal["player"]["is_correct"] is True

    # Clasificación
    await manager.show_leaderboard(room)
    assert room.state == RoomState.LEADERBOARD
    leaderboard = room.get_leaderboard()
    assert leaderboard[0]["id"] == p1.id


def test_endpoints_rest_salas():
    client = TestClient(app)

    # Crear sala
    res_crear = client.post("/api/salas", json={"modo": "juicio", "tiempo_pregunta": 30})
    assert res_crear.status_code == 200
    data_crear = res_crear.json()
    pin = data_crear["pin"]
    assert len(pin) == 6

    # Consultar sala
    res_info = client.get(f"/api/salas/{pin}")
    assert res_info.status_code == 200
    assert res_info.json()["is_open"] is True

    # Unirse a sala
    res_join = client.post(f"/api/salas/{pin}/join", json={"nickname": "Lucía M."})
    assert res_join.status_code == 200
    join_data = res_join.json()
    assert join_data["nickname"] == "Lucía M."
    assert "player_id" in join_data

    # Test WebSocket Host y Player
    token = data_crear["host_token"]
    player_id = join_data["player_id"]

    with client.websocket_connect(f"/ws/host/{pin}?token={token}") as host_ws:
        initial_host_state = host_ws.receive_json()
        assert initial_host_state["event"] == "ROOM_STATE"
        assert initial_host_state["state"] == "LOBBY"

        with client.websocket_connect(f"/ws/player/{pin}?player_id={player_id}") as player_ws:
            initial_player_state = player_ws.receive_json()
            assert initial_player_state["event"] == "ROOM_STATE"
            assert initial_player_state["player"]["nickname"] == "Lucía M."

            # El host recibe la notificación de que el alumno se ha conectado en vivo
            host_update = host_ws.receive_json()
            assert host_update["event"] == "ROOM_STATE"
            assert host_update["players"][0]["isConnected"] is True

            # Host inicia partida
            host_ws.send_json({"action": "START_GAME"})
            game_host_state = host_ws.receive_json()
            assert game_host_state["state"] == "QUESTION"

            game_player_state = player_ws.receive_json()
            assert game_player_state["state"] == "QUESTION"
            assert "correcta" not in game_player_state["item"]

            # Alumno responde
            player_ws.send_json({"action": "SUBMIT_ANSWER", "answer_index": 0})
            confirm = player_ws.receive_json()
            assert confirm["event"] == "ANSWER_CONFIRMED"


@pytest.mark.asyncio
async def test_modo_historieta_y_players_en_lobby():
    manager = RoomManager()
    room = await manager.create_room(modo="historieta", question_duration=30)
    assert len(room.items) > 0
    assert "Historieta" in room.items[0]["titulo"]

    # Alumno se une y verifica que recibe la lista de alumnos en el lobby
    p = await manager.join_player(room.pin, "Alumno Historieta")
    player_payload = manager._build_player_payload(room, p.id)
    assert player_payload["state"] == "LOBBY"
    assert "players" in player_payload
    assert len(player_payload["players"]) == 1
    assert player_payload["players"][0]["nombre"] == "Alumno Historieta"

    # Iniciar partida en modo historieta
    await manager.start_game(room, modo="historieta")
    assert room.state == RoomState.QUESTION
    assert room.modo == "historieta"

