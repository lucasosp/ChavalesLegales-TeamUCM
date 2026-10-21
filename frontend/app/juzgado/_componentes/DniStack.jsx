'use client'
import { useState } from 'react'
import MonoAvatar from './MonoAvatar'
import ModalCentro from './ModalCentro'

const ROL = { afectado: 'Afectado/a', implicado: 'Implicado/a', testigo: 'Testigo' }

function DniCard({ persona, nueva }) {
  return (
    <div className={`dni dni--${persona.role}`}>
      <div className="dni__cab"><span>Documento · {ROL[persona.role]}</span><b>{persona.expediente}</b></div>
      <div className="dni__cuerpo">
        <MonoAvatar seed={persona.avatarSeed} size={120} />
        <dl>
          <dt>Nombre</dt><dd>{persona.fullName}</dd>
          <dt>Edad</dt><dd>{persona.age} años</dd>
          <dt>Comunidad</dt><dd>{persona.region}</dd>
        </dl>
      </div>
      <div className="dni__datos">
        {persona.visualMetadata.map(d => <span key={d.label}><b>{d.label}:</b> {d.value}</span>)}
      </div>
      {nueva && <span className="dni__nueva">¡Nueva!</span>}
      <span className="dni__sello">FICTICIO</span>
    </div>
  )
}

// Mini fichas (arriba a la derecha): foto + dos líneas de «texto». Al pulsar,
// se abre el inspector centrado con la ficha a tamaño completo.
export default function DniStack({ people, nueva }) {
  const [abierta, setAbierta] = useState(null) // índice de la ficha en el inspector
  if (!people.length) return <div className="dnimini dnimini--vacio">Sin fichas</div>

  return (
    <>
      <div className="dnimonton">
        {people.map((p, i) => (
          <button key={p.expediente} data-alcance className={`dnimini dnimini--${p.role} ${nueva === p.expediente ? 'nueva' : ''}`}
            style={{ '--i': i }} onClick={() => setAbierta(i)} title={`Ver ficha de ${p.fullName}`}>
            <MonoAvatar seed={p.avatarSeed} size={46} />
            <span className="dnimini__lineas"><i /><i /></span>
          </button>
        ))}
      </div>
      {abierta !== null && (
        <ModalCentro titulo="Inspector de fichas" className="modal__caja--dni" onCerrar={() => setAbierta(null)}>
          <h3 className="modal__titulo">🪪 Ficha {abierta + 1} de {people.length}</h3>
          <DniCard key={abierta} persona={people[abierta]} nueva={nueva === people[abierta].expediente} />
          {people.length > 1 && (
            <div className="paginas">
              <button className="flecha" disabled={abierta === 0} onClick={() => setAbierta(abierta - 1)} aria-label="Ficha anterior">◀</button>
              <button className="flecha" disabled={abierta === people.length - 1} onClick={() => setAbierta(abierta + 1)} aria-label="Ficha siguiente">▶</button>
            </div>
          )}
        </ModalCentro>
      )}
    </>
  )
}
