"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinks } from "@/data/siteData";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50">
      <nav className="shell panel edge-line flex items-center justify-between rounded-2xl px-4 py-3">
        <Link href="#home" className="text-lg font-bold tracking-tight">
          Pratham<span className="accent-text">.</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] transition hover:bg-white/50 hover:text-[color:var(--accent)] dark:hover:bg-slate-900/50"
            >
              {link.label}
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
            className="panel rounded-full p-2"
          >
            {open ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="shell panel edge-line mt-2 rounded-2xl p-4 md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm text-[color:var(--muted)] hover:bg-white/40 hover:text-[color:var(--accent)] dark:hover:bg-slate-900/60"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
