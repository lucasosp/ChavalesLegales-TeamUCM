'use client'
import { useState } from 'react'
import { SELLOS } from './Sello'

// Papel del recurso (centro de la mesa). Es la zona donde caen los sellos.
export default function CasePaper({ caso, revealedDocsCount, onPedirDoc, docRecibido, marca, golpe, onSoltarSello }) {
  const [encima, setEncima] = useState(false)
  const docs = caso.extraDocuments

  return (
    <article
      className={`papel ${encima ? 'encima' : ''} ${golpe ? 'golpeado' : ''}`}
      onDragOver={e => { e.preventDefault(); setEncima(true) }}
      onDragLeave={() => setEncima(false)}
      onDrop={e => { e.preventDefault(); setEncima(false); onSoltarSello(e.dataTransfer.getData('sello')) }}
    >
      <p className="papel__cab">Juzgado de Legalín · Recurso nº {caso.id}</p>
      <p className="papel__resumen">{caso.caseSummary}</p>
      <h2 className="papel__pregunta">{caso.verdictQuestion}</h2>

      {docs.slice(0, revealedDocsCount).map(d => (
        <section key={d.docTitle} className="anexo"><h4>📎 {d.docTitle}</h4><p>{d.content}</p></section>
      ))}
      {docRecibido && (
        <section className="anexo anexo--nuevo"><h4>📬 {docRecibido.docTitle} <small>¡Recibido!</small></h4><p>{docRecibido.content}</p></section>
      )}
      {docs.length > 0 && (
        <button data-alcance className="papel__pedir" disabled={revealedDocsCount >= docs.length} onClick={onPedirDoc}>
          {revealedDocsCount >= docs.length ? 'No hay más anexos' : `📎 Pedir anexo (${docs.length - revealedDocsCount})`}
        </button>
      )}

      {marca && <span key={marca} className={`tinta tinta--${marca}`}>{SELLOS[marca].texto}</span>}
    </article>
  )
}
