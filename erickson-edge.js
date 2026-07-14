document.addEventListener('DOMContentLoaded', () => {
    const section = document.querySelector('.erickson-edge-section');
    if (!section) return;

    const carouselContainer = section.querySelector('.edge-carousel-container');
    const slides = section.querySelectorAll('.insight-slide');
    const dots = section.querySelectorAll('.nav-dot');
    const progresses = section.querySelectorAll('.nav-progress');
    
    let currentIndex = 0;
    const duration = 5000; // 5 seconds per slide
    let startTime;
    let elapsed = 0;
    let isPaused = false;

    function updateCarousel(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        progresses.forEach(p => p.style.width = '0%');

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentIndex = index;
        elapsed = 0;
        startTime = Date.now();
    }

    function step() {
        if (!isPaused) {
            elapsed = Date.now() - startTime;
            const progress = (elapsed / duration) * 100;
            
            if (progresses[currentIndex]) {
                progresses[currentIndex].style.width = `${Math.min(progress, 100)}%`;
            }

            if (elapsed >= duration) {
                let nextIndex = (currentIndex + 1) % slides.length;
                updateCarousel(nextIndex);
            }
        }
        requestAnimationFrame(step);
    }

    // Initialize
    startTime = Date.now();
    requestAnimationFrame(step);

    // Event Listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    // Pause ONLY on carousel container hover, not the whole section
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        carouselContainer.addEventListener('mouseleave', () => {
            isPaused = false;
            startTime = Date.now() - elapsed; // Resume from where it left off
        });
    }
});
