document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL ────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  // ── ACTIVE NAV LINK ───────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => sectionObs.observe(s));

  // ── HAMBURGER ────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer    = document.getElementById('drawer');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.d-link').forEach(l => l.addEventListener('click', () => {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }));

  // ── SCROLL REVEAL ─────────────────────────────
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.fade-up, .fade-right').forEach(el => revealObs.observe(el));

  // Hero fires on load
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .fade-up, .hero .fade-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 90);
    });
  });

  // ── SMOOTH SCROLL ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
      }
    });
  });

  // ── ANIMATED COUNTERS ─────────────────────────
  function countUp(el, to, suffix) {
    let start = null;
    const dur = 1400;
    const isInf = suffix === '∞';
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      if (isInf) { el.textContent = p >= 1 ? '∞' : Math.floor(ease * 999); }
      else el.textContent = Math.floor(ease * to) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.s-item strong').forEach(el => {
          const txt = el.textContent.trim();
          if (txt === '2+')   countUp(el, 2, '+');
          else if (txt === '3') countUp(el, 3, '');
          else if (txt === '12+') countUp(el, 12, '+');
          else if (txt === '∞')   countUp(el, 999, '∞');
        });
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  const statsRow = document.querySelector('.stats-row');
  if (statsRow) statsObs.observe(statsRow);

  // ── PROJECT CARD 3D TILT ─────────────────────
  document.querySelectorAll('.proj-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.perspective = '800px';
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.55s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform = '';
      setTimeout(() => card.style.transition = '', 550);
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.12s ease';
    });
  });

  // ── SKILL CHIP STAGGER REVEAL ─────────────────
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sk-chip').forEach((chip, i) => {
          chip.style.opacity = '0';
          chip.style.transform = 'translateY(10px)';
          setTimeout(() => {
            chip.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            chip.style.opacity = '1';
            chip.style.transform = 'translateY(0)';
          }, i * 55);
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  const skillsTable = document.querySelector('.skills-table');
  if (skillsTable) skillObs.observe(skillsTable);

  // ── FLOATING CARDS PARALLAX ───────────────────
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.float-card').forEach((card, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      card.style.transform = `translateY(${dir * y * 0.04}px)`;
    });
  }, { passive: true });

  // ── SMOOTH PAGE ENTRY ─────────────────────────
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.45s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });
});