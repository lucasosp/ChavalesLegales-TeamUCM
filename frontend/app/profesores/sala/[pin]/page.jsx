'use client'

import { useParams } from 'next/navigation'
import ApartadoProfesores from '../../page'

export default function SalaProfesorPage() {
  const params = useParams()
  const rawPin = params?.pin || ''
  const cleanPin = Array.isArray(rawPin) ? rawPin[0] : rawPin

  return <ApartadoProfesores initialPin={cleanPin} />
}
