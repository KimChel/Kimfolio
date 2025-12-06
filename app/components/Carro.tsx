"use client";
import {
  Application,
  AnimatedSprite,
  Assets,
  TextureStyle,
} from "pixi.js";
import Matter from "matter-js";
import { useEffect, useRef } from "react";

export default function Car() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const app = new Application();

    (async () => {

      //
      // ░░   PIXI APP   ░░ 
      //

      await app.init({
        resizeTo: containerRef.current,
        backgroundAlpha: 0, // transparent so PNGs behind are visible
      });

      TextureStyle.defaultOptions.scaleMode = "nearest"


      containerRef.current!.appendChild(app.canvas);

      //
      // ░░   SPRITE SETUP   ░░ 
      //


      //
      // ░░   Carro SETUP   ░░ 
      //
      const carroSheet = await Assets.load("/assets/carro.json");
      const carroYellowFrames = carroSheet.animations!["car_yellow"];

      const carroYellowSprite = new AnimatedSprite(carroYellowFrames);

      //
      // ░░   Neon sign Setup   ░░ 
      //
      const neonSheet = await Assets.load("/assets/neonFrames/neon.json");
      const neonFrames = neonSheet.animations!["neon"];
      const neonSprite = new AnimatedSprite(neonFrames);

      //
      // ░░   Dish Setup   ░░ 
      //

      const dishSheet = await Assets.load("/assets/dishFrames/dish.json");
      const dishFrames = dishSheet.animations["dish"]
      const dishSprite = new AnimatedSprite(dishFrames)

      neonSprite.animationSpeed = Math.floor(Math.random() * 1 + 2) / 90;
      neonSprite.play();

      carroYellowSprite.animationSpeed = 1 / 6;
      carroYellowSprite.play();
      carroYellowSprite.eventMode = "static";

      dishSprite.animationSpeed = 1 / 4;
      dishSprite.play();

      //
      // ░░   MATERIAL ENGINE   ░░ 
      //

      const engine = Matter.Engine.create();
      engine.gravity.y = 1.2;
      let groundWidth = containerRef.current!.clientWidth;

      //
      // ░░   PHYSICS FOR CARRO   ░░ 
      //

      const carroBody = Matter.Bodies.rectangle(
        carroYellowSprite.width,
        carroYellowSprite.height,
        carroYellowSprite.width,
        carroYellowSprite.height,
        {
          restitution: 0.2,
          friction: 0.8,
        }
      )

      //
      // ░░   GROUND COLLIDER   ░░ 
      //

      const ground = Matter.Bodies.rectangle(
        groundWidth / 2,
        containerRef.current!.clientHeight - 200,
        groundWidth,
        40,
        { isStatic: true }
      )

      Matter.World.add(engine.world, [carroBody, ground]);

      //
      // ░░   RESPONSIVE LOGIC   ░░ 
      //
      const carrorelX = 0.12;
      const carrorelY = 0.80;

      const neonRelX = 0.4
      const neonRelY = 0.3

      const dishRelX = 0.45
      const dishRelY = 0.3

      let lastCarroScale = 1;

      resizeSprite();
      window.addEventListener("resize", resizeSprite);

      function resizeSprite() {
        const carroScale = containerRef.current!.clientWidth / 1920;
        const neonScale = containerRef.current!.clientWidth / 600;
        const dishScale = containerRef.current!.clientWidth / 600;
        const newGroundWidth = containerRef.current!.clientWidth;

        const scaleRatio = carroScale / lastCarroScale;
        Matter.Body.scale(carroBody, scaleRatio, scaleRatio);
        lastCarroScale = carroScale;

        const groundScaleX = newGroundWidth / groundWidth;
        Matter.Body.scale(ground, groundScaleX, 1);
        groundWidth = newGroundWidth;
        Matter.Body.setPosition(ground, {
          x: newGroundWidth / 2,
          y: containerRef.current!.clientHeight - 200
        });

        carroYellowSprite.scale.set(carroScale);
        neonSprite.scale.set(neonScale);
        dishSprite.scale.set(dishScale);

        const carroX = containerRef.current!.clientWidth * carrorelX;
        const carroY = containerRef.current!.clientHeight * carrorelY;
        Matter.Body.setPosition(carroBody, { x: carroX, y: carroY });
        carroYellowSprite.x = carroBody.position.x;
        carroYellowSprite.y = carroBody.position.y;


        neonSprite.x = containerRef.current!.clientWidth * neonRelX;
        neonSprite.y = containerRef.current!.clientHeight * neonRelY;

        dishSprite.x = containerRef.current!.clientWidth * dishRelX;
        dishSprite.y = containerRef.current!.clientHeight * dishRelY;
      }


      //
      // ░░   DRAGGING LOGIC   ░░ 
      //

      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;
      let pointerHistory: { x: number, y: number, t: number }[] = [];

      function recordPointer(global: { x: number, y: number }) {
        pointerHistory.push({ x: global.x, y: global.y, t: performance.now() });
        if (pointerHistory.length > 6) pointerHistory.shift();
      }

      function applyThrowVelocity() {
        if (pointerHistory.length < 2) return;
        const first = pointerHistory[0];
        const last = pointerHistory[pointerHistory.length - 1];
        const dt = (last.t - first.t) / 5;
        if (dt <= 0) return;
        const vx = (last.x - first.x) / dt;
        const vy = (last.y - first.y) / dt;
        Matter.Body.setVelocity(carroBody, { x: vx, y: vy });
        pointerHistory = [];
      }

      function onHoverOver() {
        carroYellowSprite.cursor = "grab";
      }

      function onDragStart(event: any) {
        dragging = true
        carroYellowSprite.cursor = "grabbing";

        Matter.Body.setStatic(carroBody, true);
        const global = event.global;
        recordPointer(global);
        offsetX = global.x - carroYellowSprite.x;
        offsetY = global.y - carroYellowSprite.y;
        Matter.Body.setPosition(carroBody, { x: carroYellowSprite.x, y: carroYellowSprite.y });
      }

      function onDragMove(event: any) {
        if (!dragging) return;

        let global = event.global;
        recordPointer(global);
        Matter.Body.setPosition(carroBody, { x: global.x - offsetX, y: global.y - offsetY });
      }

      function onDragEnd(event: any) {
        dragging = false;
        Matter.Body.setStatic(carroBody, false);
        applyThrowVelocity();
      }

      function release() {
        if (!dragging) return;

        dragging = false;

        carroYellowSprite.cursor = "grab";

        Matter.Body.setStatic(carroBody, false);
        applyThrowVelocity();
      }

      carroYellowSprite
        .on("pointerover", onHoverOver)
        .on("pointerdown", onDragStart)
        .on('touchstart', onDragStart)
        .on('mousemove', onDragMove)
        .on('touchmove', onDragMove)
        .on('pointerup', onDragEnd)
        .on('ontouchup', onDragEnd)
        .on("pointerup", release);


      app.ticker.add(() => {
        Matter.Engine.update(engine, 1000 / 60);

        carroYellowSprite.x = carroBody.position.x;
        carroYellowSprite.y = carroBody.position.y;
        carroYellowSprite.rotation = carroBody.angle;
      })

      // Add neon first, then the car so the car is rendered on top
      app.stage.addChild(dishSprite);
      app.stage.addChild(neonSprite);
      app.stage.addChild(carroYellowSprite);
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
