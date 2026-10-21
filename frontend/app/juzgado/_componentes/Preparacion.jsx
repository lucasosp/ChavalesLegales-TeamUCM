'use client'
import { useState } from 'react'
import Juez from './Juez'

const franja = edad => (edad <= 9 ? '7-9' : edad <= 12 ? '10-12' : '13-16')
const EDADES = Array.from({ length: 10 }, (_, i) => i + 7)

// Pantalla previa: edad, temas y número de casos. Legalín explica cómo se juega según la edad.
export default function Preparacion({ config, onEmpezar }) {
  const [edad, setEdad] = useState(null)
  const [temas, setTemas] = useState([])
  const [n, setN] = useState(5)

  const disponibles = config.temas.filter(t => edad !== null && edad >= t.minEdad).map(t => t.id)
  const elegidos = temas.filter(t => disponibles.includes(t))
  const alternar = id => setTemas(temas.includes(id) ? temas.filter(t => t !== id) : [...temas, id])
  const elegirEdad = e => {
    setEdad(e)
    // Por defecto, todos los temas disponibles para esa edad.
    setTemas(config.temas.filter(t => e >= t.minEdad).map(t => t.id))
  }

  return (
    <section className="jz-panel veredicto-prep">
      <p className="eyebrow">Reto 2 · Infancia y juventud</p>
      <h1>⚖️ Juzgado de <em>Legalín</em></h1>
      <Juez>
        {edad === null
          ? '¡Bienvenido al juzgado de Legalín! Antes de empezar, dime: ¿cuántos años tienes?'
          : config.franjas[franja(edad)].instrucciones}
      </Juez>

      <h3>1. ¿Cuántos años tienes?</h3>
      <div className="chips">
        {EDADES.map(e => (
          <button key={e} className={`chip ${edad === e ? 'on' : ''}`} onClick={() => elegirEdad(e)}>{e}</button>
        ))}
      </div>

      {edad !== null && (
        <>
          <h3>2. ¿Qué temas quieres juzgar?</h3>
          <div className="chips">
            {config.temas.map(t => {
              const bloqueado = !disponibles.includes(t.id)
              return (
                <button key={t.id} disabled={bloqueado} title={bloqueado ? `A partir de ${t.minEdad} años` : ''}
                  className={`chip ${elegidos.includes(t.id) ? 'on' : ''}`} onClick={() => alternar(t.id)}>
                  {t.emoji} {t.nombre}{bloqueado && <small> · desde {t.minEdad}</small>}
                </button>
              )
            })}
          </div>

          <h3>3. ¿Cuántos casos?</h3>
          <div className="chips">
            {[3, 5, 7, 10].map(v => (
              <button key={v} className={`chip ${n === v ? 'on' : ''}`} onClick={() => setN(v)}>{v} casos</button>
            ))}
          </div>

          <p className="veredicto-fuente">
            {config.iaDisponible ? '🤖 Los casos se crearán con IA para ti.' : '📁 Jugarás con los casos de ejemplo del juzgado.'}
          </p>
          <button className="btn" disabled={!elegidos.length} onClick={() => onEmpezar(edad, elegidos, n)}>
            ¡Abrir el juzgado! →
          </button>
        </>
      )}
    </section>
  )
}
