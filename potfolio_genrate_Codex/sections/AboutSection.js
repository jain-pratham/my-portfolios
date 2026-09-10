import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";

const skills = ["Python", "TensorFlow", "PyTorch", "Next.js", "Node.js", "MongoDB", "PostgreSQL", "Docker"];

export default function AboutSection() {
  return (
    <AnimatedSection id="about" className="section-pad">
      <div className="shell">
        <SectionHeading
          eyebrow="About Me"
          title="Building products where intelligence meets usability"
          description="I combine ML engineering and full-stack execution to ship products that are fast, scalable, and conversion-focused."
        />
        <div className="grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr]">
          <div className="panel edge-line rounded-3xl p-3">
            <img src="/avatar.svg" alt="Pratham portrait" className="h-full w-full rounded-2xl object-cover spot-grid" />
          </div>
          <div className="panel rounded-3xl p-7">
            <p className="text-muted">
              I specialize in end-to-end product development, from model experimentation and backend APIs to modern
              frontend interfaces. My focus is delivering practical, measurable outcomes for startups and growing
              teams.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {skills.map((skill) => (
                <span key={skill} className="chip rounded-lg px-3 py-2 text-center text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
