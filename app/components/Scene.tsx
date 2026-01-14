"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Engine from "./Engine";
import Menu from "./Menu";
import { WipBanner } from "./Banner";
import { QuestLog } from "./QuestLog";

export default function Scene() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [engineReady, setEngineReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

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
      <WipBanner />
      <nav className="absolute top-4 right-4 z-50 text-left sm:scale-80">
        <Menu />
      </nav>
      <div className="absolute top-4 left-4 z-[60] sm:scale-90">
        <QuestLog />
      </div>
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

            <div className="absolute inset-0 z-10 crt">
              {!engineReady && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 font-(--font-pixel) text-xl text-white pointer-events-auto">
                  Loading... {Math.round(loadProgress * 100)}%
                </div>
              )}
              <div className="absolute inset-0 pointer-events-auto">
                <Engine
                  onLoadProgress={setLoadProgress}
                  onLoaded={() => setEngineReady(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
