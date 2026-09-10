"use client";
import { motion } from "framer-motion";
import { Globe2, ShieldCheck, Zap } from "lucide-react";

const dots = [
  { top: "14%", left: "18%" },
  { top: "28%", left: "82%" },
  { top: "56%", left: "12%" },
  { top: "72%", left: "76%" },
  { top: "88%", left: "42%" },
];

export default function GlobeSection() {
  return (
    <section className="section-shell relative overflow-hidden py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="section-title mb-8 text-4xl font-black leading-tight text-white md:text-6xl">
              EDUCATION <br /> <span className="text-cyan-300">& PROFILE</span>
            </h2>

            <div className="space-y-8">
              <div className="glass-panel flex gap-4 rounded-[1.75rem] p-6">
                <div className="h-fit rounded-xl bg-cyan-400/20 p-3">
                  <ShieldCheck className="text-cyan-300" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">MCA, Indus University</h4>
                  <p className="mt-2 text-slate-400">Ahmedabad based postgraduate student with Semester 1 SGPA of 9.5.</p>
                </div>
              </div>

              <div className="glass-panel flex gap-4 rounded-[1.75rem] p-6">
                <div className="h-fit rounded-xl bg-lime-300/20 p-3">
                  <Zap className="text-lime-300" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">BCA, Rofel College</h4>
                  <p className="mt-2 text-slate-400">Strong academic base supporting full stack development and practical project work.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute h-64 w-64 rounded-full border border-white/10 md:h-96 md:w-96"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute h-48 w-48 rounded-full border border-dashed border-white/15 md:h-80 md:w-80"
            />

            <div className="glass-panel relative z-10 rounded-full p-10 shadow-[0_0_70px_rgba(88,215,255,0.15)]">
              <Globe2 size={80} className="animate-pulse text-cyan-300" />
            </div>

            {dots.map((dot, i) => (
              <motion.div
                key={`${dot.top}-${dot.left}`}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 1, 0.2]
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i
                }}
                className="absolute h-2 w-2 rounded-full bg-cyan-300"
                style={{
                  top: dot.top,
                  left: dot.left
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
