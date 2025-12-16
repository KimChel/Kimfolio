"use client";

export default function SkillsView() {
  const skills = [
    { name: "React / Next.js", level: 90 },
    { name: "Node.js", level: 85 },
    { name: "TypeScript", level: 88 },
    { name: "Three.js / WebGL", level: 65 },
    { name: "Java / Spring", level: 70 },
  ];

  return (
    <div className="w-full h-full flex flex-col font-mono text-amber-500 p-2">
      {/* Pip-Boy Header */}
      <div className="border-b-2 border-amber-500 mb-4 flex justify-between items-end pb-2">
        <span className="text-xl font-bold bg-amber-500 text-black px-2">
          STATS
        </span>
        <span className="text-xs">LVL 24 // MAX_CAP</span>
      </div>

      {/* Skill Bars */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {skills.map((skill) => (
          <div key={skill.name} className="group">
            <div className="flex justify-between text-sm mb-1">
              <span>{skill.name.toUpperCase()}</span>
              <span>{skill.level}%</span>
            </div>
            <div className="w-full h-4 border border-amber-500 p-[2px] relative">
              {/* The fill bar */}
              <div
                className="h-full bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-1000 ease-out"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pip-Boy Footer */}
      <div className="mt-4 border-t border-amber-500/50 pt-2 flex justify-between text-[10px] uppercase">
        <span>HP: 100/100</span>
        <span>RADS: 0</span>
        <span>AP: 85/90</span>
      </div>
    </div>
  );
}
