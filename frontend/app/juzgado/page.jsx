'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Juez from './_componentes/Juez'
import Preparacion from './_componentes/Preparacion'
import MesaJuez from './_componentes/MesaJuez'
import ModalLegalin from './_componentes/ModalLegalin'
import BotonSonido from './_componentes/BotonSonido'
import { empezarPartida, getCasesConfig, siguienteCaso, verificarSello } from './_componentes/api'
import { sonar } from './_componentes/sonidos'

const ESTRELLAS_MAX = 3 // debe coincidir con backend/juzgado/partidas.py
const PAUSA_SELLO = 450 // ms para ver la tinta antes de que hable Legalín
const PAUSA_MAZAZO = 1900 // ms del mazazo (y del confeti) antes de que hable Legalín
const GOLPE_MAZO = 420 // ms hasta que el mazo toca el papel (60 % de la animación)
const TUTORIAL_VISTO = 'jz-tutorial-visto'

const franja = edad => (edad <= 9 ? '7-9' : edad <= 12 ? '10-12' : '13-16')
const tutorialVisto = () => { try { return localStorage.getItem(TUTORIAL_VISTO) === '1' } catch { return false } }

// Marco de subpágina de la web (fondo y botón de volver), como el resto de juegos.
function Marco({ children, aviso, pantalla = false }) {
  return (
    <div className={`game-subpage-container ${pantalla ? 'jz-pantalla' : ''}`}>
      <header className="subpage-topbar">
        <Link href="/profesores" className="btn-back-home">← Profesores</Link>
        {aviso && <p className="jz-aviso-barra">{aviso}</p>}
        <BotonSonido />
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
  const [edad, setEdad] = useState(null)
  const [racha, setRacha] = useState(0)
  const [mejorRacha, setMejorRacha] = useState(0)
  const [bonusTotal, setBonusTotal] = useState(0)
  const [tutorial, setTutorial] = useState(false)

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
    setScore(r.puntos); setRacha(r.racha); setMejorRacha(r.mejorRacha)
    if (r.fin) return setFase('final')
    setCurrentCase(r.caso); reiniciarCaso(); setFase('juego')
  }

  const empezar = async (edadJugador, temas, n) => {
    setFase('cargando')
    try {
      const r = await empezarPartida(edadJugador, temas, n)
      setPartidaId(r.partidaId); setTotal(r.total); setAviso(r.aviso); setResultados([])
      setEdad(edadJugador); setBonusTotal(0); setTutorial(!tutorialVisto())
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
            ¡Has conseguido {score} estrellas{bonusTotal > 0 && ` (${total * ESTRELLAS_MAX} posibles por casos + ${bonusTotal} extra por rachas)`}! {penalizaciones === 0 ? '¡Sin un solo fallo, eres un juez de primera!' : `Tuviste ${penalizaciones} intento${penalizaciones > 1 ? 's' : ''} fallido${penalizaciones > 1 ? 's' : ''}, pero lo importante es aprender.`}
          </Juez>
          <ul className="veredicto-resumen">
            {resultados.map((r, i) => (
              <li key={r.id}><span>Caso {i + 1}</span>{'⭐'.repeat(r.estrellas) || '—'}{r.fallos > 0 && <small> · {r.fallos} penalización{r.fallos > 1 ? 'es' : ''}</small>}</li>
            ))}
          </ul>
          {mejorRacha > 1 && <p className="jz-mejor-racha">🔥 Mejor racha: {mejorRacha} aciertos seguidos a la primera</p>}
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
    sonar('sello')
    try {
      const r = await verificarSello(partidaId, tipo, selectedJusticeResource || null)
      setScore(r.puntos); setFallos(r.fallos); setRacha(r.racha); setMejorRacha(r.mejorRacha)
      if (r.revelado) setRevelado(r.revelado)
      if (r.tipo === 'correcto') {
        setResultados([...resultados, { id: currentCase.id, estrellas: r.estrellas, fallos: r.fallos }])
        setBonusTotal(bonusTotal + r.bonus)
        setMazazoId(Date.now()) // Legalín da el mazazo antes de hablar
        setTimeout(() => sonar('mazazo'), GOLPE_MAZO)
      }
      setTimeout(() => {
        setFeedbackModal({ open: true, ...r })
        sonar(r.tipo === 'correcto' ? 'acierto' : r.tipo === 'falta_ok' ? 'pista' : 'fallo')
        if (r.bonus) sonar('racha')
      }, r.tipo === 'correcto' ? PAUSA_MAZAZO : PAUSA_SELLO)
    } catch (e) {
      setError(e.message)
    } finally {
      setEnviando(false)
    }
  }

  const cerrarModal = () => { setFeedbackModal(null); setMarca(null) }

  const siguiente = async () => {
    setFeedbackModal(null)
    sonar('pagina')
    try { await cargarSiguiente(partidaId) } catch (e) { setError(e.message) }
  }

  return (
    <Marco aviso={aviso} pantalla>
      <section className="veredicto">
        <MesaJuez
          config={config} caso={currentCase} puntos={score} fallos={fallos} racha={racha} people={people}
          nuevaFicha={revelado?.person?.expediente} docRecibido={revelado?.document}
          revealedDocsCount={revealedDocsCount} onPedirDoc={() => setRevealedDocsCount(revealedDocsCount + 1)}
          recurso={selectedJusticeResource} onRecurso={v => { setSelectedJusticeResource(v); setAvisarRecurso(false); if (v) sonar('carta') }}
          avisarRecurso={avisarRecurso} marca={marca} mazazoId={mazazoId} onSellar={sellar}
          tutorial={tutorial && currentCase.indice === 0 ? config.franjas[franja(edad)].tutorial : null}
          onFinTutorial={() => { setTutorial(false); try { localStorage.setItem(TUTORIAL_VISTO, '1') } catch { /* sin almacenamiento */ } }}
        />
        <p className="jz-aviso-pie">💛 {config.lineasAyuda}</p>
        {feedbackModal?.open && (
          <ModalLegalin resultado={feedbackModal} esUltimo={feedbackModal.finPartida}
            onCerrar={cerrarModal} onSiguiente={siguiente} />
        )}
      </section>
    </Marco>
  )
}
