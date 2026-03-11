document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════
  //  CUSTOM CURSOR
  // ══════════════════════════════════════════
  const ring  = document.getElementById('cur-ring');
  const dot   = document.getElementById('cur-dot');
  const glow  = document.getElementById('cur-glow');

  let mx = 0, my = 0;     // actual mouse
  let rx = 0, ry = 0;     // ring (lagged)
  let glx = 0, gly = 0;   // glow (more lagged)
  let ticking = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // Dot follows instantly
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    if (!ticking) { ticking = true; requestAnimationFrame(tickCursor); }
  });

  function tickCursor() {
    // Ring — smooth lag
    rx  += (mx  - rx)  * 0.14;
    ry  += (my  - ry)  * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    // Glow — heavier lag
    glx += (mx  - glx) * 0.07;
    gly += (my  - gly) * 0.07;
    glow.style.left = glx + 'px';
    glow.style.top  = gly + 'px';

    ticking = false;
    requestAnimationFrame(tickCursor);
  }
  tickCursor();

  // Hover state on interactive elements
  const hoverable = 'a, button, .proj-card, .tl-card, .edu-row, .sk-chip, .int-item, .soc-btn, .ap-item, .yt-video-card';
  document.querySelectorAll(hoverable).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
  });

  // Click state
  document.addEventListener('mousedown', () => document.body.classList.add('c-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('c-click'));

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    ring.style.opacity = '0'; dot.style.opacity = '0'; glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    ring.style.opacity = '1'; dot.style.opacity = '1'; glow.style.opacity = '1';
  });

  // ══════════════════════════════════════════
  //  NAVBAR SCROLL
  // ══════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  // ══════════════════════════════════════════
  //  ACTIVE NAV LINK
  // ══════════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => secObs.observe(s));

  // ══════════════════════════════════════════
  //  HAMBURGER
  // ══════════════════════════════════════════
  const ham    = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.d-link').forEach(l => l.addEventListener('click', () => {
    ham.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }));

  // ══════════════════════════════════════════
  //  SCROLL REVEAL
  // ══════════════════════════════════════════
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -44px 0px' });

  document.querySelectorAll('.fade-up, .fade-right').forEach(el => revObs.observe(el));

  // Hero stagger on load
  const heroEls = document.querySelectorAll('.hero .fade-up, .hero .fade-right');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 120 + i * 100);
  });

  // ══════════════════════════════════════════
  //  ANIMATED COUNTERS
  // ══════════════════════════════════════════
  function countUp(el, to, suffix = '') {
    const isInf = (suffix === '∞');
    let start = null;
    const dur = 1600;
    (function step(ts) {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      el.textContent = isInf ? (p >= 1 ? '∞' : Math.floor(ease * 99)) : Math.floor(ease * to) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.s-item strong').forEach(el => {
          const t = el.textContent.trim();
          if      (t === '2+')  countUp(el, 2,  '+');
          else if (t === '3')   countUp(el, 3,  '');
          else if (t === '12+') countUp(el, 12, '+');
          else if (t === '∞')   countUp(el, 0,  '∞');
        });
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  const statsRow = document.querySelector('.stats-row');
  if (statsRow) statsObs.observe(statsRow);

  // ══════════════════════════════════════════
  //  PROJECT CARD 3D TILT
  // ══════════════════════════════════════════
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.28s ease, border-color 0.28s ease';
    });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'all 0.55s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform = '';
    });
  });

  // ══════════════════════════════════════════
  //  SKILL CHIPS STAGGER ON SCROLL
  // ══════════════════════════════════════════
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sk-chip').forEach((chip, i) => {
          chip.style.opacity   = '0';
          chip.style.transform = 'translateY(12px)';
          setTimeout(() => {
            chip.style.transition = 'opacity 0.45s ease, transform 0.45s ease, background 0.28s ease, color 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease';
            chip.style.opacity   = '1';
            chip.style.transform = 'translateY(0)';
          }, i * 60);
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  const skillsTable = document.querySelector('.skills-table');
  if (skillsTable) skillObs.observe(skillsTable);

  // ══════════════════════════════════════════
  //  TIMELINE CARDS STAGGER
  // ══════════════════════════════════════════
  const tlObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const cards = document.querySelectorAll('.tl-card');
        cards.forEach((c, i) => {
          setTimeout(() => c.classList.add('visible'), i * 120);
        });
        tlObs.disconnect();
      }
    });
  }, { threshold: 0.15 });
  const tl = document.querySelector('.timeline');
  if (tl) tlObs.observe(tl);

  // ══════════════════════════════════════════
  //  SMOOTH SCROLL
  // ══════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

});