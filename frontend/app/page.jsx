import Link from 'next/link'

const MODOS = [
  { href: '/historia', icono: '📖', titulo: 'Modo historia', texto: 'Vive una aventura y decide qué hacer. ¡Cada elección cuenta!' },
  { href: '/preguntas', icono: '❓', titulo: 'Preguntas', texto: 'Pon a prueba lo que sabes sobre internet seguro.' },
  { href: '/cooperativo', icono: '🤝', titulo: 'Cooperativo', texto: 'Juega con un amigo o amiga: os turnáis y sumáis puntos juntos.' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Aprende jugando</p>
          <h1>¡Hola, soy el <span>Juez Mono</span>!</h1>
          <p className="lead">Te enseño a protegerte en internet: trampas por mensaje, acoso y vídeos falsos.
            ¿Te atreves a ser un Chaval Legal?</p>
          <Link className="btn" href="/historia">¡Empezar a jugar!</Link>
        </div>
        <img className="hero__img" src="/mascota.jpg" alt="Juez Mono, la mascota" />
      </section>

      <h2>Elige un juego</h2>
      <section className="cards">
        {MODOS.map(m => (
          <Link key={m.href} href={m.href} className="card">
            <span className="card__ico">{m.icono}</span>
            <h3>{m.titulo}</h3>
            <p>{m.texto}</p>
            <span className="card__go">Jugar →</span>
          </Link>
        ))}
      </section>
    </>
  )
}
