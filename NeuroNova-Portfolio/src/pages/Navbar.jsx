import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, X, Menu, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About Us", href: "#AboutUs" },
    { name: "Project", href: "#project" },
    { name: "Services", href: "#Services" },
    { name: "Contact", href: "#contact" },
  ];

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode toggle (add/remove class on html)
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 70, damping: 14 }}
      className="fixed top-0 left-0 w-full z-50"
    >
      {/* --- Normal Navbar (only visible when not scrolled) --- */}
      {!scrolled && (
        <div className="w-full md:w-[70%] md:mx-auto flex items-center justify-between py-6 px-4">
          {/* Logo */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center font-extrabold text-2xl tracking-wide"
          >
            <p
              id="home"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg"
            >
              Pratham <span className="text-white dark:text-gray-200">Jain</span>
            </p>
          </motion.div>

          {/* Center Nav Links (desktop only) */}
          <div className="flex-1 hidden md:flex justify-center">
            <ul className="flex gap-12 text-white dark:text-gray-200">
              {navLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer px-2 py-1 font-semibold"
                >
                  <a href={link.href}>{link.name}</a>
                  <motion.span
                    className="absolute left-0 bottom-0 w-full h-[2px] bg-pink-500"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ originX: 0 }}
                  />
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Right side buttons */}
          <div className="flex gap-3 items-center">
            {/* Day/Night Toggle */}
            <motion.button
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="flex rounded-full p-2 bg-white/40 dark:bg-gray-700 shadow-sm hover:bg-pink-100 dark:hover:bg-gray-600"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Moon className="text-yellow-300" /> : <Sun className="text-orange-500" />}
            </motion.button>

            {/* Language button (desktop only) */}
            

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden p-2 rounded-md bg-white/40 dark:bg-gray-700 shadow-sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>
      )}

      {/* Mobile Menu (works in both normal + scroll mode) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="px-6 pb-4 overflow-hidden md:hidden backdrop-blur-md bg-white/20 dark:bg-gray-800/80 rounded-lg mt-2"
          >
            <ul className="flex flex-col gap-3 text-black dark:text-white">
              {navLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: "rgb(15 23 42)",
                    color: "#fff",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-md px-3 py-2 cursor-pointer shadow-sm"
                >
                  <a href={link.href} onClick={() => setIsOpen(false)}>
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Scrolled Navbar --- */}
      {scrolled && (
        <>
          {/* Desktop Scroll Navbar */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 px-10 py-3 rounded-full backdrop-blur-xl bg-white/30 dark:bg-gray-800/70 shadow-lg"
          >
            <ul className="flex gap-10 text-black dark:text-white font-semibold">
              {navLinks.map((link) => (
                <motion.li
                  key={link.name}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <a href={link.href}>{link.name}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Mobile Scroll Navbar */}
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
            className="flex md:hidden fixed top-2 left-1/2 -translate-x-1/2 px-5 py-2 items-center gap-4 rounded-full backdrop-blur-xl bg-white/30 dark:bg-gray-800/70 shadow-lg"
          >
            {/* Logo */}
            <p className="font-extrabold text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              PJ
            </p>

            {/* Menu Btn */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md bg-white/40 dark:bg-gray-700"
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </motion.div>
        </>
      )}
    </motion.nav>
  );
}
