
// ICF Coach Certification Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    initializePage();
    
    // Add smooth scrolling for any future anchor links
    addSmoothScrolling();
    
    // Form tracking (if needed)
    trackFormInteractions();
    
    // Add loading animation for form
    handleFormLoading();
    
    // Initialize number counting animation
    initializeCounters();
});

function initializeCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Create intersection observer for counting animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalNumber = target.textContent;
                
                // Extract number and suffix
                const match = finalNumber.match(/(\d+)([+%]*)/);
                if (match) {
                    const number = parseInt(match[1]);
                    const suffix = match[2] || '';
                    
                    // Animate counting
                    animateCounter(target, 0, number, suffix, 2000);
                    
                    // Unobserve after animation starts
                    counterObserver.unobserve(target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Observe all stat numbers
    statNumbers.forEach(number => counterObserver.observe(number));
}

function animateCounter(element, start, end, suffix, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easeOutCubic for smooth deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentNumber = Math.floor(start + (end - start) * easeProgress);
        
        element.textContent = currentNumber + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = end + suffix; // Ensure final value
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function initializePage() {
    console.log('ICF Coach Certification Landing Page Loaded');
    
    // Add fade-in animation to content
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
    const enrollmentForm = document.querySelector('.enrollment-form');
    
    if (enrollmentForm) {
        // Track when form becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Form is in view');
                    // You can add analytics tracking here
                }
            });
        });
        
        observer.observe(enrollmentForm);
    }
}

function handleFormLoading() {
    const enrollmentForm = document.querySelector('.enrollment-form');
    
    if (enrollmentForm) {
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
        loadingDiv.id = 'form-loading';
        
        enrollmentForm.parentNode.insertBefore(loadingDiv, enrollmentForm);
        enrollmentForm.style.display = 'none';
        
        // Show form after load
        enrollmentForm.addEventListener('load', function() {
            loadingDiv.remove();
            enrollmentForm.style.display = 'block';
        });
        
        // Fallback to show form after 3 seconds
        setTimeout(() => {
            if (document.getElementById('form-loading')) {
                loadingDiv.remove();
                enrollmentForm.style.display = 'block';
            }
        }, 3000);
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

// Scroll to form function for program buttons
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

// Initialize scroll animations for who section
function initializeWhoAnimations() {
    const whoCards = document.querySelectorAll('.who-card');
    
    const whoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
                
                whoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    whoCards.forEach(card => whoObserver.observe(card));
}

// Initialize scroll animations for gain section
function initializeGainAnimations() {
    const gainBenefits = document.querySelectorAll('.gain-benefit');
    
    const gainObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200);
                
                gainObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    gainBenefits.forEach(benefit => gainObserver.observe(benefit));
}

// Initialize scroll animations for erickson section
function initializeEricksonAnimations() {
    const ericksonBenefits = document.querySelectorAll('.erickson-benefit');
    
    const ericksonObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
                
                ericksonObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    ericksonBenefits.forEach(benefit => ericksonObserver.observe(benefit));
}

// Initialize Growth Timeline animations


// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    initializePage();
    
    // Add smooth scrolling for any future anchor links
    addSmoothScrolling();
    
    // Form tracking (if needed)
    trackFormInteractions();
    
    // Add loading animation for form
    handleFormLoading();
    
    // Initialize number counting animation
    initializeCounters();
    
    // Initialize who section animations
    initializeWhoAnimations();
    
    // Initialize gain section animations
    initializeGainAnimations();
    
    // Initialize erickson section animations
    initializeEricksonAnimations();
    
    // Initialize faculty section animations
    initializeFacultyAnimations();
    
    // Initialize testimonial slider
    initializeTestimonialSlider();
    
    // Initialize video feedback animations
    initializeVideoFeedbackAnimations();
    
    // Initialize Growth Timeline animations
    initializeGrowthTimeline();
});

// Initialize scroll animations for faculty section
function initializeFacultyAnimations() {
    const facultyCards = document.querySelectorAll('.faculty-card');
    
    const facultyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 200);
                
                facultyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    facultyCards.forEach(card => facultyObserver.observe(card));
}

// Initialize testimonial slider
function initializeTestimonialSlider() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all items and dots
        testimonialItems.forEach(item => item.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (testimonialItems[index]) {
            testimonialItems[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    // Function to go to next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % testimonialItems.length;
        showSlide(nextIndex);
    }

    // Auto-play functionality
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Add click event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay(); // Restart auto-play after manual interaction
        });
    });

    // Initialize slider
    if (testimonialItems.length > 0) {
        showSlide(0);
        startAutoPlay();
        
        // Pause auto-play when user hovers over testimonials
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoPlay);
            sliderContainer.addEventListener('mouseleave', startAutoPlay);
        }
    }
}

// Initialize scroll animations for video feedback section
function initializeVideoFeedbackAnimations() {
    const videoItems = document.querySelectorAll('.video-item');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                
                videoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    videoItems.forEach(item => videoObserver.observe(item));
}