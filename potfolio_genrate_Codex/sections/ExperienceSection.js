import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { experiences } from "@/data/siteData";

export default function ExperienceSection() {
  return (
    <AnimatedSection id="experience" className="section-pad">
      <div className="shell max-w-5xl">
        <SectionHeading eyebrow="Experience" title="Professional timeline" />
        <div className="relative border-l border-[color:var(--stroke)] pl-6">
          {experiences.map((item) => (
            <div key={item.title} className="panel edge-line mb-6 rounded-2xl p-5">
              <span className="absolute -left-[33px] top-8 h-3 w-3 rounded-full bg-[color:var(--accent)]" />
              <p className="text-sm text-[color:var(--accent)]">{item.year}</p>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-muted">{item.company}</p>
              <p className="text-muted mt-2">{item.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
