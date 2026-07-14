// Program Outline Feature Loader
document.addEventListener('DOMContentLoaded', function() {
    // Immediately load program features instead of using animation delays
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    });
    
    // Journey Progress Square Hover Effects
    const setupJourneySquareHover = () => {
        const partICard = document.querySelector('.program-card.part-i');
        const partIICard = document.querySelector('.program-card.part-ii');
        const squareParts = document.querySelectorAll('.square-part');
        
        if (partICard && partIICard && squareParts.length >= 4) {
            // Part I Card hover - glow first two parts (top-left and top-right)
            partICard.addEventListener('mouseenter', () => {
                squareParts[0].classList.add('glow'); // part-1
                squareParts[1].classList.add('glow'); // part-2
            });
            
            partICard.addEventListener('mouseleave', () => {
                squareParts[0].classList.remove('glow');
                squareParts[1].classList.remove('glow');
            });
            
            // Part II Card hover - glow last two parts (bottom-left and bottom-right)
            partIICard.addEventListener('mouseenter', () => {
                squareParts[2].classList.add('glow'); // part-3
                squareParts[3].classList.add('glow'); // part-4
            });
            
            partIICard.addEventListener('mouseleave', () => {
                squareParts[2].classList.remove('glow');
                squareParts[3].classList.remove('glow');
            });
        }
    };
    
    // Initialize journey square hover after DOM is ready
    setTimeout(setupJourneySquareHover, 100);

    // Improve card hover effects
    const programCards = document.querySelectorAll('.program-card');
    programCards.forEach(card => {
        // Apply smooth hover transition
        card.addEventListener('mouseenter', function() {
            // Add a subtle shine effect when hovering
            const shine = document.createElement('div');
            shine.classList.add('card-shine');
            this.appendChild(shine);
            
            setTimeout(() => {
                shine.style.opacity = '0';
                shine.style.transform = 'translateY(-100%) translateX(100%)';
            }, 50);
            
            setTimeout(() => {
                if (shine && shine.parentNode === this) {
                    this.removeChild(shine);
                }
            }, 500);
            
            // Highlight feature items on hover
            const features = this.querySelectorAll('.feature-item');
            features.forEach((feature, index) => {
                setTimeout(() => {
                    feature.classList.add('feature-highlight');
                }, index * 100);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove highlight from features
            const features = this.querySelectorAll('.feature-item');
            features.forEach(feature => {
                feature.classList.remove('feature-highlight');
            });
        });
    });
});

// Add custom styles for the shine effect and feature highlights
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .card-shine {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                135deg,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,0.1) 50%,
                rgba(255,255,255,0) 100%
            );
            transform: translateY(100%) translateX(-100%);
            transition: all 0.5s ease;
            pointer-events: none;
            z-index: 5;
        }
        
        .feature-highlight {
            transform: translateY(-2px) scale(1.03) !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important;
            z-index: 10;
        }
        
        .feature-item {
            transition: all 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
});
