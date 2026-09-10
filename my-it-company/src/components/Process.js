"use client";
import { motion } from "framer-motion";
import { CheckCircle, Lightbulb, PenTool, Code2, Rocket } from "lucide-react";

const projectSteps = [
  {
    icon: Lightbulb,
    step: "01",
    title: "Discovery & Planning",
    desc: "I start by understanding your vision, requirements, and goals. We discuss features, target audience, and project scope to create a clear roadmap.",
    items: ["Requirements gathering", "Market research", "Competitor analysis", "Project timeline & budget"]
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design & Wireframing",
    desc: "Creating beautiful, user-centric designs with prototypes and wireframes. Every pixel is intentional, ensuring great UX.",
    items: ["UI/UX Design", "Wireframes", "Prototypes", "Design System"]
  },
  {
    icon: Code2,
    step: "03",
    title: "Development",
    desc: "Writing clean, scalable code using modern frameworks and best practices. Frontend, backend, and database all optimized.",
    items: ["Frontend Development", "Backend API", "Database Design", "Testing & QA"]
  },
  {
    icon: Rocket,
    step: "04",
    title: "Deployment & Launch",
    desc: "Getting your project live with proper hosting, security, and monitoring. Continuous support and updates.",
    items: ["Server Setup", "SSL/Security", "Performance Optimization", "Post-launch Support"]
  }
];

export default function ProjectProcess() {
  return (
    <section id="process" className="section-shell py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute right-[10%] top-[20%] h-64 w-64 rounded-full bg-lime-300/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h2 className="section-title text-4xl font-black text-white md:text-6xl mb-6">
            HOW I <span className="text-lime-300">BUILD</span> PROJECTS
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A systematic approach to deliver exceptional results, every single time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projectSteps.map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="relative"
              >
                {/* Connector line */}
                {idx < projectSteps.length - 1 && (
                  <div className="absolute -right-4 top-24 w-8 h-8 hidden lg:block">
                    <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
                      <path d="M16 0 L16 32" stroke="#84cc16" strokeWidth="2" strokeDasharray="4" />
                    </svg>
                  </div>
                )}

                <div className="p-8 rounded-2xl border border-lime-300/30 bg-gradient-to-br from-lime-300/10 via-transparent to-transparent hover:border-lime-300/60 transition">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-lime-300/20 text-lime-300">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-lime-300 mb-1">{phase.step}</p>
                      <h3 className="text-2xl font-bold text-white">{phase.title}</h3>
                    </div>
                  </div>

                  <p className="text-slate-300 mb-6 leading-6">{phase.desc}</p>

                  <ul className="space-y-3">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-400">
                        <CheckCircle className="w-5 h-5 text-lime-300 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
