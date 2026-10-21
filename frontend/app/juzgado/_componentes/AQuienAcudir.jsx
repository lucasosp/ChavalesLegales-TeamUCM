'use client'
import { useState } from 'react'
import ModalCentro from './ModalCentro'

const ICONO = { '024': '💛', anar: '🧸', '017': '💻', aepd: '🛡️', fiscalia_menores: '⚖️', policia: '🚓', '112': '🚑',
  servicios_sociales: '🏠', juzgado_guardia: '🏛️', '016': '💜', centro_educativo: '🏫' }

// Zona «¿A quién acudir?» (abajo a la izquierda). Si la familia pregunta, hay
// 3 tarjetas: se arrastran o se pulsan hasta la bandeja de entrega.
export default function AQuienAcudir({ caso, recurso, onRecurso, avisar }) {
  const [encima, setEncima] = useState(false)
  const [pistas, setPistas] = useState(false)
  const entregado = caso.resourceOptions.find(o => o.id === recurso)

  const listaPistas = <ul className="acudir__pistas">{caso.helpPills.map(p => <li key={p}>💡 {p}</li>)}</ul>

  if (!caso.requiresJusticeInfo) {
    return <div className="acudir acudir--solo-pistas"><h4>Pistas de Legalín</h4>{listaPistas}</div>
  }

  return (
    <div className={`acudir ${avisar ? 'sacude' : ''}`}>
      <h4>¿A quién acudir? <button data-alcance className="acudir__ayuda" onClick={() => setPistas(true)} title="Ver pistas">💡</button></h4>
      <p className="acudir__pregunta">🗣️ {caso.clientRequest}</p>
      <div className="acudir__opciones">
        {caso.resourceOptions.map(o => (
          <button key={o.id} data-alcance draggable className={`tarjeta-recurso ${o.id === recurso ? 'usada' : ''}`}
            onDragStart={e => e.dataTransfer.setData('recurso', o.id)} onClick={() => onRecurso(o.id)} title={o.cuando}>
            <span>{ICONO[o.id] || '📞'}</span>{o.nombre}
          </button>
        ))}
      </div>
      <div
        className={`bandeja ${encima ? 'encima' : ''} ${entregado ? 'llena' : ''}`}
        onDragOver={e => { e.preventDefault(); setEncima(true) }}
        onDragLeave={() => setEncima(false)}
        onDrop={e => { e.preventDefault(); setEncima(false); const id = e.dataTransfer.getData('recurso'); if (id) onRecurso(id) }}
      >
        {entregado
          ? <button data-alcance onClick={() => onRecurso('')} title="Quitar">📨 {entregado.nombre} <small>{entregado.contacto}</small></button>
          : <span>📥 Suelta aquí la tarjeta</span>}
      </div>
      {pistas && <ModalCentro titulo="Pistas" onCerrar={() => setPistas(false)}><h3 className="modal__titulo">💡 Pistas de Legalín</h3>{listaPistas}</ModalCentro>}
    </div>
  )
}
