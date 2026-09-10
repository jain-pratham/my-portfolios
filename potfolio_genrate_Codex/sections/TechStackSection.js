import {
  SiTensorflow,
  SiPython,
  SiNextdotjs,
  SiMongodb,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiDocker
} from "react-icons/si";
import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";

const stack = [
  { name: "Python", icon: SiPython },
  { name: "TensorFlow", icon: SiTensorflow },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "React", icon: SiReact },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Docker", icon: SiDocker }
];

export default function TechStackSection() {
  return (
    <AnimatedSection id="tech-stack" className="section-pad">
      <div className="shell">
        <SectionHeading eyebrow="Tech Stack" title="Tools I use in production" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stack.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="panel edge-line panel-hover flex flex-col items-center rounded-xl p-5">
                <Icon size={28} className="text-[color:var(--accent)]" />
                <span className="mt-2 text-sm">{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
