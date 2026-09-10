"use client";

import { motion } from "framer-motion";

export default function AnimatedSection({ id, className = "", children }) {
  return (
    <motion.section
      id={id}
      className={`scroll-mt-28 ${className}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
