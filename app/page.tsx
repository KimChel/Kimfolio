"use client";

import { useEffect, useState } from "react";
import Parallax from "@/app/components/Parallax";
import Scene from "@/app/components/Scene";
import MobileLanding from "@/app/components/MobileLanding";

const layers = [
  { src: "/bg2/1.png", scale: 1 },
  { src: "/bg2/2.png", scale: 1 },
  { src: "/bg2/3.png", scale: 1 },
  { src: "/bg2/4.png", scale: 1 },
  { src: "/bg2/5.png", scale: 1 },
];

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setHydrated(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!hydrated) {
    return <main className="w-full h-[100dvh] bg-black" />;
  }

  return (
    <main className="relative w-full h-[100dvh] bg-black overflow-hidden">
      {isMobile ? (
        <MobileLanding />
      ) : (
        <>
          <Parallax layers={layers} />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <Scene />
          </div>
        </>
      )}
    </main>
  );
}
