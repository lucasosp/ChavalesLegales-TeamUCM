import ModalCentro from './ModalCentro'

// Ventana de Legalín tras cada sello. `resultado` es la respuesta del backend (/api/cases/verify).
const TITULO = {
  correcto: '¡Correcto!',
  falta_ok: '¡Bien visto!',
  falta_pendiente: '¡Espera!',
  nada_falta: '¡Incorrecto!',
  incorrecto: '¡Incorrecto!',
}

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
            {resultado.leyes.map(l => <li key={l.code}><b>{l.code}</b><small>{l.officialRef}</small></li>)}
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
