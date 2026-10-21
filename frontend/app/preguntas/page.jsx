'use client'

import { useState } from 'react'
import Link from 'next/link'
import Juez from '../../components/Juez'
import useJuego from '../../components/useJuego'

export default function Preguntas() {
  const { datos, error } = useJuego('preguntas')
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [puntos, setPuntos] = useState(0)

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
          <p>Cargando preguntas…</p>
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
          <h1>❓ Preguntas</h1>
          <Juez>
            ¡Has acertado {puntos} de {datos.length}!{' '}
            {puntos === datos.length ? '¡Eres un experto legal!' : '¡Sigue practicando!'}
          </Juez>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setI(0)
                setPuntos(0)
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

  const p = datos[i]
  const responder = (n) => {
    if (elegida !== null) return
    setElegida(n)
    if (n === p.correcta) setPuntos(puntos + 1)
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
          ❓ Preguntas <small>{i + 1}/{datos.length} · ⭐ {puntos}</small>
        </h1>
        <Juez>{elegida === null ? p.pregunta : p.explica}</Juez>
        <div className="opciones">
          {p.opciones.map((o, n) => (
            <button
              key={o}
              type="button"
              onClick={() => responder(n)}
              className={`opcion ${elegida !== null && n === p.correcta ? 'ok' : ''} ${elegida === n && n !== p.correcta ? 'ko' : ''}`}
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
            Siguiente →
          </button>
        )}
      </main>
    </div>
  )
}
