'use client'
import { useEffect, useState } from 'react'
import { getJuego } from '../lib/api'

export default function useJuego(modo) {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => { getJuego(modo).then(setDatos).catch(e => setError(e.message)) }, [modo])
  return { datos, error }
}
