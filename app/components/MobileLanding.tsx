"use client";

import Link from "next/link";

const sections = [
  {
    label: "ABOUT",
    href: "/terminal/about",
    textColor: "text-green-400",
    borderColor: "border-green-500/70",
    bgColor: "bg-green-500/10 active:bg-green-500/25",
    glow: "0 0 14px rgba(74,222,128,0.35)",
  },
  {
    label: "PROJECTS",
    href: "/terminal/projects",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-400/70",
    bgColor: "bg-cyan-400/10 active:bg-cyan-400/25",
    glow: "0 0 14px rgba(34,211,238,0.35)",
  },
  {
    label: "SKILLS",
    href: "/terminal/skills",
    textColor: "text-amber-400",
    borderColor: "border-amber-400/70",
    bgColor: "bg-amber-400/10 active:bg-amber-400/25",
    glow: "0 0 14px rgba(251,191,36,0.35)",
  },
  {
    label: "CV",
    href: "/terminal/cv",
    textColor: "text-white/90",
    borderColor: "border-white/40",
    bgColor: "bg-white/5 active:bg-white/15",
    glow: "0 0 14px rgba(255,255,255,0.2)",
  },
  {
    label: "CONTACT",
    href: "/terminal/contact",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/70",
    bgColor: "bg-rose-500/10 active:bg-rose-500/25",
    glow: "0 0 14px rgba(244,63,94,0.35)",
  },
];

export default function MobileLanding() {
  return (
    <div className="crt w-full h-full bg-black flex flex-col font-mono overflow-hidden select-none relative">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-5">

        {/* Decorative top rule */}
        <div className="w-full flex items-center gap-2">
          <div className="flex-1 h-px bg-green-500/25" />
          <span className="text-green-500/40 text-[9px] tracking-[0.4em]">BOOT OK</span>
          <div className="flex-1 h-px bg-green-500/25" />
        </div>

        {/* ASCII art — larger with phosphor glow */}
        <pre
          className="text-green-400 text-[10px] sm:text-[12px] leading-[1.5] overflow-hidden"
          style={{ textShadow: "0 0 8px rgba(74,222,128,0.6), 0 0 20px rgba(74,222,128,0.25)" }}
        >
          {`.--------------------------------------------.
| _____  _                   ____            |
||  |  ||_| _____  ___  ___ |    \\  ___ _ _  |
||    -|| ||     || . ||   ||  |  || -_|| || |
||__|__||_||_|_|_||___||_|_||____/ |___|\\_/  |
'--------------------------------------------'`}
        </pre>

        {/* Subtitle */}
        <div className="text-center space-y-2">
          <p
            className="text-white/70 text-xs tracking-[0.45em] uppercase"
            style={{ textShadow: "0 0 12px rgba(255,255,255,0.2)" }}
          >
            Full Stack Engineer
          </p>
          <p className="text-green-500/45 text-[10px] tracking-[0.35em]">
            Athens, Greece
          </p>
        </div>

        {/* Prompt */}
        <p
          className="text-green-400 text-[11px] tracking-[0.3em] uppercase animate-blink"
          style={{ textShadow: "0 0 10px rgba(74,222,128,0.7)" }}
        >
          {">"} Select Module_
        </p>

        {/* Decorative bottom rule */}
        <div className="w-full h-px bg-green-500/25" />
      </div>

      {/* Navigation grid */}
      <div className="px-5 pb-10 grid grid-cols-2 gap-3">
        {sections.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className={[
              s.textColor,
              s.borderColor,
              s.bgColor,
              "border py-5 text-center uppercase text-[11px] tracking-[0.35em] transition-all duration-150",
              i === 4 ? "col-span-2" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ textShadow: s.glow }}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="text-green-500/25 text-[9px] text-center pb-5 tracking-[0.45em]">
        KIMON.DEV // v1.0.0
      </div>
    </div>
  );
}
