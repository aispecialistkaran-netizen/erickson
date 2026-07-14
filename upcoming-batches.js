document.addEventListener('DOMContentLoaded', function() {
    // Initialize pathway carousel
    initPathwayCarousel();

    function initPathwayCarousel() {
        let currentSlide = 0;
        const slides = document.querySelectorAll('.pathway-slide');
        const indicators = document.querySelectorAll('.pathway-indicator');
        const wrapper = document.querySelector('.pathway-carousel-wrapper');
        const prevBtn = document.querySelector('.pathway-prev');
        const nextBtn = document.querySelector('.pathway-next');
        
        if (!slides.length || !wrapper) return;

        // Auto-advance carousel every 5 seconds
        let autoAdvanceInterval = setInterval(nextSlide, 5000);

        function showSlide(index) {
            currentSlide = index;
            const translateX = -currentSlide * 100;
            wrapper.style.transform = `translateX(${translateX}%)`;
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentSlide);
                indicator.classList.toggle('bg-blue-600', i === currentSlide);
                indicator.classList.toggle('bg-gray-300', i !== currentSlide);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        // Event listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                clearInterval(autoAdvanceInterval);
                nextSlide();
                autoAdvanceInterval = setInterval(nextSlide, 5000);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(autoAdvanceInterval);
                prevSlide();
                autoAdvanceInterval = setInterval(nextSlide, 5000);
            });
        }

        // Indicator click events
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                clearInterval(autoAdvanceInterval);
                showSlide(index);
                autoAdvanceInterval = setInterval(nextSlide, 5000);
            });
        });

        // Pause on hover
        const carouselContainer = document.querySelector('.pathway-carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoAdvanceInterval);
            });

            carouselContainer.addEventListener('mouseleave', () => {
                autoAdvanceInterval = setInterval(nextSlide, 5000);
            });
        }
    }
});
