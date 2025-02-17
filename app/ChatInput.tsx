import { useEffect, useRef } from "react";

export default function ChatInput() {
  const chatInputContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "Enter":
          if (
            chatInputContainerRef.current === null ||
            chatInputContainerRef.current?.style.display === "none"
          ) {
            chatInputContainerRef.current!!.style.display = "block";
            chatInputRef.current!!.focus();
          } else {
            chatInputContainerRef.current!!.style.display = "none";
            chatInputRef.current!!.value = "";

            // TODO: show text
            // TODO: send to websocket
          }
          break;
        default:
          return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0"
      ref={chatInputContainerRef}
      style={{ display: "none" }}
    >
      <input
        type="text"
        className="w-full p-4 outline-none"
        ref={chatInputRef}
      />
    </div>
  );
}
