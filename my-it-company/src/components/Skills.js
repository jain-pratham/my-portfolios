"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["Frontend", "Backend", "Database", "AI/ML", "Tools"];

const skillsData = [
  { name: "React.js", cat: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Next.js", cat: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-line.svg" },
  { name: "Tailwind CSS", cat: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name: "JavaScript", cat: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "HTML5", cat: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", cat: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "Node.js", cat: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Express.js", cat: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name: "REST API", cat: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  { name: "Socket.io", cat: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
  { name: "MongoDB", cat: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "Redis", cat: "Database", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  { name: "Python", cat: "AI/ML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "Machine Learning", cat: "AI/ML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
  { name: "Deep Learning", cat: "AI/ML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  { name: "OpenCV", cat: "AI/ML", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg" },
  { name: "Git", cat: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub", cat: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Postman", cat: "Tools", icon: "https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" },
];

export default function Skills() {
  const [activeTab, setActiveTab] = useState("Frontend");
  const filteredSkills = skillsData.filter((skill) => skill.cat === activeTab);

  return (
    <section id="stack" className="section-shell relative overflow-hidden py-28">
      <div className="relative z-10 mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl"
          >
            Technical Skills
          </motion.h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 md:text-[1.65rem] md:leading-[1.8] md:text-[clamp(1rem,1.5vw,1.15rem)]">
            My expertise across various technologies and tools
          </p>
        </div>

        <div className="mb-12 flex justify-center">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/8 bg-white/[0.05] p-1.5 backdrop-blur-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all md:px-5 ${
                  activeTab === cat
                    ? "border border-white/12 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          layout
          className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[1.35rem] border border-white/[0.06] bg-[linear-gradient(135deg,rgba(27,23,42,0.96),rgba(17,15,31,0.94))] px-6 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.04)] md:px-9"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]" />
          <div className="pointer-events-none absolute -left-16 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-lime-300/6 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 top-8 h-36 w-36 rounded-full bg-cyan-300/6 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <div className="relative flex flex-wrap justify-center gap-4 md:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => (
                <motion.div
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.22 }}
                  className="flex min-w-[150px] items-center justify-center gap-3 rounded-[0.95rem] border border-white/6 bg-[#0c0b16] px-5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                >
                  <img src={skill.icon} alt={skill.name} className="h-7 w-7 object-contain" />
                  <span className="text-[0.95rem] font-semibold text-white">{skill.name}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/5 blur-[150px]" />
    </section>
  );
}
