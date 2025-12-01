"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX + 16, y: e.clientY + 16 });
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (e.type === "mousedown") setClicked(true);
      else if (e.type === "mouseup") setClicked(false);
    };

    window.addEventListener("mousedown", click);
    window.addEventListener("mouseup", click);

    return () => {
      window.removeEventListener("mousedown", click);
      window.removeEventListener("mouseup", click);
    };
  }, []);

  return (
    <div>
      {clicked && (
        <div
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            width: "32px",
            height: "32px",
            backgroundImage: "url('/assets/cursor/pointerClicked.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
            imageRendering: "pixelated",
            display: !clicked ? "none" : "block",
          }}
        ></div>
      )}{" "}
      {
        <div
          style={{
            position: "fixed",
            left: pos.x,
            top: pos.y,
            width: "32px",
            height: "32px",
            backgroundImage: "url('/assets/cursor/pointer.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
            imageRendering: "pixelated",
            display: !clicked ? "block" : "none",
          }}
        ></div>
      }
    </div>
  );
}
