// Revolutionary Hero Section Animations and Interactions

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize all hero section animations and interactions
    initHeroAnimations();
    initTypingEffect();
    initCountUpAnimation();
    init3DEffects();
    initSmoothScrolling();
});

// Initialize hero animations
function initHeroAnimations() {
    // Add parallax effect to spheres and background elements
    const heroSection = document.querySelector('.hero-section');
    
    if (!heroSection) return;
    
    // Mouse move parallax effect
    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { width, height } = heroSection.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the section
        const xPos = (clientX / width - 0.5) * 2;
        const yPos = (clientY / height - 0.5) * 2;
        
        // Apply parallax movement to different elements
        const spheres = document.querySelectorAll('.hero-sphere');
        const heroGrid = document.querySelector('.hero-grid');
        const statsCard = document.querySelector('.stats-card');
        const testimonialCard = document.querySelector('.testimonial-card');
        
        spheres.forEach((sphere, index) => {
            const factor = 20 + (index * 5);
            gsapMove(sphere, xPos * factor, yPos * factor, 1);
        });
        
        if (heroGrid) gsapMove(heroGrid, xPos * -20, yPos * -10, 1);
        if (statsCard) gsapRotate(statsCard, xPos * 5, yPos * 5, 0.5);
        if (testimonialCard) gsapRotate(testimonialCard, xPos * -10, yPos * -5, 0.7);
    });
    
    // Reset on mouse leave
    heroSection.addEventListener('mouseleave', () => {
        const spheres = document.querySelectorAll('.hero-sphere');
        const heroGrid = document.querySelector('.hero-grid');
        const statsCard = document.querySelector('.stats-card');
        const testimonialCard = document.querySelector('.testimonial-card');
        
        spheres.forEach(sphere => {
            gsapMove(sphere, 0, 0, 1.5);
        });
        
        if (heroGrid) gsapMove(heroGrid, 0, 0, 1.5);
        if (statsCard) gsapRotate(statsCard, 5, 0, 1);
        if (testimonialCard) gsapRotate(testimonialCard, -15, 0, 1);
    });
}

// Helper function for smooth movement using GSAP if available, or CSS transitions otherwise
function gsapMove(element, x, y, duration) {
    if (typeof gsap !== 'undefined') {
        gsap.to(element, {
            x, y,
            duration,
            ease: "power2.out"
        });
    } else {
        element.style.transition = `transform ${duration}s cubic-bezier(0.17, 0.67, 0.83, 0.67)`;
        element.style.transform = `translate(${x}px, ${y}px)`;
    }
}

// Helper function for smooth rotation
function gsapRotate(element, rotateY, rotateX, duration) {
    if (typeof gsap !== 'undefined') {
        gsap.to(element, {
            rotateY, rotateX,
            duration,
            ease: "power2.out"
        });
    } else {
        element.style.transition = `transform ${duration}s cubic-bezier(0.17, 0.67, 0.83, 0.67)`;
        element.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    }
}

// Initialize the typing effect for the subtitle
function initTypingEffect() {
    const typedTextElement = document.querySelector('.typed-text');
    if (!typedTextElement) return;

    const textArray = [
        "personal growth and development",
        "leadership mastery and excellence",
        "breakthrough performance insights",
        "mindful career transformation"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 60;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typingSpeed = 500; // Pause before typing next string
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1500); // Start after initial animations
}

// Initialize count-up animation for stats
function initCountUpAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The higher the slower
    
    // Simple function without intersection observer
    counters.forEach(counter => {
        const statItem = counter.closest('.stat-item');
        if (!statItem) return;
        
        // Get value from data attribute
        let target = parseInt(statItem.dataset.value) || 0;
        let count = 0;
        
        const updateCount = () => {
            const increment = target / speed;
            
            if (count < target) {
                count += increment;
                counter.innerText = Math.floor(count);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        // Start counting after a delay
        setTimeout(updateCount, 500);
    });
}

// Initialize the testimonial slider (removed - handled by testimonials-optimized.js)
function initTestimonialSlider() {
    // This functionality is now handled by testimonials-optimized.js
    // to prevent conflicts and duplicate loading
    return;
}

// Initialize 3D tilt effect for cards
function init3DEffects() {
    const cards = document.querySelectorAll('.testimonial-card, .stats-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', handleTilt);
        card.addEventListener('mouseleave', resetTilt);
    });
    
    function handleTilt(e) {
        const card = this;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;
        
        card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg)`;
    }
    
    function resetTilt() {
        this.style.transform = '';
        
        // Apply original transform if any
        if (this.classList.contains('testimonial-card')) {
            this.style.transform = 'rotateY(-15deg) translateZ(0)';
        } else if (this.classList.contains('stats-card')) {
            this.style.transform = 'rotateX(5deg)';
        }
    }
}

// Initialize smooth scrolling behavior
function initSmoothScrolling() {
    // Add smooth scroll behavior to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty anchors
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            // Smooth scroll to target
            scrollToElement(targetElement);
        });
    });
    
    // Add click handler to scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Scroll to the section after the hero
            const filterSection = document.querySelector('.filter-section');
            if (filterSection) {
                scrollToElement(filterSection);
            }
        });
    }
    
    // Add click handler to CTA button
    const ctaButton = document.querySelector('.hero-cta .cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Scroll to testimonials section
            const testimonialsSection = document.querySelector('.testimonials-section');
            if (testimonialsSection) {
                scrollToElement(testimonialsSection);
            }
        });
    }
    
    // Helper function for smooth scrolling
    function scrollToElement(element) {
        const offset = 80; // Add offset for fixed header if needed
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
    
    // Setup scroll-triggered animations
    setupScrollAnimations();
}

// Setup scroll-triggered animations
function setupScrollAnimations() {
    // Add scroll event listener for parallax effects
    window.addEventListener('scroll', handleScroll);
    
    // Handle scroll events for parallax and animations
    function handleScroll() {
        const scrollPosition = window.scrollY;
        animateHeroParallax(scrollPosition);
        revealElementsOnScroll();
    }
    
    // Parallax effect on hero section
    function animateHeroParallax(scrollPosition) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;
        
        // Only apply when hero section is visible
        if (scrollPosition < window.innerHeight) {
            // Parallax for background elements
            const spheres = document.querySelectorAll('.hero-sphere');
            spheres.forEach((sphere, index) => {
                const speed = 0.1 + (index * 0.05);
                sphere.style.transform = `translateY(${scrollPosition * speed}px)`;
            });
            
            // Parallax for grid
            const heroGrid = document.querySelector('.hero-grid');
            if (heroGrid) {
                heroGrid.style.transform = `perspective(500px) rotateX(60deg) translateY(${100 + scrollPosition * 0.2}px)`;
            }
            
            // Fade out elements as user scrolls
            const heroContent = document.querySelector('.hero-content-wrapper');
            if (heroContent) {
                const opacity = 1 - (scrollPosition / (window.innerHeight * 0.5));
                heroContent.style.opacity = Math.max(0, opacity);
            }
        }
    }
    
    // Reveal elements as they come into view
    function revealElementsOnScroll() {
        const revealElements = document.querySelectorAll('.trust-item, .testimonial-card, .stats-card');
        
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('reveal');
            }
        });
    }
    
    // Initial check for elements in view
    setTimeout(revealElementsOnScroll, 300);
}
