/**
 * Creates an animated background with floating elements
 * Adds dynamic visual interest to the timeline section
 */

document.addEventListener('DOMContentLoaded', () => {
  // Create the animated background container
  const timelineSection = document.querySelector('.timeline-carousel-section');
  const animatedBackground = document.createElement('div');
  animatedBackground.className = 'animated-background';
  
  // Insert the animated background as the first child of the timeline section
  if (timelineSection.firstChild) {
    timelineSection.insertBefore(animatedBackground, timelineSection.firstChild);
  } else {
    timelineSection.appendChild(animatedBackground);
  }
  
  // Configuration for floating elements with enhanced visibility
  const elementColors = [
    'rgba(99, 183, 211, 0.35)',   // Light blue (more opaque)
    'rgba(235, 188, 52, 0.3)',    // Yellow (more opaque)
    'rgba(76, 175, 207, 0.4)',    // Deeper blue (more vibrant)
    'rgba(240, 203, 88, 0.25)'    // Golden yellow
  ];
  
  const elementShapes = [
    'circle',
    'square',
    'hexagon',
    'triangle',
    'plus'
  ];
  
  // Create floating elements - increased number for better visual impact
  const numberOfElements = Math.min(30, Math.floor(window.innerWidth / 40)); // More elements, adjusted for screen width
  
  for (let i = 0; i < numberOfElements; i++) {
    createFloatingElement(animatedBackground);
  }
  
  // Function to create a single floating element with enhanced visual effects
  function createFloatingElement(container) {
    // Create element
    const element = document.createElement('div');
    element.className = 'floating-element';
    
    // Random properties with bigger size range
    const size = Math.floor(Math.random() * 60) + 30; // 30-90px (larger elements)
    const shape = elementShapes[Math.floor(Math.random() * elementShapes.length)];
    const color = elementColors[Math.floor(Math.random() * elementColors.length)];
    
    // Set CSS variables for positioning and animation
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;
    element.style.top = `${Math.random() * 100}%`;
    element.style.left = `${Math.random() * 100}%`;
    element.style.opacity = (Math.random() * 0.4 + 0.3).toFixed(2); // 0.3 - 0.7 (more visible)
    
    // Enhanced visual effects with box-shadow
    const glowSize = Math.floor(size / 2);
    element.style.boxShadow = `0 0 ${glowSize}px rgba(99, 183, 211, 0.35), inset 0 0 ${Math.floor(glowSize/2)}px rgba(255, 255, 255, 0.2)`;
    
    // Set animation properties - slightly faster to be more noticeable
    const duration = Math.floor(Math.random() * 15) + 15; // 15-30s (faster)
    const delay = Math.floor(Math.random() * 10); // 0-10s
    element.style.animationDuration = `${duration}s`;
    element.style.animationDelay = `-${delay}s`; // Negative delay for immediate start at different positions
    
    // Apply shape
    switch(shape) {
      case 'circle':
        element.style.borderRadius = '50%';
        element.style.background = color;
        break;
      case 'square':
        element.style.borderRadius = '4px';
        element.style.background = color;
        break;
      case 'hexagon':
        element.style.background = color;
        element.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        break;
      case 'triangle':
        element.style.background = color;
        element.style.clipPath = 'polygon(50% 0%, 100% 100%, 0% 100%)';
        break;
      case 'plus':
        element.style.background = 'none';
        element.style.border = `2px solid ${color}`;
        element.style.borderRadius = '0';
        element.style.clipPath = 'polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%)';
        break;
    }
    
    // Add to container
    container.appendChild(element);
  }
  
  // Add scroll-based parallax effect
  let lastScrollY = window.scrollY;
  const parallaxElements = document.querySelectorAll('.floating-element');
  
  window.addEventListener('scroll', () => {
    const scrollDifference = window.scrollY - lastScrollY;
    
    if (isElementInViewport(timelineSection)) {
      parallaxElements.forEach((element, index) => {
        // Different parallax rates for each element
        const parallaxRate = 0.05 + (index % 3) * 0.03;
        const currentTop = parseFloat(element.style.top);
        element.style.top = `${currentTop - scrollDifference * parallaxRate}%`;
        
        // Wrap elements if they move out of view
        if (parseFloat(element.style.top) < -10) {
          element.style.top = '110%';
        } else if (parseFloat(element.style.top) > 110) {
          element.style.top = '-10%';
        }
      });
    }
    
    lastScrollY = window.scrollY;
  });
  
  // Helper function to check if element is in viewport
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.bottom >= 0
    );
  }
});
