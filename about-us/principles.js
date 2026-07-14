/**
 * Principles section animations
 * Adds visual effects to the principles image and items
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if Intersection Observer is supported
  if ('IntersectionObserver' in window) {
    const principlesSection = document.querySelector('.principles-section');
    const principlesImage = document.querySelector('.principles-main-image');
    const principleItems = document.querySelectorAll('.principle-item');
    
    // Create an observer for the principles section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class to image
          if (principlesImage) {
            principlesImage.classList.add('principles-image-visible');
          }
          
          // Add staggered animation to principle items
          if (principleItems.length) {
            principleItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('principle-item-visible');
              }, 150 * index);
            });
          }
          
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 }); // Trigger when 20% of the section is visible
    
    // Start observing the principles section
    if (principlesSection) {
      observer.observe(principlesSection);
    }
  }
});
