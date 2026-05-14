/**
 * =========================================================
 *  SHRIPRABHU — AI ENGINEER PORTFOLIO
 *  script.js — All Interactions, Animations & Effects
 * =========================================================
 */

/* =========================================================
   1. CUSTOM CURSOR
   ========================================================= */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let raf;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower with lerp
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effects on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .skill-pill, .project-card, .social-icon, .card-btn, .nav-link'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });

  // Hide on mobile
  if ('ontouchstart' in window) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
  }
})();


/* =========================================================
   2. PARTICLE CANVAS
   ========================================================= */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W, H;

  // Resize canvas to full window
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle constructor
  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.size = Math.random() * 1.8 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    // Color: mix blue, purple, cyan
    const colors = ['59,130,246', '139,92,246', '6,182,212', '167,139,250'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  };
  Particle.prototype.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
      this.reset();
      this.x = Math.random() * W;
      this.y = Math.random() * H;
    }
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
    ctx.fill();
  };

  // Create particles
  const COUNT = Math.min(120, Math.floor((W * H) / 10000));
  for (let i = 0; i < COUNT; i++) {
    particles.push(new Particle());
  }

  // Draw connecting lines between nearby particles
  function drawConnections() {
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(96,165,250,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();


/* =========================================================
   3. NAVBAR — Scroll Effect & Active Link
   ========================================================= */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Add scrolled class
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sTop = section.offsetTop - 100;
      if (window.scrollY >= sTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* =========================================================
   4. MOBILE HAMBURGER MENU
   ========================================================= */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    drawer.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* =========================================================
   5. TYPING ANIMATION
   ========================================================= */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'Generative AI Engineer',
    'AI Developer',
    'Prompt Engineer',
    'Agentic AI Enthusiast',
    'LLM Builder'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let pause = false;

  const TYPE_SPEED   = 70;   // ms per char when typing
  const DELETE_SPEED = 40;   // ms per char when deleting
  const PAUSE_AFTER  = 1800; // ms to pause after full phrase
  const PAUSE_BEFORE = 300;  // ms to pause before typing

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (pause) {
      pause = false;
      setTimeout(type, isDeleting ? PAUSE_BEFORE : PAUSE_AFTER);
      return;
    }

    if (!isDeleting) {
      // Typing forward
      el.textContent = currentPhrase.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentPhrase.length) {
        // Finished typing — pause then delete
        isDeleting = true;
        pause = true;
        setTimeout(type, PAUSE_AFTER);
        return;
      }
      setTimeout(type, TYPE_SPEED);
    } else {
      // Deleting backward
      el.textContent = currentPhrase.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        // Finished deleting — move to next phrase
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pause = true;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
      setTimeout(type, DELETE_SPEED);
    }
  }

  // Start typing after hero animation
  setTimeout(type, 1000);
})();


/* =========================================================
   6. SCROLL REVEAL ANIMATION (custom data-aos)
   ========================================================= */
(function initScrollReveal() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
        // Unobserve after animation fires to save resources
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


/* =========================================================
   7. SKILL PILLS — Staggered Entrance
   ========================================================= */
(function initSkillStagger() {
  const groups = document.querySelectorAll('.skills-pills');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const pills = entry.target.querySelectorAll('.skill-pill');
        pills.forEach((pill, i) => {
          pill.style.opacity = '0';
          pill.style.transform = 'translateY(16px)';
          setTimeout(() => {
            pill.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.3s, box-shadow 0.3s, color 0.3s, background 0.3s';
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0)';
          }, i * 55);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  groups.forEach(g => {
    // Hide all pills initially
    g.querySelectorAll('.skill-pill').forEach(p => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(16px)';
    });
    observer.observe(g);
  });
})();


/* =========================================================
   8. PROJECT CARDS — Staggered Entrance
   ========================================================= */
(function initProjectStagger() {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.4s, box-shadow 0.4s';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 120);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(grid);
})();


/* =========================================================
   9. CONTACT FORM
   ========================================================= */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successMsg = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      // Shake validation
      [form.querySelector('#name'), form.querySelector('#email'), form.querySelector('#message')]
        .forEach(field => {
          if (!field.value.trim()) {
            field.parentElement.style.animation = 'shake 0.4s ease';
            setTimeout(() => field.parentElement.style.animation = '', 400);
            field.style.borderColor = 'rgba(239,68,68,0.6)';
            setTimeout(() => field.style.borderColor = '', 1500);
          }
        });
      return;
    }

    // Show loading state
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';
    submitBtn.disabled = true;

    // Simulate sending (replace with real API call)
    setTimeout(() => {
      btnText.style.display = 'flex';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
      successMsg.style.display = 'flex';
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);
    }, 1800);
  });
})();

// CSS shake keyframes injected via JS
(function injectShakeKeyframes() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
  `;
  document.head.appendChild(style);
})();


/* =========================================================
   10. BACK TO TOP BUTTON
   ========================================================= */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* =========================================================
   11. SMOOTH SCROLL for all anchor links
   ========================================================= */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* =========================================================
   12. HERO ENTRANCE ANIMATION
   ========================================================= */
(function heroEntrance() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  heroContent.style.opacity = '0';
  heroContent.style.transform = 'translateY(40px)';

  requestAnimationFrame(() => {
    setTimeout(() => {
      heroContent.style.transition = 'opacity 1s cubic-bezier(0.25,0.46,0.45,0.94), transform 1s cubic-bezier(0.25,0.46,0.45,0.94)';
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 200);
  });
})();


/* =========================================================
   13. DYNAMIC STATS COUNTER (About Section)
   ========================================================= */
(function initCounterAnimation() {
  // Optional: if you add counter elements later
  // Example: elements with data-count attribute
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      let current = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + (el.getAttribute('data-suffix') || '');
        if (current >= target) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* =========================================================
   14. GLOWING CARD MOUSE TRACKING
   ========================================================= */
(function initCardMouseGlow() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
})();


/* =========================================================
   15. ACTIVE SECTION HIGHLIGHT IN NAV (Live indicator)
   ========================================================= */
(function initNavIndicator() {
  const logo = document.querySelector('.nav-logo');
  if (!logo) return;

  // Subtle glow pulse on scroll start
  let scrollTimer;
  window.addEventListener('scroll', () => {
    logo.style.textShadow = '0 0 20px rgba(59,130,246,0.4)';
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      logo.style.textShadow = '';
    }, 400);
  }, { passive: true });
})();


/* =========================================================
   16. FOOTER YEAR UPDATE
   ========================================================= */
(function updateYear() {
  const yearEls = document.querySelectorAll('.footer-text');
  const year = new Date().getFullYear();
  yearEls.forEach(el => {
    el.innerHTML = el.innerHTML.replace(/\d{4}/, year);
  });
})();


/* =========================================================
   LOG — Portfolio Loaded
   ========================================================= */
console.log('%c🚀 Shriprabhu | AI Engineer Portfolio Loaded', 
  'color: #60a5fa; font-size: 14px; font-weight: bold; font-family: monospace;'
);
console.log('%cBuilt with HTML, CSS & JavaScript | No frameworks', 
  'color: #a78bfa; font-size: 11px; font-family: monospace;'
);
