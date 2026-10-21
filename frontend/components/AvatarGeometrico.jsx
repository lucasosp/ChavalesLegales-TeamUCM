'use client'

/**
 * AvatarGeometrico: Componente SVG paramétrico estilo Duolingo
 * Flat design, minimalista y sin contornos (stroke="none").
 */
export default function AvatarGeometrico({
  baseType = 1,
  colorPelo = '#4A2810',
  tieneGorro = true,
  colorRopa = '#4A1A1C',
  size = 100,
  x = 0,
  y = 0,
  standalone = false,
  className = '',
}) {
  const content = (
    <g className={`avatar-geo ${className}`}>
      {/* ==============================================================
          BASE 1: EL CHAVAL CURIOSO (Personalizable: colorPelo)
          ============================================================== */}
      {baseType === 1 && (
        <g>
          {/* Torso con sudadera redondeada */}
          <rect x="-24" y="-12" width="48" height="26" rx="13" fill={colorRopa || '#4A1A1C'} />
          {/* Cuello decorativo */}
          <ellipse cx="0" cy="-11" rx="10" ry="4" fill="#FACC15" />

          {/* Cuello del personaje */}
          <rect x="-6" y="-26" width="12" height="16" rx="4" fill="#F0BE9A" />

          {/* Cabeza suave y redondeada */}
          <rect x="-18" y="-48" width="36" height="32" rx="16" fill="#FDE0C5" />

          {/* Pelo geométrico flat (colorPelo) */}
          <rect x="-19" y="-56" width="38" height="16" rx="8" fill={colorPelo || '#4A2810'} />
          <path d="M -18 -48 Q -6 -46 -1 -41 Q -9 -39 -18 -42 Z" fill={colorPelo || '#4A2810'} />
          <rect x="-20" y="-47" width="5" height="12" rx="2.5" fill={colorPelo || '#4A2810'} />
          <rect x="15" y="-47" width="5" height="12" rx="2.5" fill={colorPelo || '#4A2810'} />
          {/* Brillo suave de pelo */}
          <rect x="-12" y="-54" width="24" height="3.5" rx="1.75" fill="#FFFFFF" opacity="0.25" />

          {/* Ojos expresivos estilo Duolingo (sin contorno) */}
          <circle cx="-7.5" cy="-33" r="3.4" fill="#18181B" />
          <circle cx="7.5" cy="-33" r="3.4" fill="#18181B" />
          {/* Brillos oculares */}
          <circle cx="-6.2" cy="-34.2" r="1.1" fill="#FFFFFF" />
          <circle cx="8.8" cy="-34.2" r="1.1" fill="#FFFFFF" />
          <circle cx="-8.2" cy="-32" r="0.6" fill="#FFFFFF" />
          <circle cx="6.8" cy="-32" r="0.6" fill="#FFFFFF" />

          {/* Cejas planas */}
          <rect x="-11" y="-40" width="7" height="2" rx="1" fill={colorPelo || '#4A2810'} />
          <rect x="4" y="-40" width="7" height="2" rx="1" fill={colorPelo || '#4A2810'} />

          {/* Mejillas sonrosadas */}
          <rect x="-14" y="-28" width="5.5" height="2.8" rx="1.4" fill="#F43F5E" opacity="0.45" />
          <rect x="8.5" y="-28" width="5.5" height="2.8" rx="1.4" fill="#F43F5E" opacity="0.45" />

          {/* Sonrisa alegre con lengua */}
          <path d="M -4 -25 Q 0 -22 4 -25 Q 0 -19 -4 -25 Z" fill="#18181B" />
          <path d="M -2.5 -23.5 Q 0 -21.5 2.5 -23.5 Q 0 -20 -2.5 -23.5 Z" fill="#F43F5E" />
        </g>
      )}

      {/* ==============================================================
          BASE 2: GAMER / SKATER (Personalizable: tieneGorro)
          ============================================================== */}
      {baseType === 2 && (
        <g>
          {/* Torso deportivo */}
          <rect x="-25" y="-12" width="50" height="28" rx="12" fill={colorRopa || '#3D4A27'} />
          {/* Franja central blanca y detalle dorado */}
          <rect x="-3" y="-10" width="6" height="24" rx="3" fill="#FFFFFF" />
          <rect x="-2" y="-4" width="4" height="7" rx="2" fill="#FACC15" />

          {/* Cuello del personaje */}
          <rect x="-6" y="-27" width="12" height="17" rx="4" fill="#E8B490" />

          {/* Cabeza estilizada */}
          <rect x="-16" y="-50" width="32" height="35" rx="15" fill="#FCD5B5" />

          {/* Gorro hacia atrás O Peinado angular moderno */}
          {tieneGorro ? (
            <g>
              {/* Gorra hacia atrás */}
              <path d="M -18 -44 C -18 -58 18 -58 18 -44 Z" fill="#4A1A1C" />
              <rect x="-23" y="-46" width="11" height="4.5" rx="2" fill="#FACC15" />
              <circle cx="0" cy="-55" r="2.5" fill="#FACC15" />
              {/* Mechones que sobresalen */}
              <circle cx="-13" cy="-42" r="3.2" fill="#18181B" />
              <circle cx="13" cy="-42" r="3.2" fill="#18181B" />
            </g>
          ) : (
            <g>
              {/* Peinado moderno angular sin gorro */}
              <path d="M -18 -45 C -18 -60 18 -58 18 -45 Z" fill="#18181B" />
              <polygon points="-12,-56 2,-63 16,-57 12,-48 -6,-49" fill="#18181B" />
              <polygon points="-6,-55 2,-60 10,-56 4,-50" fill="#FFFFFF" opacity="0.2" />
            </g>
          )}

          {/* Ojos expresivos con mirada viva */}
          <circle cx="-7" cy="-34" r="3.4" fill="#18181B" />
          <circle cx="7" cy="-34" r="3.4" fill="#18181B" />
          <circle cx="-5.8" cy="-35.2" r="1.1" fill="#FFFFFF" />
          <circle cx="8.2" cy="-35.2" r="1.1" fill="#FFFFFF" />

          {/* Cejas inclinadas dinámicas */}
          <rect x="-10.5" y="-41" width="7" height="2.2" rx="1" fill="#18181B" transform="rotate(-6 -7 -40)" />
          <rect x="3.5" y="-41" width="7" height="2.2" rx="1" fill="#18181B" transform="rotate(6 7 -40)" />

          {/* Sonrisa traviesa lateral */}
          <path d="M -3 -26 Q 2 -23 5 -27" stroke="#18181B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          {/* Pecas sutiles */}
          <circle cx="-10" cy="-30" r="0.8" fill="#D97706" />
          <circle cx="-8" cy="-28" r="0.8" fill="#D97706" />
          <circle cx="8" cy="-28" r="0.8" fill="#D97706" />
          <circle cx="10" cy="-30" r="0.8" fill="#D97706" />
        </g>
      )}

      {/* ==============================================================
          BASE 3: SABIO / CASUAL (Personalizable: colorRopa)
          ============================================================== */}
      {baseType === 3 && (
        <g>
          {/* Torso con sudadera amplia */}
          <rect x="-27" y="-14" width="54" height="30" rx="14" fill={colorRopa || '#B03921'} />
          {/* Solapa / cuello de sudadera */}
          <path d="M -14 -14 Q 0 -6 14 -14 Q 0 0 -14 -14 Z" fill="#FFFFFF" opacity="0.2" />

          {/* Cuello ancho */}
          <rect x="-7" y="-28" width="14" height="18" rx="4" fill="#E5A882" />

          {/* Pelo afro / rizado geométrico voluminoso */}
          <g fill="#18181B">
            <circle cx="-15" cy="-48" r="9" />
            <circle cx="-6" cy="-55" r="9.5" />
            <circle cx="6" cy="-54" r="9.5" />
            <circle cx="15" cy="-47" r="9" />
            <circle cx="0" cy="-47" r="8" />
          </g>

          {/* Cabeza cuadrada suave */}
          <rect x="-20" y="-48" width="40" height="34" rx="15" fill="#F8C7A3" />

          {/* Gafas de pasta planas geométricas */}
          <circle cx="-8" cy="-34" r="6.5" fill="#FFFFFF" opacity="0.3" />
          <circle cx="-8" cy="-34" r="6.5" fill="none" stroke="#18181B" strokeWidth="2.2" />
          <circle cx="8" cy="-34" r="6.5" fill="#FFFFFF" opacity="0.3" />
          <circle cx="8" cy="-34" r="6.5" fill="none" stroke="#18181B" strokeWidth="2.2" />
          <rect x="-2.5" y="-35" width="5" height="2" rx="1" fill="#18181B" />

          {/* Ojos tras las gafas */}
          <circle cx="-8" cy="-34" r="2.6" fill="#18181B" />
          <circle cx="8" cy="-34" r="2.6" fill="#18181B" />
          <circle cx="-7" cy="-35" r="0.9" fill="#FFFFFF" />
          <circle cx="9" cy="-35" r="0.9" fill="#FFFFFF" />

          {/* Cejas arqueadas amigables */}
          <rect x="-12" y="-44" width="7" height="2" rx="1" fill="#18181B" />
          <rect x="5" y="-44" width="7" height="2" rx="1" fill="#18181B" />

          {/* Mejillas sonrosadas */}
          <rect x="-16" y="-29" width="6" height="3" rx="1.5" fill="#F43F5E" opacity="0.4" />
          <rect x="10" y="-29" width="6" height="3" rx="1.5" fill="#F43F5E" opacity="0.4" />

          {/* Sonrisa ancha */}
          <path d="M -5 -25 Q 0 -20 5 -25" stroke="#18181B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  )

  if (standalone) {
    return (
      <svg
        viewBox="-35 -65 70 85"
        width={size}
        height={size}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {content}
      </svg>
    )
  }

  return <g transform={`translate(${x}, ${y})`}>{content}</g>
}

