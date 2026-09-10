"use client";

import { motion } from "framer-motion";

export default function PrimaryButton({ href, children, variant = "solid" }) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold transition-all duration-300";
  const styles =
    variant === "solid"
      ? "bg-[linear-gradient(120deg,var(--accent),var(--accent-2))] text-white shadow-[0_16px_38px_rgba(39,94,254,0.35)] hover:brightness-110"
      : "panel text-[color:var(--text)] hover:text-[color:var(--accent)]";

  return (
    <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} href={href} className={`${base} ${styles}`}>
      {children}
    </motion.a>
  );
}
