'use client'
import { useState } from 'react'
import Juez from '../../components/Juez'
import useJuego from '../../components/useJuego'

export default function Historia() {
  const { datos, error } = useJuego('historia')
  const [id, setId] = useState(null)

  if (error) return <p className="error">{error}</p>
  if (!datos) return <p>Cargando…</p>

  const actual = id ?? datos.inicio
  const escena = datos.escenas[actual]

  return (
    <section className="juego">
      <h1>📖 Modo historia</h1>
      <Juez>{escena.texto}</Juez>
      {escena.final ? (
        <div className={`resultado ${escena.bien ? 'ok' : 'ko'}`}>
          {escena.bien ? '🏆 ¡Final feliz!' : '⚖️ ¡Ups! Inténtalo otra vez'}
          <button className="btn" onClick={() => setId(null)}>Volver a empezar</button>
        </div>
      ) : (
        <div className="opciones">
          {escena.opciones.map(o => (
            <button key={o.texto} className="opcion" onClick={() => setId(o.va_a)}>{o.texto}</button>
          ))}
        </div>
      )}
    </section>
  )
}
