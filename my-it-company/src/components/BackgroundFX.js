"use client";
import { motion } from "framer-motion";

const orbs = [
  {
    className: "top-[8%] left-[-8%] h-72 w-72 bg-lime-300/14",
    duration: 13,
    x: [0, 70, 0],
    y: [0, 40, 0],
  },
  {
    className: "top-[16%] right-[-6%] h-80 w-80 bg-cyan-300/16",
    duration: 16,
    x: [0, -80, 0],
    y: [0, 20, 0],
  },
  {
    className: "bottom-[12%] left-[10%] h-64 w-64 bg-orange-300/12",
    duration: 18,
    x: [0, 45, 0],
    y: [0, -55, 0],
  },
];

export default function BackgroundFX() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0,transparent_52%)]" />
      {orbs.map((orb) => (
        <motion.div
          key={orb.className}
          animate={{ x: orb.x, y: orb.y }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute rounded-full blur-3xl ${orb.className}`}
        />
      ))}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/8"
      />
    </div>
  );
}
