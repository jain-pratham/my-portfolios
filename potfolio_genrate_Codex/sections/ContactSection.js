"use client";

import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";

export default function ContactSection() {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    // Simulate submit latency for UI feedback in demo mode.
    await new Promise((resolve) => setTimeout(resolve, 900)); 
    setSending(false);
    setMessage("Thanks! Your message has been received.");
    event.target.reset();
  };

  return (
    <AnimatedSection id="contact" className="section-pad">
      <div className="shell max-w-5xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let us craft something unforgettable"
          description="Tell me what you are building. I will respond with a clear scope, timeline, and technical direction."
        />
        <div className="panel edge-line grid gap-6 rounded-3xl p-6 md:grid-cols-[0.85fr_1.15fr] md:p-8">
          <aside className="spot-grid rounded-2xl p-5">
            <h3 className="text-2xl font-bold">Project Inquiry</h3>
            <p className="text-muted mt-3 text-sm">
              Preferred collaboration: product MVPs, AI features, and complete web platforms.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="chip rounded-xl px-3 py-2">Typical reply: within 24 hours</p>
              <p className="chip rounded-xl px-3 py-2">Timezone: IST / flexible overlap</p>
              <p className="chip rounded-xl px-3 py-2">Remote worldwide projects</p>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required
              type="text"
              placeholder="Your Name"
              className="w-full rounded-xl border border-[color:var(--stroke)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--accent)]"
            />
            <input
              required
              type="email"
              placeholder="Your Email"
              className="w-full rounded-xl border border-[color:var(--stroke)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--accent)]"
            />
            <textarea
              required
              rows="5"
              placeholder="Project Details"
              className="w-full rounded-xl border border-[color:var(--stroke)] bg-transparent px-4 py-3 outline-none focus:border-[color:var(--accent)]"
            />
            <button
              disabled={sending}
              className="w-full rounded-xl bg-[linear-gradient(120deg,var(--accent),var(--accent-2))] px-6 py-3 font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
            {message ? <p className="text-sm text-emerald-500">{message}</p> : null}
          </form>
        </div>
      </div>
    </AnimatedSection>
  );
}

