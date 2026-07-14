// Program Outline Section Animation Script
document.addEventListener('DOMContentLoaded', function() {
    // Elements for scroll animation
    const programOutlineSection = document.querySelector('.program-outline-section');
    const programCards = document.querySelectorAll('.program-card');
    const journeyLine = document.querySelector('.journey-line-container');
    const journeyDots = document.querySelectorAll('.journey-dot');
    
    // Animate elements when they come into view
    function animateOnScroll() {
        const triggerPoint = window.innerHeight * 0.8;
        
        if (programOutlineSection) {
            const sectionDistance = programOutlineSection.getBoundingClientRect().top;
            
            // When section comes into view
            if (sectionDistance < triggerPoint) {
                // Add particles animation
                const particles = createParticles();
                programOutlineSection.querySelector('.particles-bg').appendChild(particles);
                
                // Add active class to journey line and dots
                if (journeyLine) journeyLine.classList.add('active');
                journeyDots.forEach((dot, index) => {
                    setTimeout(() => {
                        dot.classList.add('active');
                    }, index * 300);
                });
            }
        }
    }
    
    // Create animated particles
    function createParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        
        // Create multiple particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position, size, and animation delay
            const size = Math.random() * 10 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            
            // Random color based on Erickson color scheme
            const colors = ['rgba(7, 63, 82, 0.2)', 'rgba(99, 183, 211, 0.2)', 'rgba(235, 188, 52, 0.2)', 'rgba(232, 135, 85, 0.2)'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = randomColor;
            
            particlesContainer.appendChild(particle);
        }
        
        return particlesContainer;
    }
    
    // Simple hover effects for program cards (no 3D transforms)
    programCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Simple scale and shadow effect
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset transform on mouse leave
            card.style.transform = '';
        });
    });
    
    // Listen for scroll events
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize on page load
    animateOnScroll();
});
