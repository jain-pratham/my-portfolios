export default function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]">{eyebrow}</p>
      <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? <p className="text-muted mt-4">{description}</p> : null}
    </div>
  );
}
