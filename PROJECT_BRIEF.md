# PROJECT_BRIEF.md — Ashvanth P S Personal Portfolio

## 1. PROJECT OVERVIEW & INSTITUTIONAL CONSTRAINTS (STRICT)
- **Owner:** Ashvanth P S
- **Role:** College Student (AI/ML, Local AI Agent Fine-Tuning, GPU Computing, Vibe Coding)
- **Purpose:** Academic Final Deliverable & Technical Interviewer Portfolio
- **Repository:** https://github.com/25bcs010-lang/portfolio.git
- **TECH STACK MANDATE (CRITICAL):**
  - Build the ENTIRE project using ONLY **HTML5, CSS3, and Vanilla JavaScript (ES6+)**.
  - **STRICTLY FORBIDDEN:** React, Vue, Angular, Bootstrap, Tailwind, jQuery, GSAP, Lenis, or ANY external CSS/JS frameworks or libraries.
  - **STRICTLY FORBIDDEN:** Website builders, portfolio templates, backend services, databases, or server-side code.
  - Must be fully responsive and usable on both phones and desktop computers (Mobile-First).

## 2. REQUIRED FILE STRUCTURE
portfolio/
├── PROJECT_BRIEF.md
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
    ├── profile.jpg          (or original SVG monogram until photo is added)
    ├── project-one.png      (placeholder frame ready for user's real screenshot)
    └── certificates/        (folder for 5 real hackathon certificates)

## 3. NON-NEGOTIABLE CONTENT & HONESTY RULES
1. **Zero Fabrication:** Never invent clients, metrics, percentages, revenue numbers, testimonials, awards, or fake projects.
2. **Real Owner Data Only:**
   - **Name:** Ashvanth P S
   - **Email:** ashvanth6410@gmail.com
   - **GitHub:** https://github.com/25bcs010-lang
   - **LinkedIn:** https://www.linkedin.com/in/ashvanth-p-s/?isSelfProfile=true
   - **Cognitive Skills:** Cognitive thinking, logical thinking, structured reasoning.
   - **Technical Skills:** Building apps & websites via vibe coding, building AI agents by fine-tuning models locally, GPU computing, TensorFlow, AI/ML workflows, Vanilla HTML/CSS/JS.
   - **Verified Achievements (5 Real Items):**
     1. MSME Hackathon — Went to Final Round (Certificate available)
     2. Smart India Hackathon (SIH) — Two-time Participant (Certificate available)
     3. ISRO Hackathon — Participation Certificate
     4. Datathon — Participation Certificate
     5. Interdepartment Hackathon — Participation Certificate
3. **Projects Section Rule:** Create 4 clean, structured project case study slots in the HTML/CSS (`Problem`, `My Role`, `Tech Stack`, `Outcome`, `Links`, `Screenshot`), marked clearly with `<!-- TODO: INSERT REAL PROJECT DATA -->` placeholders so Ashvanth can populate them in the final step. Do not invent fake project stories.
4. **Licensing:** Use only Google Fonts (`Plus Jakarta Sans` and `JetBrains Mono` under the Open Font License 1.1) and custom inline SVGs written from scratch.

## 4. VISUAL SYSTEM & DESIGN TOKENS
- **Light Theme (Hero, Core Stack Grid, Projects, Achievements):**
  - Background: `#F2F1EC` | Primary Text: `#111111` | Muted Text: `#52524E` | Border: `#DCDBD5`
- **Dark Theme (Philosophy Narrative, Kinetic Bridge, Skills Interactive List, Process, Footer):**
  - Background: `#0D0D0D` | Primary Text: `#F5F5F3` | Muted Text: `#8E8E8A` | Border: `#262626`
- **Accent Color:** `#FF4D00` (Signal Orange for status dots and keyboard focus outlines)
- **Layout:** 12-column CSS Grid (`max-width: 1440px`). On desktop (`>=1024px`), left rail (cols 1-4) holds sticky section headers/context; right area (cols 5-12) holds scrolling content. On mobile (`<768px`), single-column vertical flow.

## 5. SECTION-BY-SECTION ARCHITECTURE
1. **Header (`<header>`):** Fixed/sticky top bar with `ASHVANTH P S`, anchor links (`#about`, `#projects`, `#skills`, `#process`, `#achievements`), and `Contact Me ↗` button.
2. **Hero (`#about`):** Asymmetric split. Left rail: bio intro, `Explore Work ↓` CTA, `(College Student • AI & ML Builder)` tag. Right main: Large display headline + visual showcase frame with floating cards for `MSME Hackathon Finalist` and `2x SIH Participant`.
3. **Tech & Capability Grid (`#toolkit`):** 4x2 hairline-bordered monochrome grid showcasing: `TensorFlow`, `Local Agent Fine-Tuning`, `GPU Computing`, `AI / ML Systems`, `Vibe Coding`, `Logical Reasoning`, `Vanilla Web Stack`, `Git Workflow`.
4. **Engineering Narrative & Kinetic Bridge (`#philosophy`):** Dark section. Left sticky rail: Reasoning manifesto. Right column: Scroll-illuminated paragraph (`span.word` opacity `0.25` -> `1.0`). Below: Full-width kinetic bridge (`LOGIC` [Dynamic SVG Diagram] `EXECUTION`).
5. **Selected Projects (`#projects`):** Light section. Sticky left label `● Selected Projects`. Center/Right: 4 structured case-study slots left clearly marked for real project insertion, plus bottom link bar to `https://github.com/25bcs010-lang`.
6. **Skills & What I Can Build (`#skills`):** Dark section. Interactive 6-item large typography list (`Local AI Agent Fine-Tuning`, `Machine Learning & TensorFlow`, `GPU Computing Workflows`, `Full-Stack Vibe Coding`, `Cognitive & Logical Reasoning`, `Vanilla Web Architecture`) synced with a sticky right preview panel.
7. **How I Work (`#process`):** Dark section. `HOW I BUILD` banner + 3 horizontal steps (`STEP • 01 Deconstruct & Reason`, `STEP • 02 Fine-Tune & Build`, `STEP • 03 Verify & Ship`).
8. **Achievements & Certifications (`#achievements`):** Light section. 5-card grid for MSME Hackathon (Final Round), SIH (2x), ISRO Hackathon, Datathon, and Interdepartment Hackathon with certificate image modal slots.
9. **Contact & Dual-Stage Footer (`#contact` & `<footer>`):** Dark CTA section with email (`ashvanth6410@gmail.com`), GitHub, and LinkedIn links, live IST clock in Vanilla JS, `Back to top ↑` button, and bottom light interactive strip (`Hold to toggle grid blueprint`).

## 6. PERFORMANCE, ACCESSIBILITY & GIT RULES
- Animate ONLY `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`, or `margin`.
- Include `@media (prefers-reduced-motion: reduce)` fallback that disables scroll-scrubbing and reveals all content immediately.
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`), full keyboard navigation (`:focus-visible`), and `loading="lazy"` on below-the-fold images.
- Commit after every completed section to `https://github.com/25bcs010-lang/portfolio.git`.