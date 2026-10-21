import { RECURSOS } from './recursos.mjs'

export const SITUACIONES = Object.freeze([
  { id: 'acoso', texto: 'Me están acosando o amenazando' },
  { id: 'solicitud', texto: 'Alguien me está pidiendo fotos o datos personales' },
  { id: 'difusion', texto: 'Han difundido imágenes mías sin permiso' },
  { id: 'falsas', texto: 'Han creado imágenes falsas sobre mí' },
  { id: 'cuenta', texto: 'Me han robado una cuenta' },
  { id: 'estafa', texto: 'Me han intentado estafar' },
  { id: 'incierto', texto: 'No sé exactamente qué está pasando' },
])

const IDS = new Set(SITUACIONES.map(({ id }) => id))
export const requiereDetalles = (tipos) => tipos.some((tipo) => tipo === 'difusion' || tipo === 'falsas')

export function detallesCompletos(detalles) {
  return ['publicado', 'sensible', 'riesgoGrave', 'espana'].every((campo) =>
    ['si', 'no', 'no_se'].includes(detalles?.[campo]))
}

function recomendacion(id, motivo) {
  return { ...RECURSOS[id], motivo }
}

export function derivar(respuestas = {}) {
  // La emergencia se resuelve antes que cualquier comprobación del cuestionario.
  if (respuestas.riesgoInmediato === true) {
    return {
      emergencia: true,
      recursoPrincipal: recomendacion('emergencias', 'Has indicado que puedes estar en peligro ahora.'),
      recursosAdicionales: [recomendacion('anar', 'También puedes pedir apoyo a alguien especializado en menores cuando estés a salvo.')],
    }
  }
  if (respuestas.riesgoInmediato !== false) return { error: 'Indica primero si hay peligro inmediato.' }

  const tipos = [...new Set(respuestas.tipos ?? [])]
  if (!tipos.length || tipos.some((id) => !IDS.has(id)) || (tipos.includes('incierto') && tipos.length > 1)) {
    return { error: 'Elige al menos una situación válida.' }
  }
  if (requiereDetalles(tipos) && !detallesCompletos(respuestas.detalles)) {
    return { error: 'Responde las preguntas sobre las imágenes. Puedes elegir «No lo sé».' }
  }

  const contenidoElegible = requiereDetalles(tipos) &&
    ['publicado', 'sensible', 'riesgoGrave', 'espana'].every((campo) => respuestas.detalles[campo] === 'si')
  const adicionales = []
  const agregar = (id, motivo) => {
    if (!adicionales.some((recurso) => recurso.id === id)) adicionales.push(recomendacion(id, motivo))
  }

  let principal
  if (contenidoElegible) {
    principal = recomendacion('aepd', 'Has indicado que se ha publicado contenido sexual o de una agresión sin permiso y que puede causarte un daño grave. El canal revisa si cumple sus requisitos.')
    agregar('anar', 'Puede acompañarte y ayudarte a hablar de lo que ocurre.')
    agregar('incibe', 'Puede orientarte sobre los pasos de seguridad digital.')
  } else if (tipos.some((tipo) => ['acoso', 'solicitud', 'difusion', 'falsas'].includes(tipo)) || tipos.includes('incierto')) {
    principal = recomendacion('anar', 'Puedes hablar con profesionales que ayudan a menores, aunque todavía no sepas qué hacer.')
    agregar('incibe', 'Puede orientarte sobre el problema digital y cómo protegerte.')
  } else {
    principal = recomendacion('incibe', 'Puede orientarte sobre cuentas, estafas y seguridad digital.')
    agregar('anar', 'Puede escucharte si esto te preocupa o necesitas apoyo.')
  }

  if (tipos.some((tipo) => ['acoso', 'solicitud', 'difusion', 'falsas', 'cuenta', 'estafa'].includes(tipo))) {
    agregar('policia', 'Si quieres explicar los hechos a la policía, consulta sus canales de atención presencial.')
    agregar('guardiaCivil', 'También puedes consultar los canales de atención de Guardia Civil.')
  }
  if (respuestas.procedimientoAbierto === true) {
    agregar('sedeJudicial', 'Puedes consultar servicios judiciales disponibles para tu caso y territorio.')
    agregar('carpetaJusticia', 'Si ya tienes un asunto judicial, puedes consultar determinados datos de seguimiento.')
  }

  return { emergencia: false, recursoPrincipal: principal, recursosAdicionales: adicionales.filter(({ id }) => id !== principal.id) }
}
