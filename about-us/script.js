


// Create enhanced floating particles for the timeline background
function createParticles() {
    const particles = document.getElementById('particles');
    if (!particles) return;
    
    // Create multiple particles with different types
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
        // Create particle element
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Determine particle type (small dot, star, or glow)
        const particleType = Math.random() > 0.8 ? 'star' : Math.random() > 0.6 ? 'glow' : 'dot';
        
        // Random position, size, and opacity based on particle type
        let size, color, opacity, blurAmount;
        
        switch(particleType) {
            case 'star':
                size = Math.random() * 3 + 2;
                opacity = Math.random() * 0.8 + 0.2;
                blurAmount = '0px';
                color = Math.random() > 0.5 ? 'rgba(255, 255, 255, ' + opacity + ')' : 
                                             'rgba(160, 160, 255, ' + opacity + ')';
                particle.style.boxShadow = `0 0 ${Math.random() * 8 + 2}px rgba(255, 255, 255, 0.8)`;
                break;
                
            case 'glow':
                size = Math.random() * 8 + 4;
                opacity = Math.random() * 0.4 + 0.05;
                blurAmount = Math.random() * 10 + 5 + 'px';
                color = Math.random() > 0.5 ? 'rgba(66, 84, 255, ' + opacity + ')' : 
                                             'rgba(123, 66, 255, ' + opacity + ')';
                break;
                
            default: // dot
                size = Math.random() * 3 + 1;
                opacity = Math.random() * 0.5 + 0.1;
                blurAmount = '0px';
                color = 'rgba(255, 255, 255, ' + opacity + ')';
        }
        
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 8;
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = opacity;
        particle.style.background = color;
        particle.style.filter = `blur(${blurAmount})`;
        
        // Add to container
        particles.appendChild(particle);
        
        // Different animations for different particle types
        if (particleType === 'star') {
            // Stars have twinkling effect
            gsap.to(particle, {
                opacity: 0.1,
                duration: 1 + Math.random() * 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            gsap.to(particle, {
                y: -150 - (Math.random() * 150),
                x: (Math.random() - 0.5) * 50,
                duration: 20 + Math.random() * 40,
                delay: delay,
                repeat: -1,
                ease: "none"
            });
        } else if (particleType === 'glow') {
            // Glowing particles move slower and pulse
            gsap.to(particle, {
                scale: Math.random() * 1.5 + 1,
                opacity: opacity * 0.5,
                duration: 3 + Math.random() * 5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            gsap.to(particle, {
                y: -100 - (Math.random() * 100),
                x: (Math.random() - 0.5) * 30,
                duration: 30 + Math.random() * 40,
                delay: delay,
                repeat: -1,
                ease: "power1.inOut"
            });
        } else {
            // Regular dots float upward
            gsap.to(particle, {
                y: -120 - (Math.random() * 150),
                x: (Math.random() - 0.5) * 40,
                opacity: 0,
                duration: 15 + Math.random() * 25,
                delay: delay,
                repeat: -1,
                ease: "power1.out"
            });
        }
    }
}

// Mobile check function
function isMobile() {
    return window.innerWidth < 768;
}

// Handle timeline card hover animations
function initializeTimelineCardHovers() {
    if (isMobile()) return;
    
    const timelineCards = document.querySelectorAll('.timeline-card');
    
    timelineCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                scale: 1.03,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                duration: 0.5,
                ease: "power2.out"
            });
            
            gsap.to(card.querySelector('.timeline-icon'), {
                rotate: 10,
                scale: 1.1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                duration: 0.5,
                ease: "power2.inOut"
            });
            
            gsap.to(card.querySelector('.timeline-icon'), {
                rotate: 0,
                scale: 1,
                duration: 0.5,
                ease: "back.out(1.7)"
            });
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the back-to-top button
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        };

        // Listen for scroll events to toggle button visibility
        window.addEventListener('scroll', toggleVisibility);

        // Scroll to the top when the button is clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Initialize the horizontal timeline
    initializeHorizontalTimeline();
    
    // Initialize timeline card hover animations
    initializeTimelineCardHovers();
    
    // Handle resize events
    window.addEventListener('resize', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh(true);
        }
    });
});