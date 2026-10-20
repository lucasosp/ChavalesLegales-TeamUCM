export async function getJuego(modo) {
  const r = await fetch(`/api/juegos/${modo}`)
  if (!r.ok) throw new Error('No se pudo cargar el juego')
  return r.json()
}
