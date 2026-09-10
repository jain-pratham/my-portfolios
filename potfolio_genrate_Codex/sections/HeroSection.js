"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiCpu, FiLayers, FiZap } from "react-icons/fi";
import PrimaryButton from "@/components/PrimaryButton";

export default function HeroSection() {
  return (
    <section id="home" className="shell grid min-h-screen items-center gap-10 pt-28 lg:grid-cols-[1.1fr_.9fr]">
      <div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="chip mb-5 inline-flex rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--accent)]"
        >
          Freelance Engineer Available
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl"
        >
          Pratham
          <span className="mt-2 block accent-text">Builds ML + Product Systems</span>
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="text-muted mt-5 text-lg sm:text-xl"
        >
          Machine Learning Developer and Full Stack Developer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted mt-6 max-w-2xl"
        >
          I design modern web products with intelligence at the core, combining practical ML pipelines, clean UX, and
          scalable backend architecture.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <PrimaryButton href="#projects">
            View Projects <FiArrowRight className="ml-2" />
          </PrimaryButton>
          <PrimaryButton href="#contact" variant="ghost">
            Start a Project
          </PrimaryButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="panel edge-line spot-grid rounded-3xl p-6 lg:p-8"
      >
        <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
          <div className="panel rounded-2xl p-4">
            <p className="text-muted">Projects Delivered</p>
            <p className="mt-1 text-2xl font-bold">30+</p>
          </div>
          <div className="panel rounded-2xl p-4">
            <p className="text-muted">Client Rating</p>
            <p className="mt-1 text-2xl font-bold">4.9/5</p>
          </div>
        </div>
        <div className="grid gap-3">
          {[
            { icon: FiCpu, text: "ML Models in Production" },
            { icon: FiLayers, text: "Full-Stack SaaS Systems" },
            { icon: FiZap, text: "Fast Delivery + Clean Code" }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="panel panel-hover flex items-center gap-3 rounded-xl px-4 py-3">
                <span className="rounded-lg bg-[color:var(--ring)] p-2 text-[color:var(--accent)]">
                  <Icon />
                </span>
                <p className="text-sm font-medium">{item.text}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

