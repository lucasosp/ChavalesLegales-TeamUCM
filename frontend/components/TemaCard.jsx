export default function TemaCard({ tema, n }) {
  return (
    <a className="navcard" href={`#${tema.id}`}>
      <span className="navcard__n">{String(n).padStart(2, '0')}</span>
      <h3>{tema.titulo}</h3>
      <p>{tema.resumen}</p>
      <ul>{tema.juegos.map(j => <li key={j}>{j}</li>)}</ul>
      <small className="navcard__ley">{tema.ley}</small>
      <span className="navcard__go">Jugar →</span>
    </a>
  )
}
