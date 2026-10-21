// Bocadillo de Legalín dentro del juzgado (estilos propios en juzgado.css).
export default function Juez({ children }) {
  return (
    <div className="juez">
      <img src="/mascota.jpg" alt="Legalín, la mascota" />
      <p className="bocadillo">{children}</p>
    </div>
  )
}
