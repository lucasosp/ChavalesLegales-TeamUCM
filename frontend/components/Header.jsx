import Link from 'next/link'

export default function Header() {
  return (
    <>
      <div className="topbar">Portal educativo para la seguridad digital de menores</div>
      <header className="header wrap">
        <Link href="/" className="brand">
          <img src="/mascota.jpg" alt="" />
          <span>Chavales <b>Legales</b></span>
        </Link>
        <nav>
          <Link href="/profesores">Profesores</Link>
          <Link href="/historia">Historia</Link>
          <Link href="/juicio">Juicio</Link>
          <Link href="/preguntas">Preguntas</Link>
          <Link href="/cooperativo">Cooperativo</Link>
        </nav>
      </header>
    </>
  )
}
