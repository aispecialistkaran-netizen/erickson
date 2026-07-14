// Testimonials Infinite Card Carousel
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.testimonials-carousel-container');
    const carousel = document.querySelector('.testimonials-carousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let testimonials = [];
    let isAnimating = false;
    let autoplayInterval;
    let currentIndex = 0;
    
    // Load testimonials from JSON file
    fetch('testimonials.json')
        .then(response => response.json())
        .then(data => {
            testimonials = data;
            // Triple the testimonials array for smoother infinite scrolling
            testimonials = [...testimonials, ...testimonials, ...testimonials];
            loadTestimonials();
            initCarousel();
        })
        .catch(error => {
            console.error('Error loading testimonials:', error);
        });
    
    // Function to create testimonial cards from JSON data
    function loadTestimonials() {
        // Clear any existing slides
        carousel.innerHTML = '';
        
        // Add carousel controls to container
        if (!container.querySelector('.carousel-control')) {
            const prevButton = document.createElement('button');
            prevButton.className = 'carousel-control carousel-prev';
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.setAttribute('type', 'button');
            prevButton.setAttribute('aria-label', 'Previous testimonial');
            
            const nextButton = document.createElement('button');
            nextButton.className = 'carousel-control carousel-next';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.setAttribute('type', 'button');
            nextButton.setAttribute('aria-label', 'Next testimonial');
            
            container.appendChild(prevButton);
            container.appendChild(nextButton);
        }
        
        // Create cards for each testimonial
        testimonials.forEach(testimonial => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            
            const content = document.createElement('div');
            content.className = 'testimonial-content';
            
            // Rating stars (at the top)
            const rating = document.createElement('div');
            rating.className = 'testimonial-rating';
            rating.innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>';
            
            // Quote icon
            const quoteIcon = document.createElement('div');
            quoteIcon.className = 'testimonial-quote-icon';
            quoteIcon.innerHTML = '<i class="fas fa-quote-left"></i>';
            
            // Testimonial quote (in the middle)
            const quote = document.createElement('blockquote');
            quote.className = 'testimonial-quote';
            quote.textContent = testimonial.content;
            
            // Author info
            const author = document.createElement('div');
            author.className = 'testimonial-author';
            
            const authorImage = document.createElement('div');
            authorImage.className = 'author-image';

            // Minimal change: if there is no image (or image is a known placeholder), show a masked name instead
            const placeholderUrl = 'https://www.erickson.co.in/wp-content/uploads/2023/05/placeholder-profile.webp';
            const hasImage = testimonial.imageUrl && testimonial.imageUrl.trim() !== '' && testimonial.imageUrl !== placeholderUrl;

            // Return two-letter initials for masking: First letter of first and last word (e.g. "Navneet Eohail" -> "NE").
            // For single-word names, use first+last character (e.g. "Navneet" -> "Nt" -> uppercase "NT").
            function maskName(name) {
                if (!name) return '';
                const parts = name.trim().split(/\s+/).filter(Boolean);
                if (parts.length >= 2) {
                    const first = parts[0].charAt(0).toUpperCase();
                    const last = parts[parts.length - 1].charAt(0).toUpperCase();
                    return first + last;
                }
                const s = parts[0];
                if (s.length === 1) return s.toUpperCase() + s.toUpperCase();
                const first = s.charAt(0).toUpperCase();
                const last = s.charAt(s.length - 1).toUpperCase();
                return first + last;
            }

            if (hasImage) {
                const img = document.createElement('img');
                img.src = testimonial.imageUrl;
                img.alt = testimonial.name;
                img.loading = 'lazy';
                
                // Handle image load failure by showing mask instead
                img.onerror = () => {
                    authorImage.innerHTML = '';
                    const mask = document.createElement('div');
                    mask.className = 'author-mask';
                    mask.textContent = maskName(testimonial.name || '');
                    authorImage.appendChild(mask);
                };
                
                authorImage.appendChild(img);
            } else {
                const mask = document.createElement('div');
                mask.className = 'author-mask';
                mask.textContent = maskName(testimonial.name || '');
                authorImage.appendChild(mask);
            }

            const authorInfo = document.createElement('div');
            authorInfo.className = 'author-info';
            
            const authorName = document.createElement('h4');
            authorName.className = 'author-name';
            authorName.textContent = testimonial.name;
            
            const authorPosition = document.createElement('p');
            authorPosition.className = 'author-designation';
            authorPosition.textContent = testimonial.position || 'Erickson Graduate';
            
            // Assemble the components
            authorInfo.appendChild(authorName);
            authorInfo.appendChild(authorPosition);
            
            author.appendChild(authorImage);
            author.appendChild(authorInfo);
            
            // Order: Stars at top, quote in middle, profile at bottom
            content.appendChild(rating);
            content.appendChild(quoteIcon);
            content.appendChild(quote);
            content.appendChild(author);
            
            card.appendChild(content);
            carousel.appendChild(card);
        });
    }
    
    // Initialize carousel
    function initCarousel() {
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        // Set initial position to show first testimonial from middle set
        const originalLength = testimonials.length / 3;
        currentIndex = originalLength;
        const initialScrollPosition = currentIndex * getScrollAmount();
        carousel.scrollLeft = initialScrollPosition;
        
        // Previous slide button
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            stopAutoplay();
            previousSlide();
            startAutoplay();
        });
        
        // Next slide button
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            stopAutoplay();
            nextSlide();
            startAutoplay();
        });
        
        // Handle touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoplay();
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoplay();
        }, { passive: true });
        
        function handleSwipe() {
            const difference = touchStartX - touchEndX;
            if (Math.abs(difference) > 50) {
                if (difference > 0) { // Swipe left
                    nextSlide();
                } else { // Swipe right
                    previousSlide();
                }
            }
        }
        
        // Start autoplay
        startAutoplay();
        
        // Stop autoplay on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Maintain current position on resize
            const scrollAmount = getScrollAmount();
            carousel.scrollLeft = currentIndex * scrollAmount;
        });
    }
    
    // Get appropriate scroll amount based on viewport size
    function getScrollAmount() {
        // Scroll by 1 or more cards depending on viewport size
        const cardWidth = carousel.querySelector('.testimonial-card').offsetWidth;
        const gap = 20; // Same as CSS gap value
        return cardWidth + gap;
    }
    
    // Move to next slide
    function nextSlide() {
        if (isAnimating) return;
        
        currentIndex++;
        const originalLength = testimonials.length / 3;
        
        // Check if we need to loop back to avoid jumping
        if (currentIndex >= testimonials.length - originalLength) {
            // Jump to equivalent position in first set without animation
            currentIndex = originalLength;
        }
        
        scrollToSlide(currentIndex);
    }
    
    // Move to previous slide
    function previousSlide() {
        if (isAnimating) return;
        
        currentIndex--;
        const originalLength = testimonials.length / 3;
        
        // Check if we need to loop forward to avoid jumping
        if (currentIndex < originalLength) {
            // Jump to equivalent position in last set without animation
            currentIndex = testimonials.length - originalLength - 1;
        }
        
        scrollToSlide(currentIndex);
    }
    
    // Smooth scroll to specific slide
    function scrollToSlide(index) {
        isAnimating = true;
        
        const targetPosition = index * getScrollAmount();
        const currentPosition = carousel.scrollLeft;
        const distance = targetPosition - currentPosition;
        
        // Use animation frame for smoother scrolling
        let startTime = null;
        const duration = 600; // Smooth animation
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easeInOutCubic for smooth animation
            const easeProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
                
            carousel.scrollLeft = currentPosition + (distance * easeProgress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentIndex = index;
                isAnimating = false;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Auto scroll the carousel
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
            }
        }, 4500); // Slightly longer interval for better readability
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
});
