import TemaCard from '../components/TemaCard'

const API_URL = process.env.API_URL || 'http://localhost:8000'

async function getTemas() {
  try {
    const r = await fetch(`${API_URL}/api/temas`, { cache: 'no-store' })
    return r.ok ? r.json() : null
  } catch {
    return null
  }
}

export default async function Home() {
  const temas = await getTemas()

  return (
    <>
      <header className="hero">
        <div className="hero__in">
          <p className="eyebrow">Team UCM</p>
          <h1>Chavales <em>Legales</em></h1>
          <p className="lead">Aprende a defenderte en internet jugando: qué dice la ley,
            cómo protegerte y a quién pedir ayuda.</p>
          <a className="btn" href="#temas">Empezar</a>
        </div>
      </header>

      <main id="temas" className="wrap">
        <h2>Elige un reto</h2>
        {!temas && <p className="error">API no disponible. Arranca el backend en el puerto 8000.</p>}
        <section className="nav">
          {temas?.map((t, i) => <TemaCard key={t.id} tema={t} n={i + 1} />)}
        </section>
      </main>

      <footer className="wrap foot">
        ¿Necesitas ayuda? INCIBE <strong>017</strong> · AEPD Canal Prioritario · Policía / Guardia Civil
      </footer>
    </>
  )
}
