"use client";
import { motion } from "framer-motion";
import { Code2, Zap, Target } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="section-shell py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-[5%] top-[10%] h-56 w-56 rounded-full bg-lime-300/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="section-title text-4xl font-black text-white md:text-6xl mb-6">
            ABOUT <span className="text-lime-300">ME</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-lg leading-8 text-slate-300 mb-6">
              I'm <span className="text-lime-300 font-semibold">Pratham Jain</span>, a passionate Full Stack Developer with 3+ years of experience building high-performance, scalable web solutions. My journey in tech started with a curiosity about how things work, which evolved into a career crafting digital experiences.
            </p>
            
            <p className="text-lg leading-8 text-slate-300 mb-6">
              I specialize in creating modern web applications using React, Next.js, and Node.js. Whether it's frontend interactivity or backend architecture, I bring a blend of creativity and technical rigor to every project. I'm also passionate about AI/ML and have explored deep learning applications.
            </p>

            <p className="text-lg leading-8 text-slate-300">
              Currently available for <span className="text-lime-300 font-semibold">freelance projects</span> and exciting collaborations. Let's build something amazing together!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex gap-4 p-6 rounded-xl border border-lime-300/20 bg-lime-300/5 hover:bg-lime-300/10 transition">
              <Code2 className="w-8 h-8 text-lime-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Clean Code</h3>
                <p className="text-slate-400">Writing maintainable, scalable code that stands the test of time.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-cyan-300/20 bg-cyan-300/5 hover:bg-cyan-300/10 transition">
              <Zap className="w-8 h-8 text-cyan-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Fast Performance</h3>
                <p className="text-slate-400">Optimized solutions that load fast and perform flawlessly.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-xl border border-blue-300/20 bg-blue-300/5 hover:bg-blue-300/10 transition">
              <Target className="w-8 h-8 text-blue-300 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Goal-Driven</h3>
                <p className="text-slate-400">Every project is focused on delivering real business value.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
