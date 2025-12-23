"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaTrophy, FaCheckSquare, FaSquare } from "react-icons/fa";

export const QuestLog = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Mock Data - In the future, pass these as props from Scene based on Engine events
  const achievements = [
    { id: 1, label: "Welcome to the Grid", done: true },
    { id: 2, label: "Throw a car", done: false },
    { id: 3, label: "Find the hidden cat", done: false },
  ];

  return (
    <div className="relative font-mono z-[60]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center"
      >
        <FaTrophy
          className={`text-xl ${isOpen ? "text-yellow-600" : "text-black"}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20 }}
            className="absolute top-16 left-0 w-64 bg-[#2b2b2b] border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ imageRendering: "pixelated" }}
          >
            <div className="text-white text-xs tracking-widest bg-purple-600 px-2 py-1 border-2 border-black mb-4 inline-block">
              QUEST_LOG
            </div>
            <ul className="space-y-3">
              {achievements.map((quest) => (
                <li
                  key={quest.id}
                  className="flex items-start gap-3 text-xs text-white/90"
                >
                  <div className="mt-[2px]">
                    {quest.done ? (
                      <FaCheckSquare className="text-green-400 text-sm" />
                    ) : (
                      <FaSquare className="text-gray-600 text-sm" />
                    )}
                  </div>
                  <span className={quest.done ? "line-through opacity-50" : ""}>
                    {quest.label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
