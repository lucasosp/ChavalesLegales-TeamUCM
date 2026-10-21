import './juzgado.css'

// Todo el juego vive dentro de .juzgado-app: sus estilos no tocan el resto de la web.
export default function JuzgadoLayout({ children }) {
  return <div className="juzgado-app">{children}</div>
}
