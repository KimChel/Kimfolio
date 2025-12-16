"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  CARTRIDGE_THEMES,
  DEFAULT_THEME,
  TerminalPath,
} from "../lib/terminal-config";
import BackButton from "../components/BackButton";
import Menu from "../components/Menu";
import TerminalMenu from "../components/TerminalMenu";

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const currentTheme =
    CARTRIDGE_THEMES[pathname as TerminalPath] || DEFAULT_THEME;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <main className="relative w-full h-[100dvh] bg-black overflow-hidden">
      <div
        className="w-full h-full relative transition-all duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${currentTheme.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
      >
        <nav className="absolute top-4 left-4 z-50 sm:scale-80">
          <BackButton />
        </nav>
        <nav className="absolute top-4 right-4 z-50 sm:scale-80">
          <Menu />
        </nav>
        <nav className="absolute top-[30%] left-[17%] z-50 sm:scale-75">
          <TerminalMenu />
        </nav>

        {loading ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div
              className={`min-w-[250px] bg-black/95 border ${currentTheme.borderColor} ${currentTheme.primaryColor} px-6 py-5 font-mono uppercase tracking-[0.08em]`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span>{currentTheme.name}</span>
                <span className="animate-blink">_</span>
              </div>
              <div
                className={`relative w-full h-2 border ${currentTheme.borderColor} bg-black overflow-hidden`}
              >
                <div
                  className={`absolute inset-0 w-1/2 ${currentTheme.bootColor} animate-loading-bar opacity-80`}
                />
              </div>
              <div className="mt-2 text-xs opacity-80">
                {currentTheme.loadingText}
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[25%] left-[12%] right-[12%] bottom-[20%] flex flex-col items-center justify-center p-4">
              <div
                className={`w-full max-w-[800px] sm:max-w-[600px] h-full p-6 font-mono 
                terminal-scroll-${currentTheme.terminal} overflow-y-auto 
                bg-black/40 backdrop-blur-sm ${currentTheme.borderColor} ${currentTheme.primaryColor}`}
                style={{
                  imageRendering: "pixelated",
                  textShadow: `0 0 4px currentColor`,
                  boxShadow: `inset 0 0 20px ${
                    pathname === TerminalPath.SKILLS ? "#f59e0b" : "#000"
                  }`,
                }}
              >
                {/* THIS IS WHERE THE PAGE CONTENT IS INJECTED */}
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
