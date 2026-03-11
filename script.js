document.addEventListener('DOMContentLoaded', () => {

  const isMobile = () => window.innerWidth <= 768 || 'ontouchstart' in window;

  /* ─────────────────────────────────────────
     CUSTOM CURSOR (desktop only)
  ───────────────────────────────────────── */
  const outer  = document.getElementById('cursor-outer');
  const dot    = document.getElementById('cursor-dot');
  const trail  = document.getElementById('cursor-trail');

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let outerX  = mouseX, outerY  = mouseY;
  let trailX  = mouseX, trailY  = mouseY;

  if (!isMobile() && outer) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    // Smooth cursor follow
    function rafCursor() {
      outerX += (mouseX - outerX) * 0.13;
      outerY += (mouseY - outerY) * 0.13;
      trailX += (mouseX - trailX) * 0.07;
      trailY += (mouseY - trailY) * 0.07;

      outer.style.left = outerX + 'px';
      outer.style.top  = outerY + 'px';
      trail.style.left = trailX + 'px';
      trail.style.top  = trailY + 'px';
      requestAnimationFrame(rafCursor);
    }
    rafCursor();

    // Hover state on interactive elements
    const hoverEls = document.querySelectorAll(
      'a, button, .proj-card, .sk-chip, .ap-item, .edu-row, .int-item, .soc-btn, .nav-btn, .tl-card'
    );
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
    });

    document.addEventListener('mousedown', () => document.body.classList.add('c-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('c-click'));

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => { outer.style.opacity = '0'; dot.style.opacity = '0'; trail.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { outer.style.opacity = '1'; dot.style.opacity = '1'; trail.style.opacity = '1'; });
  }

  /* ─────────────────────────────────────────
     NAVBAR SCROLL
  ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  /* ─────────────────────────────────────────
     ACTIVE NAV LINK
  ───────────────────────────────────────── */
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

  /* ─────────────────────────────────────────
     HAMBURGER / DRAWER
  ───────────────────────────────────────── */
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

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.fade-up, .fade-right').forEach(el => revObs.observe(el));

  // Hero fires on load
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .fade-up, .hero .fade-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 90);
    });
  });

  /* ─────────────────────────────────────────
     SMOOTH SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────
     ANIMATED COUNTERS
  ───────────────────────────────────────── */
  function countUp(el, to, suffix) {
    let start = null;
    const dur  = 1500;
    const step = ts => {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      if (suffix === '∞') el.textContent = p >= 1 ? '∞' : Math.floor(ease * 99);
      else el.textContent = Math.floor(ease * to) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.s-item strong').forEach(el => {
          const t = el.textContent.trim();
          if      (t === '2+')  countUp(el, 2, '+');
          else if (t === '3')   countUp(el, 3, '');
          else if (t === '12+') countUp(el, 12, '+');
          else if (t === '∞')   countUp(el, 99, '∞');
        });
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  const statsRow = document.querySelector('.stats-row');
  if (statsRow) statsObs.observe(statsRow);

  /* ─────────────────────────────────────────
     PROJECT CARD 3D TILT (desktop only)
  ───────────────────────────────────────── */
  if (!isMobile()) {
    document.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transition = 'transform 0.1s ease';
        card.style.transform  = `translateY(-6px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
        card.style.transform  = '';
      });
    });
  }

  /* ─────────────────────────────────────────
     SKILL CHIP STAGGER
  ───────────────────────────────────────── */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sk-chip').forEach((chip, i) => {
          chip.style.opacity   = '0';
          chip.style.transform = 'translateY(12px)';
          setTimeout(() => {
            chip.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            chip.style.opacity   = '1';
            chip.style.transform = 'translateY(0)';
          }, i * 55);
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  const skillsTable = document.querySelector('.skills-table');
  if (skillsTable) skillObs.observe(skillsTable);

  /* ─────────────────────────────────────────
     TEXT SCRAMBLE on hero name (fun detail)
  ───────────────────────────────────────── */
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  function scramble(el, finalText, duration = 700) {
    let frame = 0;
    const totalFrames = Math.floor(duration / 30);
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      el.textContent = finalText
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i / finalText.length < progress) return ch;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      if (frame >= totalFrames) {
        el.textContent = finalText;
        clearInterval(timer);
      }
    }, 30);
  }

  window.addEventListener('load', () => {
    const nameEl = document.querySelector('.hero-text h1 em');
    if (nameEl) {
      const original = nameEl.textContent;
      setTimeout(() => scramble(nameEl, original, 900), 400);
    }
  });

  /* ─────────────────────────────────────────
     PAGE FADE IN
  ───────────────────────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  }));

});