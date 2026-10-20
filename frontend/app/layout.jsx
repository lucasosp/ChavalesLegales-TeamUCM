import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Chavales Legales',
  description: 'Juegos para que niños y niñas aprendan a protegerse en internet: phishing, acoso y deepfakes.',
}

export const viewport = { themeColor: '#3B0D1C' }

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Header />
        <main className="wrap">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
