// TASC Journey Interactive Timeline
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const programContents = document.querySelectorAll('.program-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs and content
            tabButtons.forEach(tab => tab.classList.remove('active'));
            programContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Show corresponding content
            const programType = button.getAttribute('data-program');
            const targetContent = document.getElementById(`${programType}-content`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // Timeline animation on scroll
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Animate milestones sequentially
                const milestones = entry.target.querySelectorAll('.timeline-milestone');
                milestones.forEach((milestone, index) => {
                    setTimeout(() => {
                        milestone.classList.add('revealed');
                    }, index * 300);
                });
            }
        });
    }, observerOptions);
    
    // Observe timeline containers
    const timelineContainers = document.querySelectorAll('.timeline-container');
    timelineContainers.forEach(container => {
        timelineObserver.observe(container);
    });
    
    // Date chip hover effects
    const dateChips = document.querySelectorAll('.date-chip');
    dateChips.forEach(chip => {
        chip.addEventListener('mouseenter', () => {
            chip.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        chip.addEventListener('mouseleave', () => {
            chip.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Journey button animation
    const journeyBtns = document.querySelectorAll('.journey-btn');
    journeyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Create ripple effect
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('div');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            btn.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Stats counter animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const finalValue = stat.textContent;
                    if (!isNaN(parseInt(finalValue))) {
                        animateCounter(stat, parseInt(finalValue));
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    const programStats = document.querySelector('.program-stats');
    if (programStats) {
        statsObserver.observe(programStats);
    }
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60; // 60 frames for smooth animation
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.ceil(current) + '+';
            }
        }, 16);
    }
});

// Add dynamic background particles
function createParticles() {
    const section = document.querySelector('.tasc-dates-section');
    if (!section) return;
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        section.appendChild(particle);
    }
}

// Initialize particles after DOM load
document.addEventListener('DOMContentLoaded', createParticles);