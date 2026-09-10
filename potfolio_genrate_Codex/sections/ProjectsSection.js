"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/siteData";

export default function ProjectsSection() {
  return (
    <AnimatedSection id="projects" className="section-pad">
      <div className="shell">
        <SectionHeading eyebrow="Portfolio" title="Selected Product Builds" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <motion.article
              key={project.title}
              whileHover={{ y: -7 }}
              transition={{ duration: 0.25 }}
              className="panel edge-line panel-hover overflow-hidden rounded-2xl"
            >
              <div className="spot-grid p-2">
                <img src={project.image} alt={project.title} className="h-44 w-full rounded-xl object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-muted mt-2 text-sm">{project.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="chip rounded-md px-2 py-1 text-xs text-[color:var(--accent)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-4 text-sm">
                  <a href={project.live} className="font-medium text-[color:var(--accent)] hover:underline">
                    Live Demo
                  </a>
                  <a href={project.code} className="font-medium text-[color:var(--accent)] hover:underline">
                    Code
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
