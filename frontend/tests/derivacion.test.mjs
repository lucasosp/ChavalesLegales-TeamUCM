import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { derivar, detallesCompletos, requiereDetalles, SITUACIONES } from '../lib/derivacion/reglas.mjs'
import { HOSTS_PERMITIDOS, RECURSOS, urlOficialValida } from '../lib/derivacion/recursos.mjs'
import { alternarTipo, crearRespuestas, pasoAnterior, siguienteDesdeDetalles, siguienteDesdeSituaciones } from '../lib/derivacion/flujo.mjs'

const respuesta = (tipos, adicionales = {}) => ({ riesgoInmediato: false, tipos, ...adicionales })

test('cada categoría obtiene una derivación útil', () => {
  const principales = {
    acoso: 'anar', solicitud: 'anar', difusion: 'anar', falsas: 'anar',
    cuenta: 'incibe', estafa: 'incibe', incierto: 'anar',
  }
  for (const { id } of SITUACIONES) {
    const detalles = requiereDetalles([id]) ? { detalles: { publicado: 'no_se', sensible: 'no_se', riesgoGrave: 'no_se', espana: 'no_se' } } : {}
    assert.equal(derivar(respuesta([id], detalles)).recursoPrincipal.id, principales[id], id)
  }
})

test('el peligro inmediato evita todas las preguntas y prioriza el 112', () => {
  for (const entrada of [
    { riesgoInmediato: true },
    { riesgoInmediato: true, tipos: ['falsas'], detalles: {} },
    { riesgoInmediato: true, tipos: ['valor_invalido'] },
  ]) {
    const salida = derivar(entrada)
    assert.equal(salida.emergencia, true)
    assert.equal(salida.recursoPrincipal.id, 'emergencias')
    assert.equal(salida.recursoPrincipal.telefono, '112')
  }
})

test('las respuestas incompletas o incompatibles devuelven error', () => {
  assert.match(derivar({}).error, /peligro inmediato/)
  assert.match(derivar(respuesta([])).error, /Elige/)
  assert.match(derivar(respuesta(['falsas'])).error, /imágenes/)
  assert.match(derivar(respuesta(['incierto', 'estafa'])).error, /Elige/)
  assert.match(derivar(respuesta(['ajeno'])).error, /Elige/)
  assert.equal(detallesCompletos({ publicado: 'si' }), false)
})

test('la AEPD solo aparece si se cumplen las cuatro condiciones declaradas', () => {
  const completos = { publicado: 'si', sensible: 'si', riesgoGrave: 'si', espana: 'si' }
  for (const tipo of ['difusion', 'falsas']) {
    assert.equal(derivar(respuesta([tipo], { detalles: completos })).recursoPrincipal.id, 'aepd')
    for (const campo of Object.keys(completos)) {
      for (const valor of ['no', 'no_se']) {
        const salida = derivar(respuesta([tipo], { detalles: { ...completos, [campo]: valor } }))
        assert.notEqual(salida.recursoPrincipal.id, 'aepd', `${tipo}: ${campo}=${valor}`)
        assert.ok(!salida.recursosAdicionales.some(({ id }) => id === 'aepd'))
      }
    }
  }
  assert.equal(derivar(respuesta(['cuenta'], { detalles: completos })).recursoPrincipal.id, 'incibe')
})

test('varios problemas mantienen recursos complementarios sin duplicados', () => {
  const salida = derivar(respuesta(['acoso', 'cuenta', 'estafa']))
  assert.equal(salida.recursoPrincipal.id, 'anar')
  const ids = salida.recursosAdicionales.map(({ id }) => id)
  assert.ok(ids.includes('incibe'))
  assert.ok(ids.includes('policia'))
  assert.ok(ids.includes('guardiaCivil'))
  assert.equal(new Set(ids).size, ids.length)
})

test('sede y Carpeta Justicia solo se añaden si ya existe un asunto judicial', () => {
  const sin = derivar(respuesta(['acoso']))
  const con = derivar(respuesta(['acoso'], { procedimientoAbierto: true }))
  assert.ok(!sin.recursosAdicionales.some(({ id }) => ['sedeJudicial', 'carpetaJusticia'].includes(id)))
  assert.ok(con.recursosAdicionales.some(({ id }) => id === 'sedeJudicial'))
  assert.ok(con.recursosAdicionales.some(({ id }) => id === 'carpetaJusticia'))
})

test('todos los destinos del catálogo son HTTPS y están en la lista cerrada', () => {
  for (const recurso of Object.values(RECURSOS)) {
    assert.ok(urlOficialValida(recurso.url), recurso.id)
    assert.ok(HOSTS_PERMITIDOS.includes(new URL(recurso.url).hostname))
  }
  for (const url of ['http://www.aepd.es/canalprioritario', 'https://www.aepd.es.ejemplo.com/',
    'https://evil.org/', 'javascript:alert(1)', 'https://user@www.anar.org/', 'https://www.anar.org:444/']) {
    assert.equal(urlOficialValida(url), false, url)
  }
})

test('el flujo de ayuda no incorpora envío ni persistencia de respuestas', () => {
  const fuente = readFileSync(new URL('../components/AyudaDerivacion.jsx', import.meta.url), 'utf8')
  for (const llamada of ['fetch(', 'sendBeacon(', 'localStorage', 'sessionStorage', 'XMLHttpRequest', '<form']) {
    assert.ok(!fuente.includes(llamada), llamada)
  }
})

test('la navegación permite avanzar, retroceder, corregir y reiniciar', () => {
  const inicial = crearRespuestas()
  assert.equal(siguienteDesdeSituaciones(inicial.tipos), null)
  const seleccion = alternarTipo(inicial.tipos, 'difusion')
  assert.equal(siguienteDesdeSituaciones(seleccion), 'detalles')
  assert.equal(siguienteDesdeDetalles({ publicado: 'si' }), null)
  const completos = { publicado: 'no_se', sensible: 'no_se', riesgoGrave: 'no_se', espana: 'no_se' }
  assert.equal(siguienteDesdeDetalles(completos), 'resultado')
  assert.equal(pasoAnterior('resultado', { ...inicial, riesgoInmediato: false, tipos: seleccion }), 'detalles')
  assert.equal(pasoAnterior('detalles', inicial), 'situaciones')
  assert.equal(pasoAnterior('situaciones', inicial), 'urgencia')
  assert.equal(pasoAnterior('resultado', { ...inicial, riesgoInmediato: true }), 'urgencia')
  assert.deepEqual(alternarTipo(['acoso'], 'incierto'), ['incierto'])
  assert.deepEqual(alternarTipo(['incierto'], 'estafa'), ['estafa'])
  assert.deepEqual(crearRespuestas(), inicial)
  assert.notEqual(crearRespuestas(), inicial)
  assert.equal(siguienteDesdeSituaciones(['estafa']), 'resultado')
})
