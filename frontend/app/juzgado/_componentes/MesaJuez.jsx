'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import AQuienAcudir from './AQuienAcudir'
import CasePaper from './CasePaper'
import DniStack from './DniStack'
import LawBookModal from './LawBookModal'
import Sello, { SELLOS } from './Sello'
import { JudgeArms, LegalinHead } from './LegalinJuez'
import { Confeti } from './Particulas'

const DIFICULTAD = { facil: '🟢 Fácil', medio: '🟡 Medio', dificil: '🔴 Difícil' }
const VUELTA_REPOSO = 700 // ms que la mano se queda en lo pulsado
// La mesa se diseña con un alto fijo y se escala para caber en la ventana; a lo ancho se
// estira hasta cubrir la mitad del hueco libre a cada lado (el papel central no cambia de forma).
const ALTO_BASE = 900
const ANCHO_BASE = 1100 // ancho mínimo de diseño
const HOLGURA_SOMBRA = 14 // px reservados para el canto 3D inferior

// Pasos del tutorial: zonas que se iluminan y a cuál apunta la mano de Legalín.
const PASOS_TUTORIAL = [
  { zonas: ['mesa__dni'], apunta: 'mesa__dni' },
  { zonas: ['mesa__ilegal', 'mesa__legal', 'mesa__falta'], apunta: 'mesa__legal' },
  { zonas: ['mesa__libro'], apunta: 'mesa__libro' },
  { zonas: ['mesa__ayuda'], apunta: 'mesa__ayuda' },
]

// Mesa del juez vista desde arriba. Componente de presentación: el estado del
// juego vive en la página; aquí se gestiona hacia dónde estira Legalín la mano
// y el tutorial del primer caso.
export default function MesaJuez({ config, caso, puntos, fallos, racha, people, nuevaFicha, docRecibido,
  revealedDocsCount, onPedirDoc, recurso, onRecurso, avisarRecurso, marca, mazazoId, onSellar, tutorial, onFinTutorial }) {
  const marcoRef = useRef(null)
  const mesaRef = useRef(null)
  const [base, setBase] = useState(null) // { s, w, x, y }: escala, ancho de diseño y posición
  const papelRef = useRef(null)
  const [tam, setTam] = useState(null)
  const [alcance, setAlcance] = useState(null)
  const [mazazo, setMazazo] = useState(null)
  const [paso, setPaso] = useState(0)

  // Escala para que la mesa ocupe todo el hueco sin bajar del tamaño de diseño.
  useLayoutEffect(() => {
    const medir = () => {
      const W = marcoRef.current.clientWidth, H = marcoRef.current.clientHeight - HOLGURA_SOMBRA
      const s = Math.min(H / ALTO_BASE, W / ANCHO_BASE)
      const hueco = Math.max(0, W - ANCHO_BASE * s)  // espacio libre total a los lados
      const ancho = ANCHO_BASE * s + hueco / 2       // ocupa la mitad del hueco de cada lado
      setBase({ s, w: ancho / s, x: (W - ancho) / 2, y: (H - ALTO_BASE * s) / 2 })
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(marcoRef.current)
    return () => ro.disconnect()
  }, [ALTO_BASE, ANCHO_BASE]) // eslint-disable-line react-hooks/exhaustive-deps -- recalcula si cambian las medidas (recarga en caliente)

  useLayoutEffect(() => {
    const medir = () => setTam({ ancho: mesaRef.current.clientWidth, alto: mesaRef.current.clientHeight })
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(mesaRef.current)
    return () => ro.disconnect()
  }, [])

  const centroDe = el => {
    const m = mesaRef.current.getBoundingClientRect(), r = el.getBoundingClientRect(), s = m.width / mesaRef.current.offsetWidth
    return { x: (r.left - m.left + r.width / 2) / s, y: (r.top - m.top + r.height / 2) / s }
  }

  // reachTo(x, y): estira la mano del lado más cercano hacia un punto de la mesa.
  // Con `fijo` la mano se queda señalando (tutorial) en vez de volver a reposo.
  const reachTo = (x, y, fijo = false) => {
    setAlcance({ x, y, lado: x < tam.ancho / 2 ? 'izq' : 'der', fijo, t: Date.now() })
  }
  useEffect(() => {
    if (!alcance || alcance.fijo) return
    const t = setTimeout(() => setAlcance(null), VUELTA_REPOSO)
    return () => clearTimeout(t)
  }, [alcance])

  // Mazazo en el centro del papel cuando la página lo pide (veredicto correcto).
  useEffect(() => {
    if (mazazoId == null) return setMazazo(null)
    const m = mesaRef.current.getBoundingClientRect(), p = papelRef.current.getBoundingClientRect(), s = m.width / mesaRef.current.offsetWidth
    setMazazo({ id: mazazoId, x: (p.left - m.left + p.width / 2) / s, y: (p.top - m.top + p.height * 0.4) / s })
  }, [mazazoId])

  // Tutorial: ilumina las zonas del paso y Legalín las señala con la mano.
  useEffect(() => {
    if (!tutorial || !tam) return
    const { zonas, apunta } = PASOS_TUTORIAL[paso]
    const mesa = mesaRef.current
    zonas.forEach(z => mesa.querySelector(`.${z}`)?.classList.add('jz-foco'))
    const { x, y } = centroDe(mesa.querySelector(`.${apunta}`))
    reachTo(x, y, true)
    return () => zonas.forEach(z => mesa.querySelector(`.${z}`)?.classList.remove('jz-foco'))
  }, [tutorial, paso, tam]) // eslint-disable-line react-hooks/exhaustive-deps

  const terminarTutorial = () => { setAlcance(null); setPaso(0); onFinTutorial() }

  const alPulsar = e => {
    const el = e.target.closest('[data-alcance]')
    if (tutorial || !el || !tam || !mesaRef.current.contains(el)) return
    const { x, y } = centroDe(el)
    reachTo(x, y)
  }

  const tema = config.temas.find(t => t.id === caso.topic)
  const faltaRecurso = caso.requiresJusticeInfo && !recurso
  const soltar = tipo => { if (SELLOS[tipo]) onSellar(tipo) }
  const mira = alcance && tam ? Math.max(-1, Math.min(1, (alcance.x - tam.ancho / 2) / (tam.ancho / 2))) : 0

  return (
    <div className="mesa-marco" ref={marcoRef}>
    <div className="mesa" ref={mesaRef} onPointerDownCapture={alPulsar}
      style={base ? { width: base.w, height: ALTO_BASE, left: base.x, top: base.y, transform: `scale(${base.s})` } : { visibility: 'hidden' }}>
      <div className="mesa__nota">
        <b>Caso {caso.indice + 1} / {caso.total}</b>
        <span>{tema?.emoji} {tema?.nombre}</span>
        <span>{DIFICULTAD[caso.difficulty]}</span>
        <span className="mesa__puntos">⭐ {puntos}{fallos > 0 && <small> · −{fallos}</small>}</span>
        {racha > 0 && <span key={racha} className="mesa__racha" title="Aciertos seguidos a la primera">🔥 Racha {racha}</span>}
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

      {tutorial && (
        <>
          <div className="tutorial-velo" />
          <div className="tutorial" role="dialog" aria-label="Tutorial">
            <img src="/mascota.jpg" alt="Legalín" />
            <div className="tutorial__texto">
              <p>{tutorial[paso]}</p>
              <div className="tutorial__pie">
                <span className="tutorial__puntos">{PASOS_TUTORIAL.map((_, i) => <i key={i} className={i === paso ? 'on' : ''} />)}</span>
                <button className="tutorial__saltar" onClick={terminarTutorial}>Saltar</button>
                <button className="btn" onClick={() => (paso < PASOS_TUTORIAL.length - 1 ? setPaso(paso + 1) : terminarTutorial())}>
                  {paso < PASOS_TUTORIAL.length - 1 ? 'Siguiente →' : '¡A jugar!'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {tam && <JudgeArms ancho={tam.ancho} alto={tam.alto} alcance={alcance} mazazo={mazazo} />}
      {mazazo && <Confeti key={mazazo.id} x={mazazo.x} y={mazazo.y} />}
    </div>
    </div>
  )
}
