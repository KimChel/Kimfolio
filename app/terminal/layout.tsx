"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { CSSProperties, useEffect, useState } from "react";
import {
  CARTRIDGE_THEMES,
  DEFAULT_THEME,
  TerminalPath,
} from "../lib/terminal-config";
import BackButton from "../components/BackButton";
import Menu from "../components/Menu";
import TerminalMenu from "../components/TerminalMenu";
import useWindowResize from "../hooks/useWindowResize";
import Link from "next/link";

const mobileTabs = [
  { label: "ABOUT", href: "/terminal/about", color: "text-green-500" },
  { label: "PROJ", href: "/terminal/projects", color: "text-cyan-400" },
  { label: "SKILLS", href: "/terminal/skills", color: "text-amber-500" },
  { label: "CV", href: "/terminal/cv", color: "text-white" },
  { label: "CONTACT", href: "/terminal/contact", color: "text-rose-500" },
];

export default function TerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [windowWidth, windowHeight] = useWindowResize();

  const isMobile = windowWidth > 0 && windowWidth < 768;

  const imageAspectRatio = 600 / 350;
  const windowAspectRatio = windowWidth / windowHeight;

  let imageWidth: number,
    imageHeight: number,
    imageTop: number,
    imageLeft: number;

  if (windowAspectRatio > imageAspectRatio) {
    imageHeight = windowHeight;
    imageWidth = imageHeight * imageAspectRatio;
    imageTop = 0;
    imageLeft = (windowWidth - imageWidth) / 2;
  } else {
    imageWidth = windowWidth;
    imageHeight = imageWidth / imageAspectRatio;
    imageLeft = 0;
    imageTop = (windowHeight - imageHeight) / 2;
  }

  const contentStyle: CSSProperties = {
    position: "absolute",
    top: `${imageTop + imageHeight * (86 / 350)}px`,
    left: `${imageLeft + imageWidth * (157 / 600)}px`,
    width: `${imageWidth * (284 / 600)}px`,
    height: `${imageHeight * (201 / 350)}px`,
  };

  const currentTheme =
    CARTRIDGE_THEMES[pathname as TerminalPath] || DEFAULT_THEME;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const href = e.dataTransfer.getData("text/plain");
    if (href && pathname !== href) {
      const audio = document.getElementById(
        "cassette-insert-sound"
      ) as HTMLAudioElement;
      audio?.play();
      router.push(href);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [pathname]);

  /* ── MOBILE LAYOUT ── */
  if (isMobile) {
    return (
      <main className="w-full h-[100dvh] bg-black flex flex-col overflow-hidden font-mono">
        {/* Header */}
        <header
          className={`flex items-center gap-3 px-4 py-3 border-b ${currentTheme.borderColor} shrink-0`}
        >
          <Link
            href="/"
            className={`shrink-0 w-9 h-9 border ${currentTheme.borderColor} flex items-center justify-center ${currentTheme.primaryColor} text-lg`}
          >
            ←
          </Link>
          <span
            className={`flex-1 text-center text-[10px] tracking-[0.25em] uppercase ${currentTheme.primaryColor}`}
          >
            {currentTheme.name}
          </span>
          {/* spacer to visually center the title */}
          <div className="w-9 shrink-0" />
        </header>

        {/* Content */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div
              className={`border ${currentTheme.borderColor} ${currentTheme.primaryColor} px-6 py-5 uppercase tracking-[0.08em] min-w-[220px]`}
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
          <div className="flex-1 min-h-0 overflow-y-auto relative crt">
            <div
              className={`min-h-full p-4 ${currentTheme.primaryColor}`}
              style={{ textShadow: `0 0 4px currentColor` }}
            >
              {children}
            </div>
          </div>
        )}

        {/* Bottom tab bar */}
        <nav
          className={`border-t ${currentTheme.borderColor} flex shrink-0`}
        >
          {mobileTabs.map((tab) => (
            <Link
              key={tab.label}
              href={tab.href}
              className={`flex-1 flex items-center justify-center py-3 text-[8px] uppercase tracking-wider transition-colors ${
                pathname === tab.href ? tab.color : "text-white/25"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </main>
    );
  }

  /* ── DESKTOP LAYOUT ── */
  return (
    <main className="relative w-full h-[100dvh] bg-black overflow-hidden">
      <div
        className="w-full h-full relative transition-all duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${currentTheme.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
          backgroundRepeat: "no-repeat",
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
          <div
            className="absolute inset-0 overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              style={contentStyle}
              className="flex flex-col items-center justify-center crt"
            >
              <div
                className={`w-full h-full p-6 font-mono
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
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
      <audio
        id="cassette-insert-sound"
        src="/assets/audio/insert-sound.mp3"
        preload="auto"
      />
    </main>
  );
}
