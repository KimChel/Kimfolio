// lib/terminal-config.ts

export enum TerminalPath {
  ABOUT = "/terminal/about",
  PROJECTS = "/terminal/projects",
  SKILLS = "/terminal/skills",
  CONTACT = "/terminal/contact",
  CV = "/terminal/cv",
}

export enum CartridgeSelection {
  ABOUT_CARTRIDGE = "about",
  PROJECTS_CARTRIDGE = "projects",
  SKILLS_CARTRIDGE = "skills",
  CONTACT_CARTRIDGE = "contact",
  CV_CARTRIDGE = "cv",
}


export const CARTRIDGE_THEMES = {
  [TerminalPath.ABOUT]: {
    name: "KIMON.OS v1.0",
    bgImage: "/assets/computer.png",
    primaryColor: "text-green-500",
    borderColor: "border-green-500", // Fixed typo from black-500
    shadowColor: "shadow-[0_0_20px_rgba(0,255,0,0.6)_inset]",
    loadingText: "> BOOT SEQUENCE INITIATED...",
    bootColor: "bg-green-500",
    terminal: "green",
  },
  [TerminalPath.PROJECTS]: {
    name: "NET.ARCHITECT",
    bgImage: "/assets/computer.png",
    primaryColor: "text-cyan-400",
    borderColor: "border-cyan-400",
    shadowColor: "shadow-[0_0_20px_rgba(34,211,238,0.4)_inset]",
    loadingText: "> DOWNLOADING SCHEMATICS...",
    bootColor: "bg-cyan-400",
    terminal: "blue",
  },
  [TerminalPath.SKILLS]: {
    name: "PIP-OS V7.1",
    bgImage: "/assets/computer.png",
    primaryColor: "text-amber-500",
    borderColor: "border-amber-500",
    shadowColor: "shadow-[0_0_15px_rgba(245,158,11,0.5)_inset]",
    loadingText: "Initializing Vault-Tec Link...",
    bootColor: "bg-amber-500",
    terminal: "orange",
  },
  [TerminalPath.CONTACT]: {
    name: "UPLINK_TERMINAL",
    bgImage: "/assets/computer.png",
    primaryColor: "text-rose-500",
    borderColor: "border-rose-500",
    shadowColor: "shadow-[0_0_20px_rgba(244,63,94,0.5)_inset]",
    loadingText: "> ESTABLISHING SECURE CONNECTION...",
    bootColor: "bg-rose-500",
    terminal: "rose",
  },
  [TerminalPath.CV]: {
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



// Fallback theme if route doesn't match
export const DEFAULT_THEME = CARTRIDGE_THEMES[TerminalPath.ABOUT];