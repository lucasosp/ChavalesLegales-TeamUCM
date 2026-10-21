import Link from 'next/link'
import AyudaDerivacion from '../../components/AyudaDerivacion'
import styles from '../../components/AyudaDerivacion.module.css'

export const metadata = {
  title: 'Necesito ayuda · Chavales Legales',
  description: 'Encuentra orientación y recursos oficiales de ayuda según lo que te preocupa.',
  robots: { index: false, follow: false },
}

export default function NecesitoAyuda() {
  return <main className={styles.page}>
    <div className={styles.container}>
      <Link href="/" className={styles.homeLink}>← Volver a Chavales Legales</Link>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Un espacio para pedir orientación</p>
        <h1>Necesito ayuda</h1>
        <p>Si algo te preocupa en internet, aquí puedes encontrar con quién hablar. No necesitas escribir tu nombre ni contar lo que pasó.</p>
      </header>
      <AyudaDerivacion />
    </div>
  </main>
}
