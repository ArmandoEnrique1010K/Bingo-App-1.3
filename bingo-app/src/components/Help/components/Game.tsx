export default function Game() {
  return (
    <>
      <h3 className="text-2xl pt-2 font-bold ">Cómo jugar</h3>
      <ul className="list-disc pl-10 list-outside space-y-2">
        <li>
          <span className="font-semibold">Iniciar partida: </span>
          Presiona el botón "Iniciar" en la sección de números objetivos.
        </li>
        <li>
          <span className="font-semibold">Números aleatorios: </span>
          Se generan durante 20 rondas. Cada número aparecerá solo una vez.
        </li>
        <li>
          <span className="font-semibold">Marcar números: </span>
          Encuentra los números en tu tablero y márcalos.
        </li>
        <li>
          <span className="font-semibold">Competencia con los bots: </span>
          Ellos también marcarán números rápidamente, dependiendo de su nombre y
          la cantidad de tableros asociados.
        </li>
        <li>
          <span className="font-semibold">Tableros múltiples: </span>
          En algunos niveles jugarás con 2 tableros, pero solo necesitas
          completar uno.
        </li>
        <li>
          <span className="font-semibold">Fin del juego: </span> Si tú o un bot
          completan el patrón ganador, el juego termina.
        </li>
        <li>
          <span className="font-semibold">
            Desbloquear el siguiente nivel:{" "}
          </span>
          Si ganas, desbloquearás el siguiente nivel. Los datos se guardan en el
          navegador.
        </li>
      </ul>
    </>
  );
}
