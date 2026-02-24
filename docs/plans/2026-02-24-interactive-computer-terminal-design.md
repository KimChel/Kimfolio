# Interactive Computer Terminal Design

## Overview

Transform the desktop terminal layout from a static computer image with drag-and-drop navigation into a fully interactive retro PC experience with physics-based cartridges, BIOS boot sequence, power/eject buttons, and CRT shutdown effects.

## State Machine

The computer operates in 4 states:

```
OFF → BOOTING → ON → SHUTTING_DOWN → OFF
```

- **OFF**: CRT black, power LED red/off, no content. Inserting a cartridge triggers BOOTING.
- **BOOTING**: BIOS POST sequence plays on CRT (~4s). LED blinks.
- **ON**: Normal content with CRT effects. LED solid green.
- **SHUTTING_DOWN**: CRT squeeze-to-dot animation (~1s). Then OFF.

### Cartridge interactions:
- **INSERT**: Eject current if any → insert new → if OFF, trigger BOOTING
- **EJECT**: Physics launch cartridge out of slot → if was ON, go to OFF

### Button behavior:
- **Power (OFF + cartridge)**: → BOOTING
- **Power (OFF + no cartridge)**: LED blinks briefly
- **Power (ON)**: → SHUTTING_DOWN → OFF
- **Power (BOOTING)**: Ignored
- **Eject (cartridge in)**: Re-create physics body at slot, apply upward impulse
- **Eject (no cartridge / BOOTING)**: Ignored

## BIOS Boot Sequence

Rendered as styled DOM text inside CRT area with typewriter effect (50-100ms per line). Uses current cartridge's theme color.

```
Phase 1 - POST (0-1.5s):
  [BIOS] KIM-PC v2.1
  Memory Test... 640K OK
  Detecting Devices...
    > CRT Display...... OK
    > Audio Module..... OK
    > Cartridge Slot... OK

Phase 2 - Cartridge Detection (1.5-2.5s):
  Reading Cartridge...
  > {theme.name} DETECTED
  > Signature verified

Phase 3 - OS Load (2.5-4s):
  Loading {theme.name}...
  [animated progress bar] {percent}%
  > {theme.loadingText}

Phase 4 - Ready (4s):
  > SYSTEM READY.
  > _  (blinking cursor, brief pause)
  → transition to ON
```

## CRT Shutdown Animation

1. Content fades slightly (100ms)
2. `scaleY` shrinks to horizontal line (300ms)
3. `scaleX` shrinks to center dot (200ms)
4. White glow/bloom on dot (200ms)
5. Fade to black (100ms)
6. LED: green → red

All CSS animations on the content wrapper.

## Physics System (Desktop Only)

**Architecture**: Matter.js + DOM sync (hybrid approach)

Matter.js runs the physics simulation. DOM elements are positioned/rotated via `transform` synced from Matter.js body positions each frame using `requestAnimationFrame`.

### World setup:
- **Gravity**: Standard downward (0, 1)
- **Shelf**: Static bodies forming floor + walls of a shelf area (left of computer)
- **Desk surface**: Static body at viewport bottom
- **Viewport walls**: Static bodies on left, right, bottom edges
- **Slot sensor**: Matter.js sensor body at cartridge slot position on computer

### Cartridge bodies:
- 5 rectangular rigid bodies, initially stacked on shelf
- Properties: friction, restitution (bounce), density for satisfying feel
- DOM `<div>` elements styled as existing `RetroCassette` design

### Interactions:
- **Drag**: `mousedown` creates Matter.js `MouseConstraint`; DOM follows
- **Throw**: Release while moving retains velocity
- **Collisions**: Cartridges collide with each other, shelf, desk, walls
- **Insert**: Overlap with slot sensor → snap animation → insert
- **Eject**: Re-create body at slot position with upward + random lateral impulse

## Power & Eject Buttons

Clickable hotspots overlaid on computer image using percentage-based absolute positioning (same approach as `contentStyle`).

- **Power button**: Circular hotspot below CRT. LED indicator via CSS `box-shadow` glow (green=ON, red=OFF, blink=BOOTING).
- **Eject button**: Rectangular hotspot near cartridge slot. Subtle raised-button styling.
- Both: `cursor: pointer`, hover glow effect.

## Component Architecture

```
TerminalLayout (layout.tsx) — state machine owner
├── ComputerScene — desktop physics + computer
│   ├── PhysicsWorld — Matter.js engine, sync loop
│   ├── CartridgeShelf — shelf visual + initial positions
│   ├── PhysicsCartridge x5 — DOM cartridge synced to body
│   ├── ComputerMonitor — bg image + hotspots
│   │   ├── PowerButton — LED + click handler
│   │   ├── EjectButton — click handler
│   │   └── CartridgeSlot — sensor zone visual
│   ├── CRTScreen — content area
│   │   ├── BootSequence — BIOS POST renderer
│   │   ├── ShutdownAnimation — CRT off effect
│   │   └── {children} — page content (when ON)
│   └── BackButton, Menu (existing)
└── MobileLayout (existing, unchanged)
```

### State ownership:
- `computerState`: OFF | BOOTING | ON | SHUTTING_DOWN — lives in TerminalLayout
- `insertedCartridge`: TerminalPath | null
- Callbacks: `onInsertCartridge(path)`, `onEjectCartridge()`, `onPowerToggle()`

### Physics sync:
- Matter.js engine in `useRef`, initialized in `useEffect`
- `requestAnimationFrame` loop reads body positions
- Directly mutates DOM transforms for performance (avoids React re-renders)

## Tech Stack

- **Matter.js** (already installed) — physics engine
- **Framer Motion** (already installed) — boot/shutdown CSS animations
- **Tailwind CSS** — styling
- **React refs + rAF** — physics-to-DOM sync

## Mobile

No changes to mobile layout. Physics and interactive features are desktop-only. Mobile keeps the current tab-based navigation.
