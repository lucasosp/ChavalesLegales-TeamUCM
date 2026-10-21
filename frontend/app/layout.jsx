import './globals.css'

export const metadata = {
  title: 'Chavales Legales · Tu escudo digital',
  description: 'Aprende ciberseguridad, prevención de ciberacoso y detección de trampas digitales jugando.',
  icons: { icon: '/logo_peque.png' },
}

export const viewport = {
  themeColor: '#022c22',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Fredoka:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
