"use client";

import { useEffect, useRef, useState } from "react";

const STEP = 64;

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const characterStatusRef = useRef({
    0: {
      pokemonId: randomIntFromInterval(1, 1025),
      position: { x: 0, y: 0 },
      isMoving: false,
    },
  });

  useEffect(() => {
    imageRef.current = new Image();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (characterStatusRef.current[0].isMoving) return;

      const { x, y } = characterStatusRef.current[0].position;

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
          imageRef.current!!.src = `/pokemon/${characterStatusRef.current[0].pokemonId}.png`;
          newPosition = { x: Math.max(0, x - STEP), y };
          break;
        case "ArrowRight":
          imageRef.current!!.src = `/pokemon/flipped/${characterStatusRef.current[0].pokemonId}.png`;
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
    const canvas = canvasRef.current!!;
    const context = canvas.getContext("2d")!!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    context.fillStyle = "#f0f0f0";
    context.fillRect(0, 0, canvas.width, canvas.height);

    const image = imageRef.current!!;
    image.src = `/pokemon/${characterStatusRef.current[0].pokemonId}.png`;
    image.onload = () => {
      context.drawImage(
        image,
        characterStatusRef.current[0].position.x,
        characterStatusRef.current[0].position.y,
        STEP,
        STEP
      );
    };
  }, [
    characterStatusRef.current[0].pokemonId,
    characterStatusRef.current[0].position,
  ]);

  const animateMove = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    characterStatusRef.current[0].isMoving = true;
    let startTime: number | null = null;

    const duration = 300; // Animation duration in ms

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1); // Progress capped at 1

      const newX = startX + (endX - startX) * progress;
      const newY = startY + (endY - startY) * progress;

      const canvas = canvasRef.current!!;
      const context = canvas.getContext("2d")!!;
      const image = imageRef.current!!;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#f0f0f0";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.drawImage(image, newX, newY, STEP, STEP);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        characterStatusRef.current[0].position = { x: newX, y: newY };
        characterStatusRef.current[0].isMoving = false;
      }
    };

    requestAnimationFrame(animate);
  };

  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
