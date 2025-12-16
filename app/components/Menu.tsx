import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  // Define the menu links for easy scaling
  const menuItems = [
    { label: "ABOUT", href: "/terminal/about", color: "bg-green-500" },
    { label: "PROJECTS", href: "/terminal/projects", color: "bg-blue-500" },
    { label: "SKILLS", href: "/terminal/skills", color: "bg-yellow-500" },
    { label: "CV", href: "/terminal/cv", color: "bg-purple-500" },
    { label: "CONTACT", href: "/terminal/contact", color: "bg-red-500" },
  ];

  return (
    <div className="relative font-mono">
      {openMenu ? (
        /* --- THE OPEN MENU BOX --- */
        <div
          className="absolute top-0 right-0 w-64 bg-[#2b2b2b] p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          style={{ imageRendering: "pixelated" }}
        >
          {/* HEADER AREA with 'X' */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-white text-xs tracking-widest bg-gray-700 px-2 py-1 border-2 border-black">
              NAV_SYS
            </span>
            <button
              onClick={() => setOpenMenu(false)}
              className="w-8 h-8 bg-red-600 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center font-bold"
            >
              X
            </button>
          </div>

          {/* LIST ITEMS */}
          <ul className="flex flex-col space-y-3">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpenMenu(false)}
                  className="group flex items-center w-full bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all"
                >
                  {/* Icon Placeholder */}
                  <div
                    className={`w-8 h-8 ${item.color} border-2 border-black mr-3 flex-shrink-0`}
                  ></div>

                  <span className="text-black text-sm font-bold tracking-tighter uppercase group-hover:text-blue-600">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        /* --- THE HAMBURGER BUTTON (CLOSED STATE) --- */
        <button
          className="group w-14 h-14 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col items-center justify-center space-y-1 p-2"
          onClick={() => setOpenMenu(true)}
        >
          <div className="w-full h-1 bg-black"></div>
          <div className="w-full h-1 bg-black"></div>
          <div className="w-full h-1 bg-black"></div>
        </button>
      )}
    </div>
  );
}
