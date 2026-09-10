import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

export default function PortfolioCarouselClick() {
  const projects = [
    {
      title: "E-Commerce Website",
      desc: "A modern and fully responsive e-commerce platform built with MERN stack. Features user authentication, shopping cart, payment gateway integration, and admin dashboard to manage products.",
      img: "image.png",
      tech: ["React", "Node.js", "MongoDB", "Express", "TailwindCSS"],
      link: "https://your-ecommerce-link.com",
    },
    {
      title: "Portfolio Website",
      desc: "A sleek and professional personal portfolio showcasing skills, experience, and projects. Built for developers and designers looking to make a strong online presence.",
      img: "image2.png",
      tech: ["Next.js", "Framer Motion", "TailwindCSS"],
      link: "https://your-portfolio-link.com",
    },
    {
      title: "Business Landing Page",
      desc: "A high-converting landing page tailored for startups and businesses. Optimized for SEO, includes hero section, features, testimonials, pricing plans, and contact form.",
      img: "image.png",
      tech: ["HTML", "CSS", "JavaScript", "GSAP"],
      link: "https://your-landingpage-link.com",
    },
    {
      title: "UI/UX Dashboard",
      desc: "An interactive and visually appealing admin dashboard UI design. Includes charts, analytics, user management, and responsive layouts for web and mobile.",
      img: "21.jpg",
      tech: ["Figma", "React", "Chart.js", "TailwindCSS"],
      link: "https://your-dashboard-link.com",
    },
  ];

  const [centerIndex, setCenterIndex] = useState(0);
  const prevIndex = (centerIndex - 1 + projects.length) % projects.length;
  const nextIndex = (centerIndex + 1) % projects.length;

  // 🔥 Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCenterIndex((prev) => (prev + 1) % projects.length);
    }, 4000); // 4 seconds delay

    return () => clearInterval(interval); // cleanup on unmount
  }, [projects.length]);

  return (
    <div
      id="project"
      className="relative w-full flex flex-col items-center py-12 px-4 md:px-0 overflow-hidden bg-[#0b111e]"
    >
      {/* Section Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f1f5f9] mb-12 tracking-wide text-center">
        Projects & Work Showcase
      </h2>

      {/* Desktop Carousel */}
      <div className="hidden md:flex relative w-full max-w-[1200px] justify-center items-center h-[480px]">
        {/* Previous Card */}
        <motion.div
          onClick={() => setCenterIndex(prevIndex)}
          whileHover={{ scale: 0.98 }}
          className="absolute w-[350px] h-[450px] rounded-xl overflow-hidden cursor-pointer scale-90 -translate-x-96 z-10 transition-all duration-500 filter blur-sm opacity-50 hover:opacity-100 hover:blur-none hover:shadow-xl"
        >
          <img
            src={projects[prevIndex].img}
            alt={projects[prevIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
            <h3 className="text-xl font-bold text-[#f8fafc]">
              {projects[prevIndex].title}
            </h3>
            <p className="text-sm text-[#94a3b8]">
              {projects[prevIndex].desc.slice(0, 60)}...
            </p>
          </div>
        </motion.div>

        {/* Center Card */}
        <motion.div
          key={centerIndex} // 👈 Important for animation reset
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute w-[500px] h-[500px] rounded-2xl shadow-[0_0_25px_rgba(2,132,199,0.6)] overflow-hidden cursor-pointer z-30 bg-[#111827] border border-[#1e293b]"
        >
          <img
            src={projects[centerIndex].img}
            alt={projects[centerIndex].title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-3xl font-bold text-[#e2e8f0] mb-3">
              {projects[centerIndex].title}
            </h3>
            <p className="text-[#94a3b8] text-sm mb-4">
              {projects[centerIndex].desc}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {projects[centerIndex].tech.map((tech) => (
                <span
                  key={tech}
                  className="bg-[#1e293b] px-3 py-1 rounded-full text-xs font-medium text-[#38bdf8] border border-[#38bdf8]/40"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={projects[centerIndex].link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold text-white hover:scale-105 transition-transform shadow-lg"
            >
              View Project <ExternalLink size={16} />
            </a>
          </div>
        </motion.div>

        {/* Next Card */}
        <motion.div
          onClick={() => setCenterIndex(nextIndex)}
          whileHover={{ scale: 0.98 }}
          className="absolute w-[350px] h-[450px] rounded-xl overflow-hidden cursor-pointer scale-90 translate-x-96 z-10 transition-all duration-500 filter blur-sm opacity-50 hover:opacity-100 hover:blur-none hover:shadow-xl"
        >
          <img
            src={projects[nextIndex].img}
            alt={projects[nextIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-4">
            <h3 className="text-xl font-bold text-[#f8fafc]">
              {projects[nextIndex].title}
            </h3>
            <p className="text-sm text-[#94a3b8]">
              {projects[nextIndex].desc.slice(0, 60)}...
            </p>
          </div>
        </motion.div>
      </div>

      {/* Mobile Cards (no auto-slide, just list) */}
      <div className="md:hidden flex flex-col gap-10 w-full items-center">
        {projects.map((project, i) => (
          <div
            key={i}
            className="w-11/12 max-w-sm rounded-xl shadow-lg overflow-hidden bg-[#111827] border border-[#1e293b]"
          >
            <img
              src={project.img}
              alt={project.title}
              className="w-full h-64 object-cover opacity-90"
            />
            <div className="p-5 flex flex-col gap-3">
              <h3 className="text-2xl font-bold text-[#f8fafc]">
                {project.title}
              </h3>
              <p className="text-[#94a3b8] text-sm">{project.desc}</p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="bg-[#1e293b] px-2 py-1 rounded-full text-xs font-medium text-[#38bdf8] border border-[#38bdf8]/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-bold text-white hover:scale-105 transition-transform shadow-lg"
              >
                View Project <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
