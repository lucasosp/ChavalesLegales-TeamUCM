'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { getInfoSala, unirseASala } from '../lib/api'
import { getWsBaseUrl, createGameSocket } from '../lib/socket'
import SalaEsperaAlumnos from '../components/SalaEsperaAlumnos'

export default function Home() {
  const [step, setStep] = useState('PIN') // 'PIN' | 'NICKNAME' | 'GAME'
  const [pin, setPin] = useState('')
  const [nickname, setNickname] = useState('')
  const [cargando, setCargando] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const [playerData, setPlayerData] = useState(null)
  const [gameState, setGameState] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [selectedSoloGame, setSelectedSoloGame] = useState(null)
  const socketRef = useRef(null)

  const handleSoloGameSelect = (gameKey) => {
    // De momento no navega; listo para enlazar próximamente (ej. /historia o /juicio)
    setSelectedSoloGame((prev) => (prev === gameKey ? null : gameKey))
  }

  // =========================================================================
  // PASO 1: VALIDAR PIN CON EL BACKEND
  // =========================================================================
  const handlePinSubmit = async (e) => {
    e.preventDefault()
    const cleanPin = pin.replace(/\s+/g, '').trim()
    if (!cleanPin) return

    setCargando(true)
    setErrorMsg(null)
    try {
      const info = await getInfoSala(cleanPin)
      if (!info.is_open) {
        throw new Error('La partida ya ha comenzado en esta sala.')
      }
      setPin(cleanPin)
      setStep('NICKNAME')
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo conectar a la sala con ese PIN.')
    } finally {
      setCargando(false)
    }
  }

  // =========================================================================
  // PASO 2: INTRODUCIR APODO Y UNIRSE EN EL BACKEND
  // =========================================================================
  const handleNicknameSubmit = async (e) => {
    e.preventDefault()
    const cleanNick = nickname.trim()
    if (!cleanNick) return

    setCargando(true)
    setErrorMsg(null)
    try {
      const res = await unirseASala(pin, cleanNick)
      setPlayerData(res)
      setStep('GAME')
    } catch (err) {
      setErrorMsg(err.message || 'Error al entrar en la sala.')
    } finally {
      setCargando(false)
    }
  }

  // =========================================================================
  // PASO 3: CONEXIÓN WEBSOCKET DEL ALUMNO DURANTE LA PARTIDA
  // =========================================================================
  useEffect(() => {
    if (step !== 'GAME' || !playerData || !pin) return

    const wsBase = getWsBaseUrl()
    const wsUrl = `${wsBase}/ws/player/${pin}?player_id=${playerData.player_id}`

    const socket = createGameSocket({
      url: wsUrl,
      onOpen: () => {
        try {
          const guardado = localStorage.getItem('chavales_mi_avatar')
          if (guardado) {
            const avatar = JSON.parse(guardado)
            socket.send('UPDATE_AVATAR', {
              baseType: avatar.baseType,
              colorPelo: avatar.colorPelo,
              colorRopa: avatar.colorRopa,
              tieneGorro: avatar.tieneGorro,
            })
          }
        } catch {}
      },
      onMessage: (data) => {
        if (data.event === 'ROOM_STATE') {
          setGameState(data)
          // Si cambia la fase a QUESTION, resetear selección local
          if (data.state === 'QUESTION' && data.player?.current_answer === null) {
            setSelectedOption(null)
          }
        } else if (data.event === 'ANSWER_CONFIRMED') {
          setSelectedOption(data.answer_index)
        }
      },
      onError: () => {
        setErrorMsg('Error en la conexión en directo con la sala.')
      },
    })

    socketRef.current = socket

    return () => {
      socket.close()
    }
  }, [step, playerData, pin])

  const handleSendAnswer = (index) => {
    if (selectedOption !== null) return
    setSelectedOption(index)
    socketRef.current?.send('SUBMIT_ANSWER', { answer_index: index })
  }

  const handleSalirPartida = () => {
    socketRef.current?.close()
    setStep('PIN')
    setPin('')
    setNickname('')
    setPlayerData(null)
    setGameState(null)
    setSelectedOption(null)
    setErrorMsg(null)
  }

  // =========================================================================
  // VISTA DEL ALUMNO CUANDO ESTÁ DENTRO DEL JUEGO
  // =========================================================================
  if (step === 'GAME') {
    const formattedPin = pin.length === 6 ? `${pin.slice(0, 3)} ${pin.slice(3)}` : pin
    const player = gameState?.player || playerData
    const item = gameState?.item
    const state = gameState?.state || 'LOBBY'

    // La sala de espera que ve cada individuo es la misma que ve el profesor
    if (state === 'LOBBY') {
      const studentList = (gameState?.players && gameState.players.length > 0)
        ? gameState.players
        : (player ? [{
            id: player.id || player.player_id,
            nombre: player.nickname,
            seatIndex: player.seat_index,
            avatarTipo: player.avatar_tipo,
            baseType: player.base_type,
            colorPelo: player.color_pelo,
            colorRopa: player.color_ropa,
            tieneGorro: player.tiene_gorro,
          }] : [])

      return (
        <SalaEsperaAlumnos
          pin={formattedPin}
          cleanPin={pin}
          students={studentList}
          isHost={false}
          currentSeat={player?.seat_index ?? 0}
          roomUrl={`http://localhost:3001/profesores/sala/${pin}`}
          onVolver={handleSalirPartida}
          onUpdateAvatar={(nuevoAvatar) => {
            socketRef.current?.send('UPDATE_AVATAR', {
              baseType: nuevoAvatar.baseType,
              colorPelo: nuevoAvatar.colorPelo,
              colorRopa: nuevoAvatar.colorRopa,
              tieneGorro: nuevoAvatar.tieneGorro,
            })
          }}
        />
      )
    }

    const colores = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981']
    const simbolos = ['▲', '◆', '●', '■']

    return (
      <div className="kahoot-page" style={{ minHeight: '100vh', padding: '16px 12px 30px' }}>
        <style>{`
          .player-hud {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 600px;
            margin: 0 auto 16px;
            background: rgba(255, 255, 255, 0.95);
            border: 3px solid #18181B;
            border-radius: 18px;
            padding: 8px 16px;
            font-weight: 800;
            box-shadow: 0 4px 0 #18181B;
          }
          .player-card {
            max-width: 600px;
            margin: 0 auto;
            background: #FFFFFF;
            border: 4px solid #18181B;
            border-radius: 24px;
            padding: 24px 20px;
            box-shadow: 0 16px 32px rgba(0,0,0,0.3);
            text-align: center;
          }
          .player-btn-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 20px;
          }
          .player-ans-btn {
            border: 3px solid #18181B;
            border-radius: 18px;
            padding: 24px 12px;
            font-size: 24px;
            font-weight: 900;
            color: #FFFFFF;
            box-shadow: 0 6px 0 #18181B;
            cursor: pointer;
            transition: transform 0.1s ease, filter 0.15s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 120px;
          }
          .player-ans-btn:active:not(:disabled) {
            transform: translateY(4px);
            box-shadow: 0 2px 0 #18181B;
          }
          .player-ans-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .player-ans-btn.selected {
            outline: 4px solid #FACC15;
            box-shadow: 0 0 0 6px #18181B;
            transform: scale(0.98);
          }
        `}</style>

        {/* HUD superior del alumno */}
        <div className="player-hud">
          <div>
            <span style={{ color: '#4A1A1C', fontSize: 16 }}>👤 {player?.nickname}</span>
            <span style={{ fontSize: 12, color: '#64748B', display: 'block' }}>
              Pupitre #{((player?.seat_index ?? 0) + 1)} · PIN {formattedPin}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: 18, color: '#16A34A', fontWeight: 900 }}>
              {player?.score ?? 0} pts
            </span>
            <span style={{ fontSize: 12, color: '#64748B', display: 'block' }}>
              Puesto #{player?.rank ?? 1}
            </span>
          </div>
        </div>

        {state === 'QUESTION' && (
          <div className="player-card">
            <span style={{
              background: '#FEF08A',
              color: '#854D0E',
              padding: '4px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
            }}>
              Pregunta {gameState?.current_index + 1} de {gameState?.total_items}
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#18181B', margin: '12px 0 16px' }}>
              {item?.pregunta || '¡Elige tu respuesta en la pantalla!'}
            </h2>

            {selectedOption === null ? (
              <div className="player-btn-grid">
                {item?.opciones?.map((opc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="player-ans-btn"
                    style={{ background: colores[idx % colores.length] }}
                    onClick={() => handleSendAnswer(idx)}
                  >
                    <span>{simbolos[idx % simbolos.length]}</span>
                    <span style={{ fontSize: 14, marginTop: 8 }}>{opc}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div style={{
                background: '#F0FDF4',
                border: '3px solid #16A34A',
                borderRadius: 20,
                padding: '32px 16px',
                marginTop: 16,
              }}>
                <div style={{ fontSize: 40 }}>✅</div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#166534', margin: '8px 0 4px' }}>
                  ¡Respuesta registrada!
                </h3>
                <p style={{ color: '#4B5563', fontSize: 14, margin: 0 }}>
                  Espera a que el profesor revele el veredicto en la pantalla principal.
                </p>
              </div>
            )}
          </div>
        )}

        {(state === 'REVEAL' || state === 'LEADERBOARD') && (
          <div className="player-card">
            {player?.is_correct ? (
              <div style={{
                background: '#DCFCE7',
                border: '3px solid #16A34A',
                borderRadius: 20,
                padding: '24px 16px',
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 44 }}>🎉</div>
                <h2 style={{ color: '#166534', fontSize: 22, fontWeight: 900, margin: '6px 0 2px' }}>
                  ¡Has acertado!
                </h2>
                <p style={{ color: '#15803D', fontWeight: 800, fontSize: 16, margin: 0 }}>
                  ¡Excelente conocimiento de la ley!
                </p>
              </div>
            ) : (
              <div style={{
                background: '#FEE2E2',
                border: '3px solid #DC2626',
                borderRadius: 20,
                padding: '24px 16px',
                marginBottom: 16,
              }}>
                <div style={{ fontSize: 44 }}>❌</div>
                <h2 style={{ color: '#991B1B', fontSize: 22, fontWeight: 900, margin: '6px 0 2px' }}>
                  ¡Vaya, esa no era!
                </h2>
                <p style={{ color: '#B91C1C', fontWeight: 700, fontSize: 14, margin: 0 }}>
                  Atiende a la explicación del profesor en la pantalla.
                </p>
              </div>
            )}

            {item?.sentencia && (
              <div style={{
                background: '#FFFBEB',
                border: '2px solid #F59E0B',
                borderRadius: 14,
                padding: 14,
                textAlign: 'left',
                fontSize: 14,
                color: '#78350F',
                lineHeight: 1.4,
              }}>
                <strong>⚖️ Veredicto legal:</strong> {item.sentencia}
              </div>
            )}

            <div style={{ marginTop: 20, color: '#64748B', fontSize: 14, fontWeight: 700 }}>
              Puesto actual en la clase: <b>#{player?.rank ?? 1}</b> ({player?.score ?? 0} pts)
            </div>
          </div>
        )}

        {state === 'FINISHED' && (
          <div className="player-card">
            <div style={{ fontSize: 54, marginBottom: 8 }}>🏆</div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: '#4A1A1C', margin: '0 0 8px' }}>
              ¡Partida finalizada!
            </h1>
            <p style={{ fontSize: 16, color: '#475569', margin: '0 0 20px' }}>
              Has terminado en el puesto <b>#{player?.rank ?? 1}</b> con <b>{player?.score ?? 0} puntos</b>.
            </p>
            <button
              type="button"
              onClick={handleSalirPartida}
              style={{
                background: '#22C55E',
                color: '#0F172A',
                border: '3px solid #18181B',
                borderRadius: 14,
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 0 #18181B',
              }}
            >
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    )
  }

  // =========================================================================
  // VISTA INICIAL: INTRODUCIR PIN O APODO
  // =========================================================================
  return (
    <div className="kahoot-page">
      {/* Fondo orgánico curvado estilo Kahoot */}
      <div className="kahoot-bg-canvas" aria-hidden="true">
        <div className="bg-wave-left" />
        <div className="bg-arc-right" />
        <div className="bg-sphere-glow" />
        <svg
          className="bg-curved-svg"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-100 200 C300 120 500 500 1000 350 C1250 270 1400 480 1550 420 L1550 1000 L-100 1000 Z"
            fill="var(--granate)"
            fillOpacity="0.45"
          />
          <path
            d="M-50 780 C320 620 680 720 1100 520 C1300 420 1480 460 1600 410 L1600 950 L-50 950 Z"
            fill="var(--verde-oscuro)"
            fillOpacity="0.35"
          />
          <path
            d="M-80 -80 C200 -20 320 220 180 440 C80 580 -40 620 -120 600 Z"
            fill="var(--naranja)"
            fillOpacity="0.22"
          />
          <circle cx="1350" cy="150" r="480" fill="var(--verde)" fillOpacity="0.25" />
          <circle cx="1350" cy="150" r="340" fill="var(--amarillo)" fillOpacity="0.12" />
        </svg>
      </div>

      {/* Acceso a profesores en la barra superior */}
      <header className="kahoot-topbar">
        <Link href="/necesito-ayuda" className="btn-help-access">Necesito ayuda <span aria-hidden="true">→</span></Link>
        <Link
          href="/profesores"
          className="btn-pro-opt1"
          aria-label="Acceso a profesores"
        >
          <span className="pro-icon-chip" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </span>
          <span className="pro-label">Acceso a profesores</span>
          <span className="pro-arrow" aria-hidden="true">→</span>
        </Link>
      </header>

      {/* Contenido principal */}
      <main className="kahoot-main-content">
        <div className="kahoot-title-wrapper">
          <Link href="/" className="brand-title-link" style={{ textDecoration: 'none' }}>
            <h1 className="brand-title" aria-label="Chavales Legales">
              <span className="title-left-col">
                <span className="title-word">CHAVAL</span>
                <span className="title-word">LEGAL</span>
              </span>
              <span className="title-suffix-es">ES</span>
            </h1>
          </Link>
        </div>

        <div className="kahoot-sections-stack">
          {/* PASO 1: INTRODUCE PIN */}
          {step === 'PIN' && (
            <section className="pin-section-card" aria-label="Acceso por PIN a sesiones">
              <div className="pin-card-header">
                <span className="pin-badge-title">PIN DE LA SESIÓN</span>
              </div>

              <form className="pin-form" onSubmit={handlePinSubmit}>
                <div className="pin-input-container">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={9}
                    placeholder="Introduce el PIN"
                    className="pin-input"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoComplete="off"
                    spellCheck="false"
                    disabled={cargando}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-pin-submit"
                  disabled={cargando || !pin.trim()}
                >
                  <span>{cargando ? 'Buscando...' : 'Entrar'}</span>
                </button>
              </form>

              {errorMsg && (
                <div style={{ marginTop: 12, color: '#DC2626', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>
                  ⚠️ {errorMsg}
                </div>
              )}
            </section>
          )}

          {/* PASO 2: INTRODUCE APODO / NOMBRE */}
          {step === 'NICKNAME' && (
            <section className="pin-section-card" aria-label="Elegir apodo de clase">
              <div className="pin-card-header">
                <span className="pin-badge-title">SALA {pin} · TU NOMBRE</span>
              </div>

              <form className="pin-form" onSubmit={handleNicknameSubmit}>
                <div className="pin-input-container">
                  <input
                    type="text"
                    maxLength={18}
                    placeholder="¿Cómo te llamas en clase?"
                    className="pin-input"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    autoComplete="off"
                    spellCheck="false"
                    autoFocus
                    disabled={cargando}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-pin-submit"
                  disabled={cargando || !nickname.trim()}
                >
                  <span>{cargando ? 'Entrando...' : '¡Listo! Entrar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('PIN'); setErrorMsg(null); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#4B5563',
                    fontSize: 12,
                    fontWeight: 700,
                    marginTop: 8,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Cambiar PIN
                </button>
              </form>

              {errorMsg && (
                <div style={{ marginTop: 12, color: '#DC2626', fontWeight: 700, fontSize: 13, textAlign: 'center' }}>
                  ⚠️ {errorMsg}
                </div>
              )}
            </section>
          )}

          {/* SECCIÓN INFERIOR: JUGAR SIN PIN (SELECTOR DE JUEGOS MODO HISTORIETA Y MODO JUICIO) */}
          <section className="solo-section-card" aria-label="Jugar sin PIN">
            <div style={{ textAlign: 'center', marginBottom: 2 }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#4A1A1C',
                  background: '#FEF08A',
                  border: '1.5px solid #18181B',
                  borderRadius: 999,
                  padding: '2px 10px',
                  marginBottom: 6,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Modo Individual
              </span>
              <h2 className="solo-title" style={{ margin: 0, fontSize: 16 }}>
                Jugar sin PIN · Elige un modo
              </h2>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                width: '100%',
              }}
            >
              {/* Opción 1: Modo Historieta / Novela visual */}
              <Link
                href="/novela"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 16,
                  border: '3px solid #18181B',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 0 #18181B',
                  cursor: 'pointer',
                  textAlign: 'left',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#FEF08A',
                    border: '2px solid #18181B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  📖
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#B45309',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Narrativa & Novela Visual
                  </span>
                  <strong style={{ fontSize: 15, fontWeight: 900, color: '#18181B' }}>
                    No lo reenvíes
                  </strong>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#64748B',
                    background: '#F1F5F9',
                    padding: '4px 8px',
                    borderRadius: 999,
                    border: '1px solid #CBD5E1',
                  }}
                >
                  Jugar →
                </span>
              </Link>

              {/* Opción 2: Modo Juicio */}
              <Link
                href="/juzgado"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 16,
                  border: '3px solid #18181B',
                  background: '#FFFFFF',
                  boxShadow: '0 4px 0 #18181B',
                  cursor: 'pointer',
                  textAlign: 'left',
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: '#BBF7D0',
                    border: '2px solid #18181B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  ⚖️
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      fontWeight: 800,
                      color: '#15803D',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Tribunal & Casos Reales
                  </span>
                  <strong style={{ fontSize: 15, fontWeight: 900, color: '#18181B' }}>
                    Juzgado de Legalín
                  </strong>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#64748B',
                    background: '#F1F5F9',
                    padding: '4px 8px',
                    borderRadius: 999,
                    border: '1px solid #CBD5E1',
                  }}
                >
                  Jugar →
                </span>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="kahoot-footer">
        <div className="footer-inner">
          <p className="footer-highlight">Chavales Legales · Tu escudo digital</p>
          <div className="footer-links-row">
            <a href="https://www.ucm.es/" target="_blank" rel="noopener noreferrer" className="footer-link">UCM</a>
            <span>•</span>
            <a href="https://www.juventudinfancia.gob.es/" target="_blank" rel="noopener noreferrer" className="footer-link">Infancia y juventud</a>
            <span>•</span>
            <a href="https://www.administraciondejusticia.gob.es/" target="_blank" rel="noopener noreferrer" className="footer-link">Administración de Justicia</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
