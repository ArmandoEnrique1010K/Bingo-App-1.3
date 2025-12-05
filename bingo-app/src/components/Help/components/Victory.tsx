export default function Victory() {
  return (
    <>
      <h3 className="text-2xl pt-2 font-bold">¿Como ganar?</h3>
      <ul className="list-disc pl-10 list-outside space-y-2">
        <li>
          <span className="font-semibold">Se rápido: </span>Marca los números
          antes que los bots.
        </li>
        <li>
          <span className="font-semibold">Forma el patrón correcto: </span>
          Cuando creas haber completado el objetivo, presiona el botón de
          verificación.
        </li>
        <li>
          <span className="font-semibold">Evita perder: </span>
          Si un bot marca el patrón antes que tú, perderás y deberás intentarlo
          de nuevo.
        </li>
      </ul>
    </>
  );
}
