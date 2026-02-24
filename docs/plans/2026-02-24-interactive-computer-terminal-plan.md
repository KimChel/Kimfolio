# Interactive Computer Terminal Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the desktop terminal layout into a fully interactive retro PC with BIOS boot sequence, Matter.js cartridge physics, power/eject buttons, and CRT shutdown animation.

**Architecture:** State machine in `TerminalLayout` drives computer states (OFF/BOOTING/ON/SHUTTING_DOWN). Matter.js physics world manages cartridge bodies with DOM-synced rendering. Cartridges live on a shelf, can be dragged/thrown, and snap into a sensor-based slot zone. Power and eject buttons are hotspots overlaid on the computer image.

**Tech Stack:** Next.js (App Router), Matter.js (physics), Framer Motion (animations), Tailwind CSS, React refs + requestAnimationFrame (physics-to-DOM sync).

---

### Task 1: Add Computer State Type and Update Terminal Config

**Files:**
- Modify: `app/lib/terminal-config.ts`

**Step 1: Add ComputerState enum and cartridge data array**

Add to `app/lib/terminal-config.ts` after the existing enums:

```typescript
export enum ComputerState {
  OFF = "OFF",
  BOOTING = "BOOTING",
  ON = "ON",
  SHUTTING_DOWN = "SHUTTING_DOWN",
}

export const CARTRIDGE_LIST = [
  {
    id: CartridgeSelection.ABOUT_CARTRIDGE,
    label: "INSERT ABOUT",
    href: TerminalPath.ABOUT,
    stickerColor: "bg-green-500",
    cassetteText: "Who am I???",
    rotation: 1,
  },
  {
    id: CartridgeSelection.PROJECTS_CARTRIDGE,
    label: "INSERT PROJECTS",
    href: TerminalPath.PROJECTS,
    stickerColor: "bg-blue-500",
    cassetteText: "Stuff I built",
    rotation: -1,
  },
  {
    id: CartridgeSelection.SKILLS_CARTRIDGE,
    label: "INSERT SKILLS",
    href: TerminalPath.SKILLS,
    stickerColor: "bg-yellow-500",
    cassetteText: "Things I'm good at",
    rotation: 4,
  },
  {
    id: CartridgeSelection.CV_CARTRIDGE,
    label: "INSERT CV",
    href: TerminalPath.CV,
    stickerColor: "bg-purple-500",
    cassetteText: "Resume // BACKUP",
    rotation: -3,
  },
  {
    id: CartridgeSelection.CONTACT_CARTRIDGE,
    label: "INSERT CONTACT",
    href: TerminalPath.CONTACT,
    stickerColor: "bg-red-500",
    cassetteText: "Call me maybe?",
    rotation: 0,
  },
] as const;

export type CartridgeData = (typeof CARTRIDGE_LIST)[number];
```

**Step 2: Verify the app still compiles**

Run: `cd /home/kimchel/Dev/kimfolio/Kimfolio && npm run build 2>&1 | tail -20`
Expected: Build succeeds (new exports are unused but valid)

**Step 3: Commit**

```bash
git add app/lib/terminal-config.ts
git commit -m "feat: add ComputerState enum and CARTRIDGE_LIST to terminal config"
```

---

### Task 2: Create the BootSequence Component

**Files:**
- Create: `app/components/terminal/BootSequence.tsx`

**Step 1: Create the BootSequence component**

This component renders the BIOS POST text inside the CRT area with typewriter-style line reveals. It accepts the current theme and an `onComplete` callback.

```tsx
"use client";

import { useEffect, useState } from "react";

type BootSequenceProps = {
  themeName: string;
  themeColor: string;
  loadingText: string;
  bootColor: string;
  borderColor: string;
  onComplete: () => void;
};

const POST_LINES = [
  { text: "[BIOS] KIM-PC v2.1", delay: 0 },
  { text: "", delay: 200 },
  { text: "Memory Test... 640K OK", delay: 400 },
  { text: "Detecting Devices...", delay: 800 },
  { text: "  > CRT Display...... OK", delay: 1100 },
  { text: "  > Audio Module..... OK", delay: 1300 },
  { text: "  > Cartridge Slot... OK", delay: 1500 },
  { text: "", delay: 1700 },
];

export default function BootSequence({
  themeName,
  themeColor,
  loadingText,
  bootColor,
  borderColor,
  onComplete,
}: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"post" | "detect" | "load" | "ready">("post");
  const [loadPercent, setLoadPercent] = useState(0);

  // Phase 1: POST lines appear one by one
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    POST_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), line.delay));
    });
    timers.push(setTimeout(() => setPhase("detect"), 1800));
    return () => timers.forEach(clearTimeout);
  }, []);

  // Phase 2: Cartridge detection
  useEffect(() => {
    if (phase !== "detect") return;
    const t = setTimeout(() => setPhase("load"), 1000);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase 3: Loading bar
  useEffect(() => {
    if (phase !== "load") return;
    const interval = setInterval(() => {
      setLoadPercent((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setPhase("ready"), 200);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [phase]);

  // Phase 4: Ready -> complete
  useEffect(() => {
    if (phase !== "ready") return;
    const t = setTimeout(onComplete, 800);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  return (
    <div
      className={`w-full h-full p-4 font-mono text-xs ${themeColor} overflow-hidden`}
      style={{ textShadow: "0 0 4px currentColor" }}
    >
      {/* Phase 1: POST */}
      {POST_LINES.slice(0, visibleLines).map((line, i) => (
        <div key={i} className="leading-relaxed">
          {line.text || "\u00A0"}
        </div>
      ))}

      {/* Phase 2: Cartridge detection */}
      {phase === "detect" && (
        <>
          <div className="leading-relaxed mt-2">Reading Cartridge...</div>
          <div className="leading-relaxed">{`> ${themeName} DETECTED`}</div>
          <div className="leading-relaxed">{"> Signature verified"}</div>
        </>
      )}

      {/* Phase 3: Loading */}
      {(phase === "load" || phase === "ready") && (
        <>
          <div className="leading-relaxed mt-2">Reading Cartridge...</div>
          <div className="leading-relaxed">{`> ${themeName} DETECTED`}</div>
          <div className="leading-relaxed">{"> Signature verified"}</div>
          <div className="leading-relaxed mt-2">{`Loading ${themeName}...`}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`relative w-48 h-2 border ${borderColor} bg-black overflow-hidden`}>
              <div
                className={`h-full ${bootColor} transition-all duration-100`}
                style={{ width: `${Math.min(loadPercent, 100)}%` }}
              />
            </div>
            <span>{Math.min(loadPercent, 100)}%</span>
          </div>
          <div className="leading-relaxed opacity-80">{`> ${loadingText}`}</div>
        </>
      )}

      {/* Phase 4: Ready */}
      {phase === "ready" && (
        <div className="mt-2">
          <div className="leading-relaxed">{"> SYSTEM READY."}</div>
          <span className="animate-blink">_</span>
        </div>
      )}
    </div>
  );
}
```

**Step 2: Verify it compiles**

Run: `cd /home/kimchel/Dev/kimfolio/Kimfolio && npm run build 2>&1 | tail -20`

**Step 3: Commit**

```bash
git add app/components/terminal/BootSequence.tsx
git commit -m "feat: add BIOS POST boot sequence component"
```

---

### Task 3: Create the CRT Shutdown Animation Component

**Files:**
- Create: `app/components/terminal/ShutdownAnimation.tsx`
- Modify: `app/globals.css` (add shutdown keyframes)

**Step 1: Add shutdown CSS keyframes to end of `app/globals.css`**

```css
/* CRT Shutdown Animation */
@keyframes crt-shutdown-squeeze {
  0% {
    transform: scaleY(1) scaleX(1);
    opacity: 1;
  }
  60% {
    transform: scaleY(0.005) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0.005) scaleX(0);
    opacity: 0;
  }
}

@keyframes crt-shutdown-glow {
  0% {
    box-shadow: 0 0 0px rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 0px rgba(255, 255, 255, 0);
    opacity: 0;
  }
}

.crt-shutdown {
  animation: crt-shutdown-squeeze 0.6s ease-in forwards;
}

.crt-shutdown-dot {
  animation: crt-shutdown-glow 0.4s ease-out 0.6s forwards;
}
```

**Step 2: Create ShutdownAnimation component**

```tsx
"use client";

import { useEffect } from "react";

type ShutdownAnimationProps = {
  onComplete: () => void;
};

export default function ShutdownAnimation({ onComplete }: ShutdownAnimationProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, 1000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
      <div className="crt-shutdown w-full h-full bg-black">
        <div className="w-full h-full bg-gray-900/50" />
      </div>
      <div className="crt-shutdown-dot absolute w-1 h-1 bg-white rounded-full" />
    </div>
  );
}
```

**Step 3: Verify and commit**

```bash
git add app/components/terminal/ShutdownAnimation.tsx app/globals.css
git commit -m "feat: add CRT shutdown squeeze-to-dot animation"
```

---

### Task 4: Create PowerButton and EjectButton Components

**Files:**
- Create: `app/components/terminal/PowerButton.tsx`
- Create: `app/components/terminal/EjectButton.tsx`

**Step 1: Create PowerButton**

```tsx
"use client";

import { ComputerState } from "../../lib/terminal-config";

type PowerButtonProps = {
  computerState: ComputerState;
  onClick: () => void;
};

export default function PowerButton({ computerState, onClick }: PowerButtonProps) {
  const ledColor = (() => {
    switch (computerState) {
      case ComputerState.ON:
        return "bg-green-500 shadow-[0_0_6px_#22c55e]";
      case ComputerState.BOOTING:
        return "bg-green-500 shadow-[0_0_6px_#22c55e] animate-blink";
      case ComputerState.SHUTTING_DOWN:
        return "bg-red-500 shadow-[0_0_6px_#ef4444]";
      case ComputerState.OFF:
      default:
        return "bg-red-900 shadow-[0_0_2px_#7f1d1d]";
    }
  })();

  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-1 hover:scale-110 transition-transform"
      title="Power"
    >
      <div className={`w-2 h-2 rounded-full ${ledColor} transition-colors`} />
      <div className="w-4 h-4 bg-gray-700 border border-gray-500 rounded-sm flex items-center justify-center hover:bg-gray-600 active:bg-gray-800 transition-colors">
        <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-gray-300">
          <circle cx="6" cy="6" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6" y1="1" x2="6" y2="6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </button>
  );
}
```

**Step 2: Create EjectButton**

```tsx
"use client";

type EjectButtonProps = {
  hasCartridge: boolean;
  onClick: () => void;
};

export default function EjectButton({ hasCartridge, onClick }: EjectButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!hasCartridge}
      className={`w-5 h-4 bg-gray-700 border border-gray-500 rounded-sm flex items-center justify-center transition-colors ${
        hasCartridge ? "hover:bg-gray-600 active:bg-gray-800" : "opacity-40"
      }`}
      title="Eject"
    >
      <svg viewBox="0 0 12 12" className="w-3 h-3 text-gray-300">
        <polygon points="6,2 10,8 2,8" fill="currentColor" />
        <rect x="2" y="9" width="8" height="1.5" fill="currentColor" />
      </svg>
    </button>
  );
}
```

**Step 3: Verify and commit**

```bash
git add app/components/terminal/PowerButton.tsx app/components/terminal/EjectButton.tsx
git commit -m "feat: add power and eject button components with LED indicator"
```

---

### Task 5: Create the Physics World Hook

**Files:**
- Create: `app/hooks/useCartridgePhysics.ts`

**Step 1: Create the hook**

This hook manages the Matter.js world for cartridge physics. It creates the engine, bodies, walls, shelf, slot sensor, and the animation loop that syncs body positions to DOM refs.

```typescript
"use client";

import { useEffect, useRef, useCallback } from "react";
import Matter from "matter-js";
import { CARTRIDGE_LIST, TerminalPath } from "../lib/terminal-config";

export type CartridgeBodyMap = Map<string, Matter.Body>;

type UseCartridgePhysicsOptions = {
  containerRef: React.RefObject<HTMLElement | null>;
  cartridgeRefs: React.RefObject<Map<string, HTMLElement>>;
  imageLayout: {
    imageTop: number;
    imageLeft: number;
    imageWidth: number;
    imageHeight: number;
  };
  onSlotOverlap: (cartridgeId: string) => void;
  insertedCartridge: TerminalPath | null;
  enabled: boolean;
};

const CARTRIDGE_W_REL = 0.12;
const CARTRIDGE_H_REL = 0.04;
const SHELF_X_REL = 0.08;
const SHELF_Y_START_REL = 0.3;
const SHELF_SPACING_REL = 0.06;
const SLOT_X_REL = 300 / 600;
const SLOT_Y_REL = 280 / 350;

export default function useCartridgePhysics({
  containerRef,
  cartridgeRefs,
  imageLayout,
  onSlotOverlap,
  insertedCartridge,
  enabled,
}: UseCartridgePhysicsOptions) {
  const engineRef = useRef<Matter.Engine | null>(null);
  const bodiesRef = useRef<CartridgeBodyMap>(new Map());
  const runnerRef = useRef<number | null>(null);
  const mouseConstraintRef = useRef<Matter.Constraint | null>(null);
  const slotSensorRef = useRef<Matter.Body | null>(null);
  const draggedBodyRef = useRef<Matter.Body | null>(null);

  const getSlotPosition = useCallback(() => {
    const { imageTop, imageLeft, imageWidth, imageHeight } = imageLayout;
    return {
      x: imageLeft + imageWidth * SLOT_X_REL,
      y: imageTop + imageHeight * SLOT_Y_REL,
    };
  }, [imageLayout]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const W = container.clientWidth;
    const H = container.clientHeight;
    const { imageTop, imageLeft, imageWidth, imageHeight } = imageLayout;

    const engine = Matter.Engine.create();
    engine.gravity.y = 1;
    engineRef.current = engine;

    const wallThickness = 60;
    const walls = [
      Matter.Bodies.rectangle(W / 2, H + wallThickness / 2, W + 200, wallThickness, { isStatic: true }),
      Matter.Bodies.rectangle(-wallThickness / 2, H / 2, wallThickness, H * 2, { isStatic: true }),
      Matter.Bodies.rectangle(W + wallThickness / 2, H / 2, wallThickness, H * 2, { isStatic: true }),
    ];

    const shelfX = W * SHELF_X_REL;
    const shelfW = imageWidth * 0.22;
    const shelfY = H * 0.65;
    const shelf = Matter.Bodies.rectangle(shelfX + shelfW / 2, shelfY, shelfW, 10, {
      isStatic: true, friction: 0.8,
    });
    const shelfWallH = 200;
    const shelfWallL = Matter.Bodies.rectangle(shelfX, shelfY - shelfWallH / 2, 10, shelfWallH, { isStatic: true });
    const shelfWallR = Matter.Bodies.rectangle(shelfX + shelfW, shelfY - shelfWallH / 2, 10, shelfWallH, { isStatic: true });

    const slotPos = {
      x: imageLeft + imageWidth * SLOT_X_REL,
      y: imageTop + imageHeight * SLOT_Y_REL,
    };
    const slotSensor = Matter.Bodies.rectangle(slotPos.x, slotPos.y, imageWidth * 0.15, imageHeight * 0.06, {
      isStatic: true, isSensor: true, label: "slot-sensor",
    });
    slotSensorRef.current = slotSensor;

    Matter.World.add(engine.world, [...walls, shelf, shelfWallL, shelfWallR, slotSensor]);

    const cW = imageWidth * CARTRIDGE_W_REL;
    const cH = imageHeight * CARTRIDGE_H_REL;

    CARTRIDGE_LIST.forEach((cartridge, i) => {
      if (insertedCartridge === cartridge.href) return;
      const body = Matter.Bodies.rectangle(
        shelfX + shelfW / 2 + (Math.random() - 0.5) * 20,
        H * SHELF_Y_START_REL + i * H * SHELF_SPACING_REL,
        cW, cH,
        { restitution: 0.3, friction: 0.6, density: 0.002, label: cartridge.id }
      );
      bodiesRef.current.set(cartridge.id, body);
      Matter.World.add(engine.world, body);
    });

    const sync = () => {
      Matter.Engine.update(engine, 1000 / 60);
      const refs = cartridgeRefs.current;
      if (refs) {
        bodiesRef.current.forEach((body, id) => {
          const el = refs.get(id);
          if (el) {
            el.style.transform = `translate(${body.position.x - cW / 2}px, ${body.position.y - cH / 2}px) rotate(${body.angle}rad)`;
          }
        });
      }
      runnerRef.current = requestAnimationFrame(sync);
    };
    runnerRef.current = requestAnimationFrame(sync);

    return () => {
      if (runnerRef.current) cancelAnimationFrame(runnerRef.current);
      Matter.Engine.clear(engine);
      bodiesRef.current.clear();
      engineRef.current = null;
    };
  }, [enabled, imageLayout, containerRef, cartridgeRefs, insertedCartridge]);

  const startDrag = useCallback((cartridgeId: string, mouseX: number, mouseY: number) => {
    const engine = engineRef.current;
    const body = bodiesRef.current.get(cartridgeId);
    if (!engine || !body) return;
    draggedBodyRef.current = body;
    const constraint = Matter.Constraint.create({
      pointA: { x: mouseX, y: mouseY },
      bodyB: body,
      stiffness: 0.2,
      damping: 0.1,
    });
    mouseConstraintRef.current = constraint;
    Matter.World.add(engine.world, constraint);
  }, []);

  const moveDrag = useCallback((mouseX: number, mouseY: number) => {
    const constraint = mouseConstraintRef.current;
    if (constraint) {
      (constraint.pointA as Matter.Vector).x = mouseX;
      (constraint.pointA as Matter.Vector).y = mouseY;
    }
  }, []);

  const endDrag = useCallback((): string | null => {
    const engine = engineRef.current;
    const constraint = mouseConstraintRef.current;
    const body = draggedBodyRef.current;
    const slot = slotSensorRef.current;

    if (engine && constraint) {
      Matter.World.remove(engine.world, constraint);
      mouseConstraintRef.current = null;
    }

    if (body && slot) {
      const dx = body.position.x - slot.position.x;
      const dy = body.position.y - slot.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 60) {
        const id = body.label;
        draggedBodyRef.current = null;
        return id;
      }
    }

    draggedBodyRef.current = null;
    return null;
  }, []);

  const ejectCartridge = useCallback((cartridgeId: string) => {
    const engine = engineRef.current;
    if (!engine) return;
    const { imageWidth, imageHeight } = imageLayout;
    const slotPos = getSlotPosition();
    const cW = imageWidth * CARTRIDGE_W_REL;
    const cH = imageHeight * CARTRIDGE_H_REL;

    const body = Matter.Bodies.rectangle(slotPos.x, slotPos.y, cW, cH, {
      restitution: 0.4, friction: 0.6, density: 0.002, label: cartridgeId,
    });
    Matter.Body.applyForce(body, body.position, {
      x: (Math.random() - 0.5) * 0.05,
      y: -0.08,
    });
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.3);
    bodiesRef.current.set(cartridgeId, body);
    Matter.World.add(engine.world, body);
  }, [imageLayout, getSlotPosition]);

  const removeCartridgeBody = useCallback((cartridgeId: string) => {
    const engine = engineRef.current;
    const body = bodiesRef.current.get(cartridgeId);
    if (engine && body) {
      Matter.World.remove(engine.world, body);
      bodiesRef.current.delete(cartridgeId);
    }
  }, []);

  return { startDrag, moveDrag, endDrag, ejectCartridge, removeCartridgeBody, getSlotPosition };
}
```

**Step 2: Verify and commit**

```bash
git add app/hooks/useCartridgePhysics.ts
git commit -m "feat: add Matter.js physics hook for cartridge drag, insert, and eject"
```

---

### Task 6: Create PhysicsCartridge Component

**Files:**
- Create: `app/components/terminal/PhysicsCartridge.tsx`

**Step 1: Create the component**

DOM-rendered cartridge whose position is driven by Matter.js. Visual design matches existing `RetroCassette`.

```tsx
"use client";

import { useEffect, useRef } from "react";
import { CartridgeData } from "../../lib/terminal-config";

type PhysicsCartridgeProps = {
  cartridge: CartridgeData;
  registerRef: (id: string, el: HTMLElement | null) => void;
  onMouseDown: (id: string, e: React.MouseEvent) => void;
};

export default function PhysicsCartridge({
  cartridge,
  registerRef,
  onMouseDown,
}: PhysicsCartridgeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerRef(cartridge.id, ref.current);
    return () => registerRef(cartridge.id, null);
  }, [cartridge.id, registerRef]);

  return (
    <div
      ref={ref}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(cartridge.id, e);
      }}
      className="absolute top-0 left-0 select-none"
      style={{ willChange: "transform" }}
    >
      <div className="relative w-28 h-10 bg-gray-900 rounded-sm border-2 border-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center p-1">
        <div className={`relative w-full h-full ${cartridge.stickerColor} border-2 border-black flex items-center px-2 overflow-hidden`}>
          <div
            className="absolute top-0 bottom-0 left-0 w-3 border-r-2 border-black/20"
            style={{
              backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
            }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-3 border-l-2 border-black/20"
            style={{
              backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
            }}
          />
          <span className="relative z-10 text-[7px] font-bold text-black truncate mx-auto">
            {cartridge.cassetteText}
          </span>
        </div>
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-500 rounded-full" />
        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-500 rounded-full" />
        <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-gray-500 rounded-full" />
        <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-gray-500 rounded-full" />
      </div>
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
git add app/components/terminal/PhysicsCartridge.tsx
git commit -m "feat: add physics-driven cartridge DOM component"
```

---

### Task 7: Create CRTScreen Component

**Files:**
- Create: `app/components/terminal/CRTScreen.tsx`

**Step 1: Create the component**

Wraps the CRT content area and switches between OFF/BOOTING/ON/SHUTTING_DOWN.

```tsx
"use client";

import { CSSProperties } from "react";
import { ComputerState, TerminalPath, CARTRIDGE_THEMES, DEFAULT_THEME } from "../../lib/terminal-config";
import BootSequence from "./BootSequence";
import ShutdownAnimation from "./ShutdownAnimation";

type CRTScreenProps = {
  computerState: ComputerState;
  insertedCartridge: TerminalPath | null;
  contentStyle: CSSProperties;
  onBootComplete: () => void;
  onShutdownComplete: () => void;
  children: React.ReactNode;
};

export default function CRTScreen({
  computerState,
  insertedCartridge,
  contentStyle,
  onBootComplete,
  onShutdownComplete,
  children,
}: CRTScreenProps) {
  const theme = insertedCartridge
    ? CARTRIDGE_THEMES[insertedCartridge] || DEFAULT_THEME
    : DEFAULT_THEME;

  return (
    <div style={contentStyle} className="flex flex-col items-center justify-center crt">
      <div
        className={`w-full h-full font-mono
          terminal-scroll-${theme.terminal} overflow-y-auto
          bg-black/40 backdrop-blur-sm ${theme.borderColor} ${theme.primaryColor}`}
        style={{
          imageRendering: "pixelated",
          textShadow: "0 0 4px currentColor",
          boxShadow: `inset 0 0 20px ${
            insertedCartridge === TerminalPath.SKILLS ? "#f59e0b" : "#000"
          }`,
        }}
      >
        {computerState === ComputerState.OFF && (
          <div className="w-full h-full bg-black" />
        )}

        {computerState === ComputerState.BOOTING && (
          <BootSequence
            themeName={theme.name}
            themeColor={theme.primaryColor}
            loadingText={theme.loadingText}
            bootColor={theme.bootColor}
            borderColor={theme.borderColor}
            onComplete={onBootComplete}
          />
        )}

        {computerState === ComputerState.ON && (
          <div className="w-full h-full p-6">{children}</div>
        )}

        {computerState === ComputerState.SHUTTING_DOWN && (
          <ShutdownAnimation onComplete={onShutdownComplete} />
        )}
      </div>
    </div>
  );
}
```

**Step 2: Verify and commit**

```bash
git add app/components/terminal/CRTScreen.tsx
git commit -m "feat: add CRTScreen component with state-driven content switching"
```

---

### Task 8: Integrate Everything into TerminalLayout

**Files:**
- Modify: `app/terminal/layout.tsx` (major rewrite of desktop section)

This is the big integration task. The desktop layout gets replaced with the new state machine, physics, and components. Mobile layout stays unchanged.

**Step 1: Rewrite layout.tsx**

Replace entire file with new version that:
- Imports all new components and hooks
- Adds `computerState` and `insertedCartridge` state (replacing `loading`)
- Syncs with Next.js pathname on mount
- Wires physics hook to container + cartridge refs
- Renders `CRTScreen`, `PowerButton`, `EjectButton`, `PhysicsCartridge` components
- Keeps mobile layout identical

Key state logic:
- `computerState: ComputerState` starts as `OFF`
- `insertedCartridge: TerminalPath | null` starts as `null`
- On pathname match: set inserted cartridge and trigger `BOOTING`
- Power toggle: OFF+cartridge→BOOTING, ON→SHUTTING_DOWN
- Eject: remove cartridge, eject physics body, go OFF
- Boot complete callback: set `ON`
- Shutdown complete callback: set `OFF`

Mouse drag flow:
- `onMouseDown` on PhysicsCartridge → `startDrag(id, x, y)`
- Window `mousemove` → `moveDrag(x, y)`
- Window `mouseup` → `endDrag()` returns cartridge ID if near slot → `handleInsertCartridge(id)`

Button positioning: absolute div at `imageTop + imageHeight * (290/350)` with `imageLeft + imageWidth * (200/600)`.

See Task 8 in design doc for full component tree. The mobile section is copy-pasted from the current layout.tsx lines 90-163, only replacing the `loading` check with `computerState === ComputerState.BOOTING`.

**Step 2: Verify it compiles and loads**

Run: `npm run build 2>&1 | tail -30`
Run: `npm run dev` and test in browser

**Step 3: Commit**

```bash
git add app/terminal/layout.tsx
git commit -m "feat: integrate state machine, physics cartridges, boot/shutdown into terminal layout"
```

---

### Task 9: Test and Polish

**Files:** Any files from above

**Step 1: Manual testing checklist**

Test in browser at `http://localhost:3000/terminal/about`:
1. Navigate to `/terminal/about` - boot sequence plays, then content shows
2. Power OFF - CRT shutdown animation plays
3. Power ON with cartridge - re-boots
4. Drag cartridge to slot - snaps, insert sound, boots
5. Eject button - cartridge pops out with physics tumble
6. Throw cartridges - collide with walls and each other
7. Mobile (<768px) - old tab layout, unchanged
8. Direct URL to `/terminal/skills` - auto-insert and boot

**Step 2: Tune physics constants**

Adjust in `useCartridgePhysics.ts`:
- Gravity, friction, restitution, density
- Eject impulse force and angular velocity
- Slot detection radius
- Shelf position and size
- Drag stiffness and damping

**Step 3: Commit fixes**

```bash
git add -A
git commit -m "fix: polish physics tuning, timing, and edge cases"
```

---

### Task 10: Remove Old TerminalMenu

**Files:**
- Delete: `app/components/TerminalMenu.tsx` (if fully replaced)

**Step 1: Verify TerminalMenu is no longer imported**

Search all files for "TerminalMenu" imports.

**Step 2: Delete if unused**

```bash
git rm app/components/TerminalMenu.tsx
git commit -m "refactor: remove unused TerminalMenu (replaced by physics cartridges)"
```
