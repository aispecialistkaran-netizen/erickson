/**
 * Erickson Global JavaScript - Header and Navigation Functions
 */
document.addEventListener('DOMContentLoaded', function() {
  // References to DOM elements
  const header = document.querySelector('.erickson-header');
  const menuToggle = document.querySelector('.erickson-menu-toggle');
  const menu = document.querySelector('.erickson-menu');
  const menuItemsWithChildren = document.querySelectorAll('.erickson-menu-item-has-children');
  
  // Handle window scroll for sticky header effects
  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  
  // Mobile menu toggle with animation
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Animate menu items entrance when opening
      if (menu.classList.contains('active')) {
        animateMenuItems();
      }
    });
  }
  
  // Animate menu items when menu opens
  function animateMenuItems() {
    const menuItems = menu.querySelectorAll('li');
    menuItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100 + (index * 50)); // Staggered animation
    });
  }
  
  // Handle submenu on mobile
  if (menuItemsWithChildren.length) {
    menuItemsWithChildren.forEach(item => {
      // For mobile: handle tap on parent items to show submenu
      const itemLink = item.querySelector('a');
      
      // Dynamically determine if we're in mobile view
      const isMobileView = () => window.innerWidth <= 991;
      
      itemLink.addEventListener('click', function(e) {
        // Only if it's mobile view
        if (isMobileView()) {
          e.preventDefault();
          
          // Close other open submenus
          menuItemsWithChildren.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
            }
          });
          
          // Toggle this submenu
          item.classList.toggle('active');
          
          // Scroll into view if needed
          if (item.classList.contains('active')) {
            setTimeout(() => {
              const submenu = item.querySelector('.erickson-submenu');
              const rect = submenu.getBoundingClientRect();
              const isVisible = rect.bottom <= window.innerHeight;
              
              // Ensure menu is fully visible within the viewport
              if (!isVisible) {
                submenu.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }
              
              // Force submenu to be contained within its parent to avoid horizontal overflow
              submenu.style.maxWidth = (item.offsetWidth - 20) + 'px';
            }, 300);
          }
        }
      });
      
      // Handle keyboard navigation for accessibility
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (isMobileView()) {
            e.preventDefault();
            item.classList.toggle('active');
          } else if (e.key === 'Enter') {
            // On desktop, Enter key navigates to the link
            itemLink.click();
          }
        } else if (e.key === 'Escape') {
          // Close submenu on Escape key
          item.classList.remove('active');
          if (isMobileView() && menu.classList.contains('active')) {
            menu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.focus(); // Return focus to menu toggle
          }
        }
      });
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (menu.classList.contains('active') && 
        !menu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      menu.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      // Reset any open submenus
      menuItemsWithChildren.forEach(item => {
        item.classList.remove('active');
      });
    }
  });
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      if (window.innerWidth > 991) {
        // Reset mobile menu state when switching to desktop
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Reset any open submenus on mobile
        menuItemsWithChildren.forEach(item => {
          item.classList.remove('active');
        });
        
        // Reset any inline styles applied during animations
        const menuItems = menu.querySelectorAll('li');
        menuItems.forEach(item => {
          item.removeAttribute('style');
        });
        
        // Reset any inline styles on submenus
        const submenus = document.querySelectorAll('.erickson-submenu');
        submenus.forEach(submenu => {
          submenu.removeAttribute('style');
        });
      }
    }, 250);
  });
  
  // Function to ensure submenus are properly contained within the viewport
  function adjustSubmenuPositioning() {
    if (window.innerWidth <= 991) {
      const submenus = document.querySelectorAll('.erickson-submenu');
      submenus.forEach(submenu => {
        // Get parent container width
        const parentWidth = submenu.parentElement.offsetWidth;
        // Ensure submenu stays within parent bounds
        submenu.style.maxWidth = (parentWidth - 10) + 'px';
      });
    }
  }
  
  // Call this function on page load and resize
  window.addEventListener('load', adjustSubmenuPositioning);
  window.addEventListener('resize', adjustSubmenuPositioning);

  // Add smooth scrolling to anchor links

});

