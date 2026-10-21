'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import AQuienAcudir from './AQuienAcudir'
import CasePaper from './CasePaper'
import DniStack from './DniStack'
import LawBookModal from './LawBookModal'
import Sello, { SELLOS } from './Sello'
import { JudgeArms, LegalinHead } from './LegalinJuez'

const DIFICULTAD = { facil: '🟢 Fácil', medio: '🟡 Medio', dificil: '🔴 Difícil' }
const VUELTA_REPOSO = 700 // ms que la mano se queda en lo pulsado

// Mesa del juez vista desde arriba. Componente de presentación: el estado del
// juego vive en la página; aquí solo se gestiona hacia dónde estira Legalín la mano.
export default function MesaJuez({ config, caso, puntos, fallos, people, nuevaFicha, docRecibido,
  revealedDocsCount, onPedirDoc, recurso, onRecurso, avisarRecurso, marca, mazazoId, onSellar }) {
  const mesaRef = useRef(null)
  const papelRef = useRef(null)
  const [tam, setTam] = useState(null)
  const [alcance, setAlcance] = useState(null)
  const [mazazo, setMazazo] = useState(null)

  useLayoutEffect(() => {
    const medir = () => setTam({ ancho: mesaRef.current.clientWidth, alto: mesaRef.current.clientHeight })
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(mesaRef.current)
    return () => ro.disconnect()
  }, [])

  // reachTo(x, y): estira la mano del lado más cercano hacia un punto de la mesa.
  const reachTo = (x, y) => {
    setAlcance({ x, y, lado: x < tam.ancho / 2 ? 'izq' : 'der', t: Date.now() })
  }
  useEffect(() => {
    if (!alcance) return
    const t = setTimeout(() => setAlcance(null), VUELTA_REPOSO)
    return () => clearTimeout(t)
  }, [alcance])

  // Mazazo en el centro del papel cuando la página lo pide (veredicto correcto).
  useEffect(() => {
    if (mazazoId == null) return setMazazo(null)
    const m = mesaRef.current.getBoundingClientRect(), p = papelRef.current.getBoundingClientRect()
    setMazazo({ id: mazazoId, x: p.left - m.left + p.width / 2, y: p.top - m.top + p.height * 0.4 })
  }, [mazazoId])

  const alPulsar = e => {
    const el = e.target.closest('[data-alcance]')
    if (!el || !tam || !mesaRef.current.contains(el)) return
    const m = mesaRef.current.getBoundingClientRect(), r = el.getBoundingClientRect()
    reachTo(r.left - m.left + r.width / 2, r.top - m.top + r.height / 2)
  }

  const tema = config.temas.find(t => t.id === caso.topic)
  const faltaRecurso = caso.requiresJusticeInfo && !recurso
  const soltar = tipo => { if (SELLOS[tipo]) onSellar(tipo) }
  const mira = alcance && tam ? Math.max(-1, Math.min(1, (alcance.x - tam.ancho / 2) / (tam.ancho / 2))) : 0

  return (
    <div className="mesa" ref={mesaRef} onPointerDownCapture={alPulsar}>
      <div className="mesa__nota">
        <b>Caso {caso.indice + 1} / {caso.total}</b>
        <span>{tema?.emoji} {tema?.nombre}</span>
        <span>{DIFICULTAD[caso.difficulty]}</span>
        <span className="mesa__puntos">⭐ {puntos}{fallos > 0 && <small> · −{fallos}</small>}</span>
      </div>
      <div className="mesa__falta"><Sello tipo="falta_info" onSellar={onSellar} /></div>
      <div className="mesa__dni"><DniStack people={people} nueva={nuevaFicha} /></div>

      <div className="mesa__ilegal">
        <Sello tipo="ilegal" onSellar={onSellar} bloqueado={faltaRecurso} motivo="Primero lleva una tarjeta a la bandeja" />
      </div>
      <div className="mesa__papel" ref={papelRef}>
        <CasePaper caso={caso} revealedDocsCount={revealedDocsCount} onPedirDoc={onPedirDoc}
          docRecibido={docRecibido} marca={marca} golpe={mazazo} onSoltarSello={soltar} />
      </div>
      <div className="mesa__legal">
        <Sello tipo="legal" onSellar={onSellar} bloqueado={faltaRecurso} motivo="Primero lleva una tarjeta a la bandeja" />
      </div>

      <div className="mesa__ayuda"><AQuienAcudir caso={caso} recurso={recurso} onRecurso={onRecurso} avisar={avisarRecurso} /></div>
      <div className="mesa__cabeza"><LegalinHead mira={mazazo ? 0.3 : mira} /></div>
      <div className="mesa__libro"><LawBookModal key={caso.id} leyes={caso.laws} /></div>

      {tam && <JudgeArms ancho={tam.ancho} alto={tam.alto} alcance={alcance} mazazo={mazazo} />}
    </div>
  )
}
