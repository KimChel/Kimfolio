"use client";
import { s } from "framer-motion/client";
import {
  Application,
  Container,
  AnimatedSprite,
  Assets,
  Spritesheet,
  SpritesheetData,
  Texture,
} from "pixi.js";
import { useEffect, useRef } from "react";

export default function Car() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new Application();

    (async () => {
      await app.init({
        resizeTo: containerRef.current,
        backgroundAlpha: 0, // transparent so PNGs behind are visible
      });
      containerRef.current!.appendChild(app.canvas);
      const sheet = await Assets.load("/assets/carro.json");
      const frames = sheet.animations!["car_yellow"];

      const carroSprite = new AnimatedSprite(frames);

      carroSprite.animationSpeed = 1 / 6;
      carroSprite.position.set(300, 800);
      carroSprite.play();

      carroSprite.eventMode = "static";

      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;

      carroSprite.on("pointerdown", (e) => {
        dragging = true;

        const global = e.global;
        offsetX = global.x - carroSprite.x;
        offsetY = global.y - carroSprite.y;
      });

      app.stage.on("pointermove", (e) => {
        debugger
        if (!dragging) return;

        const global = e.global;
        carroSprite.x = global.x - offsetX;
        carroSprite.y = global.y - offsetY;
      });

      app.stage.on("pointerup", () => {
        dragging = false;
        carroSprite.cursor = "grab";
      });

      app.stage.on("pointerupoutside", () => {
        dragging = false;
        carroSprite.cursor = "grab";
      });

      app.stage.addChild(carroSprite);
    })();

    return () => {
      app.destroy(true, true);
      if (containerRef.current?.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
