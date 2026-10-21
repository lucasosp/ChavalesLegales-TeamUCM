'use client'

import { useEffect, useRef, useState } from 'react'
import { derivar, SITUACIONES } from '../lib/derivacion/reglas.mjs'
import { alternarTipo, crearRespuestas, pasoAnterior, siguienteDesdeDetalles, siguienteDesdeSituaciones } from '../lib/derivacion/flujo.mjs'
import { urlOficialValida } from '../lib/derivacion/recursos.mjs'
import styles from './AyudaDerivacion.module.css'

const PREGUNTAS_IMAGEN = [
  { id: 'publicado', texto: '¿Está publicado en una web o red social, fuera de mensajes privados o correo?' },
  { id: 'sensible', texto: '¿Muestra contenido sexual o una agresión?' },
  { id: 'riesgoGrave', texto: '¿Su difusión te está causando, o puede causarte, un daño grave?' },
  { id: 'espana', texto: '¿La persona afectada es española o está en España?' },
]

function EnlaceOficial({ recurso, principal = false }) {
  if (!urlOficialValida(recurso.url)) return null
  return (
    <a className={principal ? styles.primaryLink : styles.secondaryLink}
      href={recurso.url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
      Abrir página oficial de {recurso.nombre} <span aria-hidden="true">↗</span>
    </a>
  )
}

function TarjetaRecurso({ recurso, principal = false }) {
  return (
    <article className={principal ? styles.primaryCard : styles.resourceCard}>
      <p className={styles.eyebrow}>{principal ? 'Recurso recomendado' : 'También puede ayudarte'}</p>
      <h2>{recurso.nombre}</h2>
      <p>{recurso.descripcion}</p>
      <p><strong>Por qué aparece:</strong> {recurso.motivo}</p>
      <p><strong>Qué puedes esperar:</strong> {recurso.espera}</p>
      <p><strong>Ten en cuenta:</strong> {recurso.limites}</p>
      <p className={styles.kind}>Tipo de ayuda: {recurso.tipoAyuda}</p>
      {recurso.telefono && <a className={styles.phoneLink} href={`tel:${recurso.telefono.replaceAll(' ', '')}`}>
        Llamar al {recurso.telefono}
      </a>}
      <EnlaceOficial recurso={recurso} principal={principal} />
    </article>
  )
}

export default function AyudaDerivacion() {
  const [paso, setPaso] = useState('urgencia')
  const [respuestas, setRespuestas] = useState(crearRespuestas)
  const [error, setError] = useState('')
  const tituloRef = useRef(null)
  const resultado = paso === 'resultado' ? derivar(respuestas) : null

  useEffect(() => {
    if (paso !== 'urgencia') tituloRef.current?.focus()
  }, [paso])

  const elegirUrgencia = (peligro) => {
    setError('')
    setRespuestas((previas) => ({ ...previas, riesgoInmediato: peligro }))
    setPaso(peligro ? 'resultado' : 'situaciones')
  }

  const alternarSituacion = (id) => {
    setError('')
    setRespuestas((previas) => ({
      ...previas,
      tipos: alternarTipo(previas.tipos, id),
    }))
  }

  const continuarSituaciones = () => {
    const siguiente = siguienteDesdeSituaciones(respuestas.tipos)
    if (!siguiente) {
      setError('Elige una opción. Si tienes dudas, puedes marcar «No sé exactamente qué está pasando».')
      return
    }
    setError('')
    setPaso(siguiente)
  }

  const continuarDetalles = () => {
    const siguiente = siguienteDesdeDetalles(respuestas.detalles)
    if (!siguiente) {
      setError('Responde las cuatro preguntas. Puedes elegir «No lo sé».')
      return
    }
    setError('')
    setPaso(siguiente)
  }

  const volver = () => {
    setError('')
    setPaso(pasoAnterior(paso, respuestas))
  }

  const reiniciar = () => {
    setRespuestas(crearRespuestas())
    setError('')
    setPaso('urgencia')
  }

  return (
    <div className={styles.flow}>
      <div className={styles.emergencyStrip} role="note">
        <div><strong>¿Estás en peligro ahora?</strong><span> Llama al 112. Si es seguro, busca a una persona adulta de confianza.</span></div>
        <div className={styles.emergencyActions}>
          <a href="tel:112" className={styles.emergencyCall}>Llamar al 112</a>
          {paso !== 'resultado' && <button type="button" onClick={() => elegirUrgencia(true)}>Ver ayuda urgente</button>}
        </div>
      </div>

      <div className={styles.panel} aria-live="polite">
        {paso === 'urgencia' && <section aria-labelledby="pregunta-urgencia">
          <p className={styles.eyebrow}>Paso 1 de 3</p>
          <h2 id="pregunta-urgencia" ref={tituloRef} tabIndex={-1}>¿Estás en peligro inmediato?</h2>
          <p>Por ejemplo, alguien puede hacerte daño ahora o necesitas ayuda urgente. Tú decides qué responder.</p>
          <div className={styles.actions}>
            <button type="button" className={styles.dangerButton} onClick={() => elegirUrgencia(true)}>Sí, necesito ayuda ahora</button>
            <button type="button" className={styles.mainButton} onClick={() => elegirUrgencia(false)}>No, puedo continuar</button>
          </div>
        </section>}

        {paso === 'situaciones' && <section aria-labelledby="pregunta-situacion">
          <p className={styles.eyebrow}>Paso 2 de 3</p>
          <h2 id="pregunta-situacion" ref={tituloRef} tabIndex={-1}>¿Qué está pasando?</h2>
          <p>Puedes elegir varias opciones. No hace falta contar detalles ni dar datos personales.</p>
          <div className={styles.options} role="group" aria-label="Situaciones que quieres consultar">
            {SITUACIONES.map(({ id, texto }) => <button key={id} type="button"
              className={respuestas.tipos.includes(id) ? styles.selectedOption : styles.option}
              aria-pressed={respuestas.tipos.includes(id)} onClick={() => alternarSituacion(id)}>{texto}</button>)}
          </div>
          <label className={styles.checkRow}>
            <input type="checkbox" checked={respuestas.procedimientoAbierto}
              onChange={(evento) => setRespuestas((previas) => ({ ...previas, procedimientoAbierto: evento.target.checked }))} />
            Ya tengo un asunto judicial y quiero consultar cómo seguirlo
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}><button type="button" className={styles.backButton} onClick={volver}>Volver</button>
            <button type="button" className={styles.mainButton} onClick={continuarSituaciones}>Continuar</button></div>
        </section>}

        {paso === 'detalles' && <section aria-labelledby="pregunta-detalles">
          <p className={styles.eyebrow}>Paso 3 de 3</p>
          <h2 id="pregunta-detalles" ref={tituloRef} tabIndex={-1}>Unas preguntas sobre las imágenes</h2>
          <p>Sirven para saber si el Canal Prioritario de la AEPD podría encajar. Puedes responder «No lo sé».</p>
          {PREGUNTAS_IMAGEN.map(({ id, texto }) => <fieldset className={styles.question} key={id}>
            <legend>{texto}</legend>
            <div className={styles.radioRow}>{[['si', 'Sí'], ['no', 'No'], ['no_se', 'No lo sé']].map(([valor, etiqueta]) =>
              <label key={valor}><input type="radio" name={id} value={valor}
                checked={respuestas.detalles[id] === valor}
                onChange={() => { setError(''); setRespuestas((previas) => ({ ...previas, detalles: { ...previas.detalles, [id]: valor } })) }} /> {etiqueta}</label>)}</div>
          </fieldset>)}
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}><button type="button" className={styles.backButton} onClick={volver}>Volver</button>
            <button type="button" className={styles.mainButton} onClick={continuarDetalles}>Ver recursos</button></div>
        </section>}

        {paso === 'resultado' && <section aria-labelledby="titulo-resultado">
          <p className={styles.eyebrow}>Orientación para ti</p>
          <h2 id="titulo-resultado" ref={tituloRef} tabIndex={-1}>{resultado?.emergencia ? 'Pide ayuda ahora' : 'Estos recursos pueden ayudarte'}</h2>
          {resultado?.error ? <p className={styles.error} role="alert">{resultado.error}</p> : <>
            {resultado.emergencia && <p className={styles.urgentText}>Llama al <a href="tel:112">112</a> ahora. Si puedes hacerlo con seguridad, acércate a una persona adulta de confianza.</p>}
            <TarjetaRecurso recurso={resultado.recursoPrincipal} principal />
            {!!resultado.recursosAdicionales.length && <div className={styles.additional}>
              <h3>Otros recursos</h3>
              {resultado.recursosAdicionales.map((recurso) => <TarjetaRecurso key={recurso.id} recurso={recurso} />)}
            </div>}
          </>}
          <div className={styles.actions}><button type="button" className={styles.backButton} onClick={volver}>Modificar respuestas</button>
            <button type="button" className={styles.resetButton} onClick={reiniciar}>Empezar de nuevo</button></div>
        </section>}
      </div>
      <p className={styles.privacy}>Tus respuestas solo se usan en esta pantalla: no se guardan ni se envían. Esta orientación no sustituye la ayuda profesional ni es asesoramiento jurídico individual.</p>
    </div>
  )
}
