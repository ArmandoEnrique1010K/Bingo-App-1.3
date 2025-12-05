import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAppStore } from "../../store/useAppStore";
import Intro from "./components/Intro";
import Menu from "./components/Menu";
import Game from "./components/Game";
import Victory from "./components/Victory";
import PowerUp from "./components/PowerUp";

export default function HelpModal() {
  const closeHelpModal = useAppStore((state) => state.closeHelpModal);
  const showHelpModal = useAppStore((state) => state.showHelpModal);

  return (
    <>
      <Dialog
        open={showHelpModal}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={closeHelpModal}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-800/50">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-xl transform transition-all duration-300 ease-in-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h2"
                className="text-4xl font-semibold text-center  mb-10"
              >
                Instrucciones
              </DialogTitle>
              <div className="text-lg space-y-4">
                <Intro />
                <Menu />
                <Game />
                <Victory />
                <PowerUp />
              </div>
              <div className="mt-10">
                <Button
                  onClick={closeHelpModal}
                  className="w-full py-2 px-4 font-semibold bg-gray-500 text-white rounded-lg text-lg  shadow-black shadow-md hover:bg-gray-900 cursor-pointer"
                >
                  Cerrar
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

/* TODO: CAMBIO DE OPACIDAD EN TAILWIND CSS 4 https://tailwindcss.com/docs/background-color#changing-the-opacity */
