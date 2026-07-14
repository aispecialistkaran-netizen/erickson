// HR Leaders Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    initializePage();
    
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
    
    // Form tracking
    trackFormInteractions();
    
    // Add loading animation for form
    handleFormLoading();
    
    // Initialize scroll animations
    initializeScrollAnimations();
});

function initializePage() {
    console.log('HR Leaders Landing Page Loaded');
    
    // Add fade-in animation to hero content
    const heroContent = document.querySelector('.hero-content');
    const formSection = document.querySelector('.form-section');
    
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 200);
    }
    
    if (formSection) {
        formSection.style.opacity = '0';
        formSection.style.transform = 'translateY(30px)';
        formSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            formSection.style.opacity = '1';
            formSection.style.transform = 'translateY(0)';
        }, 400);
    }
}

function addSmoothScrolling() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function trackFormInteractions() {
    const enrollmentForms = document.querySelectorAll('.enrollment-form');
    
    enrollmentForms.forEach(form => {
        // Track when form becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Form is in view');
                    // You can add analytics tracking here
                }
            });
        });
        
        observer.observe(form);
    });
}

function handleFormLoading() {
    const enrollmentForms = document.querySelectorAll('.enrollment-form');
    
    enrollmentForms.forEach(enrollmentForm => {
        if (enrollmentForm && enrollmentForm.parentNode) {
            // Show loading state
            const loadingDiv = document.createElement('div');
            loadingDiv.innerHTML = `
                <div style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 200px;
                    color: #666;
                    font-size: 16px;
                ">
                    <div>Loading form...</div>
                </div>
            `;
            loadingDiv.className = 'form-loading';
            
            enrollmentForm.parentNode.insertBefore(loadingDiv, enrollmentForm);
            enrollmentForm.style.display = 'none';
            
            // Show form after load
            enrollmentForm.addEventListener('load', function() {
                loadingDiv.remove();
                enrollmentForm.style.display = 'block';
            });
            
            // Fallback to show form after 3 seconds
            setTimeout(() => {
                if (loadingDiv.parentNode) {
                    loadingDiv.remove();
                    enrollmentForm.style.display = 'block';
                }
            }, 3000);
        }
    });
}

function initializeScrollAnimations() {
    // Animate benefit points on scroll
    const benefitPoints = document.querySelectorAll('.benefit-point');
    
    const benefitObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
                benefitObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    benefitPoints.forEach(point => {
        point.style.opacity = '0';
        point.style.transform = 'translateX(-30px)';
        point.style.transition = 'all 0.6s ease';
        benefitObserver.observe(point);
    });

    // Animate curriculum items on scroll
    const curriculumItems = document.querySelectorAll('.curriculum-item');
    
    const curriculumObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                curriculumObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    curriculumItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        curriculumObserver.observe(item);
    });

    // Animate why cards on scroll
    const whyCards = document.querySelectorAll('.why-card');
    
    const whyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                whyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    whyCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        whyObserver.observe(card);
    });

    // Animate testimonial cards on scroll
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    const testimonialObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                testimonialObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    testimonialCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        testimonialObserver.observe(card);
    });

    // Animate video items on scroll
    const videoItems = document.querySelectorAll('.video-item');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                videoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    videoItems.forEach(item => {
        videoObserver.observe(item);
    });

    // Initialize testimonial slider
    initializeTestimonialSlider();
}

function initializeTestimonialSlider() {
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    
    if (dots.length === 0 || testimonialItems.length === 0) return;
    
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = this.getAttribute('data-slide');
            showTestimonial(slideIndex);
        });
    });
}

function showTestimonial(index) {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    // Remove active class from all items and dots
    testimonialItems.forEach(item => item.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to selected item and dot
    if (testimonialItems[index]) {
        testimonialItems[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

// Utility function to handle responsive behavior
function handleResponsiveChanges() {
    const heroGrid = document.querySelector('.hero-grid');
    
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            // Mobile adjustments
            heroGrid?.classList.add('mobile-layout');
        } else {
            // Desktop adjustments
            heroGrid?.classList.remove('mobile-layout');
        }
    }
    
    // Check on load and resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Call responsive handler
handleResponsiveChanges();

// Scroll to form function for CTA buttons
function scrollToForm(event) {
    event.preventDefault();
    const formSection = document.querySelector('#form-section');
    if (formSection) {
        formSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add a gentle highlight effect to the form
        const form = formSection.querySelector('.enrollment-form');
        if (form) {
            form.style.transform = 'scale(1.02)';
            form.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                form.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// Smooth scroll function
function scrollToForm(event) {
  event.preventDefault();
  const formSection = document.getElementById('form-section');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Testimonial slider functionality
document.addEventListener('DOMContentLoaded', function() {
  const testimonialItems = document.querySelectorAll('.testimonial-item');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    // Hide all testimonials
    testimonialItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
      dot.classList.remove('active');
    });
    
    // Show current slide
    if (testimonialItems[index]) {
      testimonialItems[index].classList.add('active');
    }
    if (dots[index]) {
      dots[index].classList.add('active');
    }
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % testimonialItems.length;
    showSlide(currentSlide);
  }

  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    clearInterval(slideInterval);
  }

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      stopAutoplay();
      startAutoplay();
    });
  });

  // Start autoplay
  startAutoplay();

  // Pause on hover
  const sliderContainer = document.querySelector('.testimonials-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoplay);
    sliderContainer.addEventListener('mouseleave', startAutoplay);
  }

  // Initial display
  showSlide(0);
});

// Video items animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
    }
  });
}, observerOptions);

// Observe all video items
document.addEventListener('DOMContentLoaded', () => {
  const videoItems = document.querySelectorAll('.video-item');
  videoItems.forEach(item => {
    videoObserver.observe(item);
  });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Add scroll-based animations for cards
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

// Observe all modern cards
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.modern-card');
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
    cardObserver.observe(card);
  });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    header.style.boxShadow = 'none';
  }
  
  lastScroll = currentScroll;
});

// Form tracking (if needed for analytics)
document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('iframe[title*="Program Inquiry"]');
  
  forms.forEach(form => {
    form.addEventListener('load', () => {
      console.log('Form loaded successfully');
    });
  });
});

// Add parallax effect to hero section (desktop only)
const heroSection = document.querySelector('#hero-section');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateHeroParallax() {
  if (!heroSection) return;
  if (prefersReducedMotion || window.innerWidth < 1024) {
    heroSection.style.transform = 'none';
    return;
  }

  const scrolled = window.pageYOffset;
  if (scrolled < window.innerHeight) {
    heroSection.style.transform = `translateY(${scrolled * 0.2}px)`;
  } else {
    heroSection.style.transform = 'none';
  }
}

window.addEventListener('scroll', updateHeroParallax, { passive: true });
window.addEventListener('resize', updateHeroParallax);
updateHeroParallax();

// Mobile menu toggle (if needed in future)
const mobileMenuBtn = document.querySelector('[data-mobile-menu-toggle]');
const mobileMenu = document.querySelector('[data-mobile-menu]');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Lazy loading for iframes
document.addEventListener('DOMContentLoaded', () => {
  const iframes = document.querySelectorAll('iframe[loading="lazy"]');
  
  const iframeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
        }
        iframeObserver.unobserve(iframe);
      }
    });
  });
  
  iframes.forEach(iframe => {
    iframeObserver.observe(iframe);
  });
});

// Add hover effect to benefit cards
document.addEventListener('DOMContentLoaded', () => {
  const benefitCards = document.querySelectorAll('.benefit-point, .why-card');
  
  benefitCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
});

// Console welcome message
console.log('%c🚀 Welcome to xMonks x Erickson Coaching Program', 'font-size: 20px; color: #2355cf; font-weight: bold;');
console.log('%cBuilt with modern web technologies', 'font-size: 14px; color: #64748b;');
