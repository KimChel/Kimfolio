"use client";
import { Application, AnimatedSprite, Assets, TextureStyle } from "pixi.js";
import Matter from "matter-js";
import { useEffect, useRef } from "react";

interface CarroEntity {
  sprite: AnimatedSprite;
  body: Matter.Body;
  dragging: boolean;
  direction: "left" | "right";
}

export default function Engine() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container!) return;

    const app = new Application();

    (async () => {
      //
      // ░░   PIXI APP   ░░
      //

      await app.init({
        resizeTo: container!,
        backgroundAlpha: 0, // transparent so PNGs behind are visible
      });

      TextureStyle.defaultOptions.scaleMode = "nearest";

      container!.appendChild(app.canvas);

      function randomRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      function randomInt(min: number, max: number) {
        return Math.floor(randomRange(min, max + 1));
      }

      //
      // ░░   SPRITE SETUP   ░░
      //

      //
      // ░░   Carro SETUP   ░░
      //
      const carroSheet = await Assets.load("/assets/carro.json");

      const carroColors = ["car_yellow", "car_blue", "car_magenta"];

      let activeCars: CarroEntity[] = [];

      function spawnRandomCarro() {
        if (activeCars.length >= 3) return; // 3 cars max

        const colorIndex = Math.floor(Math.random() * carroColors.length);

        const frames = carroSheet.animations![carroColors[colorIndex]];

        const carroSprite = new AnimatedSprite(frames);
        carroSprite.animationSpeed = 1 / 6;
        carroSprite.play();
        carroSprite.anchor.set(0.5);
        carroSprite.eventMode = "static";

        const direction = Math.random() < 0.5 ? "left" : "right";

        const startY = container!.clientHeight * 0.45;
        const startX =
          direction === "left"
            ? container!.clientWidth + 200 // start right side
            : -200;

        carroSprite.x = startX;
        carroSprite.y = startY;
        carroSprite.scale.set(container!.clientWidth / 1920);

        const carroBody = Matter.Bodies.rectangle(
          carroSprite.x,
          carroSprite.y,
          carroSprite.width * carroSprite.scale.x,
          carroSprite.height * carroSprite.scale.y,
          {
            restitution: 0.1,
            friction: 0.9,
          }
        );

        Matter.World.add(engine.world, carroBody);
        app.stage.addChild(carroSprite);

        const carro: CarroEntity = {
          sprite: carroSprite,
          body: carroBody,
          dragging: false,
          direction,
        };

        addDraggingToCar(carro);

        activeCars.push(carro);
      }

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
      const dishFrames = dishSheet.animations["dish"];
      const dishSprite = new AnimatedSprite(dishFrames);

      neonSprite.animationSpeed = Math.floor(Math.random() * 1 + 2) / 90;
      neonSprite.play();

      dishSprite.animationSpeed = 1 / 4;
      dishSprite.play();

      //
      // ░░   MATERIAL ENGINE   ░░
      //

      const engine = Matter.Engine.create();
      engine.gravity.y = 1.2;
      let groundWidth = container!.clientWidth;

      //
      // ░░   GROUND COLLIDER   ░░
      //

      const ground = Matter.Bodies.rectangle(
        groundWidth + 500,
        container!.clientHeight - 100,
        groundWidth + 500,
        20,
        { isStatic: true }
      );

      Matter.World.add(engine.world, ground);

      //
      // ░░   RESPONSIVE LOGIC   ░░
      //

      const carrorelX = 0.12;
      const carrorelY = 0.8;

      const neonRelX = 0.4;
      const neonRelY = 0.3;

      const dishRelX = 0.45;
      const dishRelY = 0.3;

      let lastCarroScale = 1;

      resizeSprite();
      window.addEventListener("resize", resizeSprite);

      function resizeSprite() {
        const carroScale = container!!.clientWidth / 1920;
        const neonScale = container!.clientWidth / 600;
        const dishScale = container!.clientWidth / 600;
        const newGroundWidth = container!.clientWidth;

        const scaleRatio = carroScale / lastCarroScale;
        lastCarroScale = carroScale;

        const groundScaleX = newGroundWidth / groundWidth;
        Matter.Body.scale(ground, groundScaleX, 1);
        groundWidth = newGroundWidth;
        Matter.Body.setPosition(ground, {
          x: newGroundWidth / 2,
          y: container!.clientHeight - 200,
        });

        

        neonSprite.scale.set(neonScale);
        dishSprite.scale.set(dishScale);

        neonSprite.x = container!.clientWidth * neonRelX;
        neonSprite.y = container!.clientHeight * neonRelY;

        dishSprite.x = container!.clientWidth * dishRelX;
        dishSprite.y = container!.clientHeight * dishRelY;
      }

      //
      // ░░   DRAGGING LOGIC   ░░
      //

      function addDraggingToCar(car: CarroEntity) {
        let offsetX = 0;
        let offsetY = 0;
        let pointerHistory: { x: number; y: number; t: number }[] = [];

        function recordPointer(global: { x: number; y: number }) {
          pointerHistory.push({
            x: global.x,
            y: global.y,
            t: performance.now(),
          });
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

          Matter.Body.setVelocity(car.body, { x: vx, y: vy });
          pointerHistory = [];
        }

        car.sprite.on("pointerdown", (e: any) => {
          car.dragging = true;
          Matter.Body.setStatic(car.body, true);

          const g = e.global;
          offsetX = g.x - car.sprite.x;
          offsetY = g.y - car.sprite.y;

          recordPointer(g);
        });

        car.sprite.on("pointermove", (event: any) => {
          if (!car.dragging) return;

          const g = event.global;
          recordPointer(g);

          Matter.Body.setPosition(car.body, {
            x: g.x - offsetX,
            y: g.y - offsetY,
          });
        });

        function release() {
          if (!car.dragging) return;
          car.dragging = false;
          Matter.Body.setStatic(car.body, false);
          applyThrowVelocity();
        }

        car.sprite.on("pointerup", release);
        car.sprite.on("pointerupoutside", release);
      }

      app.ticker.add(() => {
        Matter.Engine.update(engine, 1000 / 60);

        activeCars.forEach((car) => {
          if (!car.dragging) {
            const speed = 2;
            if (car.direction === "left") {
              car.sprite.scale.x = -Math.abs(car.sprite.scale.x);
            }

            Matter.Body.setVelocity(car.body, {
              x: car.direction === "left" ? -speed : speed,
              y: car.body.velocity.y,
            });
          }

          Matter.Engine.update(engine, 16.666); // physics

          // Sync PIXI visual with physics
          car.sprite.x = car.body.position.x;
          car.sprite.y = car.body.position.y;
          car.sprite.rotation = car.body.angle;
        });

        for (let i = activeCars.length - 1; i >= 0; i--) {
          const car = activeCars[i];
          const x = car.body.position.x;

          if (x < -400 || x > container!.clientWidth + 400) {
            // Remove car
            Matter.World.remove(engine.world, car.body);
            app.stage.removeChild(car.sprite);
            activeCars.splice(i, 1);
          }
        }
      });

      app.stage.addChild(dishSprite);
      app.stage.addChild(neonSprite);
      setInterval(() => {
        if (activeCars.length < 2) {
          spawnRandomCarro();
        }
      }, 1500);
    })();

    return () => {
      app.destroy(true, true);
      if (container!?.firstChild) {
        container!.removeChild(container!.firstChild);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
