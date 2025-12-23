"use client";

import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

// --- 1. THE WIP WARNING BANNER ---
export const WipBanner = () => {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[60] mt-2 w-full max-w-lg">
      <div className="bg-yellow-500/90 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] p-2 flex items-center gap-3 justify-center">
        <FaExclamationTriangle className="text-black animate-pulse" />
        <div className="flex flex-col text-center">
          <span className="text-[10px] font-bold text-black font-mono leading-tight tracking-widest uppercase">
            // SYSTEM_ALERT: WORK_IN_PROGRESS
          </span>
          <span className="text-[10px] text-black font-mono leading-tight">
            Game engine in beta.{" "}
            <Link
              href="/terminal/about"
              className="underline font-bold hover:text-white transition-colors"
            >
              CLICK HERE
            </Link>{" "}
            to skip to portfolio.
          </span>
        </div>
        <FaExclamationTriangle className="text-black animate-pulse" />
      </div>
    </div>
  );
};
