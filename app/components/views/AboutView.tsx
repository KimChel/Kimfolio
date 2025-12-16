"use client"

import Typewriter from "typewriter-effect";

export default function AboutView() {
  const contentString = `
[+] init kimon.bio
> Greetings. I am Kimon, a Full Stack Software Engineer currently bridging my professional life between freelance web development and mandated military service.

[+] career.timeline
> Hellenic Navy / Mandatory Service (Current)
* Role: Full-Stack Software Engineer

> NIKI Digital Engineering (2+ Years)
* Core Stack: Full-Stack JavaScript (React/Next.js, Java Spring Boot).

> Freelance Web Developer (3+ Years)
* Core Stack: Full-Stack JavaScript.
`;

  const asciiBanner = `
.--------------------------------------------.
| _____  _                   ____            |
||  |  ||_| _____  ___  ___ |    \\  ___ _ _  |
||    -|| ||     || . ||   ||  |  || -_|| || | 
||__|__||_||_|_|_||___||_|_||____/ |___|\\_/  |
'--------------------------------------------'
// FULL STACK ENGINEER
`;

  return (
    <div className="text-lg leading-relaxed whitespace-pre-wrap">
      <pre className="text-xs sm:text-sm lg:text-lg mb-8 whitespace-pre-wrap leading-tight opacity-80">
        {asciiBanner}
      </pre>
      <Typewriter
        onInit={(typewriter) => typewriter.typeString(contentString).start()}
        options={{
          delay: 10,
          cursorClassName: "text-green-500 animate-blink",
          loop: false,
        }}
      />
    </div>
  );
}
