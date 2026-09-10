"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#f5f7fb]"
          >
            <div className="overflow-hidden">
              <motion.h1
                className="text-5xl font-black tracking-tighter text-slate-950 md:text-6xl"
              >
                {("PRATHAM JAIN").split("").map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut", delay: index * 0.12 }}
                    className={char === " " ? "inline-block w-3" : "inline-block"}
                    style={index > 7 ? { color: "#84cc16" } : {}}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section id="top" className="section-shell relative flex min-h-screen items-center justify-center overflow-hidden pt-28">
        <div className="absolute inset-0 z-0">
          <div className="absolute left-[10%] top-[18%] h-40 w-40 rounded-full border border-lime-300/20 bg-lime-300/10 blur-2xl" />
          <div className="absolute bottom-[16%] right-[10%] h-48 w-48 rounded-full border border-cyan-300/20 bg-cyan-300/10 blur-2xl" />
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="relative flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.08, scale: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none"
            >
              <h1 className="outline-text text-[18vw] font-black leading-none tracking-tighter text-white opacity-20">
                PRATHAM
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="mb-6 flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-300 backdrop-blur-xl"
            >
              <Sparkles size={14} className="text-lime-300" />
              Available for freelance projects
            </motion.div>

            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="mb-3 text-4xl font-black text-lime-300 drop-shadow-2xl md:text-6xl"
            >
              FREELANCE
            </motion.h2>

            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              className="mb-6 text-4xl font-black tracking-tight text-white md:text-6xl"
            >
              FULL STACK DEVELOPER
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.95 }}
              className="mt-2 max-w-3xl text-base leading-8 text-slate-300 md:text-lg"
            >
              I&apos;m <span className="border-b-2 border-lime-300 text-white">Pratham Jeetendra Jain</span>,
              a freelance developer building modern websites, scalable web applications,
              dashboards, and AI-powered solutions for clients who want clean design and reliable execution.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.15 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <a
                href="#contact"
                className="flex items-center gap-3 rounded-full bg-lime-300 px-8 py-4 text-sm font-black uppercase tracking-[0.22em] text-slate-950 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-[0_0_40px_rgba(158,255,107,0.22)]"
              >
                Hire Me <ArrowRight size={18} />
              </a>
              <a
                href="#work"
                className="rounded-full border border-white/12 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white backdrop-blur-xl transition-all hover:border-lime-300/50 hover:text-lime-200"
              >
                See Projects
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
              className="glass-panel mt-12 grid w-full max-w-3xl grid-cols-1 gap-4 rounded-[2rem] p-5 md:grid-cols-3 md:p-6"
            >
              {[
                ["4+", "Client and product projects"],
                ["Full Stack", "Frontend to backend delivery"],
                ["Fast", "Clear communication and quick iteration"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-4 text-center">
                  <div className="text-xl font-black text-white md:text-2xl">{value}</div>
                  <div className="mt-2 text-sm text-slate-400">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <div className="h-12 w-[1px] bg-gradient-to-b from-lime-300 to-transparent" />
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Scroll</span>
        </motion.div>
      </section>

      <style jsx global>{`
        .outline-text {
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.2);
          color: transparent;
        }
      `}</style>
    </>
  );
}
