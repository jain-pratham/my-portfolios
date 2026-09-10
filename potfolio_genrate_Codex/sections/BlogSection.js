import AnimatedSection from "@/components/AnimatedSection";
import SectionHeading from "@/components/SectionHeading";
import { blogPosts } from "@/data/siteData";

export default function BlogSection() {
  return (
    <AnimatedSection id="blog" className="section-pad">
      <div className="shell">
        <SectionHeading eyebrow="Blog" title="Latest writing" />
        <div className="grid gap-5 md:grid-cols-3">
          {blogPosts.map((post, index) => (
            <article key={post.title} className="panel edge-line panel-hover rounded-2xl p-6">
              <p className="text-sm text-[color:var(--accent)]">Article {index + 1}</p>
              <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
              <p className="text-muted mt-2 text-sm">{post.date}</p>
              <a href={post.href} className="mt-4 inline-block text-sm font-medium text-[color:var(--accent)] hover:underline">
                Read article
              </a>
            </article>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
