import { ToastContentProps } from "react-toastify";

export default function JoinRequestButton({ closeToast }: ToastContentProps) {
  return (
    // using a grid with 3 columns
    <div className="grid grid-cols-[1fr_1px_80px] w-full">
      <div className="flex flex-col p-4">
        <h3 className="text-zinc-800 text-sm font-semibold">
          Someone want to join this room
        </h3>
        <p className="text-sm">name</p>
      </div>
      {/* that's the vertical line which separate the text and the buttons*/}
      <div className="bg-zinc-900/20 h-full" />
      <div className="grid grid-rows-[1fr_1px_1fr] h-full">
        <div className="bg-zinc-900/20 w-full" />
        {/*specifying a custom closure reason that can be used with the onClose callback*/}
        <button onClick={() => closeToast("ignore")}>Deny Entry</button>
        {/*specifying a custom closure reason that can be used with the onClose callback*/}
        <button onClick={() => closeToast("reply")} className="text-purple-600">
          Admit
        </button>
      </div>
    </div>
  );
}
