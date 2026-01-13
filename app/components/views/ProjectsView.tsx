"use client";

import React, { useState } from "react";
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiExternalLink, 
  FiGithub 
} from "react-icons/fi";
import { 
  SiNextdotjs, 
  // SiPixijs, 
  SiTailwindcss, 
  SiTypescript, 
  SiReact, 
  SiFramer 
} from "react-icons/si";

interface Project {
  id: string;
  title: string;
  tag: string;
  description: string;
  details: string;
  stack: { name: string; icon: React.ReactNode }[];
  links?: { github?: string; live?: string };
}

export default function ProjectsView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const projects: Project[] = [
    {
      id: "01",
      tag: "CORE_SYSTEM",
      title: "PIXEL_CITY_PORTFOLIO",
      description: "A hybrid 2D/3D portfolio experience bridging web development and game design.",
      details: "An experimental space where React state meets physics-based environments. Integrating Pixi.js for high-performance rendering and Matter.js for rigid-body physics interactions within a Next.js 15 architecture.",
      stack: [
        { name: "Next.js", icon: <SiNextdotjs /> },
        // { name: "Pixi.js", icon: <SiPixijs /> },
        { name: "Tailwind", icon: <SiTailwindcss /> },
        { name: "TypeScript", icon: <SiTypescript /> },
      ],
    },
    {
      id: "02",
      tag: "COMMERCIAL_UI",
      title: "RETREAT_RENTALS_WEB",
      description: "Frontend architecture for a luxury countryside rental apartment.",
      details: "Developed a responsive, high-end user interface focusing on conversion and atmospheric storytelling. Implemented custom booking flow components and optimized image delivery for rural landscape photography.",
      stack: [
        { name: "React", icon: <SiReact /> },
        { name: "Framer Motion", icon: <SiFramer /> },
        { name: "Tailwind", icon: <SiTailwindcss /> },
      ],
      links: {
        live: "google.com", // Replace with your link
        github: "google.com", // Replace with your link
      }
    },
  ];

  const toggleProject = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col gap-6 text-cyan-400 font-mono">
      {projects.map((project) => {
        const isExpanded = expandedId === project.id;

        return (
          <div
            key={project.id}
            className={`border border-cyan-400 bg-cyan-900/10 transition-all duration-300 overflow-hidden ${
              isExpanded ? "bg-cyan-900/20 shadow-[0_0_15px_rgba(34,211,238,0.2)]" : "hover:bg-cyan-900/15"
            }`}
          >
            {/* Header / Summary */}
            <div 
              className="p-4 cursor-pointer flex justify-between items-start"
              onClick={() => toggleProject(project.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] bg-cyan-400 text-black px-1 font-bold">
                    {project.tag}
                  </span>
                  <span className="text-[10px] opacity-60">ID_{project.id}</span>
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tighter">
                  {">"} {project.title}
                </h3>
                {!isExpanded && (
                  <p className="text-sm opacity-70 mt-2 line-clamp-1 italic">
                    {project.description}
                  </p>
                )}
              </div>
              
              <div className="text-2xl mt-4">
                {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </div>

            {/* Expandable Content */}
            <div 
              className={`transition-all duration-500 ease-in-out px-4 ${
                isExpanded ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-cyan-400/30 pt-4 space-y-4">
                <p className="text-sm leading-relaxed text-cyan-100/80">
                  {project.details}
                </p>

                {/* Tech Stack Icons */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {project.stack.map((tech) => (
                    <div key={tech.name} className="flex items-center gap-2 text-xs bg-cyan-400/10 border border-cyan-400/40 px-2 py-1">
                      {tech.icon}
                      <span className="uppercase">{tech.name}</span>
                    </div>
                  ))}
                </div>

                {/* Links */}
                {(project.links?.github || project.links?.live) && (
                  <div className="flex gap-4 pt-2">
                    {project.links.live && (
                      <a href={project.links.live} target="_blank" className="flex items-center gap-1 text-xs hover:underline decoration-double">
                        <FiExternalLink /> VIEW_LIVE_DEPLOYMENT
                      </a>
                    )}
                    {project.links.github && (
                      <a href={project.links.github} target="_blank" className="flex items-center gap-1 text-xs hover:underline decoration-double">
                        <FiGithub /> REPOSITORY_ROOT
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}