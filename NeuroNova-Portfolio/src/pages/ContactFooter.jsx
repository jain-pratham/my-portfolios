import { motion } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";

export default function ContactFooter() {
  return (
    <section id="contact" className="relative w-full bg-gradient-to-b from-black via-indigo-950 to-slate-900 text-white py-12 md:py-24 overflow-hidden">
      
      {/* Side Contact Us - only visible on md+ */}
      <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-10">
        <span className="transform -rotate-90 text-gray-400 tracking-widest select-none">Contact Us</span>
      </div>

      {/* Contact Form Container */}
      <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 min-h-[60vh] md:min-h-[40vh] z-10">
        
        {/* Form */}
        <motion.form
          className="flex-1 flex flex-col gap-4 bg-black/30 p-6 md:p-8 rounded-3xl backdrop-blur-md shadow-2xl w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
            Get in Touch
          </h2>
          <p className="text-white/70 mb-2 text-sm md:text-base">
            I’m open for collaborations, freelance work, or just a friendly chat!
          </p>
          <input
            type="text"
            placeholder="Your Name"
            className="p-3 rounded-2xl bg-white/10 placeholder-white text-white outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="p-3 rounded-2xl bg-white/10 placeholder-white text-white outline-none focus:ring-2 focus:ring-pink-500"
          />
          <textarea
            rows={3}
            placeholder="Your Message"
            className="p-3 rounded-2xl bg-white/10 placeholder-white text-white outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
          <button className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-bold hover:scale-105 transition-transform duration-300">
            Send Message
          </button>
        </motion.form>

        {/* Contact Info */}
        <motion.div
          className="flex-1 flex flex-col justify-center gap-3 md:gap-4 text-white w-full"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h3 className="text-xl md:text-2xl font-bold">Contact Info</h3>
          <p>Email: <a href="mailto:you@example.com" className="underline">prathamjain4050@gmail.com</a></p>
          <p>Phone: <a href="tel:+1234567890" className="underline">+91 7016945985</a></p>
          <p>Address: 2, Mhavir complex oop jain temple Bhilad</p>
          <p className="text-white/70 mt-2 md:mt-4">
            You can also connect with me on social media:
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
              <Github size={22} />
            </a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
              <Linkedin size={22} />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
              <Instagram size={22} />
            </a>
            <a href="https://inshib.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors font-semibold">
              Inshib
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="mt-12 md:mt-16 w-full flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto px-6 py-6 border-t border-gray-700 z-10">
        <span className="text-white/70 text-xs md:text-sm text-center md:text-left">
          © {new Date().getFullYear()} Pratham Jain
        </span>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
            <Instagram size={20} />
          </a>
          <a href="https://inshib.com/" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors font-semibold">
            Inshib
          </a>
        </div>
      </footer>

      {/* Decorative Floating Ovals */}
      <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-10 filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 filter blur-3xl animate-pulse"></div>
    </section>
  );
}
