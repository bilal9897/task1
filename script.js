// ============================================
// INNOVATION HUB – PILIKULA
// JavaScript – All Interactivity
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. NAVBAR – Scroll Effect + Active Link
  // ============================================
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  const updateActiveLink = () => {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
      if (link) {
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink);

  // Hamburger menu
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close nav on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // Theme initialization – Locked to Light Mode
  document.documentElement.setAttribute('data-theme', 'light');

  // ============================================
  // 3. HERO PARTICLES
  // ============================================
  const particlesContainer = document.getElementById('heroParticles');
  const createParticle = () => {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    const size = Math.random() * 4 + 2;
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.6 + 0.1};
    `;
    particlesContainer.appendChild(particle);
  };

  for (let i = 0; i < 40; i++) createParticle();

  // ============================================
  // 4. SCROLL REVEAL ANIMATION
  // ============================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay;
        if (delay) {
          setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
        } else {
          entry.target.classList.add('visible');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ============================================
  // 5. ANIMATED COUNTER (Stats)
  // ============================================
  const animateCounter = (el, target, duration = 2000) => {
    let start = 0;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start);
      }
    }, step);
  };

  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target);
          animateCounter(counter, target);
        });
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  // ============================================
  // 6. TESTIMONIALS CAROUSEL
  // ============================================
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardWidth = cards[0] ? cards[0].offsetWidth + 24 : 404;
    let autoplayTimer = null;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const updateDots = () => {
      document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    const goTo = (index) => {
      currentIndex = Math.max(0, Math.min(index, cards.length - 1));
      cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots();
    };

    prevBtn.addEventListener('click', () => {
      goTo(currentIndex > 0 ? currentIndex - 1 : cards.length - 1);
      resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      goTo(currentIndex < cards.length - 1 ? currentIndex + 1 : 0);
      resetAutoplay();
    });

    const startAutoplay = () => {
      autoplayTimer = setInterval(() => {
        goTo(currentIndex < cards.length - 1 ? currentIndex + 1 : 0);
      }, 5000);
    };

    const resetAutoplay = () => {
      clearInterval(autoplayTimer);
      startAutoplay();
    };

    startAutoplay();

    // Touch/swipe support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? goTo(currentIndex + 1) : goTo(currentIndex - 1);
        resetAutoplay();
      }
    });

    window.addEventListener('resize', () => {
      cardWidth = cards[0].offsetWidth + 24;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    });
  }

  // ============================================
  // 7. GALLERY FILTER
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.9)';
          setTimeout(() => { item.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Transition for gallery items
  galleryItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  // ============================================
  // 8. CONTACT FORM HANDLER
  // ============================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.textContent = 'Sending... ⏳';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Send Message 🚀';
        btn.disabled = false;
        formSuccess.classList.add('show');
        contactForm.reset();

        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 1500);
    });
  }

  // ============================================
  // 9. BACK TO TOP BUTTON
  // ============================================
  const backTop = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backTop.classList.add('show');
    } else {
      backTop.classList.remove('show');
    }
  });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============================================
  // 10. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 11. AREA CARDS – Staggered Reveal
  // ============================================
  document.querySelectorAll('.area-card').forEach((card, i) => {
    card.setAttribute('data-delay', i * 100);
  });

  // ============================================
  // 12. NAVBAR LINK SMOOTH HIGHLIGHT
  // ============================================
  // Keyboard navigation accessibility
  document.querySelectorAll('.area-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') card.querySelector('.area-cta')?.click();
    });
  });

  // ============================================
  // 13. PARALLAX EFFECT ON HERO IMAGE
  // ============================================
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  // ============================================
  // 14. LAZY IMAGE LOADING
  // ============================================
  const images = document.querySelectorAll('img');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.4s ease';
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
        if (img.complete) img.style.opacity = '1';
        imageObserver.unobserve(img);
      }
    });
  }, { threshold: 0.1 });

  images.forEach(img => imageObserver.observe(img));

  // ============================================
  // 15. CARD TILT EFFECT on area cards
  // ============================================
  document.querySelectorAll('.area-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * 6;
      const tiltY = ((centerX - x) / centerX) * 6;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ============================================
  // INIT COMPLETE
  // ============================================
  console.log('🚀 Innovation Hub – Pilikula loaded successfully!');
});
