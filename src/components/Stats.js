"use client";
import { motion } from "framer-motion";

const stats = [
  { label: "Projects Built", val: "6+", color: "border-orange-500" },
  { label: "Years Experience", val: "3+", color: "border-blue-500" },
  { label: "Technologies", val: "20+", color: "border-green-500" },
];

export default function Stats() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="bg-[#111] p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center group transition-all hover:bg-[#161616]"
          >
            <div className={`w-24 h-24 rounded-full border-4 ${item.color} flex items-center justify-center mb-4 relative`}>
               <span className="text-white text-3xl font-bold">{item.val}</span>
               <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity ${item.color.replace('border', 'bg')}`} />
            </div>
            <p className="text-gray-400 font-bold tracking-widest text-xs uppercase">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}