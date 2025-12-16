"use client";

import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import Menu from "../components/Menu";
import BackButton from "../components/BackButton";
import TerminalMenu from "../components/TerminalMenu";
import Image from "next/image";
import { useForm } from "react-hook-form";

// --- Types ---
export enum CartridgeSelection {
  ABOUT_CARTRIDGE = "about",
  PROJECTS_CARTRIDGE = "projects",
  SKILLS_CARTRIDGE = "skills",
  CONTACT_CARTRIDGE = "contact",
  CV_CARTRIDGE = "cv",
}


// --- Configuration & Themes ---
// This object holds the configuration for every "OS" style
const CARTRIDGE_THEMES = {
  [CartridgeSelection.ABOUT_CARTRIDGE]: {
    name: "KIMON.OS v1.0",
    bgImage: "/assets/computer.png", // The monitor frame
    primaryColor: "text-green-500",
    borderColor: "border-black-500",
    shadowColor: "shadow-[0_0_20px_rgba(0,255,0,0.6)_inset]",
    loadingText: "> BOOT SEQUENCE INITIATED...",
    bootColor: "bg-green-500",
    terminal: "green",
  },
  [CartridgeSelection.PROJECTS_CARTRIDGE]: {
    name: "NET.ARCHITECT",
    bgImage: "/assets/computer.png", // Or a different "High Tech" screen
    primaryColor: "text-cyan-400",
    borderColor: "border-cyan-400",
    shadowColor: "shadow-[0_0_20px_rgba(34,211,238,0.4)_inset]",
    loadingText: "> DOWNLOADING SCHEMATICS...",
    bootColor: "bg-cyan-400",
    terminal: "blue",
  },
  [CartridgeSelection.SKILLS_CARTRIDGE]: {
    name: "PIP-OS V7.1",
    bgImage: "/assets/computer.png", // You can swap this for a Pip-Boy frame image!
    primaryColor: "text-amber-500", // Classic Fallout Amber
    borderColor: "border-amber-500",
    shadowColor: "shadow-[0_0_15px_rgba(245,158,11,0.5)_inset]",
    loadingText: "Initializing Vault-Tec Link...",
    bootColor: "bg-amber-500",
    terminal: "orange",
  },
  [CartridgeSelection.CONTACT_CARTRIDGE]: {
    name: "UPLINK_TERMINAL",
    bgImage: "/assets/computer.png",
    primaryColor: "text-rose-500",
    borderColor: "border-rose-500",
    shadowColor: "shadow-[0_0_20px_rgba(244,63,94,0.5)_inset]",
    loadingText: "> ESTABLISHING SECURE CONNECTION...",
    bootColor: "bg-rose-500",
    terminal: "rose",
  },
  [CartridgeSelection.CV_CARTRIDGE]: {
    name: "DOC.VIEWER",
    bgImage: "/assets/computer.png",
    primaryColor: "text-white",
    borderColor: "border-white",
    shadowColor: "shadow-[0_0_10px_rgba(255,255,255,0.3)_inset]",
    loadingText: "> PARSING DOCUMENT...",
    bootColor: "bg-gray-200",
    terminal: "white",
  },
};


// The "Fallout Pip-Boy" Style Component
const SkillsView = () => {
  
};


const CvView = () => {
  
};

const ContactView = () => {
  
};

// --- Main Page Component ---

export default function TerminalPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCartridge, setSelectedCartridge] =
    useState<CartridgeSelection>(CartridgeSelection.ABOUT_CARTRIDGE);

  // Get current theme based on selection
  const currentTheme = CARTRIDGE_THEMES[selectedCartridge];

  // Handle Loading Simulation on Cartridge Switch
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s load time
    return () => clearTimeout(timer);
  }, [selectedCartridge]);

  // Content Renderer
  const renderContent = () => {
    switch (selectedCartridge) {
      case CartridgeSelection.ABOUT_CARTRIDGE:
        return <AboutView />;
      case CartridgeSelection.SKILLS_CARTRIDGE:
        return <SkillsView />;
      case CartridgeSelection.PROJECTS_CARTRIDGE:
        return <ProjectsView />;
      case CartridgeSelection.CV_CARTRIDGE:
        return <CvView />;
      case CartridgeSelection.CONTACT_CARTRIDGE:
        return <ContactView />;
      default:
        return (
          <div
            className={`flex items-center justify-center h-full ${currentTheme.primaryColor}`}
          >
            <p className="animate-pulse">{">"} MODULE UNDER CONSTRUCTION</p>
          </div>
        );
    }
  };

  return (
    <main className="relative w-full h-[100dvh] bg-black overflow-hidden">
      {/* Dynamic Background Image */}
      <div
        className="w-full h-full relative transition-all duration-500 ease-in-out"
        style={{
          backgroundImage: `url(${currentTheme.bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
      >
        {/* Navigation Elements - Pass currentTheme if you want them to color-shift too */}
        <nav className="absolute top-4 left-4 z-50 sm:scale-80">
          <BackButton />
        </nav>
        <nav className="absolute top-4 right-4 z-50 sm:scale-80">
          <Menu />
        </nav>
        <nav className="absolute top-[30%] left-[17%] z-50 sm:scale-75">
          <TerminalMenu
            selectedCartridge={selectedCartridge}
            onSelectCartridge={setSelectedCartridge}
          />
        </nav>

        {/* LOADING SCREEN */}
        {loading ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div
              className={`min-w-[250px] bg-black/95 border ${currentTheme.borderColor} ${currentTheme.shadowColor} ${currentTheme.primaryColor} px-6 py-5 font-mono uppercase tracking-[0.08em]`}
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
          /* ACTUAL CONTENT SCREEN */
          <div className="absolute inset-0 overflow-hidden">
            {/* The Screen Position Container - adjust these % if you change the background image heavily */}
            <div className="absolute top-[25%] left-[12%] right-[12%] bottom-[20%] flex flex-col items-center justify-center p-4">
              <div
                className={`w-full max-w-[800px] sm:max-w-[600px] h-full p-6 font-mono terminal-scroll-${currentTheme.terminal} overflow-y-auto  bg-black/40 backdrop-blur-sm ${currentTheme.borderColor} ${currentTheme.primaryColor}`}
                style={{
                  imageRendering: "pixelated",
                  textShadow: `0 0 4px currentColor`, // Glow effect inherits text color
                  boxShadow: `inset 0 0 20px ${selectedCartridge === "skills" ? "#f59e0b" : "#000"
                    }`, // Inner glow
                }}
              >
                {renderContent()}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optional: CRT Scanline Overlay Global */}
      {/* <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[60] background-size-[100%_2px,3px_100%]" /> */}
    </main>
  );
}
