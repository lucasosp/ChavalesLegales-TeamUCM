'use client'
import { useEffect, useRef, useState } from 'react'

// Legalín visto desde arriba, sentado ante la mesa: cabeza con peluca, brazos
// que se estiran hacia lo que pulsa el jugador y mazazo al acertar.
const PELO = '#8B5A2B', PELO_OSC = '#6B4226', CARA = '#F2C79B', PELUCA = '#F4F1EA', TOGA = '#064e3b', TINTA = '#2B2B2B' // toga en el esmeralda de la web
const LARGO_BRAZO = 560   // brazo + antebrazo (px de la mesa)
const DURACION = 240      // ms que tarda la mano en llegar
const DOBLEZ_MAX = 90     // el codo apenas se abre: visto desde arriba, el brazo «se acorta» hacia la cámara

const rizos = (x, dir) => [92, 118, 144, 170].map((y, i) => (
  <g key={`${x}-${y}`}>
    <circle cx={x + dir * (i % 2) * 6} cy={y} r="15" fill={PELUCA} className="trazo" />
    <path d={`M${x + dir * (i % 2) * 6 - 6} ${y} a6 6 0 1 1 6 6`} fill="none" className="trazo-fino" />
  </g>
))

export function LegalinHead({ mira = 0 }) {
  // `mira` (-1 a 1) gira un poco la cabeza hacia donde está la mano.
  return (
    <svg className="legalin-cabeza" viewBox="0 0 280 190" aria-label="Legalín, el juez" style={{ transform: `rotate(${mira * 8}deg)` }}>
      <circle cx="36" cy="132" r="30" fill={PELO} className="trazo" />
      <path d="M30 120 q10 12 0 24" fill="none" stroke={PELO_OSC} strokeWidth="4" strokeLinecap="round" />
      <circle cx="244" cy="132" r="30" fill={PELO} className="trazo" />
      <path d="M250 120 q-10 12 0 24" fill="none" stroke={PELO_OSC} strokeWidth="4" strokeLinecap="round" />
      <circle cx="140" cy="155" r="100" fill={PELO} className="trazo" />
      {/* Flequillo que asoma bajo la peluca */}
      <path d="M118 52 q8 -16 22 -2 q14 -14 22 2 z" fill={PELO_OSC} className="trazo" />
      {/* Peluca de juez: casquete, rizos y coleta con lazo */}
      <ellipse cx="140" cy="114" rx="88" ry="62" fill={PELUCA} className="trazo" />
      {rizos(58, 1)}
      {rizos(222, -1)}
      <path d="M92 94 q48 -34 96 0 M100 118 q40 -26 80 0 M108 140 q32 -18 64 0" className="trazo-fino" fill="none" />
      <ellipse cx="110" cy="82" rx="18" ry="8" fill="#fff" />
      <path d="M126 176 l-18 -10 v20z M154 176 l18 -10 v20z" fill={TOGA} className="trazo" />
      <circle cx="140" cy="176" r="7" fill={TOGA} className="trazo" />
    </svg>
  )
}

// Codo por cinemática inversa de dos segmentos iguales: el brazo se dobla hacia fuera
// (limitado a DOBLEZ_MAX para no tapar las zonas de los lados).
function codo(h, m, fuera) {
  const dx = m.x - h.x, dy = m.y - h.y
  const d = Math.hypot(dx, dy) || 1
  const doblez = Math.min(DOBLEZ_MAX, Math.sqrt(Math.max(0, (LARGO_BRAZO / 2) ** 2 - (d / 2) ** 2)))
  return { x: (h.x + m.x) / 2 + (-dy / d) * doblez * fuera, y: (h.y + m.y) / 2 + (dx / d) * doblez * fuera }
}

// Limita el destino a lo que alcanza el brazo desde el hombro.
function alcanzable(h, p) {
  const dx = p.x - h.x, dy = p.y - h.y, d = Math.hypot(dx, dy), max = LARGO_BRAZO * 0.97
  return d <= max ? p : { x: h.x + (dx / d) * max, y: h.y + (dy / d) * max }
}

function useMano(reposo, objetivo) {
  const [pos, setPos] = useState(reposo)
  const actual = useRef(reposo)
  const destino = objetivo || reposo
  useEffect(() => {
    const desde = { ...actual.current }, t0 = performance.now()
    let raf
    const paso = t => {
      const k = Math.min(1, (t - t0) / DURACION), e = 1 - (1 - k) ** 3
      actual.current = { x: desde.x + (destino.x - desde.x) * e, y: desde.y + (destino.y - desde.y) * e }
      setPos(actual.current)
      if (k < 1) raf = requestAnimationFrame(paso)
    }
    raf = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(raf)
  }, [destino.x, destino.y]) // eslint-disable-line react-hooks/exhaustive-deps
  return pos
}

const CABEZA_MAZO = 113 // distancia de la palma al centro de la cabeza del mazo

function Brazo({ hombro, mano, fuera, conMazo, mazazoId }) {
  const c = codo(hombro, mano, fuera)
  const recorrido = `M${hombro.x} ${hombro.y} L${c.x} ${c.y} L${mano.x} ${mano.y}`
  const angulo = Math.atan2(mano.y - c.y, mano.x - c.x) * 180 / Math.PI
  return (
    <g>
      <path d={recorrido} stroke={TINTA} strokeWidth="66" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={recorrido} stroke={TOGA} strokeWidth="58" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(${mano.x} ${mano.y}) rotate(${angulo})`}>
        {/* Sombra del mazo sobre la mesa: no sube con la mano, solo se aclara y se separa */}
        {conMazo && <g transform="translate(10 12)"><g key={`s${mazazoId}`} className="mazo-sombra"><GavelSlam sombra /></g></g>}
        <rect x="-44" y="-32" width="22" height="64" rx="10" fill={PELUCA} className="trazo" />
        <g key={mazazoId} className={conMazo ? 'mano-mazazo' : undefined}>
          {conMazo && <GavelSlam />}
          <ellipse cx="0" cy="0" rx="36" ry="30" fill={PELO} className="trazo" />
          {[[30, -22], [40, -6], [40, 10], [30, 25]].map(([x, y]) => <circle key={y} cx={x} cy={y} r="10" fill={PELO} className="trazo" />)}
          {/* Dorso de la mano: nudillos en vez de palma */}
          <path d="M14 -16 q6 8 0 16 M18 4 q6 8 0 16" fill="none" stroke={PELO_OSC} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      </g>
    </g>
  )
}

// Mazo visto desde arriba, en coordenadas de la mano: el mango sale hacia +x y la
// cabeza (un cilindro) queda perpendicular. Con `sombra` se dibuja solo la silueta.
export function GavelSlam({ sombra = false }) {
  if (sombra) {
    return (
      <g fill="rgba(0, 0, 0, .22)">
        <rect x="-10" y="-8" width="116" height="16" rx="8" />
        <rect x="94" y="-48" width="38" height="96" rx="14" />
      </g>
    )
  }
  return (
    <g>
      <rect x="-12" y="-8" width="118" height="16" rx="8" fill="url(#jz-mango)" stroke={TINTA} strokeWidth="4" />
      <path d="M8 -2 H86" stroke="#E2A06A" strokeWidth="3" strokeLinecap="round" opacity=".7" />
      <rect x="94" y="-48" width="38" height="96" rx="14" fill="url(#jz-cabeza)" stroke={TINTA} strokeWidth="4" />
      <rect x="96" y="-46" width="34" height="9" rx="4" fill="#5A2F12" />
      <rect x="96" y="37" width="34" height="9" rx="4" fill="#5A2F12" />
      <rect x="94" y="-32" width="38" height="11" fill="url(#jz-oro)" stroke={TINTA} strokeWidth="2.5" />
      <rect x="94" y="21" width="38" height="11" fill="url(#jz-oro)" stroke={TINTA} strokeWidth="2.5" />
      <path d="M104 -18 V16" stroke="#fff" strokeOpacity=".45" strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

/**
 * Brazos de Legalín sobre toda la mesa (capa SVG que no captura clics).
 * `alcance`: { x, y, lado } punto al que estirar la mano, o null para reposar.
 * `mazazo`: { x, y, id } punto del papel donde golpear con el mazo, o null.
 */
export function JudgeArms({ ancho, alto, alcance, mazazo }) {
  const cx = ancho / 2
  const hombros = { izq: { x: cx - 175, y: alto + 30 }, der: { x: cx + 175, y: alto + 30 } }
  const reposo = { izq: { x: cx - 215, y: alto - 80 }, der: { x: cx + 215, y: alto - 80 } }
  const objetivo = lado => {
    if (mazazo && lado === 'der') {
      // La mano se queda a un mango de distancia, en la dirección del antebrazo, para que
      // la cabeza del mazo caiga justo en el punto (dos pasadas: el codo depende de la mano).
      let mano = mazazo
      for (let i = 0; i < 2; i++) {
        const c = codo(hombros.der, mano, 1)
        const dx = mano.x - c.x, dy = mano.y - c.y, d = Math.hypot(dx, dy) || 1
        mano = alcanzable(hombros.der, { x: mazazo.x - (dx / d) * CABEZA_MAZO, y: mazazo.y - (dy / d) * CABEZA_MAZO })
      }
      return mano
    }
    if (alcance && alcance.lado === lado) return alcanzable(hombros[lado], alcance)
    return null
  }
  const manoIzq = useMano(reposo.izq, objetivo('izq'))
  const manoDer = useMano(reposo.der, objetivo('der'))

  return (
    <svg className="brazos" viewBox={`0 0 ${ancho} ${alto}`} width={ancho} height={alto} aria-hidden="true">
      <defs>
        <linearGradient id="jz-mango" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C77A43" /><stop offset=".45" stopColor="#A35A2A" /><stop offset="1" stopColor="#6E3415" />
        </linearGradient>
        <linearGradient id="jz-cabeza" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6E3415" /><stop offset=".35" stopColor="#B86A35" /><stop offset=".55" stopColor="#C97C45" /><stop offset="1" stopColor="#5E2C10" />
        </linearGradient>
        <linearGradient id="jz-oro" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B9861B" /><stop offset=".45" stopColor="#FBE07A" /><stop offset="1" stopColor="#B9861B" />
        </linearGradient>
      </defs>
      <Brazo hombro={hombros.izq} mano={manoIzq} fuera={-1} />
      <Brazo hombro={hombros.der} mano={manoDer} fuera={1} conMazo={!!mazazo} mazazoId={mazazo?.id} />
      {mazazo && (
        // El destello se anima dentro de un grupo ya trasladado: la escala CSS no desplaza el punto.
        <g key={mazazo.id} transform={`translate(${mazazo.x} ${mazazo.y})`}>
          <g className="impacto">
            <circle r="40" fill="none" stroke={TINTA} strokeWidth="5" />
            {[0, 60, 120, 180, 240, 300].map(a => <line key={a} x1="52" x2="76" transform={`rotate(${a})`} stroke="#F5C21B" strokeWidth="8" strokeLinecap="round" />)}
          </g>
        </g>
      )}
    </svg>
  )
}
