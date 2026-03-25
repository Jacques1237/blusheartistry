/* =====================================================
   BLUSHE ARTISTRY — SCRIPT
   ===================================================== */

/* =====================================================
   POWDER EXPLOSION CANVAS
   ===================================================== */
(function initPowderCanvas() {
  const canvas = document.getElementById('powderCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  /* Colour palette — rosy pinks, rose gold, champagne, white */
  const COLORS = [
    '#f9c9d8', '#f4849d', '#e8507a', '#ff8fab',
    '#c9956f', '#d4a855', '#f5e6d0', '#e8c9a0',
    '#ffe4ec', '#ffd6e7', '#ffffff',  '#ffb3c6',
    '#f2a7c0', '#fce4ec', '#eca8be',
  ];

  class Particle {
    constructor(x, y, type) {
      this.x    = x;
      this.y    = y;
      this.type = type; // 'burst' | 'drift'
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.rotation  = Math.random() * Math.PI * 2;
      this.rotSpeed  = (Math.random() - 0.5) * 0.04;
      this.alive     = true;

      if (type === 'burst') {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 14 + 3;
        this.vx      = Math.cos(angle) * speed;
        this.vy      = Math.sin(angle) * speed - 5; // bias upward
        this.size    = Math.random() * 14 + 4;
        this.alpha   = Math.random() * 0.6 + 0.35;
        this.decay   = Math.random() * 0.007 + 0.003;
        this.gravity = 0.09;
      } else {
        /* ambient drift — small specks floating upward */
        this.vx      = (Math.random() - 0.5) * 0.7;
        this.vy      = -(Math.random() * 0.7 + 0.2);
        this.size    = Math.random() * 3.5 + 0.8;
        this.alpha   = Math.random() * 0.35 + 0.05;
        this.decay   = 0.0018;
        this.gravity = 0;
      }
    }

    update() {
      this.x        += this.vx;
      this.y        += this.vy;
      this.vy       += this.gravity;
      this.vx       *= 0.992;
      this.alpha    -= this.decay;
      this.rotation += this.rotSpeed;
      if (this.alpha <= 0) this.alive = false;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      /* Soft radial gradient — powder-puff look */
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      g.addColorStop(0,   this.color);
      g.addColorStop(0.5, this.color + '99');
      g.addColorStop(1,   'transparent');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let particles = [];

  /* ---- Burst helpers ---- */
  function burst(cx, cy, count) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(cx, cy, 'burst'));
    }
  }

  function spawnAmbient() {
    const ambientCount = particles.filter(p => p.type === 'drift').length;
    if (ambientCount < 80) {
      const x = Math.random() * canvas.width;
      particles.push(new Particle(x, canvas.height + 10, 'drift'));
    }
  }

  /* ---- Initial triple-wave explosion ---- */
  function launchExplosion() {
    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;

    /* Wave 1 — main burst */
    burst(cx, cy, 360);

    /* Wave 2 — scattered secondary burst */
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        const ox = (Math.random() - 0.5) * 260;
        const oy = (Math.random() - 0.5) * 160;
        burst(cx + ox, cy + oy, 50);
      }
    }, 380);

    /* Wave 3 — soft finishing cloud */
    setTimeout(() => burst(cx, cy, 120), 750);
  }

  /* ---- Periodic mini-bursts to keep hero alive ---- */
  function periodicBurst() {
    const cx = canvas.width;
    const cy = canvas.height;
    const x  = Math.random() * cx;
    const y  = Math.random() * cy * 0.7;
    burst(x, y, 55);
    setTimeout(periodicBurst, 5000 + Math.random() * 4000);
  }

  /* ---- Render loop ---- */
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.45) spawnAmbient();

    particles = particles.filter(p => p.alive);
    particles.forEach(p => { p.update(); p.draw(ctx); });

    requestAnimationFrame(render);
  }

  /* Expose for preloader to call */
  window.launchExplosion = launchExplosion;
  window.periodicBurst   = periodicBurst;

  /* Start render loop immediately — preloader controls when explosion fires */
  render();
})();


/* =====================================================
   GLOBAL CANVAS — SECTION BURST PARTICLES
   ===================================================== */
(function initGlobalCanvas() {
  const canvas = document.getElementById('globalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const SOFT_COLORS = [
    '#fce4ec', '#f9c9d8', '#ffffff', '#f5e6d0',
    '#ffe4ec', '#ffd6e7', '#e8c9a0', '#f2a7c0',
  ];

  class GlobalParticle {
    constructor(x, y) {
      this.x         = x;
      this.y         = y;
      this.color     = SOFT_COLORS[Math.floor(Math.random() * SOFT_COLORS.length)];
      this.rotation  = Math.random() * Math.PI * 2;
      this.rotSpeed  = (Math.random() - 0.5) * 0.05;
      this.alive     = true;

      const angle  = Math.random() * Math.PI * 2;
      const speed  = Math.random() * 5 + 1.5;
      this.vx      = Math.cos(angle) * speed;
      this.vy      = Math.sin(angle) * speed - 3;
      this.size    = Math.random() * 6 + 2;
      this.alpha   = Math.random() * 0.55 + 0.2;
      this.decay   = Math.random() * 0.012 + 0.006;
      this.gravity = 0.05;
    }

    update() {
      this.x        += this.vx;
      this.y        += this.vy;
      this.vy       += this.gravity;
      this.vx       *= 0.993;
      this.alpha    -= this.decay;
      this.rotation += this.rotSpeed;
      if (this.alpha <= 0) this.alive = false;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
      g.addColorStop(0,   this.color);
      g.addColorStop(0.5, this.color + '88');
      g.addColorStop(1,   'transparent');

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  let gParticles = [];

  function sectionBurst(x, y, count) {
    for (let i = 0; i < count; i++) {
      gParticles.push(new GlobalParticle(x, y));
    }
  }

  function renderGlobal() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gParticles = gParticles.filter(p => p.alive);
    gParticles.forEach(p => { p.update(); p.draw(ctx); });
    requestAnimationFrame(renderGlobal);
  }

  window.sectionBurst = sectionBurst;
  renderGlobal();
})();


/* =====================================================
   DOM READY
   ===================================================== */
/* Always reset to GET state on load — prevents browser resubmission warning */
history.replaceState(null, document.title, location.pathname + location.search);

document.addEventListener('DOMContentLoaded', function () {

  /* =====================================================
     FEATURE 1: PRELOADER
     ===================================================== */
  const preloader = document.getElementById('preloader');
  const startTime = Date.now();
  const MIN_DISPLAY = 1800;

  window.addEventListener('load', function () {
    const elapsed  = Date.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY - elapsed);

    setTimeout(function () {
      preloader.classList.add('fade-out');

      preloader.addEventListener('transitionend', function handler() {
        preloader.removeEventListener('transitionend', handler);
        preloader.style.display = 'none';
        document.body.classList.remove('preloading');

        /* Trigger the powder explosion now that preloader is gone */
        if (typeof window.launchExplosion === 'function') {
          window.launchExplosion();
        }
        setTimeout(function () {
          if (typeof window.periodicBurst === 'function') {
            window.periodicBurst();
          }
        }, 6000);
      });
    }, remaining);
  });


  /* ---- Video loop fallback ---- */
  const bgVideo = document.getElementById('bgVideo');
  if (bgVideo) {
    bgVideo.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    });
  }

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav ul li a');

  function activateNavLink() {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const top    = section.offsetTop - 100;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', activateNavLink, { passive: true });

  /* ---- About section scroll-in ---- */
  const aboutSection = document.querySelector('#about');
  function checkAboutInView() {
    if (!aboutSection) return;
    if (aboutSection.getBoundingClientRect().top < window.innerHeight * 0.8) {
      aboutSection.classList.add('active');
      window.removeEventListener('scroll', checkAboutInView);
    }
  }
  window.addEventListener('scroll', checkAboutInView, { passive: true });
  checkAboutInView();

  /* ---- IntersectionObserver for .reveal elements ---- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- Burger menu ---- */
  const burger  = document.getElementById('burger');
  const navMenu = document.getElementById('nav-menu');

  burger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    burger.classList.toggle('open');
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      burger.classList.remove('open');
    });
  });

  /* ---- Lightbox — updated to use masonry items ---- */
  const galleryImages = document.querySelectorAll('.masonry-item img');
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = lightbox.querySelector('img');
  const leftArrow     = lightbox.querySelector('.lightbox-arrow.left');
  const rightArrow    = lightbox.querySelector('.lightbox-arrow.right');
  let currentIndex    = 0;

  function showImage(index, direction) {
    direction = direction || 0;
    const total    = galleryImages.length;
    const newIndex = (index + total) % total;
    if (direction !== 0) {
      lightboxImg.classList.remove('slide-in-left', 'slide-in-right');
      lightboxImg.classList.add(direction === -1 ? 'slide-out-left' : 'slide-out-right');
      setTimeout(() => {
        lightboxImg.classList.remove('slide-out-left', 'slide-out-right');
        lightboxImg.src = galleryImages[newIndex].src;
        lightboxImg.classList.add(direction === -1 ? 'slide-in-right' : 'slide-in-left');
        setTimeout(() => lightboxImg.classList.remove('slide-in-left', 'slide-in-right'), 10);
      }, 300);
    } else {
      lightboxImg.src = galleryImages[newIndex].src;
    }
    currentIndex = newIndex;
  }

  galleryImages.forEach(function(img, idx) {
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      showImage(idx);
      lightbox.classList.remove('hidden');
    });
  });

  /* Also allow clicking the masonry-item div itself */
  document.querySelectorAll('.masonry-item').forEach(function(item, idx) {
    item.addEventListener('click', function(e) {
      if (e.target.tagName === 'IMG') return; // already handled above
      showImage(idx);
      lightbox.classList.remove('hidden');
    });
  });

  leftArrow.addEventListener('click',  function(e) { e.stopPropagation(); showImage(currentIndex - 1, -1); });
  rightArrow.addEventListener('click', function(e) { e.stopPropagation(); showImage(currentIndex + 1,  1); });

  /* ---- Gallery expand / collapse ---- */
  const galleryToggle = document.getElementById('galleryToggle');
  const masonryGrid   = document.querySelector('.masonry-grid');
  const toggleText    = galleryToggle && galleryToggle.querySelector('.gallery-toggle-text');

  if (galleryToggle && masonryGrid) {
    galleryToggle.addEventListener('click', function () {
      const isExpanded = masonryGrid.classList.toggle('expanded');
      galleryToggle.classList.toggle('open', isExpanded);
      toggleText.textContent = isExpanded ? 'Show Less' : 'View All 16 Photos';

      /* Scroll back up to grid top when collapsing */
      if (!isExpanded) {
        document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
  lightbox.addEventListener('click', function() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  });

  /* Keyboard navigation for lightbox */
  document.addEventListener('keydown', function(e) {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft')  showImage(currentIndex - 1, -1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1,  1);
    if (e.key === 'Escape') { lightbox.classList.add('hidden'); lightboxImg.src = ''; }
  });

  /* ---- Hide / show navbar on scroll ---- */
  let lastScrollTop = 0;
  const navbar      = document.querySelector('nav');

  window.addEventListener('scroll', function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 80) {
      navbar.style.transform = 'translateY(-120px)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }, { passive: true });

  /* ---- Cursor sparkle trail ---- */
  const SPARKLE_COLORS = [
    '#f9c9d8', '#e8507a', '#d4a855',
    '#f5e6d0', '#ff8fab', '#ffffff',
  ];

  let lastSparkleTime = 0;

  window.addEventListener('mousemove', function (e) {
    const now = Date.now();
    if (now - lastSparkleTime < 40) return; // throttle
    lastSparkleTime = now;

    const count = 3;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('div');
      dot.classList.add('cursor-sparkle');

      const size  = Math.random() * 7 + 3;
      const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      const tx    = (Math.random() - 0.5) * 40;
      const ty    = (Math.random() - 0.5) * 40 - 15;
      const delay = Math.random() * 0.15;

      dot.style.cssText = `
        left: ${e.clientX}px;
        top:  ${e.clientY}px;
        width:  ${size}px;
        height: ${size}px;
        background: ${color};
        box-shadow: 0 0 ${size * 2}px ${color};
        --tx: ${tx}px;
        --ty: ${ty}px;
        animation-delay: ${delay}s;
        transform: translate(-50%, -50%);
      `;

      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 900);
    }
  }, { passive: true });


  /* =====================================================
     FEATURE 5: STATS COUNT-UP
     ===================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  const STATS_DURATION = 2000;

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function animateStat(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const start  = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / STATS_DURATION, 1);
      const eased    = easeOutQuad(progress);
      const current  = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(function(el) {
      statsObserver.observe(el);
    });
  } else {
    statNumbers.forEach(animateStat);
  }


  /* =====================================================
     FEATURE 2: BEFORE / AFTER SLIDER
     ===================================================== */
  const baContainer = document.getElementById('baContainer');
  const baBefore    = document.getElementById('baBefore');
  const baHandle    = document.getElementById('baHandle');

  if (baContainer && baBefore && baHandle) {
    let isDragging = false;

    function setPosition(clientX) {
      const rect = baContainer.getBoundingClientRect();
      let pos = ((clientX - rect.left) / rect.width) * 100;
      pos = Math.max(2, Math.min(98, pos));

      baBefore.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
      baHandle.style.left     = pos + '%';
    }

    /* Mouse events */
    baContainer.addEventListener('mousedown', function(e) {
      isDragging = true;
      setPosition(e.clientX);
      e.preventDefault();
    });

    window.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      setPosition(e.clientX);
    });

    window.addEventListener('mouseup', function() {
      isDragging = false;
    });

    /* Touch events */
    baContainer.addEventListener('touchstart', function(e) {
      isDragging = true;
      setPosition(e.touches[0].clientX);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', function() {
      isDragging = false;
    });
  }


  /* =====================================================
     FEATURE 3: TESTIMONIALS CAROUSEL
     ===================================================== */
  const testiTrack   = document.getElementById('testiTrack');
  const testiPrev    = document.getElementById('testiPrev');
  const testiNext    = document.getElementById('testiNext');
  const testiDotsEl  = document.getElementById('testiDots');
  const testiSection = document.getElementById('testimonials');

  if (testiTrack) {
    const testiCards    = testiTrack.querySelectorAll('.testi-card');
    const testiDotBtns  = testiDotsEl ? testiDotsEl.querySelectorAll('.testi-dot') : [];
    const TESTI_TOTAL   = testiCards.length;
    let   testiIndex    = 0;
    let   testiInterval = null;

    function goToTesti(index) {
      testiIndex = (index + TESTI_TOTAL) % TESTI_TOTAL;
      testiTrack.style.transform = `translateX(-${testiIndex * 100}%)`;

      testiDotBtns.forEach(function(dot, i) {
        dot.classList.toggle('active', i === testiIndex);
      });
    }

    function startTestiInterval() {
      testiInterval = setInterval(function() {
        goToTesti(testiIndex + 1);
      }, 4500);
    }

    function stopTestiInterval() {
      clearInterval(testiInterval);
    }

    testiPrev && testiPrev.addEventListener('click', function() {
      stopTestiInterval();
      goToTesti(testiIndex - 1);
      startTestiInterval();
    });

    testiNext && testiNext.addEventListener('click', function() {
      stopTestiInterval();
      goToTesti(testiIndex + 1);
      startTestiInterval();
    });

    testiDotBtns.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        stopTestiInterval();
        goToTesti(i);
        startTestiInterval();
      });
    });

    /* Pause on hover */
    if (testiSection) {
      testiSection.addEventListener('mouseenter', stopTestiInterval);
      testiSection.addEventListener('mouseleave', startTestiInterval);
    }

    /* Touch swipe */
    let testiTouchStartX = 0;
    testiTrack.addEventListener('touchstart', function(e) {
      testiTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    testiTrack.addEventListener('touchend', function(e) {
      const diff = testiTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        stopTestiInterval();
        goToTesti(diff > 0 ? testiIndex + 1 : testiIndex - 1);
        startTestiInterval();
      }
    }, { passive: true });

    goToTesti(0);
    startTestiInterval();
  }


  /* ---- Flatpickr date picker with custom year dropdown ---- */
  if (typeof flatpickr !== 'undefined') {
    function buildYearSelect(fp) {
      const wrapper = fp.calendarContainer.querySelector('.numInputWrapper');
      if (!wrapper || wrapper.dataset.replaced) return;
      wrapper.dataset.replaced = 'true';

      const curYear = new Date().getFullYear();
      const sel = document.createElement('select');
      sel.className = 'flatpickr-year-select';
      for (let y = curYear; y <= curYear + 5; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        if (y === fp.currentYear) opt.selected = true;
        sel.appendChild(opt);
      }
      sel.addEventListener('change', function () {
        fp.changeYear(parseInt(this.value));
      });

      wrapper.style.display = 'none';
      wrapper.parentNode.insertBefore(sel, wrapper.nextSibling);
    }

    function syncYearSelect(fp) {
      const sel = fp.calendarContainer.querySelector('.flatpickr-year-select');
      if (sel) sel.value = fp.currentYear;
    }

    flatpickr('#bookDate', {
      minDate: 'today',
      dateFormat: 'Y-m-d',
      disableMobile: false,
      onReady(_, __, fp)       { buildYearSelect(fp); },
      onMonthChange(_, __, fp) { syncYearSelect(fp); },
      onYearChange(_, __, fp)  { syncYearSelect(fp); },
    });
  }

  /* ---- Booking form — AJAX submission to Formspree ---- */
  const bookingForm   = document.getElementById('bookingForm');
  const bookingCard   = bookingForm && bookingForm.closest('.booking-card');
  const bookingSubmit = document.getElementById('bookingSubmit');
  const bookingError  = document.getElementById('bookingError');
  const replyToField  = document.getElementById('replyToField');
  const emailInput    = document.getElementById('bookEmail');

  /* Keep hidden _replyto in sync with the email field */
  if (emailInput && replyToField) {
    emailInput.addEventListener('input', function () {
      replyToField.value = emailInput.value;
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      bookingSubmit.disabled = true;
      bookingSubmit.textContent = 'Sending…';
      bookingError.classList.remove('visible');

      try {
        const response = await fetch(bookingForm.action, {
          method: 'POST',
          body: new FormData(bookingForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          /* Clear POST from browser history so reload won't trigger resubmission warning */
          history.replaceState(null, document.title, location.pathname + location.search);
          /* Replace form with success message */
          bookingCard.innerHTML = `
            <div class="booking-success">
              <div class="booking-success-icon"><i class="fa-solid fa-check"></i></div>
              <h3>Enquiry Sent!</h3>
              <p>Thank you — Zoané will be in touch with you shortly.<br>Can't wait to be part of your beauty journey.</p>
            </div>`;
        } else {
          throw new Error('Server error');
        }
      } catch (err) {
        bookingSubmit.disabled = false;
        bookingSubmit.textContent = 'Send Enquiry';
        bookingError.classList.add('visible');
      }
    });
  }

  /* =====================================================
     FEATURE 6: FAQ ACCORDION
     ===================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  function openFaq(item) {
    item.classList.add('open');
    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', 'true');
  }

  function closeFaq(item) {
    item.classList.remove('open');
    const btn = item.querySelector('.faq-question');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  faqItems.forEach(function(item) {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', function() {
        const isOpen = item.classList.contains('open');

        /* Close all */
        faqItems.forEach(closeFaq);

        /* Open clicked one if it was closed */
        if (!isOpen) {
          openFaq(item);
        }
      });
    }
  });

  /* Open first FAQ item by default */
  if (faqItems.length > 0) {
    openFaq(faqItems[0]);
  }


  /* =====================================================
     FEATURE 8: FLOATING BOOK NOW CTA
     ===================================================== */
  const floatBook = document.getElementById('floatBook');

  if (floatBook) {
    function updateFloatBook() {
      const threshold = window.innerHeight * 0.7;
      if (window.scrollY > threshold) {
        floatBook.classList.add('visible');
      } else {
        floatBook.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', updateFloatBook, { passive: true });
    updateFloatBook();
  }

  /* ---- Back to top ---- */
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > window.innerHeight * 0.5) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* =====================================================
     FEATURE 9: SECTION TRANSITION POWDER BURSTS
     ===================================================== */
  const burstSections = document.querySelectorAll(
    '#services, #before-after, #testimonials, #portfolio, #booking'
  );

  if ('IntersectionObserver' in window && typeof window.sectionBurst === 'function') {
    const sectionBurstObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const centerX = window.innerWidth  / 2;
          const entryY  = Math.random() * (window.innerHeight * 0.4);
          window.sectionBurst(centerX, entryY, 50);
          sectionBurstObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    burstSections.forEach(function(sec) {
      sectionBurstObserver.observe(sec);
    });
  }

});
