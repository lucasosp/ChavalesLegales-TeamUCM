import { detallesCompletos, requiereDetalles } from './reglas.mjs'

export const crearRespuestas = () => ({ riesgoInmediato: null, tipos: [], detalles: {}, procedimientoAbierto: false })

export function alternarTipo(tipos, id) {
  if (id === 'incierto') return ['incierto']
  return tipos.includes(id) ? tipos.filter((tipo) => tipo !== id) :
    [...tipos.filter((tipo) => tipo !== 'incierto'), id]
}

export function siguienteDesdeSituaciones(tipos) {
  if (!tipos.length) return null
  return requiereDetalles(tipos) ? 'detalles' : 'resultado'
}

export function siguienteDesdeDetalles(detalles) {
  return detallesCompletos(detalles) ? 'resultado' : null
}

export function pasoAnterior(paso, respuestas) {
  if (paso === 'resultado') return respuestas.riesgoInmediato ? 'urgencia' :
    requiereDetalles(respuestas.tipos) ? 'detalles' : 'situaciones'
  if (paso === 'detalles') return 'situaciones'
  return 'urgencia'
}
