"use client";

export default function ProjectsView() {
  return (
    <div className="grid grid-cols-1 gap-4 text-cyan-400 font-mono">
      <div className="border border-cyan-400 p-4 relative overflow-hidden bg-cyan-900/10 hover:bg-cyan-900/20 transition-colors cursor-pointer">
        <div className="absolute top-0 right-0 p-1 text-[10px] border-l border-b border-cyan-400">
          DIR_01
        </div>
        <h3 className="text-xl font-bold mb-2">{">"} E-COMMERCE_ENGINE</h3>
        <p className="text-sm opacity-80">
          Full scale headless architecture using Shopify API and Next.js 14.
        </p>
      </div>

      <div className="border border-cyan-400 p-4 relative overflow-hidden bg-cyan-900/10 hover:bg-cyan-900/20 transition-colors cursor-pointer">
        <div className="absolute top-0 right-0 p-1 text-[10px] border-l border-b border-cyan-400">
          DIR_02
        </div>
        <h3 className="text-xl font-bold mb-2">{">"} PHYSICS_SANDBOX</h3>
        <p className="text-sm opacity-80">
          Interactive 2D matter.js engine implementation for portfolio showcase.
        </p>
      </div>
    </div>
  );
}
