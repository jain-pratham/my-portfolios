"use client";
import { motion } from "framer-motion";

export default function Experience() {
  const stats = [
    { label: "Projects Built", val: "4+", color: "border-orange-400" },
    { label: "Internship", val: "1", color: "border-cyan-400" },
    { label: "Core Stack", val: "10+", color: "border-lime-300" },
  ];

  return (
    <section id="experience" className="section-shell py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel flex flex-col items-center justify-center rounded-[2.5rem] p-10 text-center"
            >
              <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 ${item.color} bg-white/[0.03] shadow-[0_0_30px_rgba(0,0,0,0.35)]`}>
                <span className="text-3xl font-black text-white">{item.val}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="glass-panel relative overflow-hidden rounded-[2.5rem] p-12 md:p-16"
        >
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-orange-400 via-lime-300 to-cyan-400" />

          <div className="max-w-4xl">
            <h2 className="text-2xl font-medium leading-[1.3] tracking-tight text-white md:text-4xl">
              Pratham Jain is a <span className="italic text-slate-400">full stack developer</span> building scalable applications with React.js, Next.js, Node.js, MongoDB, and AI/ML integration.
            </h2>

            <p className="mt-8 max-w-2xl text-lg font-light text-slate-400">
              Worked as a Full Stack Developer Intern at Tankar Solutions Pvt Ltd in Ahmedabad, building full-stack apps, REST APIs, authentication flows, database operations, and responsive user interfaces.
            </p>
          </div>

          <div className="absolute bottom-8 right-12 opacity-10">
            <div className="flex h-24 w-24 rotate-12 items-center justify-center rounded-full border border-white">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Pratham • Portfolio</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
