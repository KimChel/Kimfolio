"use client";
import { s } from "framer-motion/client";
import { Application, Container, AnimatedSprite, Assets, Spritesheet, SpritesheetData } from "pixi.js";
import { useEffect, useRef } from "react";

export default function Car() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new Application();

    (async () => {

      await app.init({ width: containerRef.current!.clientWidth, height: containerRef.current!.clientHeight });
      document.body.appendChild(app.canvas);

      const sheet: SpritesheetData = await Assets.load("/assets/carro.json");

      const animations = sheet.animations

      const skata = animations!['car_yellow']

      const carroSprite = AnimatedSprite.fromFrames(skata)

      carroSprite.animationSpeed = 1 / 6;                     // 6 fps
      carroSprite.position.set(150, 150); // almost bottom-left corner of the canvas
      carroSprite.play();

    })();

    return () => {
      app.destroy(true, true);
      if (containerRef.current?.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
}