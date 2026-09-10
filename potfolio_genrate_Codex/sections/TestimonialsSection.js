"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { testimonials } from "@/data/siteData";

export default function TestimonialsSection() {
  return (
    <AnimatedSection id="testimonials" className="section-pad">
      <div className="shell">
        <SectionHeading eyebrow="Testimonials" title="What clients say" />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <motion.blockquote
              key={item.name}
              whileHover={{ y: -6 }}
              className="panel edge-line panel-hover rounded-2xl p-6"
            >
              <p className="text-muted">&ldquo;{item.quote}&rdquo;</p>
              <footer className="mt-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-[color:var(--accent)]">{item.role}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
