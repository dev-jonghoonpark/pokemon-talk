"use client";

import { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import ChatInput from "./ChatInput";
import { useCharacterStore } from "./store/ChracterStore";

const STEP = 64;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const characters = useCharacterStore((state) => state.characters);
  const addCharacter = useCharacterStore((state) => state.addCharacter);
  const updateCharacter = useCharacterStore((state) => state.updateCharacter);

  useEffect(() => {
    imageRef.current = new Image();

    const canvas = canvasRef.current!!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    addCharacter();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (useCharacterStore.getState().characters.length === 0) return;

      const characters = useCharacterStore.getState().characters;
      if (characters[0].isMoving) return;

      const { x, y } = characters[0].position;

      let newPosition = { x, y };
      switch (event.key) {
        case "ArrowUp":
          newPosition = { x, y: Math.max(0, y - STEP) };
          break;
        case "ArrowDown":
          newPosition = {
            x,
            y: Math.min(window.innerHeight - 64, y + STEP),
          };
          break;
        case "ArrowLeft":
          imageRef.current!!.src = `/pokemon/${characters[0].pokemonId}.png`;
          newPosition = { x: Math.max(0, x - STEP), y };
          break;
        case "ArrowRight":
          imageRef.current!!.src = `/pokemon/flipped/${characters[0].pokemonId}.png`;
          newPosition = {
            x: Math.min(window.innerWidth - 64, x + STEP),
            y,
          };
          break;
        default:
          return;
      }
      animateMove(x, y, newPosition.x, newPosition.y);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (characters.length === 0) return;

    const canvas = canvasRef.current!!;
    const context = canvas.getContext("2d")!!;

    const image = imageRef.current!!;
    if (image.src === "") {
      image.src = `/pokemon/flipped/${characters[0].pokemonId}.png`;

      image.onload = () => {
        context.drawImage(
          image,
          characters[0].position.x,
          characters[0].position.y,
          STEP,
          STEP
        );
      };
    } else {
      context.drawImage(
        image,
        characters[0].position.x,
        characters[0].position.y,
        STEP,
        STEP
      );
    }
  }, [characters[0]]);

  const animateMove = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    updateCharacter(0, { isMoving: true });
    let startTime: number | null = null;

    const duration = 300;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newX = startX + (endX - startX) * progress;
      const newY = startY + (endY - startY) * progress;

      const canvas = canvasRef.current!!;
      const context = canvas.getContext("2d")!!;
      const image = imageRef.current!!;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, newX, newY, STEP, STEP);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        updateCharacter(0, {
          position: { x: endX, y: endY },
          isMoving: false,
        });
        context.drawImage(image, newX, newY, STEP, STEP);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div>
      <canvas ref={canvasRef} style={{ backgroundColor: "#f0f0f0" }}></canvas>
      <ChatInput />
      <ToastContainer />
    </div>
  );
}
