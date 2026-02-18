import { AnimatedSprite, Container } from "pixi.js";

type NpcState = "idle" | "walk" | "special";

interface NpcAnimations {
  idle: AnimatedSprite;
  walk?: AnimatedSprite;
  special?: AnimatedSprite;
}

interface NpcOptions {
  speed?: number;
  xRel?: number;
  yRel?: number;
  minXRel?: number;
  maxXRel?: number;
  direction?: "left" | "right";
}

/**
 * A single NPC character with idle / walk / special animation states.
 * Call tick() once per frame to advance movement.
 * Call setState() to trigger animation transitions.
 */
export class Npc {
  sprite: AnimatedSprite; // the currently active sprite
  state: NpcState = "idle";
  direction: "left" | "right";
  speed: number;

  minX = 0;
  maxX = 0;

  // Relative (0–1) layout values, recalculated on resize
  readonly xRel: number;
  readonly yRel: number;
  readonly minXRel: number;
  readonly maxXRel: number;

  private readonly animations: NpcAnimations;
  private readonly stage: Container;

  constructor(
    animations: NpcAnimations,
    stage: Container,
    options: NpcOptions = {}
  ) {
    this.animations = animations;
    this.stage = stage;
    this.sprite = animations.idle;
    this.direction = options.direction ?? (Math.random() < 0.5 ? "left" : "right");
    this.speed = options.speed ?? 0.1;
    this.xRel = options.xRel ?? 0.5;
    this.yRel = options.yRel ?? 0.88;
    this.minXRel = options.minXRel ?? this.xRel - 0.05;
    this.maxXRel = options.maxXRel ?? this.xRel + 0.05;
  }

  // ── State machine ──────────────────────────────────────────────────────────

  setState(newState: NpcState) {
    if (this.state === newState) return;

    const next = this.animations[newState];

    // Guard: sprite may be null/destroyed after Pixi app teardown
    if (!next || !next.position) return;

    Object.values(this.animations).forEach((anim) => {
      if (anim) anim.visible = false;
    });

    next.position.set(this.sprite.x, this.sprite.y);
    next.scale.set(this.sprite.scale.x, this.sprite.scale.y);

    this.state = newState;
    this.sprite = next;
    this.sprite.visible = true;
  }

  /** Pick a random state. Called by the orchestrator on a timer. */
  randomizeState() {
    const r = Math.random();
    if (r < 0.6) this.setState("idle");
    else if (r < 0.85 && this.animations.walk) this.setState("walk");
    else if (this.animations.special) this.setState("special");
  }

  // ── Per-frame update ───────────────────────────────────────────────────────

  /** Advance walk movement. Call once per frame. */
  tick() {
    if (this.state !== "walk" || !this.animations.walk) return;

    const dir = this.direction === "left" ? -1 : 1;
    this.sprite.x += dir * this.speed;
    this.sprite.scale.x = Math.abs(this.sprite.scale.x) * dir;

    if (this.sprite.x < this.minX) this.direction = "right";
    if (this.sprite.x > this.maxX) this.direction = "left";
  }

  // ── Layout ─────────────────────────────────────────────────────────────────

  /** Recalculate pixel bounds and reposition sprites after a window resize. */
  resize(containerWidth: number, containerHeight: number, scale: number) {
    Object.values(this.animations).forEach((anim) => anim?.scale.set(scale));

    this.minX = containerWidth * this.minXRel;
    this.maxX = containerWidth * this.maxXRel;

    // Only the active sprite's position is updated; setState copies it on transition
    this.sprite.x = containerWidth * this.xRel;
    this.sprite.y = containerHeight * this.yRel;
  }

  // ── Cleanup ────────────────────────────────────────────────────────────────

  /** Remove all animation sprites from the stage. */
  destroy() {
    Object.values(this.animations).forEach((anim) => {
      if (!anim) return;
      this.stage.removeChild(anim);
      anim.destroy();
    });
  }

  // ── Static factory ─────────────────────────────────────────────────────────

  /**
   * Load all animation spritesheets for a single NPC, add them to the stage,
   * and return a configured Npc instance.
   */
  static create(
    loadedAssets: Record<string, any>,
    basePath: string,
    hasWalk: boolean,
    hasSpecial: boolean,
    stage: Container,
    options: NpcOptions = {}
  ): Npc {
    const makeSprite = (animName: string, path: string): AnimatedSprite => {
      const s = new AnimatedSprite(loadedAssets[path].animations[animName]);
      s.anchor.set(0.5, 1);
      s.animationSpeed = 1 / 10;
      s.play();
      s.visible = false;
      s.zIndex = 2;
      stage.addChild(s);
      return s;
    };

    const animations: NpcAnimations = {
      idle: makeSprite("idle", `${basePath}/idle.json`),
      ...(hasWalk && { walk: makeSprite("walk", `${basePath}/walk.json`) }),
      ...(hasSpecial && { special: makeSprite("special", `${basePath}/special.json`) }),
    };

    animations.idle.visible = true;

    return new Npc(animations, stage, options);
  }
}
