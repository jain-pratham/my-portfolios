"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Skills", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed left-1/2 top-5 z-[100] w-[95%] max-w-7xl -translate-x-1/2 rounded-[1.75rem] border transition-all duration-500 ${
        scrolled
          ? "border-white/10 bg-slate-950/65 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
          : "border-white/0 bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-3 font-black tracking-tighter text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-300/20 bg-lime-300/10 text-lime-300 shadow-[0_0_30px_rgba(158,255,107,0.12)]">
            <Zap className="fill-current" size={20} />
          </span>
          <span className="text-2xl">PRATHAM</span>
        </a>

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-2 text-sm font-medium text-slate-300 backdrop-blur-xl md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 transition-colors hover:bg-white/8 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="rounded-full border border-lime-300/50 bg-lime-300 px-6 py-3 text-sm font-black text-slate-950 transition-all hover:-translate-y-0.5 hover:bg-white"
        >
          START PROJECT
        </a>
      </div>
    </motion.nav>
  );
}
