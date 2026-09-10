import { motion } from "framer-motion";

export default function AboutUs() {
  return (
    <section id="AboutUs" className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white py-20 px-6 md:px-12 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        
        {/* Heading */}
        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg"
        >
          About Us
        </motion.h2>

        {/* Content */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl leading-relaxed text-gray-300 max-w-3xl mx-auto"
        >
          At <span className="font-semibold text-pink-400">JP Tech Studio</span>, 
          we specialize in building <span className="text-indigo-400">modern, responsive, and scalable</span> 
          digital solutions that empower businesses and individuals.  
          Our focus is to blend <span className="text-purple-400">innovation</span> with 
          <span className="text-pink-400"> technology</span>, delivering impactful experiences that truly stand out.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto"
        >
          From crafting elegant <span className="text-indigo-400">web applications</span> 
          to developing user-friendly <span className="text-purple-400">interfaces</span>,  
          our team is committed to excellence, creativity, and long-term value.  
          We believe in creating solutions that not only look great but also perform seamlessly. 🚀
        </motion.p>
      </div>

      {/* 🔥 Cross Tilted Infinite Strips */}
      <div className="relative mt-24 h-48 overflow-hidden">
        
        {/* Top Tilted Strip */}
        <motion.div
          className="absolute top-6 left-0 w-[200%] flex space-x-16 text-xl md:text-2xl font-semibold text-white bg-gradient-to-r from-indigo-700 via-blue-600 to-indigo-700 py-4 shadow-lg"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ transform: "rotate(-6deg)" }}
        >
          <span className="whitespace-nowrap">
            ⭐ Secure ⭐ Reliable ⭐ Engaging ⭐ Accessible ⭐ Responsive ⭐ Dynamic ⭐ Scalable ⭐ Innovative ⭐
          </span>
          <span className="whitespace-nowrap">
            ⭐ Secure ⭐ Reliable ⭐ Engaging ⭐ Accessible ⭐ Responsive ⭐ Dynamic ⭐ Scalable ⭐ Innovative ⭐
          </span>
        </motion.div>

        {/* Bottom Tilted Strip */}
        <motion.div
          className="absolute bottom-6 left-0 w-[200%] flex space-x-16 text-xl md:text-2xl font-semibold text-white bg-gradient-to-r from-purple-700 via-pink-600 to-purple-700 py-4 shadow-lg"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ transform: "rotate(6deg)" }}
        >
          <span className="whitespace-nowrap">
            🚀 Modern 🚀 Responsive 🚀 Secure 🚀 Creative 🚀 Accessible 🚀 Dynamic 🚀 Scalable 🚀 Innovative 🚀
          </span>
          <span className="whitespace-nowrap">
            🚀 Modern 🚀 Responsive 🚀 Secure 🚀 Creative 🚀 Accessible 🚀 Dynamic 🚀 Scalable 🚀 Innovative 🚀
          </span>
        </motion.div>

      </div>
    </section>
  );
}
