/**
 * Timeline Carousel Automation
 * Enhanced version with smoother transitions and optimized performance
 * Automatically rotates through the timeline cards with elegant transitions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const AUTO_ROTATE_INTERVAL = 8000; // Time between auto-rotations (in milliseconds) - longer for better viewing
  const TRANSITION_DURATION = 2000; // Match this with the CSS transition duration (in ms)
  const TOTAL_ITEMS = 9; // Total number of timeline items
  let currentIndex = 0;
  let autoRotateInterval;
  let userInteracted = false;
  let isTransitioning = false; // Flag to prevent multiple transitions at once
  
  // Get all timeline elements
  const timelineInputs = Array.from(document.querySelectorAll('.timeline-cards input[type="radio"]'));
  const timelineContainer = document.querySelector('.timeline-cards-container');
  const timelineCards = document.querySelector('.timeline-cards');
  
  // Initialize - check which item is currently selected
  timelineInputs.forEach((input, index) => {
    if (input.checked) {
      currentIndex = index;
    }
  });
  
  // Function to rotate to a specific timeline item with guaranteed smooth animation
  function rotateTo(index) {
    if (isTransitioning) return; // Prevent multiple transitions
    isTransitioning = true;
    
    // Set the new index
    currentIndex = index;
    
    // Force a browser reflow before adding the class to ensure animation triggers
    void timelineCards.offsetWidth;
    
    // Add animation class for smooth transition
    timelineCards.classList.add('rotating');
    
    // Delay checking the radio button by a tiny amount to ensure CSS transitions catch up
    setTimeout(() => {
      // Check the corresponding radio button (triggers the rotation)
      timelineInputs[currentIndex].checked = true;
    }, 20); // Small delay to ensure transition always triggers
    
    // Reset the transition state after animation completes
    setTimeout(() => {
      timelineCards.classList.remove('rotating');
      isTransitioning = false;
    }, TRANSITION_DURATION + 100); // Add extra buffer time to ensure animation completes
  }
  
  // Function to rotate to the next timeline item
  function rotateToNextItem() {
    rotateTo((currentIndex + 1) % TOTAL_ITEMS);
  }
  
  // Function to rotate to the previous timeline item
  function rotateToPreviousItem() {
    rotateTo((currentIndex - 1 + TOTAL_ITEMS) % TOTAL_ITEMS);
  }
  
  // Start auto-rotation with performance optimization
  function startAutoRotate() {
    if (autoRotateInterval) clearInterval(autoRotateInterval);
    
    // Use requestAnimationFrame for smoother performance
    const startTime = Date.now();
    
    function checkRotation() {
      const currentTime = Date.now();
      
      // If enough time has passed and user isn't interacting, rotate
      if (currentTime - startTime >= AUTO_ROTATE_INTERVAL && !userInteracted && !isTransitioning) {
        rotateToNextItem();
        startAutoRotate(); // Restart the timer
      } else {
        // Check again in the next frame
        requestAnimationFrame(checkRotation);
      }
    }
    
    // Start checking for rotation timing
    requestAnimationFrame(checkRotation);
  }
  
  // Event listener for user interaction with radio buttons
  timelineInputs.forEach((input, idx) => {
    input.addEventListener('change', () => {
      userInteracted = true;
      
      // If the user selects a different item, rotate to it smoothly
      if (currentIndex !== idx) {
        rotateTo(idx);
      }
      
      // Reset user interaction flag after some time
      setTimeout(() => {
        userInteracted = false;
      }, AUTO_ROTATE_INTERVAL * 1.5);
    });
  });
  
  // Improve hover interaction
  timelineContainer.addEventListener('mouseenter', () => {
    userInteracted = true;
  });
  
  timelineContainer.addEventListener('mouseleave', () => {
    // Reset user interaction flag after leaving
    setTimeout(() => {
      userInteracted = false;
      // Restart auto-rotation when mouse leaves
      if (!isTransitioning) startAutoRotate();
    }, AUTO_ROTATE_INTERVAL / 3);
  });
  
  // Initialize auto-rotation
  startAutoRotate();
  
  // Enhanced touch interaction with better gesture detection
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let touchStartTime = 0;
  
  timelineContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
    userInteracted = true;
  }, { passive: true });
  
  timelineContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    const touchDuration = Date.now() - touchStartTime;
    
    handleSwipe(touchDuration);
    
    // Reset user interaction flag after touch with intelligent delay
    setTimeout(() => {
      userInteracted = false;
      if (!isTransitioning) startAutoRotate();
    }, AUTO_ROTATE_INTERVAL / 2);
  }, { passive: true });
  
  function handleSwipe(duration) {
    const swipeThreshold = 40; // Minimum swipe distance
    const maxSwipeTime = 300; // Maximum time for a swipe (ms)
    const horizontalDistance = touchEndX - touchStartX;
    const verticalDistance = Math.abs(touchEndY - touchStartY);
    
    // Only process horizontal swipes (with minimal vertical movement)
    if (duration < maxSwipeTime && Math.abs(horizontalDistance) > swipeThreshold && verticalDistance < swipeThreshold * 1.5) {
      if (horizontalDistance < 0) {
        // Swipe left - next item
        rotateToNextItem();
      } else {
        // Swipe right - previous item
        rotateToPreviousItem();
      }
    }
  }
  
  // Add keyboard navigation for accessibility
  document.addEventListener('keydown', (e) => {
    if (isElementInViewport(timelineContainer)) {
      if (e.key === 'ArrowRight') {
        rotateToNextItem();
        userInteracted = true;
        setTimeout(() => { userInteracted = false; }, AUTO_ROTATE_INTERVAL);
      } else if (e.key === 'ArrowLeft') {
        rotateToPreviousItem();
        userInteracted = true;
        setTimeout(() => { userInteracted = false; }, AUTO_ROTATE_INTERVAL);
      }
    }
  });
  
  // Helper function to check if an element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
  
  // Restart auto-rotation if window loses focus and regains it
  window.addEventListener('focus', () => {
    if (!userInteracted && !isTransitioning) startAutoRotate();
  });
  
  // Enhanced intersection observer with threshold array for smoother transitions
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add class with slight delay for a more natural appearance
        setTimeout(() => {
          timelineContainer.classList.add('in-view');
        }, 100);
        
        if (!userInteracted && !isTransitioning) startAutoRotate();
      } else {
        timelineContainer.classList.remove('in-view');
      }
    });
  }, { 
    threshold: [0.2, 0.4, 0.6], // Multiple thresholds for smoother detection
    rootMargin: '0px 0px -10% 0px' // Start animation slightly before fully in view
  });
  
  observer.observe(document.querySelector('.timeline-carousel-section'));
});
