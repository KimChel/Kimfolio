"use client";
import {
  Application,
  AnimatedSprite,
  Assets,
  Sprite,
  TextureStyle,
} from "pixi.js";
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
    special?: AnimatedSprite;
  };
  state: "idle" | "walk" | "special";
  direction: "left" | "right";
  speed: number;
  minX: number;
  maxX: number;
  minXRel?: number;
  maxXRel?: number;
  xRel?: number;
  yRel?: number;
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
  "/assets/street_lamp.png",
  "/assets/dev_sign.png",
  "/assets/npc/npc1/idle.json",
  "/assets/npc/npc1/walk.json",
  "/assets/npc/npc1/special.json",
  "/assets/npc/npc2/idle.json",
  "/assets/npc/npc2/special.json",
  "/assets/npc/npc3/idle.json",
  "/assets/npc/npc3/walk.json",
  "/assets/npc/npc3/special.json",
  "/assets/npc/npc4/idle.json",
  "/assets/npc/npc4/walk.json",
  "/assets/npc/npc4/special.json",
  "/assets/npc/npc5/idle.json",
  "/assets/npc/npc5/special.json",
] as const;

export default function Engine({ onLoadProgress, onLoaded }: EngineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const initialWidth = container.clientWidth || 1;
    const initialHeight = container.clientHeight || 1;

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
      // ƒ-`ƒ-`   PIXI APP   ƒ-`ƒ-`
      //

      TextureStyle.defaultOptions.scaleMode = "nearest"; //pixelated rendering
      app.stage.sortableChildren = true; // enable z-index ordering

      //
      // ƒ-`ƒ-`   SPRITE SETUP   ƒ-`ƒ-`
      //

      //
      // ƒ-`ƒ-`   Carro SETUP   ƒ-`ƒ-`
      //
      const loadedAssets = (await Assets.load([...ASSET_URLS], (progress) => {
        if (!isCancelled) onLoadProgress?.(progress);
      })) as Record<string, any>;

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
        carroSprite.zIndex = 5;

        const direction = Math.random() < 0.5 ? "left" : "right";

        const startY = container!.clientHeight * 0.45;
        const startX =
          direction === "left"
            ? container!.clientWidth + 200 // start right side
            : -200;

        carroSprite.x = startX;
        carroSprite.y = startY;
        carroSprite.scale.set(container!.clientWidth / 1920);

        const groundMask =
          direction === "left" ? leftGroundCategory : rightGroundCategory;

        const carroBody = Matter.Bodies.rectangle(
          carroSprite.x,
          carroSprite.y,
          carroSprite.width * carroSprite.scale.x,
          carroSprite.height * carroSprite.scale.y,
          {
            restitution: 0.1,
            friction: 0.4,
            collisionFilter: { group: -1, mask: groundMask },
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
      // ƒ-`ƒ-`   Neon sign Setup   ƒ-`ƒ-`
      //

      const neonSheet = loadedAssets["/assets/neonFrames/neon.json"];
      const neonFrames = neonSheet.animations!["neon"];
      const neonSprite = new AnimatedSprite(neonFrames);

      //
      // ƒ-`ƒ-`   Dish Setup   ƒ-`ƒ-`
      //
      const dishSheet = loadedAssets["/assets/dishFrames/dish.json"];
      const dishFrames = dishSheet.animations["dish"];
      const dishSprite = new AnimatedSprite(dishFrames);

      neonSprite.animationSpeed = Math.floor(Math.random() * 1 + 2) / 90;
      neonSprite.play();

      dishSprite.animationSpeed = 1 / 4;
      dishSprite.play();

      //
      // ƒ-`ƒ-`   Street Lights Setup   ƒ-`ƒ-`
      //

      const streetLightTexture = loadedAssets["/assets/street_lights.png"];
      const streetLampTexture = loadedAssets["/assets/street_lamp.png"];

      const streetLightSprite1 = new Sprite(streetLightTexture);
      const streetlampSprite1 = new Sprite(streetLampTexture);

      const streetLightSprite2 = new Sprite(streetLightTexture);
      const streetlampSprite2 = new Sprite(streetLampTexture);

      streetLightSprite1.anchor.set(0.5, 1);
      streetLightSprite1.x = container!.clientWidth * 0.303;
      streetLightSprite1.y = container!.clientHeight * 1.009;
      streetLightSprite1.scale.set(container!.clientWidth / 600);
      streetLightSprite1.alpha = 0.4;
      streetLightSprite1.zIndex = 10;

      streetlampSprite1.anchor.set(0.5, 1);
      streetlampSprite1.x = container!.clientWidth * 0.312;
      streetlampSprite1.y = container!.clientHeight * 0.898;
      streetlampSprite1.scale.set(container!.clientWidth / 600);
      streetlampSprite1.zIndex = 3;

      streetLightSprite2.anchor.set(0.5, 1);
      streetLightSprite2.x = container!.clientWidth * 0.725;
      streetLightSprite2.y = container!.clientHeight * 1.013;
      streetLightSprite2.scale.set(container!.clientWidth / 600);
      streetLightSprite2.alpha = 0.4;
      streetLightSprite2.zIndex = 10;

      streetlampSprite2.anchor.set(0.5, 1);
      streetlampSprite2.x = container!.clientWidth * 0.733;
      streetlampSprite2.y = container!.clientHeight * 0.9;
      streetlampSprite2.scale.set(container!.clientWidth / 600);
      streetlampSprite2.zIndex = 3;

      //
      // ƒ-`ƒ-`   Dev Sign Setup   ƒ-`ƒ-`
      //

      const devSignTexture = loadedAssets["/assets/dev_sign.png"];
      const devSign = new Sprite(devSignTexture);

      devSign.anchor.set(0.5, 1);
      devSign.scale.set(container!.clientWidth / 600);

      //
      // ƒ-`ƒ-`   NPC SETUP   ƒ-`ƒ-`
      //

      const SIDEWALK_Y_REL = 0.88;
      const SIDEWALK_MIN_REL = 0.26;
      const SIDEWALK_MAX_REL = 0.82;
      const WALK_RANGE_REL = 0.05;

      const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(max, value));

      const randomSidewalkX = () =>
        SIDEWALK_MIN_REL +
        Math.random() * (SIDEWALK_MAX_REL - SIDEWALK_MIN_REL - WALK_RANGE_REL);

      function loadNpcAnimations(
        basePath: string,
        hasWalk = false,
        hasSpecial = false
      ) {
        const idle = new AnimatedSprite(
          loadedAssets[`${basePath}/idle.json`].animations.idle
        );

        const animations: NpcEntity["animations"] = { idle };

        if (hasWalk) {
          animations.walk = new AnimatedSprite(
            loadedAssets[`${basePath}/walk.json`].animations.walk
          );
        }

        if (hasSpecial) {
          animations.special = new AnimatedSprite(
            loadedAssets[`${basePath}/special.json`].animations.special
          );
        }

        Object.values(animations).forEach((s: AnimatedSprite | undefined) => {
          if (!s) return;
          s.anchor.set(0.5, 1);
          s.animationSpeed = 1 / 10;
          s.play();
          s.visible = false;
          s.zIndex = 2;
          app.stage.addChild(s);
        });

        animations.idle.visible = true;

        return animations;
      }

      type NpcOptions = {
        speed?: number;
        minX?: number;
        maxX?: number;
        x?: number;
        y?: number;
        direction?: "left" | "right";
      };

      function createNpc(
        animations: NpcEntity["animations"],
        options: NpcOptions = {}
      ): NpcEntity {
        const normalizeWidth = (value?: number) =>
          value === undefined ? undefined : value > 1 ? value / initialWidth : value;
        const normalizeHeight = (value?: number) =>
          value === undefined ? undefined : value > 1 ? value / initialHeight : value;

        const baseXRel =
          options.x !== undefined ? normalizeWidth(options.x)! : randomSidewalkX();
        const baseYRel =
          options.y !== undefined ? normalizeHeight(options.y)! : SIDEWALK_Y_REL;
        const baseMinXRel =
          options.minX !== undefined
            ? normalizeWidth(options.minX)!
            : clamp(baseXRel - WALK_RANGE_REL, SIDEWALK_MIN_REL, baseXRel);
        const baseMaxXRel =
          options.maxX !== undefined
            ? normalizeWidth(options.maxX)!
            : clamp(
                baseXRel + WALK_RANGE_REL,
                baseXRel + WALK_RANGE_REL / 2,
                SIDEWALK_MAX_REL
              );

        return {
          sprite: animations.idle,
          animations,
          state: "idle",
          direction:
            options.direction ?? (Math.random() < 0.5 ? "left" : "right"),
          speed: options.speed ?? 0.1,
          minX: 0,
          maxX: 0,
          minXRel: baseMinXRel,
          maxXRel: baseMaxXRel,
          xRel: baseXRel,
          yRel: baseYRel,
        };
      }

      const allNpcs: NpcEntity[] = [];

      function addNpc(
        animations: NpcEntity["animations"],
        options: NpcOptions = {}
      ) {
        const npc = createNpc(animations, options);
        allNpcs.push(npc);
        return npc;
      }

      const npc1Animations = loadNpcAnimations("/assets/npc/npc1", true, true);

      const npc1Options: NpcOptions = {};

      const npc2Animations = loadNpcAnimations("/assets/npc/npc2", false, true);
      const npc3Animations = loadNpcAnimations("/assets/npc/npc3", true, true);
      const npc4Animations = loadNpcAnimations("/assets/npc/npc4", true, true);
      const npc5Animations = loadNpcAnimations("/assets/npc/npc5", false, true);

      addNpc(npc1Animations, npc1Options);
      addNpc(npc2Animations);
      addNpc(npc3Animations);
      addNpc(npc4Animations);
      addNpc(npc5Animations);

      //
      // ƒ-`ƒ-`   MATERIAL ENGINE   ƒ-`ƒ-`
      //

      const engine = Matter.Engine.create();
      engine.gravity.y = 0.4;
      let groundWidth = container!.clientWidth;

      const leftGroundCategory = Matter.Body.nextCategory();
      const rightGroundCategory = Matter.Body.nextCategory();
      const groundVerticalOffset = 40;

      //
      // ƒ-`ƒ-`   GROUND COLLIDER   ƒ-`ƒ-`
      //

      const ground = Matter.Bodies.rectangle(
        groundWidth + 1000,
        container!.clientHeight - 80,
        groundWidth + 1000,
        20,
        { isStatic: true, collisionFilter: { category: leftGroundCategory } }
      );

      const lowerGround = Matter.Bodies.rectangle(
        groundWidth + 1000,
        container!.clientHeight - 100 + groundVerticalOffset,
        groundWidth + 1000,
        20,
        { isStatic: true, collisionFilter: { category: rightGroundCategory } }
      );

      Matter.World.add(engine.world, ground);
      Matter.World.add(engine.world, lowerGround);

      //
      // ƒ-`ƒ-`   RESPONSIVE LOGIC   ƒ-`ƒ-`
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
        const lampScale = container!.clientWidth / 600;
        const devSignScale = container!.clientWidth / 600;
        const npcScale48 = container!.clientWidth / 800;
        const npcScale32 = container!.clientWidth / 1000;

        neonSprite.scale.set(neonScale);
        dishSprite.scale.set(dishScale);
        streetLightSprite1.scale.set(lightScale);
        streetLightSprite2.scale.set(lightScale);
        streetlampSprite1.scale.set(lampScale)
        streetlampSprite2.scale.set(lampScale)
        devSign.scale.set(devSignScale);

        neonSprite.x = container!.clientWidth * neonRelX;
        neonSprite.y = container!.clientHeight * neonRelY;

        dishSprite.x = container!.clientWidth * dishRelX;
        dishSprite.y = container!.clientHeight * dishRelY;

        streetLightSprite1.x = container!.clientWidth * 0.303;
        streetLightSprite1.y = container!.clientHeight * 1.009;

        streetlampSprite1.x = container!.clientWidth * 0.312;
        streetlampSprite1.y = container!.clientHeight * 0.898;

        streetLightSprite2.x = container!.clientWidth * 0.725;
        streetLightSprite2.y = container!.clientHeight * 1.013;

        streetlampSprite2.x = container!.clientWidth * 0.733;
        streetlampSprite2.y = container!.clientHeight * 0.9;

        devSign.x = container!.clientWidth * devSignRelX;
        devSign.y = container!.clientHeight * devSignRelY;

        allNpcs.forEach((npc, index) => {
          const scale = index >= 6 ? npcScale32 : npcScale48;

          Object.values(npc.animations).forEach((a) => {
            a?.scale.set(scale);
          });

        

          const fallbackMinRel = 0.3 + index * 0.03;
          const minXRel = npc.minXRel ?? fallbackMinRel;
          const maxXRel = npc.maxXRel ?? minXRel + 0.08;

          npc.minX = minXRel > 1 ? minXRel : container!.clientWidth * minXRel;
          npc.maxX = maxXRel > 1 ? maxXRel : container!.clientWidth * maxXRel;

          const xRel = npc.xRel ?? minXRel;
          const yRel = npc.yRel ?? 0.88;

          npc.sprite.x = xRel > 1 ? xRel : container!.clientWidth * xRel;
          npc.sprite.y = yRel > 1 ? yRel : container!.clientHeight * yRel;
        });

        // Update ground
        const newGroundWidth = container!.clientWidth + 600;

        const groundScaleX = newGroundWidth / groundWidth;
        Matter.Body.scale(ground, groundScaleX, 1);
        Matter.Body.scale(lowerGround, groundScaleX, 1);
        groundWidth = newGroundWidth;

        Matter.Body.setPosition(ground, {
          x: newGroundWidth / 2,
          y: container!.clientHeight - 50,
        });
        Matter.Body.setPosition(lowerGround, {
          x: newGroundWidth / 2,
          y: container!.clientHeight - 50 + groundVerticalOffset,
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
      // ƒ-`ƒ-`   NPC STATE   ƒ-`ƒ-`
      //

      function setNpcState(npc: NpcEntity, state: NpcEntity["state"]) {
        if (npc.state === state) return;

        const nextSprite = npc.animations[state];
        if (!nextSprite) return; // state not available for this NPC

        Object.values(npc.animations).forEach((animation) => {
          if (animation) animation.visible = false;
        });

        // Keep transform consistent when swapping animations
        nextSprite.position.set(npc.sprite.x, npc.sprite.y);
        nextSprite.scale.set(npc.sprite.scale.x, npc.sprite.scale.y);

        npc.state = state;
        npc.sprite = nextSprite;
        npc.sprite.visible = true;
      }

      //
      // ƒ-`ƒ-`   DRAGGING LOGIC   ƒ-`ƒ-`
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
            const speed = Math.floor(Math.random() * (2 - 0.5 + 1) + 0.5);
            if (car.direction === "left") {
              car.sprite.scale.x = -Math.abs(car.sprite.scale.x);
            }

            const targetGround =
              car.direction === "left" ? ground : lowerGround;

            if (Matter.Collision.collides(car.body, targetGround)) {
              Matter.Body.setVelocity(car.body, {
                x: car.direction === "left" ? -speed : speed,
                y: car.body.velocity.y,
              });
            }
          }

          allNpcs.forEach((npc) => {
            if (npc.state === "walk" && npc.animations.walk) {
              const dir = npc.direction === "left" ? -1 : 1;
              npc.sprite.x += dir * npc.speed;
              npc.sprite.scale.x = Math.abs(npc.sprite.scale.x) * dir;

              if (npc.sprite.x < npc.minX) npc.direction = "right";
              if (npc.sprite.x > npc.maxX) npc.direction = "left";
            }
          });

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
        app.stage.addChild(streetlampSprite1);
        app.stage.addChild(streetLightSprite2);
        app.stage.addChild(streetlampSprite2);
        app.stage.addChild(devSign);
        setInterval(() => {
          allNpcs.forEach((npc) => {
            const r = Math.random();
            if (r < 0.6) setNpcState(npc, "idle");
            else if (r < 0.85 && npc.animations.walk) setNpcState(npc, "walk");
            else if (npc.animations.special) setNpcState(npc, "special");
          });
        }, 4000);
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
