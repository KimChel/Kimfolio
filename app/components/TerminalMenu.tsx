import { randomInt } from 'crypto';
import React, { useState } from 'react'
import { CartridgeSelection } from '../about/page';

const RetroCassette = ({
  color,
  text,
  rotation,
  selected,
}: {
  color: string;
  text: string;
  rotation: number;
  selected: boolean;
}) => {
  return (
    <div className="group relative w-full h-12 bg-gray-900 rounded-sm border-2 border-gray-700 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center p-1 cursor-pointer transition-transform hover:-translate-x-2">

      {selected ? (
        // 🔥 Render this if selected === true
        <div className="w-full h-full flex items-center justify-center text-white font-bold">
          SELECTED
        </div>
      ) : (
        // 🔥 Render this if selected === false
        <div className="relative w-full h-full">

          {/* The Colored Sticker Label */}
          <div className={`relative w-full h-full ${color} border-2 border-black flex items-center px-2 overflow-hidden`}>

            {/* Grip lines left */}
            <div
              className="absolute top-0 bottom-0 left-0 w-4 border-r-2 border-black/20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
              }}
            />

            {/* Grip lines right */}
            <div
              className="absolute top-0 bottom-0 right-0 w-4 border-l-2 border-black/20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
              }}
            />

            {/* Cassette Window */}
            <div
              className="hidden sm:flex absolute left-1/2 -translate-x-1/2 w-32 h-6 bg-white border-2 border-black items-center justify-center space-x-3 opacity-90 font-serif italic font-bold text-black text-sm"
              style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
            >
              {text}
            </div>
          </div>

          {/* Screw holes */}
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-500 rounded-full"></div>
          <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-500 rounded-full"></div>
          <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-gray-500 rounded-full"></div>
          <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-gray-500 rounded-full"></div>

        </div>
      )}

    </div>
  );
};
export default function TerminalMenu({ selectedCartridge }: { selectedCartridge: string }) {

    const menuItems = [
        { label: "INSERT ABOUT", href: "/about", color: "bg-green-500", casette: "Who am I???", selected: selectedCartridge === CartridgeSelection.ABOUT_CARTRIDGE },
        { label: "INSERT PROJECTS", href: "/projects", color: "bg-blue-500", casette: "Who am I???", selected: selectedCartridge === CartridgeSelection.PROJECTS_CARTRIDGE },
        { label: "INSERT SKILLS", href: "/skills", color: "bg-yellow-500", casette: "Who am I???", selected: selectedCartridge === CartridgeSelection.PROJECTS_CARTRIDGE },
        { label: "INSERT CV", href: "/cv", color: "bg-purple-500", casette: "Resume //BACKUP", selected: selectedCartridge === CartridgeSelection.ABOUT_CARTRIDGE },
        { label: "INSERT CONTACT", href: "/contact", color: "bg-red-500", casette: "Who am I???", selected: selectedCartridge === CartridgeSelection.PROJECTS_CARTRIDGE },
    ];


    return (
        <div
            className="absolute top-0 right-0 w-80 bg-amber-50 p-4 border-l-4 border-b-4 border-black shadow-[-4px_4px_0px_0px_rgba(0,0,0,1)]"
            style={{ imageRendering: "pixelated" }}
        >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2 border-dashed">
                <span className="text-black text-xs font-bold tracking-widest px-2 py-1 ">
                    // SELECT_CARTRIDGE
                </span>
                <div className="w-3 h-3 bg-red-500 animate-pulse rounded-full border border-black"></div>
            </div>

            {/* LIST ITEMS */}
            <ul className="flex flex-col space-y-4">
                {menuItems.map((item) => (
                    <li key={item.label} onClick={() => console.log(`Loading ${item.href}...`)}>
                        <span className="font-mono font-bold text-xs text-black/70 tracking-tighter uppercase">{item.label}</span>

                        <RetroCassette
                            color={item.color}
                            text={item.casette}
                            rotation={Math.floor(Math.random() * 9) - 4}
                            selected={item.selected}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}
