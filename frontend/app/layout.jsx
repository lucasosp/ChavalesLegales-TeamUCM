import './globals.css'

export const metadata = {
  title: 'Chavales Legales · Team UCM',
  description: 'Juegos interactivos para que los menores conozcan la ley frente al phishing, el acecho online y los deepfakes.',
}

export const viewport = { themeColor: '#0B1026' }

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
