// API del Juzgado de Legalín (/api/cases/*). El backend corrige: aquí nunca llegan soluciones.
async function pedir(url, opciones) {
  const r = await fetch(url, opciones)
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).detail || 'Algo ha fallado en el juzgado')
  return r.json()
}

const json = body => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const getCasesConfig = () => pedir('/api/cases/config')
export const empezarPartida = (edad, temas, n) => pedir('/api/cases/start', json({ edad, temas, n }))
export const siguienteCaso = partidaId => pedir(`/api/cases/next?partida=${partidaId}`)
export const verificarSello = (partidaId, sello, recurso) => pedir('/api/cases/verify', json({ partidaId, sello, recurso }))
