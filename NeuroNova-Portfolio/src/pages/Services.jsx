import { motion } from "framer-motion";
import { Code, Palette, Server, Wrench } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Web Development",
      desc: "We build fast, scalable and modern websites using the latest technologies that grow with your business.",
      icon: <Code className="w-10 h-10 text-pink-500" />,
    },
    {
      title: "UI / UX Design",
      desc: "We design clean, user-friendly and engaging interfaces that provide a seamless experience for your customers.",
      icon: <Palette className="w-10 h-10 text-purple-500" />,
    },
    {
      title: "Hosting & Setup",
      desc: "We handle complete hosting, domain and deployment setup so you never have to worry about the technical side.",
      icon: <Server className="w-10 h-10 text-indigo-500" />,
    },
    {
      title: "Maintenance",
      desc: "We provide ongoing support, updates and maintenance to keep your website secure and up-to-date.",
      icon: <Wrench className="w-10 h-10 text-blue-500" />,
    },
  ];

  return (
    <section id="Services" className="relative min-h-screen w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-black text-white py-20 px-6">
      {/* Title */}
      <motion.h2
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-16"
      >
        Our <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">Services</span>
      </motion.h2>

      {/* Grid of Services */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-white/10 backdrop-blur-md shadow-lg p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          >
            <div className="mb-6">{service.icon}</div>
            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
            <p className="text-gray-300 leading-relaxed">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
