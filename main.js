/**
 * CHARMU PRIME VENTURES — MAIN.JS
 * Handles: navbar scroll, mobile menu, scroll animations,
 *          counter animation, testimonials slider,
 *          portfolio filter, contact form, scroll-to-top
 */

/* ─── DOM READY ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR SCROLL EFFECT ─── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Sticky navbar
    navbar.classList.toggle('scrolled', scrollY > 60);

    // Scroll-to-top button
    scrollTopBtn.classList.toggle('visible', scrollY > 500);

    // Update active nav link
    updateActiveNavLink();
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ─── MOBILE NAVIGATION ─── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close nav when clicking outside
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ─── ACTIVE NAV LINK ON SCROLL ─── */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
      }
    });
  }

  // Smooth scroll for all internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ─── SCROLL-TRIGGERED FADE-IN ANIMATION ─── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay for grid children
        const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
        siblings.forEach((el, idx) => {
          setTimeout(() => el.classList.add('visible'), idx * 80);
        });
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(
    '.service-card, .portfolio-item, .testimonial-card, ' +
    '.about-card-main, .about-card-accent, .pillar, ' +
    '.contact-detail, .footer-col'
  ).forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });


  /* ─── COUNTER ANIMATION ─── */
  const counters = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(counter => animateCounter(counter));
    }
  }, { threshold: 0.5 });

  if (counters.length) counterObserver.observe(counters[0]);

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }


  /* ─── TESTIMONIALS SLIDER ─── */
  const slider      = document.getElementById('testimonialsSlider');
  const dotsWrap    = document.getElementById('tDots');
  const prevBtn     = document.getElementById('tPrev');
  const nextBtn     = document.getElementById('tNext');
  const cards       = slider ? slider.querySelectorAll('.testimonial-card') : [];

  if (slider && cards.length) {
    let currentSlide = 0;
    let autoSlide;
    const visibleCount = getVisibleCount();

    // Build dots
    const totalSlides = Math.ceil(cards.length / visibleCount);
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('div');
      dot.className = 'tctrl-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    }

    function getVisibleCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function goToSlide(index) {
      const visible = getVisibleCount();
      const max     = Math.ceil(cards.length / visible) - 1;
      currentSlide  = Math.max(0, Math.min(index, max));

      const cardWidth   = cards[0].offsetWidth + 24; // gap = 1.5rem = 24px
      slider.style.transform = `translateX(-${currentSlide * visible * cardWidth}px)`;

      dotsWrap.querySelectorAll('.tctrl-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    prevBtn.addEventListener('click', () => {
      resetAutoSlide();
      goToSlide(currentSlide - 1);
    });
    nextBtn.addEventListener('click', () => {
      resetAutoSlide();
      goToSlide(currentSlide + 1);
    });

    function resetAutoSlide() {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => {
        const visible = getVisibleCount();
        const max = Math.ceil(cards.length / visible) - 1;
        goToSlide(currentSlide >= max ? 0 : currentSlide + 1);
      }, 5000);
    }

    resetAutoSlide();
    window.addEventListener('resize', () => goToSlide(0));
  }


  /* ─── PORTFOLIO FILTER ─── */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        const show = filter === 'all' || category === filter;

        if (show) {
          item.style.display = '';
          setTimeout(() => item.classList.add('visible'), 10);
        } else {
          item.classList.remove('visible');
          item.style.display = 'none';
        }
      });
    });
  });


  /* ─── CONTACT FORM ─── */
  const contactForm = document.getElementById('contactForm');
  const formNotice  = document.getElementById('formNotice');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#eb5757';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });
      if (!valid) {
        showNotice('Please fill in all required fields.', 'error');
        return;
      }

      // Email validation
      const email = contactForm.querySelector('#email').value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        contactForm.querySelector('#email').style.borderColor = '#eb5757';
        showNotice('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate submission (replace with actual fetch to backend)
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').textContent = 'Sending...';

      await simulateSubmit();

      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Message';
      contactForm.reset();
      showNotice('✓ Thank you! Your message has been sent. We\'ll be in touch within 24 hours.', 'success');
    });
  }

  function showNotice(msg, type) {
    formNotice.textContent = msg;
    formNotice.className   = 'form-notice ' + type;
    setTimeout(() => {
      formNotice.className = 'form-notice';
    }, 6000);
  }

  function simulateSubmit() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }


  /* ─── PAGE LOAD FADE ─── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  console.log('Charmu Prime Ventures — Website Loaded Successfully ✓');
});
