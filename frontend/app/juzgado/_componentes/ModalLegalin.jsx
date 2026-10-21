import ModalCentro from './ModalCentro'

// Ventana de Legalín tras cada sello. `resultado` es la respuesta del backend (/api/cases/verify).
const TITULO = {
  correcto: '¡Correcto!',
  falta_ok: '¡Bien visto!',
  falta_pendiente: '¡Espera!',
  nada_falta: '¡Incorrecto!',
  incorrecto: '¡Incorrecto!',
}

// Identificador BOE dentro de la cita oficial, p. ej. «… (BOE-A-1995-25444), art. 172 ter».
const idBoe = ref => ref?.match(/\((BOE-[A-Z]-\d{4}-\d+)\)/)?.[1]

export default function ModalLegalin({ resultado, esUltimo, onCerrar, onSiguiente }) {
  const { tipo, correcto, mensaje } = resultado
  return (
    <ModalCentro titulo={TITULO[tipo]} className={correcto ? 'ok' : 'ko'}>
      <img src="/mascota.jpg" alt="Legalín, la mascota" />
      <h2>{TITULO[tipo]}</h2>

      {tipo === 'incorrecto' && (
        <ul className="modal__fallos">
          <li>{resultado.veredictoOk ? '✅ El veredicto está bien.' : '⚖️ El veredicto no es el correcto.'}</li>
          {!resultado.recursoOk && <li>📞 Ese recurso no es el más adecuado.</li>}
        </ul>
      )}
      <p className="modal__msg">{mensaje}</p>
      {!correcto && <p className="modal__penal">−1 ⭐ en este caso</p>}

      {tipo === 'correcto' && (
        <>
          <ul className="modal__leyes">
            {resultado.leyes.map(l => {
              const id = idBoe(l.officialRef)
              return (
                <li key={l.code}>
                  <b>{l.code}</b>
                  <span>{l.kidText || l.simplified || l.summary}</span>
                  {id && (
                    <a className="ley-link" href={`https://www.boe.es/buscar/act.php?id=${id}`} target="_blank" rel="noopener noreferrer">
                      📜 Ver la ley en el BOE ↗
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
          {resultado.recurso && (
            <p className="modal__recurso">📞 <b>{resultado.recurso.nombre}</b> ({resultado.recurso.contacto}): {resultado.recurso.cuando}</p>
          )}
          <p className="modal__estrellas">{'⭐'.repeat(resultado.estrellas) || 'Sin estrellas esta vez'}</p>
        </>
      )}

      {tipo === 'correcto' && <button className="btn" onClick={onSiguiente}>{esUltimo ? 'Ver resultado' : 'Siguiente caso →'}</button>}
      {tipo === 'falta_ok' && <button className="btn" onClick={onCerrar}>Ver lo que faltaba</button>}
      {!correcto && <button className="btn" onClick={onCerrar}>Volver a intentarlo</button>}
    </ModalCentro>
  )
}
