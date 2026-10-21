"""Script de simulación de sesión multijugador estilo Kahoot.
Prueba la creación de la sala por el profesor y la conexión de varios alumnos por WebSocket.
"""
import asyncio
import json
import contextlib
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from main import app
from fastapi.testclient import TestClient


def wait_for_state(ws, target_state, max_tries=5):
    """Lee mensajes hasta que el estado coincida con el objetivo."""
    for _ in range(max_tries):
        msg = ws.receive_json()
        if msg.get("event") == "ROOM_STATE" and msg.get("state") == target_state:
            return msg
    raise TimeoutError(f"No se alcanzó el estado {target_state}")


def run_session_simulation():
    print("▶️ Iniciando simulación de sesión multijugador...")
    client = TestClient(app)

    # 1. Profesor crea la sala
    res_crear = client.post("/api/salas", json={"modo": "juicio", "tiempo_pregunta": 30})
    assert res_crear.status_code == 200, f"Error al crear sala: {res_crear.text}"
    data_crear = res_crear.json()
    pin = data_crear["pin"]
    token = data_crear["host_token"]
    print(f"✅ Sala creada por el profesor con éxito. PIN: {pin}")

    # 2. Tres alumnos se unen desde el inicio
    alumnos_nombres = ["Mateo G.", "Sofía R.", "Hugo V."]
    alumnos_data = []

    for nom in alumnos_nombres:
        res_join = client.post(f"/api/salas/{pin}/join", json={"nickname": nom})
        assert res_join.status_code == 200, f"Error al unir alumno {nom}: {res_join.text}"
        join_data = res_join.json()
        alumnos_data.append(join_data)
        print(f"✅ Alumno '{nom}' se ha unido a la sala (Pupitre #{join_data['seat_index'] + 1})")

    # 3. Conexiones WebSocket concurrentes usando ExitStack
    with contextlib.ExitStack() as stack:
        host_ws = stack.enter_context(client.websocket_connect(f"/ws/host/{pin}?token={token}"))
        initial_host = host_ws.receive_json()
        assert initial_host["state"] == "LOBBY"
        assert len(initial_host["players"]) == 3
        print("✅ Pantalla de proyección del profesor conectada al WebSocket (LOBBY activo)")

        # Conectar los 3 alumnos
        player_sockets = []
        for a in alumnos_data:
            ws = stack.enter_context(client.websocket_connect(f"/ws/player/{pin}?player_id={a['player_id']}"))
            p_state = ws.receive_json()
            assert p_state["state"] == "LOBBY"
            player_sockets.append((a, ws))
            # El host recibe la notificación de conexión en vivo de cada alumno
            host_update = host_ws.receive_json()
            assert host_update["event"] == "ROOM_STATE"
            print(f"✅ Dispositivo de '{a['nickname']}' conectado en tiempo real")

        # 4. Host inicia la partida
        print("▶️ Profesor pulsa 'Iniciar partida'...")
        host_ws.send_json({"action": "START_GAME"})
        game_host = wait_for_state(host_ws, "QUESTION")
        print(f"✅ Caso 1 proyectado: {game_host['item']['titulo']}")

        # Todos los alumnos reciben la pregunta (¡sin revelar la correcta!)
        for a, ws in player_sockets:
            p_game = wait_for_state(ws, "QUESTION")
            assert "correcta" not in p_game["item"], "¡Fallo de seguridad: 'correcta' no debe enviarse al alumno!"

        print("✅ Seguridad verificada: ningún alumno recibe la respuesta correcta en la fase de votación.")

        # 5. Los alumnos responden
        # Alumno 0 responde la correcta (0)
        a0, ws0 = player_sockets[0]
        ws0.send_json({"action": "SUBMIT_ANSWER", "answer_index": 0})

        # Alumno 1 responde la correcta (0)
        a1, ws1 = player_sockets[1]
        ws1.send_json({"action": "SUBMIT_ANSWER", "answer_index": 0})

        # Alumno 2 responde una errónea (1)
        a2, ws2 = player_sockets[2]
        ws2.send_json({"action": "SUBMIT_ANSWER", "answer_index": 1})
        print("✅ Respuestas enviadas por los alumnos y procesadas por el backend")

        # 6. Profesor revela el veredicto
        print("▶️ Profesor pulsa 'Mostrar veredicto'...")
        host_ws.send_json({"action": "REVEAL"})
        reveal_host = wait_for_state(host_ws, "REVEAL")
        assert "sentencia" in reveal_host["item"]
        print(f"✅ Veredicto revelado: {reveal_host['item']['sentencia'][:60]}...")

        # 7. Profesor muestra clasificación
        print("▶️ Profesor muestra clasificación de la clase...")
        host_ws.send_json({"action": "LEADERBOARD"})
        lead_host = wait_for_state(host_ws, "LEADERBOARD")
        top1 = lead_host["leaderboard"][0]
        print(f"✅ Líder provisional del aula: {top1['nombre']} con {top1['score']} pts")

    print("🎉 ¡Simulación completada con éxito de extremo a extremo!")


if __name__ == "__main__":
    run_session_simulation()
