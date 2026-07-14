/*
 * Enhanced animations and interactions for Erickson India About page
 * Provides smooth scroll animations, intersection observer effects, and interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all animations and interactions
  initScrollAnimations();
  initHeaderEffects();
  initParallaxEffects();
  initBackToTop();
  initCounterAnimations();
  initCardHoverEffects();
});

// Scroll-based animations using Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all sections and cards
  const animatableElements = document.querySelectorAll(`
    .section,
    .principle-item,
    .pillar-item,
    .vmv-item,
    .timeline-item,
    .reason-item,
    .honor-item,
    .stat-item
  `);

  animatableElements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// Header effects on scroll
function initHeaderEffects() {
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Hide/show header on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
  });
}

// Subtle parallax effects for hero section
function initParallaxEffects() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    if (hero) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  });
}

// Back to top button functionality
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Animated counter for statistics
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-item h2');
  const observerOptions = {
    threshold: 0.7
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const originalText = element.textContent;
  const target = parseInt(originalText);
  const suffix = originalText.replace(/^\d+/, ''); // Extract everything after the number (K+, +, etc.)
  const increment = target / 50;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, 40);
}

// Enhanced card hover effects
function initCardHoverEffects() {
  const cards = document.querySelectorAll(`
    .principle-item,
    .pillar-item,
    .reason-item,
    .honor-item,
    .timeline-item
  `);

  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Loading animation for the page
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  
  // Animate hero content with delay
  setTimeout(() => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.classList.add('animate-in');
    }
  }, 300);
});

// Add CSS classes for animations
const animationStyles = `
<style>
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.site-header {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.site-header.scrolled {
  background: rgba(7, 63, 82, 0.98);
  backdrop-filter: blur(20px);
}

body.loaded .hero-content {
  animation: heroFadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger animation for grid items */
.principles-grid .principle-item:nth-child(1) { animation-delay: 0.1s; }
.principles-grid .principle-item:nth-child(2) { animation-delay: 0.2s; }
.principles-grid .principle-item:nth-child(3) { animation-delay: 0.3s; }
.principles-grid .principle-item:nth-child(4) { animation-delay: 0.4s; }

.pillars-grid .pillar-item:nth-child(1) { animation-delay: 0.1s; }
.pillars-grid .pillar-item:nth-child(2) { animation-delay: 0.2s; }
.pillars-grid .pillar-item:nth-child(3) { animation-delay: 0.3s; }
.pillars-grid .pillar-item:nth-child(4) { animation-delay: 0.4s; }

.vmv-grid .vmv-item:nth-child(1) { animation-delay: 0.1s; }
.vmv-grid .vmv-item:nth-child(2) { animation-delay: 0.2s; }
.vmv-grid .vmv-item:nth-child(3) { animation-delay: 0.3s; }

.reasons-grid .reason-item:nth-child(1) { animation-delay: 0.1s; }
.reasons-grid .reason-item:nth-child(2) { animation-delay: 0.2s; }
.reasons-grid .reason-item:nth-child(3) { animation-delay: 0.3s; }
.reasons-grid .reason-item:nth-child(4) { animation-delay: 0.4s; }

.honors-grid .honor-item:nth-child(1) { animation-delay: 0.1s; }
.honors-grid .honor-item:nth-child(2) { animation-delay: 0.2s; }
.honors-grid .honor-item:nth-child(3) { animation-delay: 0.3s; }
.honors-grid .honor-item:nth-child(4) { animation-delay: 0.4s; }
</style>
`;

document.head.insertAdjacentHTML('beforeend', animationStyles);
