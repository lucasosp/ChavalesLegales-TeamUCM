'use client'

import { useState } from 'react'
import Link from 'next/link'
import Juez from '../../components/Juez'
import useJuego from '../../components/useJuego'

export default function Cooperativo() {
  const { datos, error } = useJuego('cooperativo')
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [equipo, setEquipo] = useState(0)

  if (error) {
    return (
      <div className="game-subpage-container">
        <header className="subpage-topbar">
          <Link href="/profesores" className="btn-back-home">
            ← Profesores
          </Link>
        </header>
        <section className="juego">
          <p className="error">{error}</p>
        </section>
      </div>
    )
  }

  if (!datos) {
    return (
      <div className="game-subpage-container">
        <header className="subpage-topbar">
          <Link href="/profesores" className="btn-back-home">
            ← Profesores
          </Link>
        </header>
        <section className="juego">
          <p>Cargando cooperativo…</p>
        </section>
      </div>
    )
  }

  if (i >= datos.length) {
    return (
      <div className="game-subpage-container">
        <header className="subpage-topbar">
          <Link href="/profesores" className="btn-back-home">
            ← Profesores
          </Link>
        </header>
        <main className="juego" style={{ textAlign: 'center' }}>
          <h1>🤝 Cooperativo</h1>
          <Juez>
            ¡Equipo, habéis conseguido {equipo} de {datos.length} escudos! Juntos sois más fuertes.
          </Juez>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setI(0)
                setEquipo(0)
                setElegida(null)
              }}
            >
              Jugar otra vez
            </button>
            <Link
              href="/profesores"
              className="btn"
              style={{ background: 'var(--verde)', color: '#fff', textDecoration: 'none' }}
            >
              Volver a profesores
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const c = datos[i]
  const jugador = (i % 2) + 1
  const responder = (n) => {
    if (elegida !== null) return
    setElegida(n)
    if (n === c.correcta) setEquipo(equipo + 1)
  }

  return (
    <div className="game-subpage-container">
      <header className="subpage-topbar">
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link href="/profesores" className="btn-back-home">
            ← Apartado de profesores
          </Link>
          <Link href="/" className="btn-back-home" style={{ opacity: 0.85 }}>
            Inicio
          </Link>
        </div>
      </header>

      <main className="juego">
        <h1>
          🤝 Cooperativo <small>🛡️ {equipo}</small>
        </h1>
        <p className={`turno j${jugador}`}>Turno del Jugador {jugador} (el otro puede ayudar)</p>
        <Juez>{c.caso} ¿Qué hacemos?</Juez>
        <div className="opciones">
          {c.opciones.map((o, n) => (
            <button
              key={o}
              type="button"
              onClick={() => responder(n)}
              className={`opcion ${elegida !== null && n === c.correcta ? 'ok' : ''} ${elegida === n && n !== c.correcta ? 'ko' : ''}`}
            >
              {o}
            </button>
          ))}
        </div>
        {elegida !== null && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setI(i + 1)
              setElegida(null)
            }}
          >
            Pasar turno →
          </button>
        )}
      </main>
    </div>
  )
}
