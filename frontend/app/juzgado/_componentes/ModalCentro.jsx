'use client'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

// Ventana centrada en la pantalla. Se cierra con ✕, Escape o pulsando fuera
// (salvo que `onCerrar` no exista, como en los mensajes de Legalín).
// Se monta en <body> para que ninguna capa de la mesa quede por encima; el
// envoltorio .juzgado-app mantiene los estilos del juego.
export default function ModalCentro({ titulo, onCerrar, className = '', children }) {
  useEffect(() => {
    if (!onCerrar) return
    const tecla = e => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [onCerrar])

  return createPortal(
    <div className="juzgado-app">
      <div className="modal" role="dialog" aria-modal="true" aria-label={titulo} onClick={onCerrar}>
        <div className={`modal__caja ${className}`} onClick={e => e.stopPropagation()}>
          {onCerrar && <button className="modal__cerrar" onClick={onCerrar} aria-label="Cerrar">✕</button>}
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
