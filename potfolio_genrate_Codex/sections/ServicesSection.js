"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { services } from "@/data/siteData";

export default function ServicesSection() {
  return (
    <AnimatedSection id="services" className="section-pad">
      <div className="shell">
        <SectionHeading eyebrow="Services" title="High-impact freelance services" />
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="panel edge-line panel-hover rounded-2xl p-6"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">
                0{index + 1}
              </p>
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="text-muted mt-3">{service.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
