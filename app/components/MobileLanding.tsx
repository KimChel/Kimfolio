"use client";

import Link from "next/link";

const sections = [
  {
    label: "ABOUT",
    href: "/terminal/about",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    bgColor: "bg-green-500/10 active:bg-green-500/20",
  },
  {
    label: "PROJECTS",
    href: "/terminal/projects",
    textColor: "text-cyan-400",
    borderColor: "border-cyan-400",
    bgColor: "bg-cyan-400/10 active:bg-cyan-400/20",
  },
  {
    label: "SKILLS",
    href: "/terminal/skills",
    textColor: "text-amber-500",
    borderColor: "border-amber-500",
    bgColor: "bg-amber-500/10 active:bg-amber-500/20",
  },
  {
    label: "CV",
    href: "/terminal/cv",
    textColor: "text-white",
    borderColor: "border-white",
    bgColor: "bg-white/10 active:bg-white/20",
  },
  {
    label: "CONTACT",
    href: "/terminal/contact",
    textColor: "text-rose-500",
    borderColor: "border-rose-500",
    bgColor: "bg-rose-500/10 active:bg-rose-500/20",
  },
];

export default function MobileLanding() {
  return (
    <div className="w-full h-full bg-black flex flex-col font-mono overflow-hidden select-none">
      {/* Header / Hero */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <pre className="text-green-500 text-[7px] sm:text-[9px] leading-[1.4] opacity-60 overflow-hidden">
          {`.--------------------------------------------.
| _____  _                   ____            |
||  |  ||_| _____  ___  ___ |    \\  ___ _ _  |
||    -|| ||     || . ||   ||  |  || -_|| || |
||__|__||_||_|_|_||___||_|_||____/ |___|\\_/  |
'--------------------------------------------'`}
        </pre>

        <div className="text-center space-y-1">
          <p className="text-white/40 text-[10px] tracking-[0.35em] uppercase">
            Full Stack Engineer
          </p>
          <p className="text-white/20 text-[9px] tracking-widest">
            Athens, Greece
          </p>
        </div>

        <p className="text-green-500/80 text-xs tracking-[0.3em] uppercase animate-blink">
          {">"} Select Module_
        </p>
      </div>

      {/* Navigation grid */}
      <div className="px-6 pb-10 grid grid-cols-2 gap-3">
        {sections.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className={[
              s.textColor,
              s.borderColor,
              s.bgColor,
              "border p-4 text-center uppercase text-xs tracking-[0.25em] transition-colors",
              i === 4 ? "col-span-2" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="text-white/15 text-[9px] text-center pb-4 tracking-[0.3em]">
        KIMON.DEV // v1.0.0
      </div>
    </div>
  );
}
