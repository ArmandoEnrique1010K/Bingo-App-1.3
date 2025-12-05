export default function Libraries() {
  return (
    <>
      <p>
        <span className="font-bold">Librerías utilizadas:</span>
      </p>
      <ul className="list-disc list-inside pl-4">
        <li>
          <a
            href="https://www.npmjs.com/package/@heroicons/react"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            HeroIcons
          </a>{" "}
          (iconos)
        </li>
        <li>
          <a
            href="https://headlessui.com/react/dialog"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            HeadlessUI
          </a>{" "}
          (componentes accesibles)
        </li>
        <li>
          <a
            href="https://www.npmjs.com/package/zustand"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            Zustand
          </a>{" "}
          (Manejo del estado global)
        </li>
        <li>
          <a
            href="https://tonejs.github.io/"
            target="_blank"
            className="text-blue-500 hover:underline"
          >
            ToneJS
          </a>{" "}
          (sonidos)
        </li>
      </ul>
    </>
  );
}
