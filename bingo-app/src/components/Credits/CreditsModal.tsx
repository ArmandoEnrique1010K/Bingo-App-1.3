import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAppStore } from "../../store/useAppStore";
import Intro from "./components/Intro";
import Technologies from "./components/Technologies";
import Libraries from "./components/Libraries";
import Sounds from "./components/Sounds";
import Musics from "./components/Musics";
import Others from "./components/Others";

export default function CreditsModal() {
  const showCreditsModal = useAppStore((state) => state.showCreditsModal);
  const closeCreditsModal = useAppStore((state) => state.closeCreditsModal);

  return (
    <>
      <Dialog
        open={showCreditsModal}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={closeCreditsModal}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-gray-800/50">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl transform transition-all duration-300 ease-in-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
            >
              <DialogTitle
                as="h2"
                className="text-4xl font-semibold text-center mb-10"
              >
                Créditos del autor
              </DialogTitle>
              <div className="space-y-4 text-lg">
                <Intro />
                <Technologies />
                <Libraries />
                <Sounds />
                <Musics />
                <Others />
              </div>

              <div className="mt-10">
                <Button
                  onClick={closeCreditsModal}
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
