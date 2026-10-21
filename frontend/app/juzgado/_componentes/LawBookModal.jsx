'use client'
import { useState } from 'react'
import ModalCentro from './ModalCentro'

// Libro de leyes: el botón vive abajo a la derecha y el libro se abre en el
// centro de la pantalla. Dos leyes por doble página; las flechas pasan la hoja.
export default function LawBookModal({ leyes }) {
  const [abierto, setAbierto] = useState(false)
  const [hoja, setHoja] = useState(0)
  const [giro, setGiro] = useState(null) // 'adelante' | 'atras' mientras se anima la hoja
  const hojas = Math.ceil(leyes.length / 2)
  const pasar = d => { setGiro(d > 0 ? 'adelante' : 'atras'); setHoja(hoja + d) }

  const pagina = (ley, n) => ley ? (
    <div className="libro-abierto__pagina">
      <b>{ley.code}</b>
      <p>{ley.simplified}</p>
      <small>Página {n}</small>
    </div>
  ) : <div className="libro-abierto__pagina libro-abierto__pagina--vacia">⚖️</div>

  return (
    <>
      <button className="libro" data-alcance onClick={() => { setHoja(0); setGiro(null); setAbierto(true) }} title="Consultar leyes">
        <span className="libro__lomo" />
        <span className="libro__tapa">⚖️<b>LEYES</b><small>Fáciles</small></span>
      </button>
      {abierto && (
        <ModalCentro titulo="Libro de leyes" className="modal__caja--libro" onCerrar={() => setAbierto(false)}>
          <h3 className="modal__titulo">📜 Leyes explicadas fácil</h3>
          <div key={hoja} className={`libro-abierto ${giro ? `gira-${giro}` : ''}`}>
            {pagina(leyes[hoja * 2], hoja * 2 + 1)}
            {pagina(leyes[hoja * 2 + 1], hoja * 2 + 2)}
          </div>
          <div className="paginas">
            <button className="flecha" disabled={hoja === 0} onClick={() => pasar(-1)} aria-label="Hoja anterior">◀</button>
            <span>{hoja + 1} / {hojas}</span>
            <button className="flecha" disabled={hoja >= hojas - 1} onClick={() => pasar(1)} aria-label="Hoja siguiente">▶</button>
          </div>
        </ModalCentro>
      )}
    </>
  )
}
