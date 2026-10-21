'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Novela() {
  const router = useRouter()
  useEffect(() => {
    const exit = (event) => {
      const frame = document.getElementById('novela-frame')
      if (event.origin === location.origin && event.source === frame?.contentWindow && event.data?.type === 'legalinstory:exit') router.push('/')
    }
    window.addEventListener('message', exit)
    return () => window.removeEventListener('message', exit)
  }, [router])

  return (
    <main style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#07050a' }}>
      <Link href="/" style={{ position: 'absolute', top: 8, left: 12, zIndex: 1, color: '#f3eae7', background: '#171223', padding: '8px 12px', borderRadius: 8 }}>← Inicio</Link>
      <iframe id="novela-frame" title="No lo reenvíes · Novela visual interactiva" src="/novela/index.html" style={{ width: '100%', height: '100%', border: 0, paddingTop: 48 }} />
    </main>
  )
}
