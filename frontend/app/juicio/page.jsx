'use client'

import { useState } from 'react'
import Link from 'next/link'
import Juez from '../../components/Juez'
import useJuego from '../../components/useJuego'

export default function ModoJuicio() {
  const { datos, error } = useJuego('juicio')
  const [index, setIndex] = useState(0)
  const [veredicto, setVeredicto] = useState(null)
  const [aciertos, setAciertos] = useState(0)

  if (error) {
    return (
      <div className="game-subpage-container">
        <header className="subpage-topbar">
          <Link href="/profesores" className="btn-back-home">
            ← Profesores
          </Link>
        </header>
        <section className="juego">
          <p className="error">Error al cargar el modo juicio: {error}</p>
        </section>
      </div>
    )
  }

  if (!datos || datos.length === 0) {
    return (
      <div className="game-subpage-container">
        <header className="subpage-topbar">
          <Link href="/profesores" className="btn-back-home">
            ← Profesores
          </Link>
        </header>
        <section className="juego">
          <p>Cargando casos del tribunal digital…</p>
        </section>
      </div>
    )
  }

  // Si se han resuelto todos los casos
  if (index >= datos.length) {
    return (
      <div className="game-subpage-container">
        <header className="subpage-topbar">
          <Link href="/profesores" className="btn-back-home">
            ← Profesores
          </Link>
        </header>
        <main className="juego" style={{ textAlign: 'center' }}>
          <h1>⚖️ Tribunal Digital: Sesión Concluida</h1>
          <Juez>
            {aciertos === datos.length
              ? `¡Veredicto unánime! Habéis resuelto los ${datos.length} casos con pleno conocimiento de la ley. ¡Excelente labor judicial en el aula!`
              : `Habéis resuelto correctamente ${aciertos} de ${datos.length} casos. Conocer nuestros derechos y límites digitales nos protege a todos.`}
          </Juez>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setIndex(0)
                setVeredicto(null)
                setAciertos(0)
              }}
            >
              Juzgar de nuevo
            </button>
            <Link href="/profesores" className="btn" style={{ background: 'var(--verde)', color: '#fff', textDecoration: 'none' }}>
              Volver a profesores
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const casoActual = datos[index]

  const dictarSentencia = (opcionIndex) => {
    if (veredicto !== null) return
    setVeredicto(opcionIndex)
    if (opcionIndex === casoActual.correcta) {
      setAciertos((prev) => prev + 1)
    }
  }

  const siguienteCaso = () => {
    setIndex((prev) => prev + 1)
    setVeredicto(null)
  }

  return (
    <div className="game-subpage-container">
      <header className="subpage-topbar">
        <Link href="/profesores" className="btn-back-home">
          ← Apartado de profesores
        </Link>
      </header>

      <main className="juego">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>⚖️ Modo juicio</h1>
          <span style={{ background: 'rgba(255,255,255,0.15)', padding: '0.4rem 0.9rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--amarillo)' }}>
            Caso {index + 1} de {datos.length} · Aciertos: {aciertos}
          </span>
        </div>

        <div className="juicio-case-card">
          <div className="juicio-case-header">
            <span className="juicio-case-title">{casoActual.titulo}</span>
            {casoActual.articulo && (
              <span className="juicio-case-tag">{casoActual.articulo}</span>
            )}
          </div>
          <div className="juicio-hechos">
            <strong>📋 Hechos expuestos:</strong> {casoActual.hechos}
          </div>
          <div className="juicio-pregunta">
            {casoActual.pregunta}
          </div>
        </div>

        <Juez>
          {veredicto === null
            ? 'Atención a la sala: leed con atención los hechos y deliberad qué veredicto dictamina la ley.'
            : casoActual.sentencia}
        </Juez>

        <div className="opciones">
          {casoActual.opciones.map((opcionTexto, i) => {
            let extraClass = ''
            if (veredicto !== null) {
              if (i === casoActual.correcta) {
                extraClass = 'ok'
              } else if (veredicto === i) {
                extraClass = 'ko'
              }
            }

            return (
              <button
                key={opcionTexto}
                type="button"
                className={`opcion ${extraClass}`}
                onClick={() => dictarSentencia(i)}
                disabled={veredicto !== null}
              >
                <span>{['A', 'B', 'C'][i] || '•'}.</span> {opcionTexto}
              </button>
            )
          })}
        </div>

        {veredicto !== null && (
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={siguienteCaso}>
              {index + 1 < datos.length ? 'Siguiente caso →' : 'Ver veredicto final 🏆'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
