document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR SCROLL SHADOW ─────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // ── ACTIVE NAV LINK ───────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── HAMBURGER ────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.d-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── SCROLL REVEAL ─────────────────────────────
  const revealEls = document.querySelectorAll('.fade-up, .fade-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Trigger hero elements immediately on load
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .fade-up, .hero .fade-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 80);
    });
  });

  // ── SMOOTH SCROLL ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── SKILL CHIP HOVER STAGGER ──────────────────
  document.querySelectorAll('.sk-chips').forEach(row => {
    row.querySelectorAll('.sk-chip').forEach((chip, i) => {
      chip.style.transitionDelay = `${i * 0.03}s`;
    });
  });

  // ── PROJECT CARD SUBTLE TILT ─────────────────
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});