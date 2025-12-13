"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [isHovered, setIsHovered] = useState(false)

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

  useEffect(() => {
    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isClickable =
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        (target.tagName === "INPUT" &&
          (target.getAttribute("type") === "submit" ||
            target.getAttribute("type") === "button")
        )

      if (e.type === "mouseover" && isClickable) {
        setIsHovered(true)
      } else if (e.type === "mouseout" && isClickable) {
        setIsHovered(false)
      }else if(!isClickable){
        setIsHovered(false)
      }

    }

    window.addEventListener("mouseover", handleHover);
    window.addEventListener("mouseout", handleHover);

    return () => {
      window.removeEventListener("mouseover", handleHover)
      window.removeEventListener("mouseout", handleHover);
    }

  }, [])

  const getCursorImage = () => {
    if (clicked && !isHovered) return "url('/assets/cursor/pointerClicked.png')"
    if (isHovered) return "url('/assets/cursor/pointerHover.png')"
    return "url('/assets/cursor/pointer.png')"
  }

  return (

    <div
style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        width: "32px",
        height: "32px",
        backgroundImage: getCursorImage(),
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 9999,
        imageRendering: "pixelated",
        // Only hide the custom cursor if the system cursor leaves the window? 
        // Or simply always show it.
        display: "block", 
        transition: "background-image 0.1s ease", // Optional: smooth transition between images
      }}
    ></div>

  );
}
