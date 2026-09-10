# Core4ix Theme Reference

## Purpose
This document is the single reference for the current website theme direction, implemented content status, and pending work.

## Project Theme Snapshot
- Brand direction: premium modern agency, clean light UI, enterprise-tech feel.
- Visual style: soft gradients, glass/blurry accents, rounded cards, bold typography, motion-heavy section transitions.
- Framework stack: Astro + Svelte + Tailwind CSS v4.
- Theme architecture: utility-first Tailwind classes directly in components (no centralized design-token file yet).

## Core Theme Tokens In Use
- Primary brand blue: `#1f4e79`
- Electric accent cyan: `#00c6ff`
- Supporting deep slate: `#0f172a`
- Secondary cyan/blue variants: `#0284c7`, `#0b7ea5`
- Neutral system: `white`, `slate-50` to `slate-900`, and light gray section backgrounds (`#f5f5f5`, `#f3f3f3`)
- Special accent (project stats): `#ff3c3c`

## Typography Direction
- Current implementation relies on Tailwind default sans stack.
- Styling pattern: very bold headings (`font-black`), uppercase micro-labels, tight tracking for hero/section titles.
- Tone mix in copy: English + Hindi/Hinglish in a few sections.

## Layout and Section Structure (Homepage)
Rendered by `src/components/LandingExperience.svelte` in this order:
1. Innovation Loader
2. Navbar
3. Hero
4. Trusted By
5. About Us
6. Services
7. Metrics (Num)
8. Industries
9. Process
10. Technologies
11. Project Showcase
12. Testimonials
13. FAQ
14. Footer + Contact CTA

## Implemented Theme Behavior (Done)
- Fixed floating navbar with desktop mega-menu and mobile menu.
- Intro loader with animated ring + type-in brand reveal.
- Hero with radial grid background and animated gradient title.
- Continuous marquee partner logos.
- Tabbed services panel with animated active indicator.
- Animated metrics reveal and hover states.
- Industry card grid with custom inline SVG icons.
- 4-step process cards with visual timeline.
- Tabbed technologies grid with icon system.
- Auto-rotating project showcase carousel.
- Testimonial switching panel with prev/next controls.
- FAQ accordion interaction.
- Contact-focused footer block with CTA buttons and contact cards.

## Content and Asset Status
### Done
- Core homepage sections are implemented and visible.
- Branding assets are present: `/logo1.png`, `/logo2.png`, partner logos, and base images.
- Dedicated technologies route exists: `src/pages/technologies.astro`.

### Remaining / Needs Cleanup
- Anchor mismatch in navbar: `AI` points to `#services`, but no `id="services"` section exists.
- Duplicate anchor id: `id="solutions"` appears in both `Services.svelte` and `footer/Footer.svelte`.
- Several CTA buttons are visual-only (no navigation/action wired).
- Some copy still appears placeholder/inconsistent (example: `Aalpha` in project section).
- Encoding/mojibake issues exist in a few files (`README.md`, `LaunchMessage.svelte`, one arrow text in `Services.svelte`).
- External image dependencies are used in some sections (Unsplash/Flaticon/RandomUser); decide if these should be localized to `/public`.
- No centralized token system yet (colors/spacing/radius repeated inline).

## Theme Governance Notes for Team
- Keep primary brand balance around `#1f4e79` + `#00c6ff`; avoid introducing unrelated palette tones.
- Preserve rounded, soft-shadow, high-contrast heading style across new sections.
- Prefer reusing existing interaction patterns: tab switchers, subtle hover lift, gradient accents.
- For future scalability, consider creating shared design tokens in `tailwind.config.js` and/or CSS variables.

## Relevant Files
- `src/layouts/MainLayout.astro`
- `src/styles/global.css`
- `tailwind.config.js`
- `src/components/*.svelte`
- `src/components/footer/Footer.svelte`
- `src/pages/index.astro`
- `src/pages/technologies.astro`
