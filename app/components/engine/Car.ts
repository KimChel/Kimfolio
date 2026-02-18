import { AnimatedSprite, Container } from "pixi.js";
import Matter from "matter-js";

interface GroundCategories {
  left: number;
  right: number;
}

/**
 * A single physics-driven car that drives across the scene.
 * Owns its AnimatedSprite and Matter body.
 * Call tick() once per frame (after Matter.Engine.update).
 */
export class Car {
  readonly sprite: AnimatedSprite;
  readonly body: Matter.Body;
  readonly direction: "left" | "right";

  private dragging = false;
  private readonly world: Matter.World;
  private readonly stage: Container;
  private readonly ground: Matter.Body;
  private readonly lowerGround: Matter.Body;

  constructor(
    frames: any[],
    direction: "left" | "right",
    container: HTMLDivElement,
    stage: Container,
    world: Matter.World,
    ground: Matter.Body,
    lowerGround: Matter.Body,
    groundCategories: GroundCategories
  ) {
    this.direction = direction;
    this.stage = stage;
    this.world = world;
    this.ground = ground;
    this.lowerGround = lowerGround;

    // ── Sprite ──────────────────────────────────────────────────────────────
    this.sprite = new AnimatedSprite(frames);
    this.sprite.animationSpeed = 1 / 6;
    this.sprite.play();
    this.sprite.anchor.set(0.5);
    this.sprite.eventMode = "static";
    this.sprite.zIndex = 5;

    const scale = container.clientWidth / 1920;
    const startX = direction === "left" ? container.clientWidth + 200 : -200;
    const startY = container.clientHeight * 0.45;

    this.sprite.x = startX;
    this.sprite.y = startY;
    this.sprite.scale.set(scale);

    // ── Physics body ────────────────────────────────────────────────────────
    const mask =
      direction === "left" ? groundCategories.left : groundCategories.right;

    this.body = Matter.Bodies.rectangle(
      startX,
      startY,
      this.sprite.width * this.sprite.scale.x,
      this.sprite.height * this.sprite.scale.y,
      { restitution: 0.1, friction: 0.4, collisionFilter: { group: -1, mask } }
    );

    // Register with Pixi and Matter
    Matter.World.add(world, this.body);
    stage.addChild(this.sprite);

    this.setupDragging();
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private setupDragging() {
    let offsetX = 0;
    let offsetY = 0;
    let history: { x: number; y: number; t: number }[] = [];

    const record = (g: { x: number; y: number }) => {
      history.push({ x: g.x, y: g.y, t: performance.now() });
      if (history.length > 6) history.shift();
    };

    const applyThrow = () => {
      if (history.length < 2) return;
      const first = history[0];
      const last = history[history.length - 1];
      const dt = (last.t - first.t) / 2;
      if (dt <= 0) return;
      Matter.Body.setVelocity(this.body, {
        x: (last.x - first.x) / dt,
        y: (last.y - first.y) / dt,
      });
      history = [];
    };

    this.sprite.on("pointerdown", (e: any) => {
      this.dragging = true;
      Matter.Body.setStatic(this.body, true);
      offsetX = e.global.x - this.sprite.x;
      offsetY = e.global.y - this.sprite.y;
      record(e.global);
    });

    this.sprite.on("pointermove", (e: any) => {
      if (!this.dragging) return;
      record(e.global);
      Matter.Body.setPosition(this.body, {
        x: e.global.x - offsetX,
        y: e.global.y - offsetY,
      });
    });

    const release = () => {
      if (!this.dragging) return;
      this.dragging = false;
      Matter.Body.setStatic(this.body, false);
      applyThrow();
    };

    this.sprite.on("pointerup", release);
    this.sprite.on("pointerupoutside", release);
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  /** Move the car and sync the sprite to the physics body. Call once per frame. */
  tick() {
    if (!this.dragging) {
      const speed = Math.random() * 1.5 + 0.5;

      if (this.direction === "left") {
        this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
      }

      const targetGround =
        this.direction === "left" ? this.ground : this.lowerGround;

      if (Matter.Collision.collides(this.body, targetGround)) {
        Matter.Body.setVelocity(this.body, {
          x: this.direction === "left" ? -speed : speed,
          y: this.body.velocity.y,
        });
      }
    }

    this.sprite.x = this.body.position.x;
    this.sprite.y = this.body.position.y;
    this.sprite.rotation = this.body.angle;
  }

  /** Rescale sprite and physics body after a window resize. */
  rescale(newScale: number, previousScale: number) {
    const ratio = newScale / previousScale;
    this.sprite.scale.set(newScale);
    Matter.Body.scale(this.body, ratio, ratio);
  }

  /** True when the car has driven off either side of the viewport. */
  isOffscreen(containerWidth: number) {
    const x = this.body.position.x;
    return x < -400 || x > containerWidth + 400;
  }

  /** Remove sprite from stage and body from world. */
  destroy() {
    Matter.World.remove(this.world, this.body);
    this.stage.removeChild(this.sprite);
    this.sprite.destroy();
  }
}
