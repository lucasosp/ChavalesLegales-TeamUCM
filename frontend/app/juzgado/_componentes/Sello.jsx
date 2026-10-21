// Sello de goma visto desde arriba. Se pulsa o se arrastra sobre el papel.
export const SELLOS = {
  ilegal: { texto: 'ILEGAL', icono: '✖' },
  legal: { texto: 'LEGAL', icono: '✔' },
  falta_info: { texto: 'FALTA INFO', icono: '?' },
}

// `bloqueado` solo atenúa: al pulsarlo, la página avisa de qué falta.
export default function Sello({ tipo, onSellar, bloqueado, motivo }) {
  const { texto, icono } = SELLOS[tipo]
  return (
    <button
      data-alcance
      className={`sello sello--${tipo} ${bloqueado ? 'bloqueado' : ''}`}
      draggable
      onDragStart={e => e.dataTransfer.setData('sello', tipo)}
      onClick={() => onSellar(tipo)}
      title={bloqueado ? motivo : `Sellar ${texto}`}
    >
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="8" y="22" width="104" height="80" rx="20" className="sello__base" />
        <rect x="8" y="22" width="104" height="18" rx="9" className="sello__brillo" />
        <circle cx="60" cy="62" r="28" className="sello__mango" />
        <circle cx="60" cy="62" r="18" className="sello__pomo" />
        <ellipse cx="52" cy="54" rx="7" ry="4" fill="#fff" opacity=".55" />
        <text x="60" y="70" textAnchor="middle" className="sello__icono">{icono}</text>
      </svg>
      <span className="sello__texto">{texto}</span>
    </button>
  )
}
