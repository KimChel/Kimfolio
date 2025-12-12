"use client";

import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect";
import Menu from "../components/Menu";
import BackButton from "../components/BackButton";
import { label } from "framer-motion/client";
import TerminalMenu from "../components/TerminalMenu";

export enum CartridgeSelection {
  ABOUT_CARTRIDGE = "about",
  PROJECTS_CARTRIDGE = "projects"
}
export default function AboutPage() {
  const [loading, setLoading] = useState(true);

  const menuItems = [
    { label: "ABOUT", selected: false },
    { label: "PROJECTS", selected: false },
    { label: "SKILLS", selected: false },
    { label: "CONTACT", selected: false },
  ]

  const contentString = `
[+] init kimon.bio
&gt; Greetings. I am Kimon, a Full Stack Software Engineer currently bridging my professional life between freelance web development and mandated military service. My core objective is to leverage my extensive web development experience toward the realm of game development.

[+] career.timeline
&gt; Hellenic Navy / Mandatory Service (Current)
* Role: Full-Stack Software Engineer
* Note: Applying modern software development practices (React, Node.js) to critical internal systems. Focus on efficiency and security in high-stakes environments.

&gt; Freelance Web Developer (3+ Years)
* Core Stack: Full-Stack JavaScript (React/Next.js, Node/Express).
* Projects: Delivered responsive, high-performance solutions for multiple clients, focusing on robust APIs and clean user interfaces.

[+] target.transition
&gt; My portfolio, built with Pixi.js and Matter.js, serves as a direct demonstration of my capacity to handle graphics pipelines, physics engines, and complex event handling—all foundational skills for game development. Currently experimenting with Unity/C# in personal projects.

kimon@dev-os:~$ `;

  const asciiBanner = `
.--------------------------------------------.
| _____  _                   ____            |
||  |  ||_| _____  ___  ___ |    \\  ___ _ _  |
||    -|| ||     || . ||   ||  |  || -_|| || | 
||__|__||_||_|_|_||___||_|_||____/ |___|\\_/  |
'--------------------------------------------'

// FULL STACK ENGINEER [ FREELANCE + NAVY ] / GAME DEV ASPIRANT
`;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full h-[100dvh] bg-black overflow-hiddenr">
      <div
        className="w-full h-full relative"
        style={{
          backgroundImage: `url(/assets/computer.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          imageRendering: "pixelated",
        }}
      >
        <nav className="absolute top-4 left-4 z-50">
          <BackButton />
        </nav>
        <nav className="absolute top-4 right-4 z-50">
          <Menu />
        </nav>
        <nav className="absolute top-[40%] left-[15%] z-50">
          <TerminalMenu selectedCartridge={CartridgeSelection.ABOUT_CARTRIDGE} />
        </nav>
        {loading ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="min-w-[220px] bg-black/90 border border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.6)_inset,0_0_8px_rgba(0,255,0,0.6)] text-green-500 px-6 py-5 font-mono uppercase tracking-[0.08em]">
              <div className="flex items-center gap-2 mb-3">
                <span>{">"} boot sequence</span>
                <span className="animate-blink">_</span>
              </div>
              <div className="relative w-40 h-2 border border-green-500 bg-[#0a1a56] overflow-hidden">
                <div className="absolute inset-0 w-1/2 bgfrom-transparent via-green-500 to-transparent animate-ping" />
              </div>
              <div className="mt-2 text-xs text-[#7dff7d]">
                initializing modules
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[25%] left-[12%] right-[12%] bottom-[20%] flex flex-col items-center justify-center p-4 ">

              <div
                className="w-full max-w-[800px] h-full p-6 text-green-500 font-mono terminal-scroll overflow-y-auto "
                style={{
                  imageRendering: "pixelated",
                  textShadow: "0 0 1px #00ff00, 0 0 4px #00ff00",
                }}
              >
                {/* ASCII Magic Banner (Always visible after loading) */}
                <pre className="text-xs sm:text-sm lg:text-lg mb-8 whitespace-pre-wrap leading-tight text-white">
                  {asciiBanner}
                </pre>

                {/* Typewriter Effect wraps all the content */}
                {!loading && (
                  <div className="text-lg leading-relaxed whitespace-pre-wrap">
                    <Typewriter
                      onInit={(typewriter) => {
                        typewriter.typeString(contentString).start();
                      }}
                      options={{
                        delay: 15, // Fast typing speed, slightly slower than 10 for readability
                        cursorClassName: "text-lg text-green-500 animate-blink",
                        // Remove the default loop/pause if you only want it to run once
                        loop: false,
                      }}
                    />

                    {/* The final blinking cursor element is now part of the typewriter string itself */}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
