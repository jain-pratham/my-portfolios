import { socialLinks } from "@/data/siteData";

export default function Footer() {
  return (
    <footer className="section-pad pb-10 pt-4">
      <div className="shell panel edge-line flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-5 sm:flex-row">
        <p className="text-muted text-sm">
          Copyright {new Date().getFullYear()} Pratham. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="text-sm text-[color:var(--muted)] hover:text-[color:var(--accent)]"
              target="_blank"
              rel="noreferrer"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
