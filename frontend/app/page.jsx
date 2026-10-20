import Link from 'next/link'

const MODOS = [
  { href: '/historia', titulo: 'Modo historia', texto: 'Vive una aventura y decide qué hacer. ¡Cada elección cuenta!' },
  { href: '/preguntas', titulo: 'Preguntas', texto: 'Pon a prueba lo que sabes sobre internet seguro.' },
  { href: '/cooperativo', titulo: 'Cooperativo', texto: 'Juega con un amigo o amiga: os turnáis y sumáis puntos juntos.' },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__in">
          <p className="eyebrow">Aprende jugando</p>
          <h1>¡Hola, soy <em>Legalín</em>!</h1>
          <p className="lead">Te enseño a protegerte en internet: trampas por mensaje, acoso y vídeos falsos.
            ¿Te atreves a ser un Chaval Legal?</p>
          <Link className="btn" href="#juegos">Empezar</Link>
        </div>
        <img className="hero__img" src="/mascota.jpg" alt="Legalín, la mascota" />
      </section>

      <h2 id="juegos">Elige un juego</h2>
      <section className="nav">
        {MODOS.map((m, i) => (
          <Link key={m.href} href={m.href} className="navcard">
            <span className="navcard__n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{m.titulo}</h3>
            <p>{m.texto}</p>
            <span className="navcard__go">Jugar →</span>
          </Link>
        ))}
      </section>
    </>
  )
}
