import { motion } from "framer-motion";
import { MessageCircle, Sparkles } from "lucide-react";

export default function HeroAI() {
  return (
    <section id="home" className="relative w-full min-h-screen flex items-center justify-center overflow-hidden px-4 text-white">

      {/* 🌈 Deep Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-[length:300%_300%] 
        bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e]" />

      {/* 🔥 Neon Blobs */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-[#00f0ff]/40 blur-3xl top-20 left-10"
        animate={{ x: [0, 60, -40, 0], y: [0, -50, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#9b5cff]/40 blur-3xl bottom-20 right-10"
        animate={{ x: [0, -70, 30, 0], y: [0, 60, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ✨ Floating Sparkles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full"
            initial={{ x: Math.random() * 1200, y: Math.random() * 800, opacity: 0 }}
            animate={{ y: [null, Math.random() * -50], opacity: [0, 1, 0] }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Floating Robots */}
      <motion.img
        src="2.png"
        alt="Robot"
        className="hidden md:block absolute top-10 left-10 w-28 opacity-90 drop-shadow-[0_0_15px_#00f0ff]"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.img
        src="3.png"
        alt="Robot"
        className="hidden md:block absolute bottom-20 left-24 w-36 opacity-90 drop-shadow-[0_0_15px_#9b5cff]"
        animate={{ y: [0, 25, 0], x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.img
        src="2.png"
        alt="Robot"
        className="hidden md:block absolute top-32 right-10 w-32 opacity-90 drop-shadow-[0_0_15px_#ff6ec7]"
        animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-6">
        {/* Glass Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/10 px-5 py-2 rounded-full 
            text-xs sm:text-sm backdrop-blur-xl border border-white/20 shadow-lg"
        >
          <Sparkles size={16} className="text-[#00f0ff]" />
          23+ Happy Clients
          <div className="flex -space-x-2">
            <img
              src="https://i.pravatar.cc/30?img=1"
              className="w-6 h-6 rounded-full border-2 border-white/40"
            />
            <img
              src="https://i.pravatar.cc/30?img=2"
              className="w-6 h-6 rounded-full border-2 border-white/40"
            />
            <img
              src="https://i.pravatar.cc/30?img=3"
              className="w-6 h-6 rounded-full border-2 border-white/40"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 12 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-[0_0_10px_#00f0ff]"
        >
          Level Up With{" "}
          <span className="bg-gradient-to-r from-[#00f0ff] via-[#9b5cff] to-[#ff6ec7] bg-clip-text text-transparent">
            AI & Innovation
          </span>
          <br className="hidden sm:block" />
          Build The Future Today 🚀
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto"
        >
          From websites to intelligent systems — we create bold, modern, and 
          futuristic digital experiences that attract and inspire.
        </motion.p>

        {/* Button */}
        <motion.button
  whileHover={{ scale: 1.08 }}
  whileTap={{ scale: 0.92 }}
  onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
  className="px-6 sm:px-8 py-3 mt-4 bg-gradient-to-r from-[#00f0ff] to-[#9b5cff] 
    text-black font-semibold rounded-full shadow-[0_0_25px_#00f0ff] hover:opacity-90 
    flex items-center gap-2 mx-auto text-sm sm:text-base"
>
  <MessageCircle size={18} /> Let’s Build Together
</motion.button>

      </div>
    </section>
  );
}

/* 🌈 Tailwind Custom Gradient Animation */
<style jsx global>{`
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient {
    background-size: 300% 300%;
    animation: gradient 18s ease infinite;
  }
`}</style>
