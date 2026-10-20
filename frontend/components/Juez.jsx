// Bocadillo de Legalín, la mascota que guía cada juego.
export default function Juez({ children }) {
  return (
    <div className="juez">
      <img src="/mascota.jpg" alt="Legalín, la mascota" />
      <p className="bocadillo">{children}</p>
    </div>
  )
}
