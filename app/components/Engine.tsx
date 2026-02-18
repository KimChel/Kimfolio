"use client";

import { Application, AnimatedSprite, Assets, Sprite, TextureStyle } from "pixi.js";
import Matter from "matter-js";
import { useEffect, useRef } from "react";
import { Car } from "./engine/Car";
import { Npc } from "./engine/Npc";

// ── Types ──────────────────────────────────────────────────────────────────────

type EngineProps = {
  onLoadProgress?: (progress: number) => void;
  onLoaded?: () => void;
};

// ── Asset manifest ─────────────────────────────────────────────────────────────

const ASSETS = [
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

const CAR_COLORS = ["car_yellow", "car_blue", "car_magenta", "car_red"] as const;

// ── NPC definitions (basePath + which animations exist) ───────────────────────

const NPC_DEFS = [
  { basePath: "/assets/npc/npc1", hasWalk: true,  hasSpecial: true  },
  { basePath: "/assets/npc/npc2", hasWalk: false, hasSpecial: true  },
  { basePath: "/assets/npc/npc3", hasWalk: true,  hasSpecial: true  },
  { basePath: "/assets/npc/npc4", hasWalk: true,  hasSpecial: true  },
  { basePath: "/assets/npc/npc5", hasWalk: false, hasSpecial: true  },
] as const;

// ── Scene decoration layout ────────────────────────────────────────────────────

const SCENE_SCALE_DIVISOR = 600;

const DECORATION_LAYOUT = [
  { key: "neon",         xRel: 0.400, yRel: 0.300, alpha: 1.0, zIndex: 4  },
  { key: "dish",         xRel: 0.630, yRel: 0.328, alpha: 1.0, zIndex: 4  },
  { key: "streetLight1", xRel: 0.303, yRel: 1.009, alpha: 0.4, zIndex: 10 },
  { key: "streetLamp1",  xRel: 0.312, yRel: 0.898, alpha: 1.0, zIndex: 3  },
  { key: "streetLight2", xRel: 0.725, yRel: 1.013, alpha: 0.4, zIndex: 10 },
  { key: "streetLamp2",  xRel: 0.733, yRel: 0.900, alpha: 1.0, zIndex: 3  },
  { key: "devSign",      xRel: 0.615, yRel: 0.480, alpha: 1.0, zIndex: 4  },
] as const;

// ── Sidewalk layout constants ──────────────────────────────────────────────────

const SIDEWALK = {
  Y:          0.88,
  MIN_X:      0.26,
  MAX_X:      0.82,
  WALK_RANGE: 0.05,
} as const;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const randomSidewalkX = () =>
  SIDEWALK.MIN_X + Math.random() * (SIDEWALK.MAX_X - SIDEWALK.MIN_X - SIDEWALK.WALK_RANGE);

// ── Component ──────────────────────────────────────────────────────────────────

export default function Engine({ onLoadProgress, onLoaded }: EngineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const container = containerRef.current!;

    // Mutable references shared between initPixi and the cleanup closure
    let isCancelled = false;
    let npcIntervalId: ReturnType<typeof setInterval> | undefined;
    let carIntervalId: ReturnType<typeof setInterval> | undefined;
    let onResize = () => {};   // reassigned inside initPixi once everything is ready

    // ── Pixi + scene init ────────────────────────────────────────────────────
    const initPixi = async () => {

      // ── Pixi app ───────────────────────────────────────────────────────────
      const app = new Application();
      await app.init({ resizeTo: container, backgroundAlpha: 0, preference: "webgl" });

      if (isCancelled) {
        app.destroy({ removeView: true }, { children: true, texture: true });
        return;
      }

      appRef.current = app;
      container.appendChild(app.canvas);
      TextureStyle.defaultOptions.scaleMode = "nearest";
      app.stage.sortableChildren = true;

      // ── Asset loading ──────────────────────────────────────────────────────
      onLoadProgress?.(0);

      const loaded = (await Assets.load([...ASSETS], (p) => {
        if (!isCancelled) onLoadProgress?.(p);
      })) as Record<string, any>;

      if (isCancelled) {
        app.destroy({ removeView: true }, { children: true, texture: true });
        return;
      }

      // ── Physics world ──────────────────────────────────────────────────────
      const physics = Matter.Engine.create();
      physics.gravity.y = 0.4;

      const leftCategory  = Matter.Body.nextCategory();
      const rightCategory = Matter.Body.nextCategory();
      const GROUND_OFFSET = 40;

      let groundWidth = container.clientWidth + 1000;

      const ground = Matter.Bodies.rectangle(
        groundWidth / 2, container.clientHeight - 50, groundWidth, 20,
        { isStatic: true, collisionFilter: { category: leftCategory } }
      );
      const lowerGround = Matter.Bodies.rectangle(
        groundWidth / 2, container.clientHeight - 50 + GROUND_OFFSET, groundWidth, 20,
        { isStatic: true, collisionFilter: { category: rightCategory } }
      );

      Matter.World.add(physics.world, [ground, lowerGround]);

      // ── Scene decorations ──────────────────────────────────────────────────
      const neonSprite = new AnimatedSprite(loaded["/assets/neonFrames/neon.json"].animations["neon"]);
      neonSprite.animationSpeed = Math.floor(Math.random() * 1 + 2) / 90;
      neonSprite.play();

      const dishSprite = new AnimatedSprite(loaded["/assets/dishFrames/dish.json"].animations["dish"]);
      dishSprite.animationSpeed = 1 / 4;
      dishSprite.play();

      const streetLight1 = new Sprite(loaded["/assets/street_lights.png"]);
      const streetLamp1  = new Sprite(loaded["/assets/street_lamp.png"]);
      const streetLight2 = new Sprite(loaded["/assets/street_lights.png"]);
      const streetLamp2  = new Sprite(loaded["/assets/street_lamp.png"]);
      const devSign      = new Sprite(loaded["/assets/dev_sign.png"]);

      [streetLight1, streetLamp1, streetLight2, streetLamp2, devSign].forEach((s) =>
        s.anchor.set(0.5, 1)
      );

      // Map layout keys to sprites
      const decorationSprites: Record<string, Sprite | AnimatedSprite> = {
        neon: neonSprite, dish: dishSprite,
        streetLight1, streetLamp1, streetLight2, streetLamp2, devSign,
      };

      DECORATION_LAYOUT.forEach(({ key, alpha, zIndex }) => {
        const s = decorationSprites[key];
        s.alpha   = alpha;
        s.zIndex  = zIndex;
        app.stage.addChild(s);
      });

      // ── NPCs ───────────────────────────────────────────────────────────────
      const allNpcs: Npc[] = NPC_DEFS.map(({ basePath, hasWalk, hasSpecial }) => {
        const xRel = randomSidewalkX();
        return Npc.create(loaded, basePath, hasWalk, hasSpecial, app.stage, {
          xRel,
          minXRel: clamp(xRel - SIDEWALK.WALK_RANGE, SIDEWALK.MIN_X, xRel),
          maxXRel: clamp(xRel + SIDEWALK.WALK_RANGE, xRel + SIDEWALK.WALK_RANGE / 2, SIDEWALK.MAX_X),
        });
      });

      // ── Cars ───────────────────────────────────────────────────────────────
      const activeCars: Car[] = [];
      const groundCategories = { left: leftCategory, right: rightCategory };

      const spawnCar = () => {
        if (activeCars.length >= 3) return;
        const colorKey   = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
        const frames     = loaded["/assets/carro.json"].animations![colorKey];
        const direction  = Math.random() < 0.5 ? "left" : "right" as const;
        const car = new Car(
          frames, direction, container, app.stage,
          physics.world, ground, lowerGround, groundCategories
        );
        activeCars.push(car);
      };

      // ── Resize handler ─────────────────────────────────────────────────────
      let lastCarScale = container.clientWidth / 1920;

      onResize = () => {
        const W = container.clientWidth;
        const H = container.clientHeight;

        // Decorations
        const decScale = W / SCENE_SCALE_DIVISOR;
        DECORATION_LAYOUT.forEach(({ key, xRel, yRel }) => {
          const s = decorationSprites[key];
          s.scale.set(decScale);
          s.x = W * xRel;
          s.y = H * yRel;
        });

        // NPCs
        const npcScale = W / 800;
        allNpcs.forEach((npc) => npc.resize(W, H, npcScale));

        // Cars
        const newCarScale = W / 1920;
        activeCars.forEach((car) => car.rescale(newCarScale, lastCarScale));
        lastCarScale = newCarScale;

        // Ground bodies
        const newGW    = W + 600;
        const gScaleX  = newGW / groundWidth;
        Matter.Body.scale(ground, gScaleX, 1);
        Matter.Body.scale(lowerGround, gScaleX, 1);
        groundWidth = newGW;
        Matter.Body.setPosition(ground,      { x: newGW / 2, y: H - 50 });
        Matter.Body.setPosition(lowerGround, { x: newGW / 2, y: H - 50 + GROUND_OFFSET });

        spawnCar();
      };

      window.addEventListener("resize", onResize);
      onResize(); // initial layout pass

      // ── Game loop ──────────────────────────────────────────────────────────
      app.ticker.add(() => {
        // Physics: exactly one step per frame
        Matter.Engine.update(physics, 1000 / 60);

        // Cars: tick + off-screen cleanup
        for (let i = activeCars.length - 1; i >= 0; i--) {
          activeCars[i].tick();
          if (activeCars[i].isOffscreen(container.clientWidth)) {
            activeCars[i].destroy();
            activeCars.splice(i, 1);
          }
        }

        // NPCs: once per frame (not once per car)
        allNpcs.forEach((npc) => npc.tick());
      });

      // ── Intervals ─────────────────────────────────────────────────────────
      npcIntervalId = setInterval(() => {
        if (isCancelled) return;
        allNpcs.forEach((npc) => npc.randomizeState());
      }, 4000);

      carIntervalId = setInterval(() => {
        if (isCancelled) return;
        if (activeCars.length < 3) spawnCar();
      }, 6000);

      onLoadProgress?.(1);
      onLoaded?.();
    };

    initPixi();

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      isCancelled = true;

      // Clear intervals before destroying the app so callbacks can't fire
      // on already-destroyed sprites
      clearInterval(npcIntervalId);
      clearInterval(carIntervalId);
      window.removeEventListener("resize", onResize);

      const app = appRef.current;
      if (app) {
        app.destroy({ removeView: true }, { children: true, texture: true });
        appRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}
