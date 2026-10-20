'use client'
import { useState } from 'react'
import Juez from '../../components/Juez'
import useJuego from '../../components/useJuego'

export default function Cooperativo() {
  const { datos, error } = useJuego('cooperativo')
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [equipo, setEquipo] = useState(0)

  if (error) return <p className="error">{error}</p>
  if (!datos) return <p>Cargando…</p>

  if (i >= datos.length) {
    return (
      <section className="juego">
        <h1>🤝 Cooperativo</h1>
        <Juez>¡Equipo, habéis conseguido {equipo} de {datos.length} escudos! Juntos sois más fuertes.</Juez>
        <button className="btn" onClick={() => { setI(0); setEquipo(0); setElegida(null) }}>Jugar otra vez</button>
      </section>
    )
  }

  const c = datos[i]
  const jugador = (i % 2) + 1
  const responder = n => {
    if (elegida !== null) return
    setElegida(n)
    if (n === c.correcta) setEquipo(equipo + 1)
  }

  return (
    <section className="juego">
      <h1>🤝 Cooperativo <small>🛡️ {equipo}</small></h1>
      <p className={`turno j${jugador}`}>Turno del Jugador {jugador} (el otro puede ayudar)</p>
      <Juez>{c.caso} ¿Qué hacemos?</Juez>
      <div className="opciones">
        {c.opciones.map((o, n) => (
          <button key={o} onClick={() => responder(n)}
            className={`opcion ${elegida !== null && n === c.correcta ? 'ok' : ''} ${elegida === n && n !== c.correcta ? 'ko' : ''}`}>
            {o}
          </button>
        ))}
      </div>
      {elegida !== null && <button className="btn" onClick={() => { setI(i + 1); setElegida(null) }}>Pasar turno →</button>}
    </section>
  )
}
