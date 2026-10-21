// Avatar de mono plano (estilo Duolingo) generado de forma determinista a partir de una semilla.
const PELO = ['#8B5A2B', '#A0522D', '#6B4226', '#C68642', '#5C3A21', '#D9A066']
const CARA = ['#F6D7B0', '#F2C79B', '#EBC08E', '#FAE0C3']
const FONDO = ['#5E8F2F', '#F5C21B', '#D9641E', '#4FA3D1', '#B57EDC', '#E86A8E']
const COMPLEMENTO = ['nada', 'gafas', 'gorra', 'lazo', 'cascos']
const BOCA = ['sonrisa', 'abierta', 'tranquila']

function hash(texto) {
  let h = 2166136261
  for (const c of texto) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return h >>> 0
}

export default function MonoAvatar({ seed = 'mono', size = 96 }) {
  const h = hash(seed)
  const elegir = (lista, salto) => lista[(h >>> salto) % lista.length]
  const pelo = elegir(PELO, 0), cara = elegir(CARA, 3), fondo = elegir(FONDO, 6)
  const complemento = elegir(COMPLEMENTO, 9), boca = elegir(BOCA, 12)
  const mira = ((h >>> 15) % 3) - 1 // las pupilas miran a un lado u otro

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Avatar">
      <circle cx="60" cy="60" r="60" fill={fondo} />
      {/* Orejas */}
      <circle cx="24" cy="62" r="14" fill={pelo} /><circle cx="24" cy="62" r="8" fill={cara} />
      <circle cx="96" cy="62" r="14" fill={pelo} /><circle cx="96" cy="62" r="8" fill={cara} />
      {/* Cabeza y mechón */}
      <circle cx="60" cy="62" r="36" fill={pelo} />
      <path d="M50 28 q10 -14 20 0 q-10 -4 -20 0z" fill={pelo} />
      {/* Cara en forma de corazón */}
      <circle cx="49" cy="58" r="15" fill={cara} /><circle cx="71" cy="58" r="15" fill={cara} />
      <ellipse cx="60" cy="76" rx="25" ry="19" fill={cara} />
      {/* Ojos */}
      <circle cx="49" cy="57" r="8" fill="#fff" /><circle cx="71" cy="57" r="8" fill="#fff" />
      <circle cx={49 + mira * 2} cy="58" r="4.5" fill="#2A1A12" /><circle cx={71 + mira * 2} cy="58" r="4.5" fill="#2A1A12" />
      <circle cx={50 + mira * 2} cy="56.5" r="1.5" fill="#fff" /><circle cx={72 + mira * 2} cy="56.5" r="1.5" fill="#fff" />
      {/* Mofletes, nariz y boca */}
      <ellipse cx="40" cy="75" rx="5" ry="3" fill="#F49A9A" opacity=".7" />
      <ellipse cx="80" cy="75" rx="5" ry="3" fill="#F49A9A" opacity=".7" />
      <circle cx="56" cy="71" r="1.8" fill="#6B4226" /><circle cx="64" cy="71" r="1.8" fill="#6B4226" />
      {boca === 'sonrisa' && <path d="M50 80 q10 10 20 0" stroke="#6B4226" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {boca === 'abierta' && <path d="M51 79 q9 12 18 0z" fill="#6B2A2A" />}
      {boca === 'tranquila' && <path d="M53 82 q7 4 14 0" stroke="#6B4226" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {/* Complementos */}
      {complemento === 'gafas' && (
        <g stroke="#2A1A12" strokeWidth="3" fill="none">
          <circle cx="49" cy="57" r="10" /><circle cx="71" cy="57" r="10" /><path d="M59 57 h2" />
        </g>
      )}
      {complemento === 'gorra' && (
        <g><path d="M28 42 q32 -30 64 0z" fill="#7A1F35" /><path d="M58 40 q24 -4 40 4 q-18 2 -40 0z" fill="#5A1527" /></g>
      )}
      {complemento === 'lazo' && (
        <g fill="#E86A8E"><path d="M76 30 l12 -8 v16z" /><path d="M76 30 l-12 -8 v16z" /><circle cx="76" cy="30" r="4" /></g>
      )}
      {complemento === 'cascos' && (
        <g><path d="M22 58 q38 -56 76 0" stroke="#2A1A12" strokeWidth="5" fill="none" />
          <rect x="14" y="54" width="12" height="18" rx="5" fill="#4FA3D1" /><rect x="94" y="54" width="12" height="18" rx="5" fill="#4FA3D1" /></g>
      )}
    </svg>
  )
}
