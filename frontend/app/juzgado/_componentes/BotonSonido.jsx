'use client'
import { useEffect, useState } from 'react'
import { estaSilenciado, setSilencio, sonar } from './sonidos'

// Botón 🔊/🔇 para activar o silenciar los efectos de sonido.
export default function BotonSonido() {
  const [mudo, setMudo] = useState(false)
  useEffect(() => setMudo(estaSilenciado()), [])

  const alternar = () => {
    setSilencio(!mudo)
    setMudo(!mudo)
    if (mudo) sonar('carta') // al activar, un «clic» para confirmar
  }

  return (
    <button className="jz-sonido" onClick={alternar} aria-pressed={!mudo} title={mudo ? 'Activar sonido' : 'Silenciar'}>
      {mudo ? '🔇' : '🔊'}<span>{mudo ? 'Sin sonido' : 'Sonido'}</span>
    </button>
  )
}
