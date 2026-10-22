/* ================================================================
   ASHVANTH P S — script.js
   Phase 1: Mobile Navigation Toggle
   Phase 2: Scroll Word-Illumination (rAF + getBoundingClientRect)
   Phase 3: Certificate Lightbox Modal (Accessible Vanilla ES6)
   Phase 4: Skills Interactive Preview & IntersectionObserver
================================================================ */

'use strict';

/* ----------------------------------------------------------------
   MOBILE NAV TOGGLE
   querySelector() finds the first element matching a CSS selector.
   We store references to both the button and the drawer so we can
   read/change their attributes and classes.
---------------------------------------------------------------- */
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (navToggle && mobileNav) {

  /* addEventListener() listens for a specific event on an element.
     'click' fires every time the user clicks the button. */
  navToggle.addEventListener('click', () => {

    /* getAttribute() reads the current value of an HTML attribute.
       We use aria-expanded to track open/closed state — this also
       communicates the state to screen readers. */
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';

    /* Toggle: if it was open, close it; if closed, open it. */
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileNav.setAttribute('aria-hidden',   String(isOpen));

    /* classList.toggle() adds the class if missing, removes if present. */
    mobileNav.classList.toggle('is-open', !isOpen);

    /* Update accessible label so screen readers announce the action */
    navToggle.setAttribute(
      'aria-label',
      isOpen ? 'Open navigation menu' : 'Close navigation menu'
    );
  });

  /* Close the mobile nav when any link inside it is clicked.
     querySelectorAll() returns ALL matching elements as a NodeList.
     forEach() runs the callback for each one. */
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden',   'true');
      mobileNav.classList.remove('is-open');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
    });
  });

  /* Close on Escape key press — keyboard accessibility */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden',   'true');
      mobileNav.classList.remove('is-open');
      navToggle.setAttribute('aria-label', 'Open navigation menu');
      /* Return focus to the toggle button so keyboard users aren't lost */
      navToggle.focus();
    }
  });
}


/* ================================================================
   PHASE 2 — SCROLL WORD ILLUMINATION
   Technique: scroll event → requestAnimationFrame → getBoundingClientRect()
   Each word in #illuminated-narrative fades from opacity 0.25 → 1.0
   as it enters the comfortable reading zone of the viewport.
================================================================ */

/* ----------------------------------------------------------------
   STEP 0: Check prefers-reduced-motion BEFORE doing any work.

   window.matchMedia() is the JS equivalent of a CSS @media query.
   It returns a MediaQueryList object. .matches is a boolean.

   If true, the user has OS-level "Reduce Motion" enabled.
   We must NOT animate anything, and must reveal all text immediately.
---------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* ----------------------------------------------------------------
   STEP 1: Target the narrative paragraph in the DOM.
---------------------------------------------------------------- */
const narrativeParagraph = document.getElementById('illuminated-narrative');

/* Array that will hold references to all the word <span> elements.
   We declare it here (outer scope) so updateWordOpacities() can
   access it without being passed it as a parameter every frame. */
let wordSpans = [];

/* The "ticking" flag is the heart of the requestAnimationFrame
   debounce pattern. It prevents us from scheduling multiple rAF
   callbacks in a single frame when the scroll event fires rapidly. */
let ticking = false;

/* ----------------------------------------------------------------
   STEP 2: Initialise — split text OR bypass for reduced-motion.
---------------------------------------------------------------- */
if (narrativeParagraph) {

  if (prefersReducedMotion) {
    /* ── REDUCED-MOTION PATH ──────────────────────────────────────
       Do NOT split or animate anything.
       Simply ensure the full paragraph is fully visible (opacity 1).
       CSS already handles animation disabling, but we make the
       opacity explicit here as a belt-and-braces guarantee. */
    narrativeParagraph.style.opacity = '1';

  } else {
    /* ── NORMAL PATH ──────────────────────────────────────────────
       Split the paragraph text into individual word <span>s,
       run one initial pass so words already on screen get the
       correct opacity before the user even scrolls, then start
       listening for scroll events. */

    wordSpans = splitIntoWords(narrativeParagraph);

    /* Initial pass — handles words visible on page load */
    updateWordOpacities();

    /* passive: true tells the browser "we will NEVER call
       event.preventDefault() inside this listener".
       The browser can then optimise scroll handling (e.g. start
       scrolling before our JS code even runs), giving silky 60fps. */
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

/* ----------------------------------------------------------------
   STEP 3: splitIntoWords(element)

   Takes a paragraph element.
   1. Reads its raw text (textContent — strips HTML tags).
   2. Splits on whitespace (/\s+/ matches any run of spaces/newlines).
   3. Rebuilds innerHTML as: word1 <span>word2</span> word3 ...
      — each word wrapped in <span class="word"> starts at opacity 0.25.
      — words are joined with a literal space character so line-
        wrapping works correctly (the space is between spans, not inside).
   4. Returns a plain Array of the span elements (via Array.from).

   NOTE: Replacing innerHTML removes the original text node. Screen
   readers encounter the <span> elements as inline text — semantically
   identical to the original paragraph — so accessibility is preserved.
---------------------------------------------------------------- */
function splitIntoWords(el) {
  /* textContent reads the raw text, ignoring all HTML tags.
     .trim() removes leading/trailing whitespace/newlines. */
  const rawText = el.textContent.trim();

  /* Split on one or more whitespace characters.
     /\s+/ covers: spaces, tabs, newlines (our HTML has newlines in it).
     .filter(Boolean) removes any empty strings from the array. */
  const words = rawText.split(/\s+/).filter(Boolean);

  /* Rebuild innerHTML: each word in its own span.
     map()   → transforms each word string into a <span> HTML string.
     join(' ') → joins them with a real space between each span
               (this space is what the browser uses for word-wrap). */
  el.innerHTML = words
    .map(w => `<span class="word">${w}</span>`)
    .join(' ');

  /* querySelectorAll returns a NodeList — Array.from() converts it
     to a real Array so we can use .map() and .forEach() later. */
  return Array.from(el.querySelectorAll('.word'));
}


/* ----------------------------------------------------------------
   STEP 4: onScroll()

   Called by the 'scroll' event listener every time the page scrolls.
   The scroll event can fire MANY times per second (10–30+).
   If we called updateWordOpacities() directly here, we'd run it far
   more often than the screen can refresh (typically 60fps = every 16ms).

   The "ticking" pattern solves this:
   — On the first scroll event in a frame: set ticking = true,
     schedule ONE requestAnimationFrame callback.
   — On subsequent scroll events in the SAME frame: ticking is
     already true, so we do nothing (skip the extra rAF call).
   — When rAF fires and runs updateWordOpacities(): set ticking = false,
     so the next scroll event in the NEXT frame can schedule a new rAF.

   Result: updateWordOpacities() runs at most ONCE per frame, perfectly
   in sync with the display refresh rate. Never faster, never wasted.
---------------------------------------------------------------- */
function onScroll() {
  if (!ticking) {
    ticking = true;
    /* requestAnimationFrame(callback) schedules callback to run at the
       start of the NEXT paint frame. The browser guarantees this runs
       at the right time — just before the screen refreshes.
       It passes a timestamp argument (we don't use it here). */
    requestAnimationFrame(updateWordOpacities);
  }
}


/* ----------------------------------------------------------------
   STEP 5: updateWordOpacities()

   The core math. Called by requestAnimationFrame — so it runs
   at most once per display refresh frame (60fps on most screens).

   HOW getBoundingClientRect() WORKS:
   ─────────────────────────────────
   rect = element.getBoundingClientRect()

   Returns a DOMRect object with properties:
     rect.top    → pixels from the viewport TOP EDGE to the element TOP
     rect.bottom → pixels from the viewport TOP EDGE to the element BOTTOM
     rect.left   → pixels from the viewport LEFT EDGE to the element LEFT
     rect.height → element's height in pixels

   KEY INSIGHT about rect.top:
     rect.top = 800  → element is 800px below the top of the viewport
                        (it's BELOW the fold — not yet visible)
     rect.top = 400  → element is 400px from the top (visible, midscreen)
     rect.top = 0    → element's top is exactly AT the viewport top edge
     rect.top = -100 → element's top is 100px ABOVE the viewport
                        (user has already scrolled PAST it)

   As the user scrolls DOWN:
     → rect.top DECREASES (element moves up toward the viewport top)

   THE ILLUMINATION ZONE:
   ──────────────────────
   We define two threshold values as fractions of viewport height (vh):

     ZONE_START = vh × 0.85   (85% down from viewport top — near bottom)
     ZONE_END   = vh × 0.25   (25% down from viewport top — comfortable read zone)

   A word begins illuminating when rect.top crosses ZONE_START (entering
   the bottom of the screen) and finishes when rect.top reaches ZONE_END
   (sitting in the comfortable upper reading area).

   PROGRESS FORMULA:
   ─────────────────
     rawProgress = (ZONE_START − rect.top) / (ZONE_START − ZONE_END)

   Let's verify with boundary values:

   When rect.top = ZONE_START (word just entering illumination zone):
     rawProgress = (ZONE_START − ZONE_START) / ZONE_SIZE = 0 / ZONE_SIZE = 0

   When rect.top = ZONE_END (word at comfortable reading position):
     rawProgress = (ZONE_START − ZONE_END) / ZONE_SIZE = ZONE_SIZE / ZONE_SIZE = 1

   When rect.top > ZONE_START (word below fold, not yet visible):
     numerator is negative → rawProgress < 0 → Math.max(0, ...) clamps to 0

   When rect.top < ZONE_END (word above reading zone, already read):
     numerator > ZONE_SIZE → rawProgress > 1 → Math.min(1, ...) clamps to 1

   OPACITY MAPPING (linear interpolation):
   ────────────────────────────────────────
     opacity = 0.25 + progress × 0.75

   progress = 0 → opacity = 0.25 + 0 × 0.75 = 0.25  (dim — word is below fold)
   progress = 1 → opacity = 0.25 + 1 × 0.75 = 1.00  (bright — word is being read)

   This is the standard lerp formula: lerp(a, b, t) = a + t × (b − a)
   Here: lerp(0.25, 1.0, t) = 0.25 + t × 0.75

   PERFORMANCE — avoiding layout thrashing:
   ─────────────────────────────────────────
   We separate all DOM READS from all DOM WRITES into two phases.
   Reading the DOM (getBoundingClientRect) and writing the DOM
   (style.opacity) in an interleaved loop forces the browser to
   recalculate layout after every write — this is "layout thrashing".

   Our approach:
     Phase 1: Read ALL rects → calculate ALL opacities → store in array.
     Phase 2: Write ALL opacities from the array.
   This way the browser only calculates layout ONCE per frame.
---------------------------------------------------------------- */
function updateWordOpacities() {
  const vh = window.innerHeight;  /* viewport height in CSS pixels */

  /* ── DEFINE THE ILLUMINATION ZONE ── */
  const ZONE_START = vh * 0.85;              /* 85% down — enter zone */
  const ZONE_END   = vh * 0.25;              /* 25% down — fully read  */
  const ZONE_SIZE  = ZONE_START - ZONE_END;  /* size of the transition band */

  /* ── PHASE 1: BATCH READ ── */
  /* Map each span to its computed opacity — NO DOM WRITES here. */
  const computed = wordSpans.map(span => {
    /* getBoundingClientRect() triggers a layout read.
       Doing all reads together (before any writes) means the browser
       only needs to compute layout ONCE for this entire batch. */
    const rect    = span.getBoundingClientRect();
    const wordTop = rect.top;  /* distance from viewport top to this word's top */

    /* Progress: 0 (below fold) → 1 (in reading zone) */
    const rawProgress = (ZONE_START - wordTop) / ZONE_SIZE;
    const progress    = Math.min(1, Math.max(0, rawProgress));  /* clamp [0, 1] */

    /* Lerp: 0.25 at progress=0, 1.0 at progress=1 */
    return (0.25 + progress * 0.75).toFixed(3);
    /* toFixed(3) rounds to 3 decimal places — enough precision,
       avoids floating-point noise like 0.9999999997 */
  });

  /* ── PHASE 2: BATCH WRITE ── */
  /* Apply all computed opacities. Because all reads are done,
     these writes don't trigger any additional layout calculations. */
  wordSpans.forEach((span, index) => {
    span.style.opacity = computed[index];
  });

  /* Reset the ticking flag so onScroll() can schedule the
     next rAF call when the user scrolls again. */
  ticking = false;
}


/* ================================================================
   PHASE 3 — CERTIFICATE LIGHTBOX MODAL
   Pure Vanilla ES6 implementation:
   - Full keyboard accessibility (focus trap, Escape to close)
   - Focus restoration to the triggering button upon dismissal
   - Backdrop click detection
   - Fallback frame if local certificate image is pending
================================================================ */

const certModal = document.getElementById('certificate-modal');
const certCloseBtn = document.querySelector('.cert-modal-close');
const modalImg = document.getElementById('modal-cert-img');
const modalFallback = document.getElementById('modal-cert-fallback');
const modalTitle = document.getElementById('modal-cert-title');
const modalSubtitle = document.getElementById('modal-cert-subtitle');
const certButtons = document.querySelectorAll('.cert-preview-btn');

let lastActiveTrigger = null;

if (certModal && certCloseBtn && modalImg && modalTitle && modalSubtitle) {

  /* Open Modal Function */
  function openCertModal(btn) {
    lastActiveTrigger = btn;

    const certSrc = btn.getAttribute('data-cert-src');
    const certTitle = btn.getAttribute('data-cert-title') || 'Certificate Preview';
    const certSubtitle = btn.getAttribute('data-cert-subtitle') || '';

    modalTitle.textContent = certTitle;
    modalSubtitle.textContent = certSubtitle;

    /* Reset image state */
    modalImg.classList.remove('is-loaded');
    if (modalFallback) {
      modalFallback.style.display = 'flex';
    }

    /* Test loading the certificate image */
    if (certSrc) {
      const tester = new Image();
      tester.onload = () => {
        modalImg.src = certSrc;
        modalImg.classList.add('is-loaded');
        if (modalFallback) {
          modalFallback.style.display = 'none';
        }
      };
      tester.onerror = () => {
        /* Keep fallback placeholder visible */
        modalImg.classList.remove('is-loaded');
        if (modalFallback) {
          modalFallback.style.display = 'flex';
        }
      };
      tester.src = certSrc;
    }

    /* Reveal modal dialog */
    certModal.setAttribute('aria-hidden', 'false');
    certModal.classList.add('is-active');
    document.body.style.overflow = 'hidden'; /* freeze body scroll */

    /* Move focus to close button for immediate keyboard accessibility */
    certCloseBtn.focus();
  }

  /* Close Modal Function */
  function closeCertModal() {
    if (!certModal.classList.contains('is-active')) return;

    certModal.setAttribute('aria-hidden', 'true');
    certModal.classList.remove('is-active');
    document.body.style.overflow = ''; /* restore body scroll */

    /* Restore focus to the button that triggered the modal */
    if (lastActiveTrigger) {
      lastActiveTrigger.focus();
      lastActiveTrigger = null;
    }
  }

  /* Attach click listeners to all certificate preview buttons */
  certButtons.forEach(btn => {
    btn.addEventListener('click', () => openCertModal(btn));
  });

  /* Close on close button click */
  certCloseBtn.addEventListener('click', closeCertModal);

  /* Close on backdrop click (clicking outside the modal card) */
  certModal.addEventListener('click', (event) => {
    if (event.target === certModal) {
      closeCertModal();
    }
  });

  /* Close on Escape key */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && certModal.classList.contains('is-active')) {
      closeCertModal();
    }
  });
}


/* ================================================================
   PHASE 4 — INTERACTIVE SKILLS PREVIEW PANEL & INTERSECTION OBSERVER
   Pure Vanilla ES6 implementation:
   - Data-driven dictionary for all 6 core competencies
   - Synchronized hover, focus, and keyboard activation
   - IntersectionObserver for scroll-driven active state transitions
================================================================ */

const skillsData = {
  'local-ai': {
    badge: 'AI / AGENTS',
    title: 'Local AI Agent Fine-Tuning',
    desc: 'Fine-tuning quantized open weights (Llama, Mistral, Qwen) directly on local GPU hardware. Eliminating cloud inference costs and third-party API dependencies while maintaining sovereign data control.',
    tags: [
      'LoRA / QLoRA parameter-efficient tuning',
      'Local tool & function calling loops',
      'Deterministic reasoning chains',
      'Zero cloud data leakage'
    ]
  },
  'ml-tf': {
    badge: 'MODEL TRAINING',
    title: 'Machine Learning & TensorFlow',
    desc: 'End-to-end model design using TensorFlow. Data normalization, custom training loops, validation checkpointing, and conversion to edge-optimized inference runtimes.',
    tags: [
      'TensorFlow model pipelines',
      'Supervised classification & regression',
      'Edge model quantization',
      'Cross-entropy loss optimization'
    ]
  },
  'gpu-compute': {
    badge: 'PARALLEL HARDWARE',
    title: 'GPU Computing Workflows',
    desc: 'Harnessing dedicated GPU hardware for accelerated batch matrix operations, gradient computation, and reduced latency model checkpoints.',
    tags: [
      'CUDA acceleration pipelines',
      'VRAM memory allocation tuning',
      'Batch tensor processing',
      'High-throughput parallel inference'
    ]
  },
  'vibe-coding': {
    badge: 'RAPID ITERATION',
    title: 'Full-Stack Vibe Coding',
    desc: 'Intuition-guided, high-velocity engineering leveraging AI pairing. Rapidly scaffolding complete user interfaces, validating prototypes, and eliminating mechanical coding overhead.',
    tags: [
      'High-speed proof-of-concept delivery',
      'First-principles prompt design',
      'Dynamic component iteration',
      'Continuous feedback loops'
    ]
  },
  'cognitive-reasoning': {
    badge: 'FIRST PRINCIPLES',
    title: 'Cognitive & Logical Reasoning',
    desc: 'Applying formal logical thinking and structured breakdown to complex domain problems. Isolating root causes before architecting code guarantees verified predictability.',
    tags: [
      'Root-cause problem decomposition',
      'Algorithmic state analysis',
      'Edge-case stress modeling',
      'Deterministic execution logic'
    ]
  },
  'vanilla-web': {
    badge: 'ZERO FRAMEWORKS',
    title: 'Vanilla Web Architecture',
    desc: 'Engineering responsive, accessible, 60fps web applications using exclusively standard HTML5, CSS3, and ES6 JavaScript. No framework overhead or third-party bundle rot.',
    tags: [
      'Pure ES6+ DOM manipulation',
      '12-column CSS Grid & clamp() scale',
      'WCAG 2.1 AA accessibility compliance',
      'Zero build-step runtime simplicity'
    ]
  }
};

const skillItems = document.querySelectorAll('.skill-item');
const previewPanel = document.getElementById('skill-preview-panel');
const previewBadge = document.getElementById('preview-badge');
const previewTitle = document.getElementById('preview-title');
const previewDesc = document.getElementById('preview-desc');
const previewTags = document.getElementById('preview-tags');

if (skillItems.length > 0 && previewPanel && previewBadge && previewTitle && previewDesc && previewTags) {

  /* Function to switch active skill and update right-hand preview */
  function setActiveSkill(skillId, sourceElement) {
    const data = skillsData[skillId];
    if (!data) return;

    /* Update .is-active and ARIA attributes across all items */
    skillItems.forEach(item => {
      const isActive = item === sourceElement;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-expanded', String(isActive));
    });

    /* Smoothly update the preview card text using opacity fade */
    previewPanel.style.opacity = '0.5';

    setTimeout(() => {
      previewBadge.textContent = data.badge;
      previewTitle.textContent = data.title;
      previewDesc.textContent = data.desc;

      /* Rebuild tags list */
      previewTags.innerHTML = data.tags
        .map(tag => `<li>${tag}</li>`)
        .join('');

      previewPanel.style.opacity = '1';
    }, 100);
  }

  /* User interaction: mouseover, focus, click, and keyboard activation */
  skillItems.forEach(item => {
    const skillId = item.getAttribute('data-skill-id');

    /* Hover */
    item.addEventListener('mouseover', () => {
      setActiveSkill(skillId, item);
    });

    /* Keyboard focus */
    item.addEventListener('focus', () => {
      setActiveSkill(skillId, item);
    });

    /* Click */
    item.addEventListener('click', () => {
      setActiveSkill(skillId, item);
    });

    /* Enter or Space key */
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveSkill(skillId, item);
      }
    });
  });

  /* IntersectionObserver: scroll-based activation when in viewport
     (bypassed if prefers-reduced-motion is true) */
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        /* When a skill item enters the central reading threshold */
        if (entry.isIntersecting) {
          const skillId = entry.target.getAttribute('data-skill-id');
          setActiveSkill(skillId, entry.target);
        }
      });
    }, {
      root: null,
      /* Focus on middle 40% band of screen */
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.6
    });

    skillItems.forEach(item => skillObserver.observe(item));
  }
}
