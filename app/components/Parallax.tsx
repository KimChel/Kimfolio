"use client"

import { motion, useMotionValue, useTransform } from "framer-motion";
import { use, useEffect } from "react";

type Props = {
  layers: { src: string, scale?: number, mt?: number }[]
}

export default function Parallax({ layers }: Props) {

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
      {layers.map((layer, index) => {
        const translateX = useTransform(x, (val) => val * (index + 1) * 0.3)
        const translateY = useTransform(y, (val) => val * (index + 1) * 0.3)

        return (
          <motion.div
            key={index}
            style={{
              translateX,
              translateY,
              scale: layer.scale || 1,
              marginTop: layer.mt || 0,
            }}
            className="
        absolute inset-0
        "
          >
            <div className="w-full h-full"
              style={{
                backgroundImage: `url(${layer.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                imageRendering: "pixelated"
              }}
            ></div>
          </motion.div>
        )
      })}
    </div>
  );
}
