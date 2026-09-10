"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code } from "lucide-react";
import { useState } from "react";

const projects = [
  {
    id: 1,
    title: "Inventory Management System",
    desc: "Hackathon-built full-stack inventory system with product, stock, and transaction tracking. Real-time updates, user authentication, and comprehensive analytics dashboard.",
    tags: ["Next.js", "Node.js", "MongoDB", "Redis"],
    image: "pro1.png",
    link: "https://github.com/jain-pratham/odoo-hackathon-inventory-system",
    type: "Full Stack",
    year: "2023",
    details: "Award-winning hackathon project featuring advanced inventory management capabilities"
  },
  {
    id: 2,
    title: "Live Chat Application",
    desc: "Real-time messaging platform with authentication, user presence, and responsive interface. Features include file sharing, typing indicators, and message history.",
    tags: ["React.js", "Node.js", "Socket.io", "MongoDB"],
    image: "pro2.png",
    link: "https://github.com/jain-pratham/chat_web",
    type: "Real-Time",
    year: "2024",
    details: "Enterprise-grade communication platform with socket-based real-time updates"
  },
  {
    id: 3,
    title: "Academic Consultancy Platform",
    desc: "Freelance consultancy website with service listings, inquiry handling, and SEO optimization. Custom booking system and client management.",
    tags: ["Next.js", "Node.js", "MongoDB"],
    image: "pro3.png",
    link: "https://thesiswithdrpoonam.in",
    type: "Web App",
    year: "2023",
    details: "Full-featured consultancy platform with 200+ active users"
  },
  {
    id: 4,
    title: "Image Classification System",
    desc: "Deep learning based image classification workflow with preprocessing and model training pipeline. 95% accuracy on custom dataset.",
    tags: ["Python", "Deep Learning", "OpenCV"],
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=2070",
    link: "https://github.com/jain-pratham/Adaptive-Face-Recognition-Engine",
    type: "AI/ML",
    year: "2024",
    details: "Advanced ML model with real-time inference capabilities"
  }
];

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <section id="work" className="section-shell py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="section-title text-4xl font-black text-white md:text-6xl">
            SELECTED <br /> <span className="text-lime-300">WORKS</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left - Projects List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-3"
          >
            {projects.map((project, idx) => (
              <motion.button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 5 }}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-300 ${
                  selectedProject.id === project.id
                    ? "border-lime-300 bg-lime-300/10 backdrop-blur-xl"
                    : "border-white/10 bg-white/[0.02] hover:border-lime-300/50 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className={`text-sm font-bold mb-1 ${
                      selectedProject.id === project.id ? "text-lime-300" : "text-slate-400"
                    }`}>
                      {project.type}
                    </p>
                    <h3 className={`font-black tracking-tight ${
                      selectedProject.id === project.id ? "text-white text-lg" : "text-slate-300 text-base"
                    }`}>
                      {project.title}
                    </h3>
                  </div>
                  {selectedProject.id === project.id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="w-2 h-8 bg-lime-300 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>

                <div className="mt-2 flex gap-1 flex-wrap">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-slate-900 text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Right - Project Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Project Image */}
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-white/10"
                >
                  <motion.img
                    key={selectedProject.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Tags */}
                  <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                    {selectedProject.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="px-3 py-1 rounded-full border border-lime-300/60 bg-lime-300/20 text-xs font-bold text-lime-200 backdrop-blur-md"
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>

                  {/* Year Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-6 right-6"
                  >
                    <div className="px-4 py-2 rounded-lg bg-black/60 border border-white/10 backdrop-blur-xl text-xs font-bold text-white">
                      {selectedProject.year}
                    </div>
                  </motion.div>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                    {selectedProject.title}
                  </h2>

                  <p className="text-base text-slate-300 leading-7 mb-4">
                    {selectedProject.desc}
                  </p>

                  <p className="text-sm text-lime-300 font-semibold mb-6">
                    {selectedProject.details}
                  </p>

                  {/* Links */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex gap-4"
                  >
                    <motion.a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-lime-300/50 bg-lime-300/20 hover:bg-lime-300/30 text-lime-300 font-bold transition-all"
                    >
                      <ExternalLink size={18} />
                      View Project
                    </motion.a>

                    <motion.a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
                    >
                      <Code size={18} />
                      Source Code
                    </motion.a>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
