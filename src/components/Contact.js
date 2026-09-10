"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, FolderGit2, Link2, Clock3, Send, ArrowRight, ArrowUp, X } from "lucide-react";

const contactCards = [
  {
    label: "Email",
    value: "jainpratham4050@gmail.com",
    href: "mailto:jainpratham4050@gmail.com",
    icon: Mail,
    accent: "bg-cyan-300/12 text-cyan-200 border-cyan-300/20",
  },
  {
    label: "GitHub",
    value: "github.com/jain-pratham",
    href: "https://github.com/jain-pratham",
    icon: FolderGit2,
    accent: "bg-lime-300/12 text-lime-200 border-lime-300/20",
  },
  {
    label: "LinkedIn",
    value: "Pratham Jain | LinkedIn",
    href: "https://www.linkedin.com/in/pratham-jeetendra-jain/",
    icon: Link2,
    accent: "bg-white/8 text-white border-white/12",
  },
  {
    label: "Response Time",
    value: "Within 24 hours",
    href: "#contact",
    icon: Clock3,
    accent: "bg-cyan-300/12 text-cyan-200 border-cyan-300/20",
  },
];

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Skills", href: "#stack" },
  { label: "Projects", href: "#work" },
];

const footerConnect = [
  {
    label: "GitHub",
    href: "https://github.com/jain-pratham",
    icon: FolderGit2,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pratham-jeetendra-jain/",
    icon: Link2,
  },
  {
    label: "Email",
    href: "mailto:jainpratham4050@gmail.com",
    icon: Mail,
  },
];

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <section id="contact" className="section-shell relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/[0.02] to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full border border-cyan-300/10 opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-16 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,215,255,0.14),transparent_62%)] blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-black leading-none tracking-[-0.06em] text-white md:text-6xl"
          >
            LET&apos;S BUILD SOMETHING
            <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-lime-300 to-cyan-200 bg-clip-text text-transparent">
              REMARKABLE
            </span>
          </motion.h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-400 md:text-lg">
            Whether you&apos;re launching a startup, improving a business website, or building a custom platform, I can help turn the idea into a clean and scalable product.
          </p>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/5 px-8 py-4 text-sm font-black text-white backdrop-blur-xl transition-all hover:border-cyan-300/30 hover:bg-white/8"
          >
            Get In Touch <ArrowRight size={18} />
          </button>
          <p className="mt-10 text-xl font-bold tracking-tight text-white md:text-2xl">
            Available for freelance projects and long-term collaborations.
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-500 md:text-lg">
            I focus on shipping modern web solutions with clear communication, strong execution, and product-level polish.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[88vh] w-full max-w-[980px] overflow-hidden rounded-[1.9rem] border border-white/8 bg-[linear-gradient(180deg,rgba(20,23,34,0.97),rgba(16,18,28,0.98))] shadow-[0_30px_100px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition-colors hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="grid max-h-[90vh] overflow-y-auto lg:grid-cols-[0.95fr_1.15fr]">
                <div className="border-b border-white/6 p-6 md:p-7 lg:border-b-0 lg:border-r">
                  <h3 className="text-[1.9rem] font-black tracking-tight text-white">Let&apos;s Connect</h3>
                  <p className="mt-3 max-w-md text-[0.98rem] leading-7 text-slate-400">
                    I&apos;m always open to discussing new projects, freelance opportunities, and creative product ideas.
                  </p>

                  <div className="mt-6 space-y-3.5">
                    {contactCards.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                          className="flex items-center justify-between rounded-[1.15rem] border border-white/8 bg-white/[0.03] p-3.5 transition-all hover:bg-white/[0.05]"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.accent}`}>
                              <Icon size={17} />
                            </div>
                            <div>
                              <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">{item.label}</div>
                              <div className="mt-1 text-[0.98rem] font-semibold text-white">{item.value}</div>
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-slate-600" />
                        </a>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 md:p-7">
                  <h3 className="text-[1.9rem] font-black tracking-tight text-white">Send a Message</h3>
                  <p className="mt-3 text-[0.98rem] leading-7 text-slate-400">
                    Fill out the form and I&apos;ll get back to you as soon as possible.
                  </p>

                  <form className="mt-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        type="text"
                        placeholder="Your name"
                        className="w-full rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[0.98rem] text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.06]"
                      />
                      <input
                        type="email"
                        placeholder="Your email"
                        className="w-full rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[0.98rem] text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.06]"
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Subject"
                      className="w-full rounded-[1rem] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[0.98rem] text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.06]"
                    />

                    <textarea
                      rows="5"
                      placeholder="Your message..."
                      className="w-full resize-none rounded-[1.15rem] border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[0.98rem] text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-300/40 focus:bg-white/[0.06]"
                    ></textarea>

                    <button className="group flex w-full items-center justify-center gap-3 rounded-[1rem] bg-gradient-to-r from-cyan-300 via-lime-300 to-cyan-200 py-3.5 text-[0.98rem] font-black text-slate-950 transition-all hover:brightness-105 active:scale-[0.99]">
                      Send Message
                      <Send size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="relative z-10 mt-16 border-t border-white/8 bg-transparent">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-base font-bold tracking-tight text-white">Pratham Jain</p>
              <p className="mt-1 text-sm text-slate-500">Freelance full stack developer building modern digital products.</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              {footerConnect.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-slate-300 transition-all hover:border-white/15 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
              <a
                href="#top"
                aria-label="Back to top"
                className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-lime-300/30 bg-lime-300/90 text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                <ArrowUp size={15} />
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/6 pt-3 text-xs text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>&copy; 2026 Pratham Jain. All rights reserved.</p>
            <p>Built with Next.js, Tailwind CSS, Framer Motion, and care.</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
