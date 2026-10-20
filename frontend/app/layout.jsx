import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Chavales Legales',
  description: 'Juegos para que niños y niñas aprendan a protegerse en internet: phishing, acoso y deepfakes.',
}

export const viewport = { themeColor: "#2A0A14" }

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
