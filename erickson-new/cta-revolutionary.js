/**
 * Revolutionary CTA Section - Interactive JavaScript
 * Adds scroll-triggered animations, enhanced interactions, and dynamic effects
 */

class RevolutionaryCTA {
    constructor() {
        this.section = document.querySelector('.cta-revolutionary');
        this.leftPanel = document.querySelector('.cta-left-panel');
        this.rightPanel = document.querySelector('.cta-right-panel');
        this.titleLines = document.querySelectorAll('.title-line');
        this.floatingElements = document.querySelectorAll('.float-element');
        this.trustStats = document.querySelectorAll('.trust-stat');
        
        this.isInView = false;
        this.animationTriggered = false;
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollEffects();
        this.setupInteractiveElements();
        this.setupParticleEffects();
        this.setupStatCounters();
        
        // Enhanced hover effects
        this.setupEnhancedHovers();
        
        // Keyboard accessibility
        this.setupKeyboardNavigation();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isInView = true;
                    this.triggerEntryAnimations();
                } else {
                    this.isInView = false;
                }
            });
        }, observerOptions);

        if (this.section) {
            observer.observe(this.section);
        }
    }

    triggerEntryAnimations() {
        if (this.animationTriggered) return;
        this.animationTriggered = true;

        // Stagger title animations
        this.titleLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.animationPlayState = 'running';
                
                // Add typing effect to highlighted title
                if (line.classList.contains('highlight')) {
                    this.addTypingEffect(line);
                }
            }, index * 300);
        });

        // Trigger floating elements
        setTimeout(() => {
            this.animateFloatingElements();
        }, 1200);

        // Start stat counters
        setTimeout(() => {
            this.startStatCounters();
        }, 2000);
    }

    addTypingEffect(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '3px solid var(--erickson-secondary)';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        }, 100);
    }

    setupScrollEffects() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking && this.isInView) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    updateScrollEffects() {
        const scrollProgress = this.getScrollProgress();
        
        // Parallax effects for geometric patterns
        const patterns = document.querySelectorAll('.pattern-layer');
        patterns.forEach((pattern, index) => {
            const speed = (index + 1) * 0.5;
            const yPos = scrollProgress * speed * 50;
            pattern.style.transform = `translateY(${yPos}px) rotate(${scrollProgress * 180}deg)`;
        });

        // Dynamic particle field movement
        const particleField = document.querySelector('.particle-field');
        if (particleField) {
            const moveX = Math.sin(scrollProgress * Math.PI * 2) * 10;
            const moveY = Math.cos(scrollProgress * Math.PI * 2) * 10;
            particleField.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }

        // Floating elements responsive to scroll
        this.floatingElements.forEach((element, index) => {
            const speed = (index % 2 === 0) ? 1 : -1;
            const yPos = Math.sin(scrollProgress * Math.PI * 4 + index) * 15 * speed;
            element.style.transform = `translateY(${yPos}px) rotate(${scrollProgress * 90 + index * 45}deg)`;
        });
    }

    getScrollProgress() {
        if (!this.section) return 0;
        
        const rect = this.section.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionHeight = rect.height;
        
        const visibleTop = Math.max(0, windowHeight - rect.top);
        const visibleBottom = Math.min(sectionHeight, windowHeight - rect.bottom + sectionHeight);
        const visibleHeight = Math.max(0, visibleBottom - Math.max(0, -rect.top));
        
        return Math.min(1, Math.max(0, visibleHeight / (windowHeight + sectionHeight)));
    }

    setupInteractiveElements() {
        // Enhanced button interactions
        const buttons = document.querySelectorAll('.cta-primary-btn, .cta-secondary-btn');
        buttons.forEach(button => {
            this.setupButtonInteractions(button);
        });

        // Interactive floating elements
        this.floatingElements.forEach((element, index) => {
            this.setupFloatingElementInteraction(element, index);
        });

        // Central visual interactions
        const centralIcon = document.querySelector('.central-icon');
        if (centralIcon) {
            this.setupCentralIconInteraction(centralIcon);
        }
    }

    setupButtonInteractions(button) {
        button.addEventListener('mouseenter', (e) => {
            this.createRippleEffect(e.target, e);
            
            // Add magnetic effect
            button.style.transform = 'translateY(-5px) scale(1.02)';
            
            // Enhanced glow animation
            const glow = button.querySelector('.btn-glow');
            if (glow) {
                glow.style.animation = 'none';
                glow.offsetHeight; // Trigger reflow
                glow.style.animation = 'buttonGlow 0.6s ease-out forwards';
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });

        button.addEventListener('click', (e) => {
            this.createClickExplosion(e.target, e);
        });
    }

    setupFloatingElementInteraction(element, index) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = `scale(1.2) rotate(${index * 45}deg)`;
            element.style.boxShadow = '0 10px 25px rgba(99, 183, 211, 0.4)';
            
            // Create orbiting particles
            this.createOrbitingParticles(element);
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
            element.style.boxShadow = '';
        });
    }

    setupCentralIconInteraction(icon) {
        icon.addEventListener('mouseenter', () => {
            // Create expanding rings
            this.createExpandingRings(icon);
            
            // Enhanced pulse animation
            icon.style.animation = 'none';
            icon.offsetHeight;
            icon.style.animation = 'enhancedPulse 0.6s ease-out forwards';
        });

        // Click interaction for easter egg
        let clickCount = 0;
        icon.addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                this.triggerEasterEgg();
                clickCount = 0;
            }
        });
    }

    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 100;
        `;
        
        element.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    createClickExplosion(element, event) {
        const particles = 12;
        const rect = element.getBoundingClientRect();
        
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            const angle = (i / particles) * Math.PI * 2;
            const velocity = 50 + Math.random() * 30;
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            
            particle.style.cssText = `
                position: fixed;
                left: ${event.clientX}px;
                top: ${event.clientY}px;
                width: 6px;
                height: 6px;
                background: var(--erickson-secondary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: particleExplosion 0.8s ease-out forwards;
                --dx: ${Math.cos(angle) * velocity}px;
                --dy: ${Math.sin(angle) * velocity}px;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    }

    setupParticleEffects() {
        // Dynamic particle generation
        setInterval(() => {
            if (this.isInView && Math.random() > 0.7) {
                this.createFloatingParticle();
            }
        }, 2000);
    }

    createFloatingParticle() {
        const particle = document.createElement('div');
        const startX = Math.random() * window.innerWidth;
        const colors = ['var(--erickson-secondary)', 'var(--erickson-accent)', 'rgba(255,255,255,0.6)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: 100vh;
            width: ${3 + Math.random() * 5}px;
            height: ${3 + Math.random() * 5}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            animation: floatUp 6s linear forwards;
            opacity: ${0.3 + Math.random() * 0.4};
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 6000);
    }

    setupStatCounters() {
        this.statCounters = [
            { element: this.trustStats[0]?.querySelector('.stat-number'), target: 25, suffix: '+' },
            { element: this.trustStats[1]?.querySelector('.stat-number'), target: 10000, suffix: '+' },
            { element: this.trustStats[2]?.querySelector('.stat-number'), target: 50, suffix: '+' }
        ];
    }

    startStatCounters() {
        this.statCounters.forEach((counter, index) => {
            if (!counter.element) return;
            
            setTimeout(() => {
                this.animateCounter(counter.element, counter.target, counter.suffix);
            }, index * 200);
        });
    }

    animateCounter(element, target, suffix) {
        const duration = 2000;
        const steps = 60;
        const stepValue = target / steps;
        let currentValue = 0;
        let step = 0;
        
        const timer = setInterval(() => {
            step++;
            currentValue = Math.min(target, Math.floor(stepValue * step));
            
            if (target >= 1000) {
                element.textContent = (currentValue / 1000).toFixed(currentValue >= 1000 ? 0 : 1) + 'K' + suffix;
            } else {
                element.textContent = currentValue + suffix;
            }
            
            if (step >= steps) {
                clearInterval(timer);
                // Final value
                if (target >= 1000) {
                    element.textContent = (target / 1000).toFixed(target >= 1000 ? 0 : 1) + 'K' + suffix;
                } else {
                    element.textContent = target + suffix;
                }
            }
        }, duration / steps);
    }

    animateFloatingElements() {
        this.floatingElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.animation = `float 4s ease-in-out infinite`;
                element.style.animationDelay = `${index * 0.5}s`;
            }, index * 200);
        });
    }

    setupEnhancedHovers() {
        // Mouse tracking for enhanced parallax
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            
            if (this.isInView) {
                this.updateMouseParallax(mouseX, mouseY);
            }
        });
    }

    updateMouseParallax(mouseX, mouseY) {
        // Subtle parallax for floating elements
        this.floatingElements.forEach((element, index) => {
            const intensity = (index + 1) * 5;
            const x = mouseX * intensity;
            const y = mouseY * intensity;
            
            element.style.transform += ` translate(${x}px, ${y}px)`;
        });
        
        // Geometric patterns response
        const patterns = document.querySelectorAll('.pattern-layer');
        patterns.forEach((pattern, index) => {
            const intensity = (index + 1) * 3;
            const x = mouseX * intensity;
            const y = mouseY * intensity;
            
            pattern.style.transform += ` translate(${x}px, ${y}px)`;
        });
    }

    setupKeyboardNavigation() {
        const interactiveElements = [
            ...document.querySelectorAll('.cta-primary-btn, .cta-secondary-btn'),
            ...this.floatingElements
        ];
        
        interactiveElements.forEach(element => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }

    triggerEasterEgg() {
        // Create spectacular visual effect
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        // Create multiple bursts
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.createColorBurst(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 200);
        }
        
        document.body.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }

    createColorBurst(x, y) {
        const colors = ['#63B7D3', '#EBBC34', '#E88755', '#ffffff'];
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            const angle = (i / 20) * Math.PI * 2;
            const velocity = 100 + Math.random() * 50;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: burst 1.5s ease-out forwards;
                --dx: ${Math.cos(angle) * velocity}px;
                --dy: ${Math.sin(angle) * velocity}px;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    }
}

// Additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes buttonGlow {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    @keyframes enhancedPulse {
        0% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.15); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes particleExplosion {
        to {
            transform: translate(var(--dx), var(--dy));
            opacity: 0;
        }
    }
    
    @keyframes floatUp {
        to {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
    
    @keyframes burst {
        to {
            transform: translate(var(--dx), var(--dy));
            opacity: 0;
            transform: scale(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RevolutionaryCTA();
});

// Also initialize if script loads after DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new RevolutionaryCTA();
    });
} else {
    new RevolutionaryCTA();
}