"use client";

import { motion } from "framer-motion";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="panel rounded-full p-2 text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)]"
    >
      {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
    </motion.button>
  );
}
