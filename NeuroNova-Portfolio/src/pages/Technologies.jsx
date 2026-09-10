import { motion } from "framer-motion";

export default function Technologies() {
  const techs = [
    "React","Next.js","Node.js","MongoDB","Express","TailwindCSS","JavaScript",
    "HTML5","CSS3","Git","Figma","TypeScript","Redux","Python","Django",
    "GraphQL","PostgreSQL","Docker","AWS","Vercel"
  ];

  const repeatedTechs = [...techs, ...techs]; // duplicate for infinite scroll

  const rowVariants = {
    animate: (direction) => ({
      x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        x: { repeat: Infinity, repeatType: "loop", duration: 25, ease: "linear" },
      },
    }),
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-black via-indigo-950 to-slate-900 text-white py-12 md:py-20 overflow-hidden">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-center mb-8 sm:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-4">
        Technologies & Skills
      </h2>

      {/* Outer frame */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 md:px-16 lg:px-20 flex flex-col gap-6 md:gap-10 overflow-hidden">
        {Array.from({ length: 2 }).map((_, rowIndex) => (   // ✅ Mobile pe 2 rows, desktop pe bhi clean
          <div key={rowIndex} className="overflow-hidden">
            <motion.div
              className="flex gap-4 sm:gap-6 md:gap-8"
              custom={rowIndex % 2 === 0 ? "left" : "right"}
              variants={rowVariants}
              animate="animate"
            >
              {repeatedTechs.map((tech, i) => (
                <motion.div
                  key={tech + i + rowIndex}
                  className="flex flex-col items-center justify-center min-w-[90px] sm:min-w-[110px] md:min-w-[130px] p-3 sm:p-4 bg-black/30 rounded-xl md:rounded-2xl shadow-lg hover:scale-110 transition-transform duration-500 cursor-pointer"
                  whileHover={{ scale: 1.2, y: -10 }}
                >
                  <img
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.toLowerCase()}/${tech.toLowerCase()}-original.svg`}
                    alt={tech}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 object-contain mb-2"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <span className="text-xs sm:text-sm md:text-base">{tech}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Background glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 w-64 sm:w-80 h-64 sm:h-80 rounded-full absolute -top-20 -left-20 filter blur-3xl animate-pulse opacity-10"></div>
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-64 sm:w-80 h-64 sm:h-80 rounded-full absolute -bottom-20 -right-20 filter blur-3xl animate-pulse opacity-10"></div>
      </div>
    </section>
  );
}
