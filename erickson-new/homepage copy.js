/**
 * Homepage JavaScript - Brand Partners Animation & Interactions
 * Uses proper Erickson design patterns and JavaScript for animations
 */

class HomepageManager {
    constructor() {
        this.init();
        this.animationStarted = false; // Flag to prevent multiple animations
    }

    init() {
        this.initBrandLogosAnimation();
        this.initScrollAnimations();
        this.initHeroFeaturesAnimation();
    this.initStatisticsCounting();
    this.initTestimonialsAnimation();
        this.initCertificationFeaturesAnimation();
        
        // Add animated blobs to FAQ section
        this.initFAQBackgroundEffects();
    }
    
    /**
     * Initialize animated background effects for FAQ section
     */
    initFAQBackgroundEffects() {
        const faqSection = document.querySelector('.faq-section');
        if (!faqSection) return;
        
        // Create animated background elements
        const blob1 = faqSection.querySelector('.blob-1');
        const blob2 = faqSection.querySelector('.blob-2');
        
        if (blob1 && blob2) {
            // Set initial positions
            gsap.set(blob1, {
                top: '10%',
                right: '-200px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, rgba(235, 188, 52, 0.2) 0%, rgba(235, 188, 52, 0) 70%)',
                opacity: 0.2,
                filter: 'blur(80px)',
                zIndex: 0
            });
            
            gsap.set(blob2, {
                bottom: '5%',
                left: '-150px',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 70% 70%, rgba(99, 183, 211, 0.2) 0%, rgba(99, 183, 211, 0) 70%)',
                opacity: 0.2,
                filter: 'blur(70px)',
                zIndex: 0
            });
            
            // Animate blobs
            gsap.to(blob1, {
                x: '30px',
                y: '40px',
                duration: 20,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            
            gsap.to(blob2, {
                x: '40px',
                y: '-30px',
                duration: 15,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 1
            });
        }
    }

    /**
     * Initialize brand logos with staggered fade-in animation
     */
    initBrandLogosAnimation() {
        const brandLogos = document.querySelectorAll('.brand-logo-item');
        
        if (brandLogos.length === 0) return;

        // Add initial hidden state
        brandLogos.forEach((logo, index) => {
            logo.style.opacity = '0';
            logo.style.transform = 'translateY(20px)';
        });

        // Observe when brand section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateBrandLogos();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });

        const brandSection = document.querySelector('.brand-partners-section');
        if (brandSection) {
            observer.observe(brandSection);
        }
    }

    /**
     * Animate brand logos with staggered entrance
     */
    animateBrandLogos() {
        const brandLogos = document.querySelectorAll('.brand-logo-item');
        
        brandLogos.forEach((logo, index) => {
            setTimeout(() => {
                logo.style.transition = 'all 0.6s ease';
                logo.style.opacity = '1';
                logo.style.transform = 'translateY(0)';
            }, index * 100); // 100ms delay between each logo
        });
    }

    /**
     * Initialize scroll-based animations for other elements
     */
    initScrollAnimations() {
        // Animate section titles when they come into view
        const sectionTitles = document.querySelectorAll('.section-title');
        
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.5
        });

        sectionTitles.forEach(title => {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            title.style.transition = 'all 0.8s ease';
            titleObserver.observe(title);
        });
    }

    /**
     * Initialize hero features animation
     */
    initHeroFeaturesAnimation() {
        const featureTags = document.querySelectorAll('.feature-tag');
        
        if (featureTags.length === 0) return;

        // Simple fade-in animation
        featureTags.forEach((tag, index) => {
            tag.style.opacity = '0';
            setTimeout(() => {
                tag.style.transition = 'opacity 0.5s ease';
                tag.style.opacity = '1';
            }, index * 100 + 500);
        });
    }

    /**
     * Initialize statistics counting animation
     */
    initStatisticsCounting() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) {
            return;
        }

        // Store original values and set initial state (only if not already done)
        statNumbers.forEach((stat, index) => {
            const originalText = stat.textContent.trim();
            
            // Only set data-count if it doesn't exist (prevents overwriting on multiple runs)
            if (!stat.hasAttribute('data-count')) {
                stat.setAttribute('data-count', originalText);
                stat.textContent = '0';
            }
        });

        // Try to observe when statistics section comes into view
        const statsSection = document.querySelector('.statistics-section');
        if (statsSection) {
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStatistics();
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            observer.observe(statsSection);

            // Check if section is already visible (for cases where it's visible on page load)
            const rect = statsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                setTimeout(() => this.animateStatistics(), 500);
            }

            // Fallback: trigger after 2 seconds if observer doesn't work
            setTimeout(() => {
                const statNumbers = document.querySelectorAll('.stat-number');
                if (statNumbers[0] && statNumbers[0].textContent === '0') {
                    this.animateStatistics();
                }
            }, 2000);

            // Add a manual trigger for testing (remove this in production)
            window.testStatsAnimation = () => {
                this.animateStatistics();
            };

        }
    }

    /**
     * Animate statistics counting
     */
    animateStatistics() {
        // Prevent multiple animations
        if (this.animationStarted) {
            return;
        }
        
        this.animationStarted = true;
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((stat, index) => {
            const targetText = stat.getAttribute('data-count') || stat.textContent;
            const duration = 2000; // 2 seconds
            const delay = index * 200; // Stagger by 200ms
            
            setTimeout(() => {
                this.countUp(stat, targetText, duration);
            }, delay);
        });
    }

    /**
     * Count up animation for individual statistic
     */
    countUp(element, targetText, duration) {
        // Parse the target number (handle formats like "75,000+", "40+", "19")
        let targetNumber = 0;
        let suffix = '';
        
        if (targetText.includes('+')) {
            const parts = targetText.split('+');
            targetNumber = parseInt(parts[0].replace(/,/g, ''));
            suffix = '+';
        } else if (targetText.includes(',')) {
            targetNumber = parseInt(targetText.replace(/,/g, ''));
        } else {
            targetNumber = parseInt(targetText);
        }

        if (isNaN(targetNumber)) {
            console.error(`Failed to parse target number from "${targetText}"`);
            return;
        }

        const startNumber = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOutQuart);
            
            // Format the number with commas if needed
            let displayNumber = currentNumber.toLocaleString();
            if (suffix) {
                displayNumber += suffix;
            }
            
            element.textContent = displayNumber;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Ensure final value is correct
                let finalNumber = targetNumber.toLocaleString();
                if (suffix) {
                    finalNumber += suffix;
                }
                element.textContent = finalNumber;
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Initialize testimonials animation
     */
    initTestimonialsAnimation() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        if (testimonialCards.length === 0) return;

        // Set initial state for testimonials
        testimonialCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
        });

        // Observe when testimonials section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTestimonials();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        const testimonialsSection = document.querySelector('.testimonials-section');
        if (testimonialsSection) {
            observer.observe(testimonialsSection);
        }
    }

    /**
     * Animate testimonials with staggered entrance
     */
    animateTestimonials() {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        
        testimonialCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 150); // 150ms delay between each card
        });
    }

    /**
     * Initialize FAQ accordion functionality
     */
    initFAQAccordion() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        if (faqQuestions.length === 0) return;
        
        // Add click event listeners to all FAQ questions
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items first
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                    const q = item.querySelector('.faq-question');
                    if (q) q.setAttribute('aria-expanded', 'false');
                });
                
                // If this item wasn't active before, make it active
                if (!isActive) {
                    faqItem.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
        
        // Set initial state - ensure accessibility attributes
        faqQuestions.forEach(question => {
            const faqItem = question.parentElement;
            const answerId = `faq-answer-${Math.random().toString(36).substring(2, 10)}`;
            const answer = faqItem.querySelector('.faq-answer');
            
            // Set ARIA attributes
            question.setAttribute('aria-controls', answerId);
            answer.id = answerId;
            
            // Add keyboard support
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    question.click();
                }
            });
        });
        
        // Add special hover effects
        document.querySelectorAll('.faq-item').forEach(item => {
            const icon = item.querySelector('.faq-icon');
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('mouseenter', () => {
                if (!item.classList.contains('active')) {
                    icon.style.transform = 'rotate(45deg) scale(1.05)';
                }
            });
            
            question.addEventListener('mouseleave', () => {
                if (!item.classList.contains('active')) {
                    icon.style.transform = 'rotate(0) scale(1)';
                }
            });
        });
        
        // Open the first item by default
        if (faqQuestions.length > 0) {
            const firstItem = faqQuestions[0].parentElement;
            firstItem.classList.add('active');
            faqQuestions[0].setAttribute('aria-expanded', 'true');
        }
    }
    
    /**
     * Animate FAQ items with staggered entrance
     */
    animateFAQItems() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    /**
     * Initialize certification features animation
     */
    initCertificationFeaturesAnimation() {
        const featureItems = document.querySelectorAll('.feature-item');
        
        if (featureItems.length === 0) return;

        // Set initial state for features
        featureItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
        });

        // Observe when certification section comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCertificationFeatures();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        const certificationSection = document.querySelector('.want-to-know-section');
        if (certificationSection) {
            observer.observe(certificationSection);
        }
    }

    /**
     * Animate certification features with staggered entrance
     */
    animateCertificationFeatures() {
        const featureItems = document.querySelectorAll('.feature-item');
        
        featureItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200); // 200ms delay between each feature
        });
    }

    /**
     * Add smooth hover effects to brand logos
     */
    addBrandHoverEffects() {
        const brandItems = document.querySelectorAll('.brand-logo-item');
        
        brandItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Add subtle pulse effect
                item.style.transform = 'translateY(-5px) scale(1.02)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomepageManager();
});

// Add loading performance optimization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HomepageManager();
    });
} else {
    new HomepageManager();
}


    document.addEventListener('DOMContentLoaded', function() {
        // Optimized FAQ Accordion: toggle .active and set maxHeight dynamically
        const faqItems = document.querySelectorAll('.faq-item');

        if (!faqItems || faqItems.length === 0) return;

        function closeItem(item) {
            item.classList.remove('active');
            const q = item.querySelector('.faq-question');
            const ico = item.querySelector('.faq-icon i');
            const answer = item.querySelector('.faq-answer');
            if (q) q.setAttribute('aria-expanded', 'false');
            if (ico) ico.className = 'fas fa-plus';
            if (answer) {
                // remove maxHeight to collapse smoothly
                answer.style.maxHeight = '0px';
            }
        }

        function openItem(item) {
            item.classList.add('active');
            const q = item.querySelector('.faq-question');
            const ico = item.querySelector('.faq-icon i');
            const answer = item.querySelector('.faq-answer');
            if (q) q.setAttribute('aria-expanded', 'true');
            if (ico) ico.className = 'fas fa-minus';
            if (answer) {
                // set maxHeight to scrollHeight for snappy transition
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        }

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            // initialize collapsed state
            if (item.classList.contains('active')) {
                if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                if (answer) answer.style.maxHeight = '0px';
            }

            if (question) {
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Close all items first (single-open behavior)
                    faqItems.forEach(other => {
                        if (other !== item) closeItem(other);
                    });

                    // Toggle this one
                    if (isActive) {
                        closeItem(item);
                    } else {
                        openItem(item);
                    }
                });
            }
        });

        // Open first item by default for accessibility
        const first = faqItems[0];
        if (first && !first.classList.contains('active')) {
            openItem(first);
        }
    });
