// Testimonials Infinite Card Carousel
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.testimonials-carousel-container');
    const carousel = document.querySelector('.testimonials-carousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let testimonials = [];
    let isAnimating = false;
    let autoplayInterval;
    
    // Load testimonials from JSON file
    fetch('testimonials.json')
        .then(response => response.json())
        .then(data => {
            testimonials = data;
            // Duplicate the testimonials array to allow for infinite scrolling effect
            testimonials = [...testimonials, ...testimonials.slice(0, 5)];
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
            
            const img = document.createElement('img');
            img.src = testimonial.imageUrl || 'https://www.erickson.co.in/wp-content/uploads/2023/05/placeholder-profile.webp';
            img.alt = testimonial.name;
            img.loading = 'lazy';
            
            const authorInfo = document.createElement('div');
            authorInfo.className = 'author-info';
            
            const authorName = document.createElement('h4');
            authorName.className = 'author-name';
            authorName.textContent = testimonial.name;
            
            const authorPosition = document.createElement('p');
            authorPosition.className = 'author-designation';
            authorPosition.textContent = testimonial.position || 'Erickson Graduate';
            
            // Assemble the components
            authorImage.appendChild(img);
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
        
        // Previous slide button
        prevBtn.addEventListener('click', () => {
            if (isAnimating) return;
            stopAutoplay();
            // Smaller amount for smoother single-card scrolling
            const scrollAmount = getScrollAmount() * 0.8;
            scrollCarousel(-scrollAmount);
            startAutoplay();
        });
        
        // Next slide button
        nextBtn.addEventListener('click', () => {
            if (isAnimating) return;
            stopAutoplay();
            // Smaller amount for smoother single-card scrolling
            const scrollAmount = getScrollAmount() * 0.8;
            scrollCarousel(scrollAmount);
            startAutoplay();
        });
        
        // Handle scroll events
        carousel.addEventListener('scroll', () => {
            // Check if we're at the end and need to loop back
            handleInfiniteScroll();
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
            if (difference > 50) { // Swipe left
                scrollCarousel(scrollAmount);
            } else if (difference < -50) { // Swipe right
                scrollCarousel(-scrollAmount);
            }
        }
        
        // Start autoplay
        startAutoplay();
        
        // Stop autoplay on hover
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Recalculate scroll amount when window is resized
            handleInfiniteScroll();
        });
    }
    
    // Get appropriate scroll amount based on viewport size
    function getScrollAmount() {
        // Scroll by 1 or more cards depending on viewport size
        const cardWidth = carousel.querySelector('.testimonial-card').offsetWidth;
        const gap = 20; // Same as CSS gap value
        return cardWidth + gap;
    }
    
    // Smooth scroll carousel by specified amount
    function scrollCarousel(amount) {
        isAnimating = true;
        
        // Get current scroll position
        const currentScroll = carousel.scrollLeft;
        const targetScroll = currentScroll + amount;
        
        // Use animation frame for smoother scrolling
        let startTime = null;
        const duration = 800; // Slower, gentler animation (was 500)
        
        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easeInOutQuad easing function for smoother motion
            const easeProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
            carousel.scrollLeft = currentScroll + (amount * easeProgress);
            
            if (elapsed < duration) {
                requestAnimationFrame(animate);
            } else {
                isAnimating = false;
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Handle infinite scroll effect
    function handleInfiniteScroll() {
        const cards = carousel.querySelectorAll('.testimonial-card');
        
        // If we're close to the end, loop back to start more smoothly
        if (carousel.scrollLeft + carousel.offsetWidth >= carousel.scrollWidth - 200) {
            // Wait for any animations to complete, then smoothly reset
            setTimeout(() => {
                if (!isAnimating) {
                    // Smoothly transition to beginning using a subtle opacity transition
                    carousel.style.scrollBehavior = 'auto';
                    carousel.style.opacity = '0.98';
                    setTimeout(() => {
                        carousel.scrollTo({
                            left: 100,
                            behavior: 'auto'
                        });
                        
                        setTimeout(() => {
                            carousel.style.opacity = '1';
                            carousel.style.scrollBehavior = 'smooth';
                        }, 50);
                    }, 100);
                }
            }, 500);
        }
        
        // If we're close to the start (scrolling backwards), loop to the end
        if (carousel.scrollLeft <= 100) {
            // Calculate position near the end to jump to
            const jumpPosition = carousel.scrollWidth - carousel.offsetWidth - 200;
            if (jumpPosition > 0 && !isAnimating) {
                // Similar smooth transition when looping backward
                setTimeout(() => {
                    if (!isAnimating) {
                        carousel.style.scrollBehavior = 'auto';
                        carousel.style.opacity = '0.98';
                        setTimeout(() => {
                            carousel.scrollTo({
                                left: jumpPosition,
                                behavior: 'auto'
                            });
                            
                            setTimeout(() => {
                                carousel.style.opacity = '1';
                                carousel.style.scrollBehavior = 'smooth';
                            }, 50);
                        }, 100);
                    }
                }, 500);
            }
        }
    }
    
    // Auto scroll the carousel
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (!isAnimating) {
                // Use a smaller scroll amount for smoother auto-scrolling
                const autoScrollAmount = getScrollAmount() / 2;
                scrollCarousel(autoScrollAmount);
            }
        }, 4000); // More time between auto-scrolls (was 3000)
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
});
