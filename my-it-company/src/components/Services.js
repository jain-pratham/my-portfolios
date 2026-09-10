"use client";
import { motion } from "framer-motion";
import { Bot, Code2, Database, LayoutDashboard, Monitor, Search } from "lucide-react";

const services = [
  {
    icon: Code2,
    title: "Web Development",
    tag: "Frontend + Full Stack",
    desc: "High-converting websites that not only look great but help you generate more leads and grow your business.",
    color: "from-cyan-400 via-sky-500 to-blue-600"
  },
  {
    icon: Monitor,
    title: "Responsive Design",
    tag: "Mobile First Experience",
    desc: "Your website will work perfectly on all devices, ensuring a smooth experience for every user.",
    color: "from-fuchsia-400 via-violet-500 to-purple-600"
  },
  {
    icon: Database,
    title: "Backend & Systems",
    tag: "Secure Infrastructure",
    desc: "Secure and scalable backend systems to handle your data, users, and business operations efficiently.",
    color: "from-orange-400 via-amber-500 to-red-500"
  },
  {
    icon: Search,
    title: "SEO Optimization",
    tag: "Search Visibility",
    desc: "Fast-loading websites that reduce bounce rate and improve user experience and SEO ranking.",
    color: "from-yellow-300 via-amber-400 to-orange-500"
  },
  {
    icon: Bot,
    title: "AI Integration",
    tag: "Automation + Intelligence",
    desc: "Smart features like automation, chatbots, and AI tools to make your product more powerful.",
    color: "from-emerald-400 via-green-500 to-teal-500"
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard & Tools",
    tag: "Business Control Center",
    desc: "Custom dashboards and tools to manage your business, track data, and make better decisions.",
    color: "from-indigo-400 via-blue-500 to-cyan-500"
  }
];

export default function Services() {
  return (
    <section id="services" className="section-shell py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h2 className="section-title text-4xl font-black text-white md:text-6xl mb-6">
            MY <span className="text-lime-300">SERVICES</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Comprehensive solutions tailored to transform your ideas into powerful digital products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-7 shadow-[0_22px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl transition duration-300 hover:border-white/20 hover:shadow-[0_28px_70px_rgba(0,0,0,0.35)]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className={`absolute -right-14 top-0 h-36 w-36 rounded-full bg-gradient-to-br ${service.color} blur-3xl opacity-20`} />
                  <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                </div>

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className={`relative inline-flex rounded-[1.25rem] bg-gradient-to-br ${service.color} p-[1px] shadow-[0_18px_35px_rgba(15,23,42,0.28)]`}>
                      <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-slate-950/90">
                        <Icon className="h-6 w-6 text-white" strokeWidth={2.1} />
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-300">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="mb-3 text-2xl font-black tracking-tight text-white transition group-hover:text-lime-300">
                    {service.title}
                  </h3>

                  <p className="leading-7 text-slate-400">
                    {service.desc}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                    <span className="text-sm font-semibold text-slate-200">Premium delivery</span>
                    <div className="h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_18px_rgba(158,255,107,0.85)]" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
