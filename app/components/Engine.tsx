"use client";
import { Application, AnimatedSprite, Assets, Sprite, TextureStyle } from "pixi.js";
import Matter from "matter-js";
import { useEffect, useRef } from "react";

interface CarroEntity {
  sprite: AnimatedSprite;
  body: Matter.Body;
  dragging: boolean;
  direction: "left" | "right";
}

interface NpcEntity {
  sprite: AnimatedSprite;
  body?: Matter.Body;
  animations: {
    idle: AnimatedSprite;
    walk?: AnimatedSprite;
    special: AnimatedSprite;
  };
  state: "idle" | "walk" | "special";
  direction: "left" | "right";
  speed: number;
  minX: number;
  maxX: number;
}

type EngineProps = {
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
};

const ASSET_URLS = [
  "/assets/carro.json",
  "/assets/neonFrames/neon.json",
  "/assets/dishFrames/dish.json",
  "/assets/street_lights.png",
  "/assets/dev_sign.png",
  "/assets/npc/npc1/idle.json",
  "/assets/npc/npc1/walk.json",
  "/assets/npc/npc1/special.json",
  "/assets/npc/npc2/idle.json",
  "/assets/npc/npc2/special.json",
] as const;

export default function Engine({ onLoadProgress, onLoaded }: EngineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isCancelled = false;


    const initPixi = async () => {
      const app = new Application();

      await app.init({
        resizeTo: container,
        backgroundAlpha: 0, // transparent so PNGs behind are visible
        preference: "webgl",
      });

      if (isCancelled) {
        app.destroy({ removeView: true }, { children: true, texture: true });
        return;
      }

      appRef.current = app;

      container.appendChild(app.canvas);

      onLoadProgress?.(0);

      //
      // ░░   PIXI APP   ░░
      //

      TextureStyle.defaultOptions.scaleMode = "nearest"; //pixelated rendering
      app.stage.sortableChildren = true; // enable z-index ordering

      //
      // ░░   SPRITE SETUP   ░░
      //

      //
      // ░░   Carro SETUP   ░░
      //
      const loadedAssets = (await Assets.load(
        [...ASSET_URLS],
        (progress) => {
          if (!isCancelled) onLoadProgress?.(progress);
        }
      )) as Record<string, any>;

      if (isCancelled) {
        app.destroy({ removeView: true }, { children: true, texture: true });
        return;
      }

      const carroSheet = loadedAssets["/assets/carro.json"];

      const carroColors = ["car_yellow", "car_blue", "car_magenta", "car_red"];

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
        carroSprite.zIndex = 2;

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
            friction: 0.4,
            collisionFilter: { group: -1 },
          }
        );

        Matter.World.add(engine.world, carroBody);
        if (app.stage) {
          app.stage.addChild(carroSprite);
        }

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

      const neonSheet = loadedAssets["/assets/neonFrames/neon.json"];
      const neonFrames = neonSheet.animations!["neon"];
      const neonSprite = new AnimatedSprite(neonFrames);

      //
      // ░░   Dish Setup   ░░
      //
      const dishSheet = loadedAssets["/assets/dishFrames/dish.json"];
      const dishFrames = dishSheet.animations["dish"];
      const dishSprite = new AnimatedSprite(dishFrames);

      neonSprite.animationSpeed = Math.floor(Math.random() * 1 + 2) / 90;
      neonSprite.play();

      dishSprite.animationSpeed = 1 / 4;
      dishSprite.play();

      //
      // ░░   Street Lights Setup   ░░
      //

      const streetLightTexture = loadedAssets["/assets/street_lights.png"];

      const streetLightSprite1 = new Sprite(streetLightTexture);

      const streetLightSprite2 = new Sprite(streetLightTexture);

      streetLightSprite1.anchor.set(0.5, 1);
      streetLightSprite1.x = container!.clientWidth * 0.303;
      streetLightSprite1.y = container!.clientHeight * 1.009;
      streetLightSprite1.scale.set(container!.clientWidth / 600);
      streetLightSprite1.alpha = 0.4;
      streetLightSprite1.zIndex = 10;

      streetLightSprite2.anchor.set(0.5, 1);
      streetLightSprite2.x = container!.clientWidth * 0.725;
      streetLightSprite2.y = container!.clientHeight * 1.013;
      streetLightSprite2.scale.set(container!.clientWidth / 600);
      streetLightSprite2.alpha = 0.4;
      streetLightSprite2.zIndex = 10;

      //
      // ░░   Dev Sign Setup   ░░
      //

      const devSignTexture = loadedAssets["/assets/dev_sign.png"];
      const devSign = new Sprite(devSignTexture);

      devSign.anchor.set(0.5, 1);
      devSign.scale.set(container!.clientWidth / 600);

      //
      // ░░   NPC SETUP   ░░
      //

      const npc_1_idle = loadedAssets["/assets/npc/npc1/idle.json"];
      const npc_1_walk = loadedAssets["/assets/npc/npc1/walk.json"];
      const npc_1_special = loadedAssets["/assets/npc/npc1/special.json"];

      const npc1Idle = new AnimatedSprite(npc_1_idle.animations.idle);
      const npc1Walk = new AnimatedSprite(npc_1_walk.animations.walk);
      const npc1Special = new AnimatedSprite(npc_1_special.animations.special);

      [npc1Idle, npc1Walk, npc1Special].forEach((s: any) => {
        s.anchor.set(0.5, 1);
        s.animationSpeed = 1 / 10;
        s.play();
        s.visible = false;
        s.zIndex = 2;
        app.stage.addChild(s);
      });

      npc1Idle.visible = true;

      //
      // ░░   NPC SETUP OLDMAN   ░░
      //

      const npc_2_idle = loadedAssets["/assets/npc/npc2/idle.json"];
      const npc_2_special = loadedAssets["/assets/npc/npc2/special.json"];

      const npc2Idle = new AnimatedSprite(npc_2_idle.animations.idle);
      const npc2Special = new AnimatedSprite(npc_2_special.animations.special);

      [npc2Idle, npc2Special].forEach((s: any) => {
        s.anchor.set(0.5, 1);
        s.animationSpeed = 1 / 10;
        s.play();
        s.visible = false;
        s.zIndex = 1;
        app.stage.addChild(s);
      });

      npc2Idle.visible = true;

      //
      // ░░   NPC ENTITIES   ░░
      //

      const npc1: NpcEntity = {
        sprite: npc1Idle,
        animations: {
          idle: npc1Idle,
          walk: npc1Walk,
          special: npc1Special,
        },
        state: "idle",
        direction: Math.random() < 0.5 ? "left" : "right",
        speed: 0.1,
        minX: 0,
        maxX: 0,
      };

      const npc2: NpcEntity = {
        sprite: npc2Idle,
        animations: {
          idle: npc2Idle,
          special: npc2Special,
        },
        state: "idle",
        direction: "right",
        speed: 0.1,
        minX: 0,
        maxX: 0,
      };

      //
      // ░░   MATERIAL ENGINE   ░░
      //

      const engine = Matter.Engine.create();
      engine.gravity.y = 0.4;
      let groundWidth = container!.clientWidth;

      //
      // ░░   GROUND COLLIDER   ░░
      //

      const ground = Matter.Bodies.rectangle(
        groundWidth + 1000,
        container!.clientHeight - 100,
        groundWidth + 1000,
        20,
        { isStatic: true }
      );

      Matter.World.add(engine.world, ground);

      //
      // ░░   RESPONSIVE LOGIC   ░░
      //

      const neonRelX = 0.4;
      const neonRelY = 0.3;

      const dishRelX = 0.63;
      const dishRelY = 0.328;

      const devSignRelX = 0.615;
      const devSignRelY = 0.48;

      let lastCarroScale = 1;

      resizeSprite();
      window.addEventListener("resize", resizeSprite);

      function resizeSprite() {
        // Update sprite values
        const carroScale = container!!.clientWidth / 1920;
        const neonScale = container!.clientWidth / 600;
        const dishScale = container!.clientWidth / 600;
        const lightScale = container!.clientWidth / 600;
        const devSignScale = container!.clientWidth / 600;
        const npc1Scale = container!.clientWidth / 800;
        const npc2Scale = container!.clientWidth / 800;

        neonSprite.scale.set(neonScale);
        dishSprite.scale.set(dishScale);
        streetLightSprite1.scale.set(lightScale);
        streetLightSprite2.scale.set(lightScale);
        devSign.scale.set(devSignScale);

        Object.values(npc1.animations).forEach((state) => {
          state.scale.set(npc1Scale);
        });

        Object.values(npc2.animations).forEach((state) => {
          state.scale.set(npc2Scale);
        });

        neonSprite.x = container!.clientWidth * neonRelX;
        neonSprite.y = container!.clientHeight * neonRelY;

        dishSprite.x = container!.clientWidth * dishRelX;
        dishSprite.y = container!.clientHeight * dishRelY;

        streetLightSprite1.x = container!.clientWidth * 0.303;
        streetLightSprite1.y = container!.clientHeight * 1.009;

        streetLightSprite2.x = container!.clientWidth * 0.725;
        streetLightSprite2.y = container!.clientHeight * 1.013;

        devSign.x = container!.clientWidth * devSignRelX;
        devSign.y = container!.clientHeight * devSignRelY;

        npc1.minX = container!.clientWidth * 0.35;
        npc1.maxX = container!.clientWidth * 0.45;

        npc2.minX = container!.clientWidth * 0.4;
        npc2.maxX = container!.clientWidth * 0.5;

        // if (!npc1.sprite.x) {
        npc1.sprite.x = npc1.minX;
        npc1.sprite.y = container!.clientHeight * 0.88;
        // }

        // if (!npc2.sprite.x) {
        npc2.sprite.x = npc2.minX;
        npc2.sprite.y = container!.clientHeight
          * 0.88;
        // }

        // Update ground
        const newGroundWidth = container!.clientWidth + 600;

        const groundScaleX = newGroundWidth / groundWidth;
        Matter.Body.scale(ground, groundScaleX, 1);
        groundWidth = newGroundWidth;

        Matter.Body.setPosition(ground, {
          x: newGroundWidth / 2,
          y: container!.clientHeight - 50,
        });

        const scaleRatio = carroScale / lastCarroScale;
        lastCarroScale = carroScale;

        activeCars.forEach((car) => {
          car.sprite.scale.set(carroScale);
          Matter.Body.scale(car.body, scaleRatio, scaleRatio);
        });

        spawnRandomCarro();
      }

      //
      // ░░   NPC STATE   ░░
      //

      function setNpcState(npc: NpcEntity, state: NpcEntity["state"]) {
        if (npc.state === state) return;

        const nextSprite = npc.animations[state];
        if (!nextSprite) return; // state not available for this NPC

        Object.values(npc.animations).forEach((animation) => {
          animation.visible = false;
        });

        // Keep transform consistent when swapping animations
        nextSprite.position.set(npc.sprite.x, npc.sprite.y);
        nextSprite.scale.set(npc.sprite.scale.x, npc.sprite.scale.y);

        npc.state = state;
        npc.sprite = nextSprite;
        npc.sprite.visible = true;
      }

      function randomNpc1State() {
        const rand = Math.random();
        if (rand < 0.6) setNpcState(npc1, "idle");
        else if (rand < 0.9) setNpcState(npc1, "walk");
        else setNpcState(npc1, "special");
      }

      function randomNpc2State() {
        const rand = Math.random();
        if (rand < 0.75) setNpcState(npc2, "idle");
        else setNpcState(npc2, "special");
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
          const dt = (last.t - first.t) / 2;
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
            const speed = 1;
            if (car.direction === "left") {
              car.sprite.scale.x = -Math.abs(car.sprite.scale.x);
            }

            if (Matter.Collision.collides(car.body, ground)) {
              Matter.Body.setVelocity(car.body, {
                x: car.direction === "left" ? -speed : speed,
                y: car.body.velocity.y,
              });
            }
          }

          if (npc1.state === "walk") {
            const dir = npc1.direction === "left" ? -1 : 1;
            npc1.sprite.x += dir * npc1.speed;

            npc1.sprite.scale.x = Math.abs(npc1.sprite.scale.x) * dir;
            if (npc1.sprite.x < npc1.minX) npc1.direction = "right";
            if (npc1.sprite.x > npc1.maxX) npc1.direction = "left";
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
      if (app.stage) {
        app.stage.addChild(neonSprite);
        app.stage.addChild(dishSprite);
        app.stage.addChild(streetLightSprite1);
        app.stage.addChild(streetLightSprite2);
        app.stage.addChild(devSign);
        setInterval(() => {
          randomNpc1State();
          npc1.direction = Math.random() < 0.5 ? "left" : "right";
        }, 4000);
        setInterval(() => {
          randomNpc2State();
        }, 5000);
        setInterval(() => {
          if (activeCars.length < 3) {
            spawnRandomCarro();
          }
        }, 6000);
      }

      onLoadProgress?.(1);
      onLoaded?.();
    };

    initPixi();

    return () => {
      isCancelled = true;

      const app = appRef.current;
      if (app) {
        if ((app as any)._customCleanup) (app as any)._customCleanup();

        //destroy pipi
        app.destroy({ removeView: true }, { children: true, texture: true });
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
