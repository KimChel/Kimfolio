"use client"

import Image from "next/image";

export default function CvView(){
    const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "assets/docs/kimon_cv.pdf";
    link.download = "Kimon_Cheliotis_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-auto md:h-full flex flex-col font-mono text-white p-2 md:overflow-hidden">
      {/* --- HEADER: Toolbar style --- */}
      <div className="border-b-2 border-white mb-4 flex justify-between items-end pb-2">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold bg-white text-black px-2">
            DOC.VIEWER
          </span>
          <span className="text-xs opacity-70">FILE: KIMON_CV_FINAL.PDF</span>
        </div>
        <div className="text-xs hidden sm:block">READ_ONLY_MODE</div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-6 md:overflow-hidden">
        {/* --- LEFT COLUMN: ID & Metadata --- */}
        <div className="w-full md:w-1/3 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-white/30 pb-4 md:pb-0 pr-0 md:pr-4 md:overflow-y-auto md:terminal-scroll-gray">
          {/* Pixelated Photo Container */}
          <div className="relative w-full aspect-[3/4] border-2 border-white p-1">
            <div className="w-full h-full relative bg-gray-900">
              {/* Replace src with your actual path */}
              <Image
                src="/assets/me_pixel/me_lg.png"
                alt="Profile"
                fill
                className="object-cover"
                style={{ imageRendering: "pixelated" }}
              />

              {/* Scanline overlay for the photo */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 background-size-[100%_2px,3px_100%] pointer-events-none" />
            </div>
          </div>

          {/* Metadata Section */}
          <button
            onClick={handleDownload}
            className="mt-auto border border-white hover:bg-white hover:text-black transition-colors py-2 text-xs uppercase text-center w-full"
          >
            [ DOWNLOAD_PDF ]
          </button>
          <div className="text-xs space-y-3 opacity-90">
            <div>
              <p className="opacity-50 mb-1">AUTHOR</p>
              <p>Kimon-Konstantinos Cheliotis</p>
            </div>
            <div>
              <p className="opacity-50 mb-1">STATUS</p>
              <p>Active Service / Freelance</p>
            </div>
            <div>
              <p className="opacity-50 mb-1">CONTACT</p>
              <p className="break-all">kimonheliotis@gmail.com</p>
            </div>
            <div>
              <p className="opacity-50 mb-1">LOCATION</p>
              <p>Athens, Greece</p>
            </div>
          </div>

          {/* Download Button (Mobile/Sidebar version) */}
        </div>

        {/* --- RIGHT COLUMN: Document Content Preview --- */}
        <div className="flex-1 md:overflow-y-auto md:pr-2 md:terminal-scroll-gray space-y-6 text-sm">
          {/* Section: Experience */}
          <section>
            <h3 className="border-b border-white/50 mb-2 pb-1 text-xs opacity-70 uppercase">
              01 // Experience_Log
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">HELLENIC NAVY</span>
                  <span className="text-xs opacity-60">2023 - Present</span>
                </div>
                <div className="text-xs opacity-80 italic mb-1">
                  Software Engineer
                </div>
                <p className="opacity-90 leading-relaxed text-xs">
                  Developing Java Spring Boot microservices for operational
                  information platforms. Designing RESTful APIs to improve data
                  flow and system interoperability.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">NIKI DIGITAL ENGINEERING</span>
                  <span className="text-xs opacity-60">2022 - 2025</span>
                </div>
                <div className="text-xs opacity-80 italic mb-1">
                  Full-Stack Developer
                </div>
                <p className="opacity-90 leading-relaxed text-xs">
                  Delivered high-performance solutions for automotive clients
                  (BMW, Mercedes, Volvo). Managed full-stack lifecycles using
                  React, Java Spring Boot, and Apollo GraphQL.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Education */}
          <section>
            <h3 className="border-b border-white/50 mb-2 pb-1 text-xs opacity-70 uppercase">
              02 // Education_Database
            </h3>
            <div className="space-y-3">
              <div>
                <div className="font-bold">M.Sc. Security, Big Data</div>
                <div className="font-bold">& Simulations</div>
                <div className="text-xs opacity-80">
                  University of Thessaly | Grade: 9.73/10
                </div>
              </div>
              <div>
                <div className="font-bold">B.Sc. Computer Science</div>
                <div className="font-bold">& Telecommunications</div>
                <div className="text-xs opacity-80">University of Thessaly | Grade: 6.9/10</div>
              </div>
            </div>
          </section>

          {/* Section: Stack */}
          <section>
            <h3 className="border-b border-white/50 mb-2 pb-1 text-xs opacity-70 uppercase">
              03 // Tech_Stack
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full"></span> React /
                Next.js
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full"></span> Java
                Spring Boot
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full"></span>{" "}
                TypeScript
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full"></span> GraphQL
                / Apollo
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full"></span>{" "}
                PostgreSQL
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-white rounded-full"></span> MongoDB
              </div>
            </div>
          </section>

          {/* Footer decoration */}
          <div className="pt-8 opacity-50 text-[10px] text-center">
            -- END OF DOCUMENT STREAM --
          </div>
        </div>
      </div>
    </div>
  );
}