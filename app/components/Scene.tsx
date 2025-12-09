"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { use, useEffect } from "react";
import Image from "next/image";
import Engine from "./Engine";
import Link from "next/link";

export default function Scene() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;

      x.set((event.clientX / innerWidth - 0.5) * 20);
      y.set((event.clientY / innerHeight - 0.5) * 20);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [x, y]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        style={{
          translateX: useTransform(x, (val) => val * 1.5),
          translateY: useTransform(y, (val) => val * 1.5),
          scale: 1.02,
        }}
        className="
        absolute inset-0
        "
      >
        <div className="w-full h-full relative">
          <div
            className="
          absolute bottom-0 left-1/2 -translate-x-1/2
          w-full max-w-dvw
        "
            style={{
              height: "auto",
              aspectRatio: "16 / 9",
            }}
          >
            <Image
              src="/assets/building.png"
              alt="building"
              width={1920} // set actual pixel width of your image
              height={1080}
              unoptimized
              className="absolute inset-0 w-full h-full"
              style={{
                imageRendering: "pixelated",
              }}
            />

            <div className="absolute inset-0 z-10 pointer-events-auto">
              <Engine />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
