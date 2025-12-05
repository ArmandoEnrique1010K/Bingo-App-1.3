export default function Menu() {
  return (
    <>
      <h3 className="text-2xl pt-2 font-bold">Menú principal</h3>
      <p>
        En el menú principal encontrarás varias opciones para interactuar con el
        juego:
      </p>
      <ul className="list-disc pl-10 list-outside space-y-2">
        <li>
          <span className="font-semibold">Niveles: </span>Accede a los distintos
          desafíos y desbloquea nuevos niveles
        </li>
        <li>
          <span className="font-semibold">Música: </span> Activa o desactiva la
          música de fondo.
        </li>
        <li>
          <span className="font-semibold">Sonidos: </span> Ajusta los efectos de
          sonido del juego.
        </li>
        <li>
          <span className="font-semibold">Créditos: </span>Conoce al creador de
          BingoApp.
        </li>
        <li>
          <span className="font-semibold">Reiniciar partida: </span>Vuelve a
          empezar el nivel actual.
        </li>
        <li>
          <span className="font-semibold">Abandonar partida: </span>
          Regresa al menú principal
        </li>
      </ul>
    </>
  );
}
