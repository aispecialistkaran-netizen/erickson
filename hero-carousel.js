// Hero Carousel JavaScript
class HeroCarousel {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.autoSlideInterval = null;
        this.autoSlideDelay = 12000; // 25 seconds
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) return;
        
        // Set up dynamic backgrounds
        this.setBackgrounds();
        
        // Check if mobile - if so, only show first slide and disable carousel
        if (window.innerWidth <= 480) {
            this.setupMobileView();
            return;
        }
        
        // Add event listeners
        this.bindEvents();
        
        // Start auto-slide
        this.startAutoSlide();
        
        // Pause auto-slide on hover
        this.setupHoverEvents();
        
        // Initialize accessibility
        this.setupAccessibility();
        
        // Handle window resize
        this.setupResizeHandler();
    }
    
    setBackgrounds() {
        this.slides.forEach((slide, index) => {
            const bgUrl = slide.getAttribute('data-bg');
            if (bgUrl) {
                slide.style.backgroundImage = `url('${bgUrl}')`;
            }
        });
    }
    
    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
            });
        }
        
        // Indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Touch/swipe support
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        const carousel = document.querySelector('.hero-carousel-container');
        
        if (!carousel) return;
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        }, { passive: true });
        
        // Mouse drag support for desktop
        let isDragging = false;
        
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        carousel.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            endX = e.clientX;
            this.handleSwipe(startX, endX);
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50; // Minimum swipe distance
        const diff = startX - endX;
        
        if (Math.abs(diff) < threshold) return;
        
        if (diff > 0) {
            this.nextSlide();
        } else {
            this.prevSlide();
        }
    }
    
    setupHoverEvents() {
        // Only pause on hover for mobile devices to avoid desktop autoplay issues
        if (window.innerWidth <= 768) {
            const carousel = document.querySelector('.hero-carousel-section');
            
            if (carousel) {
                carousel.addEventListener('mouseenter', () => this.pauseAutoSlide());
                carousel.addEventListener('mouseleave', () => this.startAutoSlide());
            }
        }
    }
    
    setupMobileView() {
        // On mobile, show only the first slide and hide carousel controls
        this.currentSlide = 0;
        
        // Show only first slide
        this.slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
                slide.style.display = 'none';
            }
        });
        
        // Hide navigation controls on mobile
        const navButtons = document.querySelector('.carousel-nav');
        const indicators = document.querySelector('.carousel-indicators');
        
        if (navButtons) {
            navButtons.style.display = 'none';
        }
        if (indicators) {
            indicators.style.display = 'none';
        }
        
        // Initialize basic accessibility for single slide
        this.setupAccessibility();
    }
    
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            // Reinitialize carousel on screen size change
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.pauseAutoSlide();
                this.init();
            }, 250);
        });
    }
    
    setupAccessibility() {
        // Add ARIA labels and roles
        const carousel = document.querySelector('.hero-carousel-container');
        if (carousel) {
            carousel.setAttribute('role', 'region');
            carousel.setAttribute('aria-label', 'Hero image carousel');
        }
        
        // Update indicators with proper ARIA attributes
        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('role', 'tab');
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        });
        
        this.updateAriaStates();
    }
    
    updateAriaStates() {
        this.slides.forEach((slide, index) => {
            slide.setAttribute('aria-hidden', index !== this.currentSlide);
        });
        
        this.indicators.forEach((indicator, index) => {
            indicator.setAttribute('aria-selected', index === this.currentSlide);
        });
    }
    
    goToSlide(slideIndex) {
        if (slideIndex === this.currentSlide) return;
        
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide]?.classList.remove('active');
        this.indicators[this.currentSlide]?.classList.remove('active');
        
        // Update current slide index
        this.currentSlide = slideIndex;
        
        // Add active class to new slide and indicator
        this.slides[this.currentSlide]?.classList.add('active');
        this.indicators[this.currentSlide]?.classList.add('active');
        
        // Update accessibility states
        this.updateAriaStates();
        
        // Reset auto-slide timer
        this.resetAutoSlide();
        
        // Trigger custom event
        this.dispatchSlideChangeEvent();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoSlide() {
        if (this.slides.length <= 1) return;
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }
    
    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    resetAutoSlide() {
        this.pauseAutoSlide();
        this.startAutoSlide();
    }
    
    dispatchSlideChangeEvent() {
        const event = new CustomEvent('slideChange', {
            detail: {
                currentSlide: this.currentSlide,
                totalSlides: this.slides.length
            }
        });
        document.dispatchEvent(event);
    }
    
    // Public API methods
    destroy() {
        this.pauseAutoSlide();
        // Remove event listeners if needed
    }
    
    getCurrentSlide() {
        return this.currentSlide;
    }
    
    getTotalSlides() {
        return this.slides.length;
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const heroCarousel = new HeroCarousel();
    
    // Make carousel globally available for debugging
    window.heroCarousel = heroCarousel;
    
    // Add smooth scroll for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.hero-carousel-section').nextElementSibling;
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
});

// Handle page visibility changes (pause/resume auto-slide)
document.addEventListener('visibilitychange', () => {
    if (window.heroCarousel) {
        if (document.hidden) {
            window.heroCarousel.pauseAutoSlide();
        } else {
            window.heroCarousel.startAutoSlide();
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        // Re-initialize carousel if needed on significant size changes
        if (window.heroCarousel) {
            // Could add responsive adjustments here
        }
    }, 250);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeroCarousel;
}