// Efectos de sonido sintetizados con Web Audio (sin archivos de audio).
// El silencio se recuerda en el navegador del jugador.
let ctx = null
let silencio = false
try { silencio = localStorage.getItem('jz-silencio') === '1' } catch { /* sin almacenamiento: con sonido */ }

export const estaSilenciado = () => silencio

export function setSilencio(valor) {
  silencio = valor
  try { localStorage.setItem('jz-silencio', valor ? '1' : '0') } catch { /* no pasa nada */ }
}

function audio() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Nota con envolvente rápida (ataque 10 ms y caída exponencial).
function tono(a, { frec, hasta = frec, tipo = 'sine', ini = 0, dur = 0.15, vol = 0.3 }) {
  const t = a.currentTime + ini
  const o = a.createOscillator(), g = a.createGain()
  o.type = tipo
  o.frequency.setValueAtTime(frec, t)
  o.frequency.exponentialRampToValueAtTime(hasta, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(a.destination)
  o.start(t)
  o.stop(t + dur + 0.02)
}

// Ráfaga de ruido filtrado (golpes y papel).
function ruido(a, { ini = 0, dur = 0.1, vol = 0.3, filtro = 1200, tipoFiltro = 'lowpass', hastaFiltro }) {
  const t = a.currentTime + ini
  const n = Math.floor(a.sampleRate * dur)
  const buf = a.createBuffer(1, n, a.sampleRate), datos = buf.getChannelData(0)
  for (let i = 0; i < n; i++) datos[i] = (Math.random() * 2 - 1) * (1 - i / n)
  const src = a.createBufferSource()
  src.buffer = buf
  const f = a.createBiquadFilter()
  f.type = tipoFiltro
  f.frequency.setValueAtTime(filtro, t)
  if (hastaFiltro) f.frequency.exponentialRampToValueAtTime(hastaFiltro, t + dur)
  const g = a.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(a.destination)
  src.start(t)
}

const SONIDOS = {
  sello: a => { ruido(a, { dur: 0.09, vol: 0.5, filtro: 900 }); tono(a, { frec: 150, hasta: 60, dur: 0.16, vol: 0.5 }) },
  mazazo: a => {
    ruido(a, { dur: 0.05, vol: 0.6, filtro: 3000, tipoFiltro: 'bandpass' })
    tono(a, { frec: 220, hasta: 90, tipo: 'triangle', dur: 0.22, vol: 0.55 })
    tono(a, { frec: 110, hasta: 50, dur: 0.3, vol: 0.45 })
  },
  pagina: a => ruido(a, { dur: 0.32, vol: 0.22, filtro: 600, tipoFiltro: 'bandpass', hastaFiltro: 3200 }),
  carta: a => tono(a, { frec: 520, hasta: 780, tipo: 'triangle', dur: 0.09, vol: 0.18 }),
  acierto: a => [523, 659, 784, 1047].forEach((f, i) => tono(a, { frec: f, tipo: 'triangle', ini: i * 0.09, dur: 0.22, vol: 0.22 })),
  pista: a => [659, 880].forEach((f, i) => tono(a, { frec: f, tipo: 'triangle', ini: i * 0.1, dur: 0.2, vol: 0.2 })),
  fallo: a => [[330, 300], [262, 200]].forEach(([f, h], i) => tono(a, { frec: f, hasta: h, tipo: 'square', ini: i * 0.16, dur: 0.22, vol: 0.08 })),
  racha: a => [784, 988, 1175, 1568].forEach((f, i) => tono(a, { frec: f, ini: 0.45 + i * 0.07, dur: 0.18, vol: 0.2 })),
}

export function sonar(nombre) {
  if (silencio) return
  const a = audio()
  if (a) SONIDOS[nombre]?.(a)
}
