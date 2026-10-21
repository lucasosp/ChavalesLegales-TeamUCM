'use client'

import { useState } from 'react'
import Link from 'next/link'
import Juez from '../../components/Juez'
import useJuego from '../../components/useJuego'

export default function Historia() {
  const { datos, error } = useJuego('historia')
  const [id, setId] = useState(null)

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
          <p>Cargando historieta interactiva…</p>
        </section>
      </div>
    )
  }

  const actual = id ?? datos.inicio
  const escena = datos.escenas[actual]

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
        <h1>📖 Modo historieta</h1>
        <Juez>{escena.texto}</Juez>

        {escena.final ? (
          <div className={`resultado ${escena.bien ? 'ok' : 'ko'}`}>
            <p style={{ margin: 0, marginBottom: '1rem' }}>
              {escena.bien ? '🏆 ¡Decisión acertada! ¡Final feliz!' : '⚖️ ¡Cuidado con esa decisión! Inténtalo otra vez'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn" onClick={() => setId(null)}>
                Volver a empezar
              </button>
              <Link
                href="/profesores"
                className="btn"
                style={{ background: 'var(--verde)', color: '#fff', textDecoration: 'none' }}
              >
                Volver a profesores
              </Link>
            </div>
          </div>
        ) : (
          <div className="opciones">
            {escena.opciones.map((o) => (
              <button
                key={o.texto}
                type="button"
                className="opcion"
                onClick={() => setId(o.va_a)}
              >
                {o.texto}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
