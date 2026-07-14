// Stats Animation
function initStatsAnimation() {
    // Counter animation for stat numbers
    const statCards = document.querySelectorAll('.stat-card');
    if (!statCards || statCards.length === 0) return;

    // Setup Intersection Observer to trigger animations when cards are visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statCard = entry.target;
                const numberElement = statCard.querySelector('.stat-number');
                if (!numberElement) return;
                // Prefer an explicit data-count attribute if present (set by other scripts)
                const dataCount = numberElement.getAttribute('data-count');
                const originalText = (dataCount !== null) ? dataCount : (numberElement.textContent || '');

                // Parse numeric part robustly (handles '75,000+', '40+', '19')
                const numericPart = String(originalText).replace(/[^0-9]/g, '');
                const finalValue = parseInt(numericPart.replace(/,/g, ''), 10) || 0;
                const suffix = String(originalText).replace(/[0-9,]/g, '');

                // Start counting animation
                animateCounter(numberElement, 0, finalValue, suffix);

                // Add animation class to the card
                setTimeout(() => {
                    statCard.classList.add('animated');
                }, 200);

                // Once animated, no need to observe anymore
                observer.unobserve(statCard);
            }
        });
    }, {
        threshold: 0.3
    });

    // Observe all stat cards
    statCards.forEach(card => {
        observer.observe(card);
    });

    // Function to animate counter from 0 to target
    function animateCounter(element, start, end, suffix) {
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeOut * end);

            // Format number with commas if needed
            let formattedNumber = current;
            if (current >= 1000) {
                formattedNumber = current.toLocaleString();
            }

            element.textContent = formattedNumber + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Final value with proper formatting
                let finalFormatted = end;
                if (end >= 1000) {
                    finalFormatted = end.toLocaleString();
                }
                element.textContent = finalFormatted + suffix;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Simple hover effect without tilting
    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStatsAnimation);
} else {
    initStatsAnimation();
}
