'use client'
import { useState } from 'react'
import Juez from '../../components/Juez'
import useJuego from '../../components/useJuego'

export default function Preguntas() {
  const { datos, error } = useJuego('preguntas')
  const [i, setI] = useState(0)
  const [elegida, setElegida] = useState(null)
  const [puntos, setPuntos] = useState(0)

  if (error) return <p className="error">{error}</p>
  if (!datos) return <p>Cargando…</p>

  if (i >= datos.length) {
    return (
      <section className="juego">
        <h1>❓ Preguntas</h1>
        <Juez>¡Has acertado {puntos} de {datos.length}! {puntos === datos.length ? '¡Eres un experto!' : '¡Sigue practicando!'}</Juez>
        <button className="btn" onClick={() => { setI(0); setPuntos(0); setElegida(null) }}>Jugar otra vez</button>
      </section>
    )
  }

  const p = datos[i]
  const responder = n => {
    if (elegida !== null) return
    setElegida(n)
    if (n === p.correcta) setPuntos(puntos + 1)
  }

  return (
    <section className="juego">
      <h1>❓ Preguntas <small>{i + 1}/{datos.length} · ⭐ {puntos}</small></h1>
      <Juez>{elegida === null ? p.pregunta : p.explica}</Juez>
      <div className="opciones">
        {p.opciones.map((o, n) => (
          <button key={o} onClick={() => responder(n)}
            className={`opcion ${elegida !== null && n === p.correcta ? 'ok' : ''} ${elegida === n && n !== p.correcta ? 'ko' : ''}`}>
            {o}
          </button>
        ))}
      </div>
      {elegida !== null && <button className="btn" onClick={() => { setI(i + 1); setElegida(null) }}>Siguiente →</button>}
    </section>
  )
}
