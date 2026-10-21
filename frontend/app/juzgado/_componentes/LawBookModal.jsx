'use client'
import { useState } from 'react'
import ModalCentro from './ModalCentro'
import { sonar } from './sonidos'

// Libro de leyes: el botón vive abajo a la derecha y el libro se abre en el
// centro de la pantalla. Dos leyes por doble página; al pasar, una hoja gira en
// 3D sobre el lomo (cara delantera = página que se va, reverso = la que llega).
export default function LawBookModal({ leyes }) {
  const [abierto, setAbierto] = useState(false)
  const [hoja, setHoja] = useState(0)          // doble página visible
  const [giro, setGiro] = useState(null)       // { dir: 'adelante' | 'atras', desde } mientras gira la hoja
  const hojas = Math.ceil(leyes.length / 2)

  const pasar = d => {
    if (giro) return
    setGiro({ dir: d > 0 ? 'adelante' : 'atras', desde: hoja })
    sonar('pagina')
    setHoja(hoja + d)
  }

  const pagina = (i, extra = '') => {
    const ley = leyes[i]
    return ley ? (
      <div className={`libro-abierto__pagina ${extra}`}>
        <b>{ley.code}</b>
        <p>{ley.simplified}</p>
        <small>Página {i + 1}</small>
      </div>
    ) : <div className={`libro-abierto__pagina libro-abierto__pagina--vacia ${extra}`}>⚖️</div>
  }

  // Páginas fijas durante el giro: debajo de la hoja se ve ya la página nueva.
  const izq = giro?.dir === 'adelante' ? giro.desde * 2 : hoja * 2
  const der = giro?.dir === 'atras' ? giro.desde * 2 + 1 : hoja * 2 + 1

  return (
    <>
      <button className="libro" data-alcance onClick={() => { setHoja(0); setGiro(null); setAbierto(true); sonar('pagina') }} title="Consultar leyes">
        <span className="libro__lomo" />
        <span className="libro__tapa">⚖️<b>LEYES</b><small>Fáciles</small></span>
      </button>
      {abierto && (
        <ModalCentro titulo="Libro de leyes" className="modal__caja--libro" onCerrar={() => setAbierto(false)}>
          <h3 className="modal__titulo">📜 Leyes explicadas fácil</h3>
          <div className="libro-abierto">
            {pagina(izq)}
            {pagina(der)}
            {giro && (
              <div className={`hoja hoja--${giro.dir}`} onAnimationEnd={() => setGiro(null)}>
                {giro.dir === 'adelante' ? (
                  <>
                    {pagina(giro.desde * 2 + 1, 'hoja__cara')}
                    {pagina(hoja * 2, 'hoja__cara hoja__cara--dorso')}
                  </>
                ) : (
                  <>
                    {pagina(giro.desde * 2, 'hoja__cara')}
                    {pagina(hoja * 2 + 1, 'hoja__cara hoja__cara--dorso')}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="paginas">
            <button className="flecha" disabled={hoja === 0 || !!giro} onClick={() => pasar(-1)} aria-label="Hoja anterior">◀</button>
            <span>{hoja + 1} / {hojas}</span>
            <button className="flecha" disabled={hoja >= hojas - 1 || !!giro} onClick={() => pasar(1)} aria-label="Hoja siguiente">▶</button>
          </div>
        </ModalCentro>
      )}
    </>
  )
}
