"use client";

export default function SkillsView() {
  const skillGroups = [
    {
      title: "CORE SYSTEMS",
      items: [
        { name: "React / Next.js", level: 92, detail: "RSC, SSR, routing" },
        { name: "TypeScript", level: 90, detail: "typed UI + services" },
        { name: "Node.js", level: 86, detail: "APIs, workers, tooling" },
      ],
    },
    {
      title: "DATA + API",
      items: [
        { name: "PostgreSQL", level: 82, detail: "schema, indexing" },
        { name: "Apollo / GraphQL", level: 78, detail: "schemas, caching" },
        { name: "Java / Spring", level: 72, detail: "REST, auth" },
      ],
    },
    {
      title: "UI STACK",
      items: [
        { name: "Angular", level: 70, detail: "forms, Rx, tooling" },
      ],
    },
    {
      title: "EXPERIMENTAL",
      items: [
        { name: "Three.js (occasional)", level: 58, detail: "3D, shaders" },
        { name: "Python", level: 68, detail: "automation, data" },
      ],
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col font-mono text-amber-500 p-2 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(245,158,11,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.08),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-15 bg-[linear-gradient(transparent_96%,rgba(245,158,11,0.25)_98%)] bg-[length:100%_6px]" />
      {/* Pip-Boy Header */}
      <div className="border-b-2 border-amber-500 mb-4 flex justify-between items-end pb-2 relative z-10">
        <span className="text-xl font-bold bg-amber-500 text-black px-2 tracking-widest">
          STATS
        </span>
        <span className="text-xs uppercase">
          Vault 111 // Lvl 24 // Max_cap
        </span>
      </div>

      {/* Skill Bars */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 relative z-10">
        {skillGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-400/80">
              {group.title}
            </div>
            {group.items.map((skill) => (
              <div key={skill.name} className="group">
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill.name.toUpperCase()}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className="w-full h-4 border border-amber-500 p-[2px] relative">
                  {/* The fill bar */}
                  <div
                    className="h-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-1000 ease-out skills-flicker"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-amber-400/70 mt-1">
                  {skill.detail}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pip-Boy Footer */}
      <div className="mt-4 border-t border-amber-500/50 pt-2 flex justify-between text-[10px] uppercase relative z-10">
        <span>HP: 100/100</span>
        <span>RADS: 0.0</span>
        <span>AP: 85/90</span>
      </div>

      <style jsx>{`
        @keyframes pipFlicker {
          0% {
            opacity: 0.7;
            filter: brightness(0.85);
          }
          12% {
            opacity: 1;
            filter: brightness(1.1);
          }
          20% {
            opacity: 0.85;
            filter: brightness(0.95);
          }
          35% {
            opacity: 1;
            filter: brightness(1.2);
          }
          55% {
            opacity: 0.9;
            filter: brightness(1);
          }
          70% {
            opacity: 1;
            filter: brightness(1.15);
          }
          100% {
            opacity: 1;
            filter: brightness(1);
          }
        }

        .skills-flicker {
          animation: pipFlicker 900ms ease-out 1;
        }
      `}</style>
    </div>
  );
}
