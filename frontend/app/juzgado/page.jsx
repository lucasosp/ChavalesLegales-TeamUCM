'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Juez from './_componentes/Juez'
import Preparacion from './_componentes/Preparacion'
import MesaJuez from './_componentes/MesaJuez'
import ModalLegalin from './_componentes/ModalLegalin'
import { empezarPartida, getCasesConfig, siguienteCaso, verificarSello } from './_componentes/api'

const ESTRELLAS_MAX = 3 // debe coincidir con backend/juzgado/partidas.py
const PAUSA_SELLO = 450 // ms para ver la tinta antes de que hable Legalín
const PAUSA_MAZAZO = 1100 // ms del mazazo al acertar

// Marco de subpágina de la web (fondo y botón de volver), como el resto de juegos.
function Marco({ children }) {
  return (
    <div className="game-subpage-container">
      <header className="subpage-topbar">
        <Link href="/profesores" className="btn-back-home">← Profesores</Link>
      </header>
      {children}
    </div>
  )
}

export default function Juzgado() {
  const [config, setConfig] = useState(null)
  const [error, setError] = useState(null)
  const [fase, setFase] = useState('prep') // prep | cargando | juego | final
  const [aviso, setAviso] = useState(null)

  // Partida: la corrección y la puntuación las lleva el backend (/api/cases/*)
  const [partidaId, setPartidaId] = useState(null)
  const [total, setTotal] = useState(0)
  const [currentCase, setCurrentCase] = useState(null)
  const [score, setScore] = useState(0)
  const [resultados, setResultados] = useState([])

  // Estado del caso en la mesa
  const [revealedDocsCount, setRevealedDocsCount] = useState(0)
  const [selectedJusticeResource, setSelectedJusticeResource] = useState('')
  const [feedbackModal, setFeedbackModal] = useState(null)
  const [fallos, setFallos] = useState(0)
  const [marca, setMarca] = useState(null)
  const [revelado, setRevelado] = useState(null) // { person, document } recibido con «Falta información»
  const [avisarRecurso, setAvisarRecurso] = useState(false)
  const [mazazoId, setMazazoId] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => { getCasesConfig().then(setConfig).catch(e => setError(e.message)) }, [])

  if (error) return <Marco><section className="jz-panel"><Juez>¡Ups! {error}</Juez><button className="btn" onClick={() => { setError(null); setFase('prep') }}>Volver a empezar</button></section></Marco>
  if (!config) return <Marco><p className="jz-cargando">Cargando…</p></Marco>

  const reiniciarCaso = () => {
    setRevealedDocsCount(0); setSelectedJusticeResource(''); setFeedbackModal(null)
    setFallos(0); setMarca(null); setRevelado(null); setAvisarRecurso(false); setMazazoId(null)
  }

  const cargarSiguiente = async id => {
    const r = await siguienteCaso(id)
    setScore(r.puntos)
    if (r.fin) return setFase('final')
    setCurrentCase(r.caso); reiniciarCaso(); setFase('juego')
  }

  const empezar = async (edad, temas, n) => {
    setFase('cargando')
    try {
      const r = await empezarPartida(edad, temas, n)
      setPartidaId(r.partidaId); setTotal(r.total); setAviso(r.aviso); setResultados([])
      await cargarSiguiente(r.partidaId)
    } catch (e) {
      setError(e.message)
    }
  }

  if (fase === 'prep') return <Marco><Preparacion config={config} onEmpezar={empezar} /></Marco>

  if (fase === 'cargando') {
    return (
      <Marco>
        <section className="jz-panel">
          <h1>⚖️ Juzgado de <em>Legalín</em></h1>
          <Juez>Estoy preparando los expedientes del juzgado… ¡un momento, que hay mucho papeleo! 🐒📁</Juez>
        </section>
      </Marco>
    )
  }

  if (fase === 'final') {
    const penalizaciones = resultados.reduce((s, r) => s + r.fallos, 0)
    return (
      <Marco>
        <section className="jz-panel">
          <h1>⚖️ Sentencia final</h1>
          <Juez>
            ¡Has conseguido {score} de {total * ESTRELLAS_MAX} estrellas! {penalizaciones === 0 ? '¡Sin un solo fallo, eres un juez de primera!' : `Tuviste ${penalizaciones} intento${penalizaciones > 1 ? 's' : ''} fallido${penalizaciones > 1 ? 's' : ''}, pero lo importante es aprender.`}
          </Juez>
          <ul className="veredicto-resumen">
            {resultados.map((r, i) => (
              <li key={r.id}><span>Caso {i + 1}</span>{'⭐'.repeat(r.estrellas) || '—'}{r.fallos > 0 && <small> · {r.fallos} penalización{r.fallos > 1 ? 'es' : ''}</small>}</li>
            ))}
          </ul>
          <p className="veredicto-ayuda">{config.lineasAyuda}</p>
          <button className="btn" onClick={() => setFase('prep')}>Jugar otra vez</button>
        </section>
      </Marco>
    )
  }

  const people = revelado?.person ? [...currentCase.people, revelado.person] : currentCase.people

  const sellar = async tipo => {
    if (enviando || feedbackModal) return
    if (tipo !== 'falta_info' && currentCase.requiresJusticeInfo && !selectedJusticeResource) {
      setAvisarRecurso(false); requestAnimationFrame(() => setAvisarRecurso(true)) // reinicia la sacudida
      return
    }
    setMarca(tipo); setEnviando(true)
    try {
      const r = await verificarSello(partidaId, tipo, selectedJusticeResource || null)
      setScore(r.puntos); setFallos(r.fallos)
      if (r.revelado) setRevelado(r.revelado)
      if (r.tipo === 'correcto') {
        setResultados([...resultados, { id: currentCase.id, estrellas: r.estrellas, fallos: r.fallos }])
        setMazazoId(Date.now()) // Legalín da el mazazo antes de hablar
      }
      setTimeout(() => setFeedbackModal({ open: true, ...r }), r.tipo === 'correcto' ? PAUSA_MAZAZO : PAUSA_SELLO)
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  const cerrarModal = () => { setFeedbackModal(null); setMarca(null) }

  const siguiente = async () => {
    setFeedbackModal(null)
    try { await cargarSiguiente(partidaId) } catch (e) { setError(e.message) }
  }

  return (
    <Marco>
      <section className="veredicto">
        {aviso && <p className="veredicto-fuente">{aviso}</p>}
        <MesaJuez
          config={config} caso={currentCase} puntos={score} fallos={fallos} people={people}
          nuevaFicha={revelado?.person?.expediente} docRecibido={revelado?.document}
          revealedDocsCount={revealedDocsCount} onPedirDoc={() => setRevealedDocsCount(revealedDocsCount + 1)}
          recurso={selectedJusticeResource} onRecurso={v => { setSelectedJusticeResource(v); setAvisarRecurso(false) }}
          avisarRecurso={avisarRecurso} marca={marca} mazazoId={mazazoId} onSellar={sellar}
        />
        {config.temasSensibles.includes(currentCase.topic) && <p className="veredicto-ayuda">💛 {config.lineasAyuda}</p>}
        {feedbackModal?.open && (
          <ModalLegalin resultado={feedbackModal} esUltimo={feedbackModal.finPartida}
            onCerrar={cerrarModal} onSiguiente={siguiente} />
        )}
      </section>
    </Marco>
  )
}
