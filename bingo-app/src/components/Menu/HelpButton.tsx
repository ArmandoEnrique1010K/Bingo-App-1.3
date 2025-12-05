import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import HelpModal from "../Help/HelpModal";
import { useAppStore } from "../../store/useAppStore";

export default function HelpButton() {
  const levelData = useAppStore((state) => state.levelData);
  const openHelpModal = useAppStore((state) => state.openHelpModal);

  const { color } = levelData;

  return (
    <>
      <button
        onClick={openHelpModal}
        className={`sm:py-4 py-2 px-2 text-${color}-500 cursor-pointer`}
      >
        <QuestionMarkCircleIcon className="sm:w-8 w-6" aria-hidden="true" />
      </button>

      <HelpModal />
    </>
  );
}
