"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaInfoCircle, FaChevronLeft } from "react-icons/fa";

export const ControlsHUD = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="fixed left-0 top-[25%] z-[55] flex items-start font-mono">
      {/* The Sliding Panel */}
      <motion.div
        animate={{
          width: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        className="bg-black/40 backdrop-blur-md border-y-2 border-r-2 border-white/20 overflow-hidden"
      >
        <div className="w-64 p-4 text-white text-xs space-y-4">
          <div>
            <h3 className="font-bold text-cyan-400 mb-1 border-b border-cyan-400/30 pb-1">
              CONTROLS
            </h3>
            <ul className="space-y-2 opacity-80">
              <li className="flex justify-between">
                <span>Move Mouse</span>{" "}
                <span className="text-gray-400">[PAN]</span>
              </li>
              <li className="flex justify-between">
                <span>Left Click + Drag</span>{" "}
                <span className="text-gray-400">[GRAB]</span>
              </li>
              <li className="flex justify-between">
                <span>Release</span>{" "}
                <span className="text-gray-400">[THROW]</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-cyan-400 mb-1 border-b border-cyan-400/30 pb-1">
              OBJECTIVE
            </h3>
            <p className="opacity-80 leading-relaxed">
              Explore the scene. Interact with the physics engine. Complete
              quests in the log to unlock secrets.
            </p>
          </div>
        </div>
      </motion.div>

      {/* The Toggle Tab */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-cyan-600 text-white h-12 w-6 flex items-center justify-center border-y-2 border-r-2 border-white/20 hover:bg-cyan-500 transition-colors rounded-r-md"
      >
        {isExpanded ? <FaChevronLeft size={10} /> : <FaInfoCircle size={14} />}
      </button>
    </div>
  );
};
