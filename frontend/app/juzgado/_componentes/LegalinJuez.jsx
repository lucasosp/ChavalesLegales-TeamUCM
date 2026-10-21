'use client'
import { useEffect, useRef, useState } from 'react'

// Legalín visto desde arriba, sentado ante la mesa: cabeza con peluca, brazos
// que se estiran hacia lo que pulsa el jugador y mazazo al acertar.
const PELO = '#8B5A2B', PELO_OSC = '#6B4226', CARA = '#F2C79B', PELUCA = '#F4F1EA', TOGA = '#064e3b', TINTA = '#18181B' // toga en el esmeralda de la web
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
      <circle cx="36" cy="132" r="15" fill={CARA} />
      <circle cx="244" cy="132" r="30" fill={PELO} className="trazo" />
      <circle cx="244" cy="132" r="15" fill={CARA} />
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

function Brazo({ hombro, mano, fuera, conMazo, mazazoId }) {
  const c = codo(hombro, mano, fuera)
  const recorrido = `M${hombro.x} ${hombro.y} L${c.x} ${c.y} L${mano.x} ${mano.y}`
  const angulo = Math.atan2(mano.y - c.y, mano.x - c.x) * 180 / Math.PI
  return (
    <g>
      <path d={recorrido} stroke={TINTA} strokeWidth="66" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={recorrido} stroke={TOGA} strokeWidth="58" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(${mano.x} ${mano.y}) rotate(${angulo})`}>
        <rect x="-44" y="-32" width="22" height="64" rx="10" fill={PELUCA} className="trazo" />
        <ellipse cx="0" cy="0" rx="36" ry="30" fill={PELO} className="trazo" />
        {[[30, -22], [40, -6], [40, 10], [30, 25]].map(([x, y]) => <circle key={y} cx={x} cy={y} r="10" fill={PELO} className="trazo" />)}
        <ellipse cx="2" cy="0" rx="16" ry="13" fill={CARA} />
        {conMazo && <GavelSlam key={mazazoId} />}
      </g>
    </g>
  )
}

// Mazo visto desde arriba. La animación CSS lo levanta (más grande = más cerca
// de la cámara) y lo baja de golpe sobre el papel.
export function GavelSlam() {
  return (
    <g className="mazo">
      <rect x="0" y="-7" width="92" height="14" rx="6" fill="#A0612F" className="trazo" />
      <rect x="78" y="-34" width="38" height="68" rx="10" fill="#6B3E1F" className="trazo" />
      <rect x="78" y="-22" width="38" height="8" fill="#F5C21B" />
      <rect x="78" y="14" width="38" height="8" fill="#F5C21B" />
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
      // La mano se queda a un mango de distancia para que la cabeza del mazo caiga en el punto.
      const dx = mazazo.x - hombros.der.x, dy = mazazo.y - hombros.der.y, d = Math.hypot(dx, dy)
      return alcanzable(hombros.der, { x: mazazo.x - (dx / d) * 97, y: mazazo.y - (dy / d) * 97 })
    }
    if (alcance && alcance.lado === lado) return alcanzable(hombros[lado], alcance)
    return null
  }
  const manoIzq = useMano(reposo.izq, objetivo('izq'))
  const manoDer = useMano(reposo.der, objetivo('der'))

  return (
    <svg className="brazos" viewBox={`0 0 ${ancho} ${alto}`} width={ancho} height={alto} aria-hidden="true">
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
