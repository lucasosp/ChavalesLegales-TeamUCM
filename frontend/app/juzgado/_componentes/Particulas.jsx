'use client'
import { useMemo } from 'react'

// Partículas con CSS: cada pieza lleva su destino en variables (--dx, --dy, --giro).

// Salpicadura de tinta del color del sello alrededor de la marca del papel.
export function Salpicadura({ tipo }) {
  const gotas = useMemo(() => Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2 + Math.random() * 0.5
    const d = 80 + Math.random() * 90
    return { dx: Math.cos(a) * d, dy: Math.sin(a) * d * 0.65, t: 9 + Math.random() * 14, r: Math.random() * 360 }
  }), [])
  return (
    <span className={`salpicadura salpicadura--${tipo}`} aria-hidden="true">
      {gotas.map((g, i) => (
        <i key={i} style={{ '--dx': `${g.dx}px`, '--dy': `${g.dy}px`, '--r': `${g.r}deg`, width: g.t, height: g.t * 0.8 }} />
      ))}
    </span>
  )
}

const COLORES = ['#FFC800', '#58CC02', '#FF4B4B', '#1CB0F6', '#FF9600', '#CE82FF']

// Confeti de estrellas que salta desde el punto del mazazo.
export function Confeti({ x, y }) {
  const piezas = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    dx: (Math.random() - 0.5) * 380,
    dy: -60 - Math.random() * 140,
    giro: (Math.random() - 0.5) * 720,
    color: COLORES[i % COLORES.length],
    estrella: i % 3 !== 2,
    retraso: Math.random() * 80,
  })), [])
  return (
    <div className="confeti" style={{ left: x, top: y }} aria-hidden="true">
      {piezas.map((p, i) => (
        <i key={i} className={p.estrella ? 'estrella' : 'tira'}
          style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--giro': `${p.giro}deg`, color: p.color, background: p.estrella ? 'none' : p.color, animationDelay: `${450 + p.retraso}ms` }}>
          {p.estrella ? '★' : ''}
        </i>
      ))}
    </div>
  )
}
