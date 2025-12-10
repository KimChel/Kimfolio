"use client";

import React, { useEffect, useState } from "react";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full h-[100dvh] bg-black overflow-hiddenr">
      <div
        className="w-full h-full relative"
        style={{
          backgroundImage: `url(/assets/computer.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
      >
        {loading ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="min-w-[220px] bg-black/90 border border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.6)_inset,0_0_8px_rgba(0,255,0,0.6)] text-green-500 px-6 py-5 font-mono uppercase tracking-[0.08em]">
              <div className="flex items-center gap-2 mb-3">
                <span>{">"} boot sequence</span>
                <span className="animate-blink">_</span>
              </div>
              <div className="relative w-40 h-2 border border-green-500 bg-[#001900] overflow-hidden">
                <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-ping" />
              </div>
              <div className="mt-2 text-xs text-[#7dff7d]">
                initializing modules
              </div>
            </div>
          </div>
        ): (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[15%] left-[12%] right-[12%] bottom-[20%] flex flex-col items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl max-h-xl bg-[#1a1a1a]/80 border-2 border-[#333] p-6 shadow-inner text-green-500 font-mono">
              <h1 className="text-2xl mb-4 uppercase tracking-tighter shadow-green-900 drop-shadow-md">
                {">"} system.init(Kimon)
              </h1>
              <p className="text-sm leading-relaxed">
                Full-stack developer serving in the Hellenic Navy. Bridging the
                gap between web systems and game logic.
              </p>

              <div className="mt-8 border-t border-green-900 pt-4">
                <span className="animate-blink">_</span>
              </div>
            </div>
          </div>
        </div>
        )}

      </div>
    </main>
  );
}
