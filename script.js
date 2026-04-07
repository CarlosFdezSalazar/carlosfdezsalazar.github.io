/* =============================================
   PORTFOLIO — script.js
   Vanilla JS: nav scroll, hamburger, fade-in
   No dependencies — works on GitHub Pages
   ============================================= */

'use strict';

/* ── 1. Sticky Nav on Scroll ─────────────────
   Adds/removes .scrolled class on the <nav>
   which triggers the glassmorphism style
   defined in styles.css (.nav.scrolled)
──────────────────────────────────────────── */
(function initStickyNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled
})();


/* ── 2. Hamburger Menu ───────────────────────
   Toggles .open on both the button and the
   <ul> nav links list for mobile nav
──────────────────────────────────────────── */
(function initHamburger() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    links.classList.toggle('open', isOpen);
    // Prevent body scroll while menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when any nav link is clicked
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ── 3. Fade-up Scroll Animations ───────────
   Uses IntersectionObserver to add .visible
   to any element with class .fade-up when
   it enters the viewport.

   HOW TO USE IN YOUR HTML:
   Add class="fade-up" to any element you want
   to animate in. Stack delays with inline style:
     <p class="fade-up" style="transition-delay:.2s">
──────────────────────────────────────────── */
(function initFadeUp() {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  // Skip animations for users who prefer reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.12,  // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
})();


/* ── 4. Auto-animate section cards on scroll ─
   Finds .project-card, .link-card, .media-item
   and adds fade-up behaviour automatically.
   (Cards are not .fade-up by default in HTML
   so we progressively enhance them here.)
──────────────────────────────────────────── */
(function initCardAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cards = document.querySelectorAll(
    '.project-card, .link-card, .media-item, .stat'
  );

  if (!cards.length || prefersReduced) return;

  // Add fade-up class and stagger delays per card group
  cards.forEach((card, i) => {
    card.classList.add('fade-up');
    // Stagger within groups of 4
    const delay = (i % 4) * 80;
    card.style.transitionDelay = `${delay}ms`;
  });

  // Re-run the fade-up observer (picks up newly-added .fade-up elements)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  cards.forEach(card => observer.observe(card));
})();


/* ── 5. Active nav link highlighting ─────────
   Highlights the nav link matching the
   current visible section as you scroll.
──────────────────────────────────────────── */
(function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a');
  if (!sections.length || !navLinks.length) return;

  function setActiveLink() {
    let currentId = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';  // reset
      if (link.getAttribute('href') === `#${currentId}`) {
        link.style.color = 'var(--accent)';
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();
})();


/* ── 6. Smooth scroll polyfill for older Safari
   (modern browsers support scroll-behavior: smooth
   in CSS natively, but this catches edge cases)
──────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update URL hash without jumping
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  });
})();


/* ── 7. Current year in footer copyright ─────
   Keeps the footer date always current.
   Usage in HTML: <span id="year"></span>
   (optional — currently using hardcoded year)
──────────────────────────────────────────── */
(function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();


/* =============================================
   HOW TO ADD A NEW PROJECT
   ──────────────────────────────────────────
   In index.html, inside .projects__grid,
   copy and paste this block:

   <article class="project-card">
     <div class="project-card__header">
       <span class="project-card__number">05</span>
       <div class="project-card__links">
         <a href="YOUR_GITHUB_LINK" target="_blank" rel="noopener">
           <i class="fa-brands fa-github"></i>
         </a>
       </div>
     </div>
     <h3 class="project-card__title">Project Title</h3>
     <p class="project-card__desc">Short description of the project.</p>
     <div class="project-card__tech">
       <span class="pill pill--sm">Tech 1</span>
       <span class="pill pill--sm">Tech 2</span>
     </div>
   </article>

   ──────────────────────────────────────────
   HOW TO ADD A YOUTUBE VIDEO TO A PROJECT
   ──────────────────────────────────────────
   Inside the <article> block, add:

   <div class="project-card__video">
     <iframe
       src="https://www.youtube-nocookie.com/embed/YOUR_VIDEO_ID"
       title="Demo"
       allowfullscreen
       loading="lazy">
     </iframe>
   </div>

   ──────────────────────────────────────────
   HOW TO ADD A DOWNLOADABLE PDF
   ──────────────────────────────────────────
   Place the PDF file in a /docs/ folder in
   your repo root, then inside the <article>:

   <a href="docs/myfile.pdf" download class="project-card__pdf">
     <i class="fa-solid fa-file-pdf"></i> Download Docs
   </a>

   ──────────────────────────────────────────
   GITHUB PAGES DEPLOYMENT STEPS
   ──────────────────────────────────────────
   1. Push all files (index.html, styles.css,
      script.js, /docs/, cover-letter.pdf) to
      a GitHub repository.
   2. Go to Settings → Pages.
   3. Set Source to "Deploy from a branch".
   4. Select branch: main, folder: / (root).
   5. Click Save — your site will be live at
      https://yourusername.github.io/reponame/
   ============================================= */
