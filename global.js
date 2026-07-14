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

document.addEventListener("DOMContentLoaded", () => {
  // Provide an array of events here. The system will pick the current/live event,
  // or the next upcoming one. After an event finishes it will move to the next.
// Events Data
  let sessionEvents = [];

  // Helper function to load events from JSON
  async function loadEventsData() {
    try {
      const response = await fetch('./events.json');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // Map the events.json standardized data into the format needed by global.js
      sessionEvents = data.map(event => {
        // Construct eventDate string e.g., "Oct 9, 2025 7:00 PM"
        let formattedDate = `${event.date} ${event.time}`; 
        try {
          const [year, month, day] = event.date.split('-');
          const dateObj = new Date(year, parseInt(month)-1, day);
          const monthStr = dateObj.toLocaleDateString('en-US', {month: 'short'});
          formattedDate = `${monthStr} ${parseInt(day)}, ${year} ${event.time}`;
        } catch (e) {
          console.error("Invalid date string:", event.date, e);
        }

        // Extract duration in hours from string like "1 Hour"
        const durationMatch = event.duration ? event.duration.match(/(\d+)/) : null;
        const durationHours = durationMatch ? parseInt(durationMatch[1], 10) : 1;

        return {
          title: event.title,
          presenter: event.presenter,
          eventDate: formattedDate,
          durationHours: durationHours,
          registrationLink: event.registrationLink,
          liveLink: event.liveLink || event.registrationLink
        };
      });
    } catch (error) {
      console.error('Error loading session events:', error);
    }
  }

  function createSessionStrip() {
    if (document.getElementById('sessionStrip')) return;
    const sessionStripHTML = `
      <style>
      /* Sleek 1-line announcement banner */
      .erickson-session-strip {
        display:flex;
        align-items:center;
        justify-content:center;
        padding:10px 20px;
        background:linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
        color:#fff;
        z-index:9999;
        font-size:0.95em;
        cursor:pointer;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        box-shadow: 0 0 15px rgba(255,255,255,0.1);
        transition: all 0.2s ease;
        gap:15px;
        overflow: hidden;
      }

      .erickson-session-strip:hover {
        background:linear-gradient(135deg, #2a2a2a 0%, #151515 100%);
      }

      .erickson-session-strip .session-info {
        display:flex;
        align-items:center;
        gap:8px;
        white-space:nowrap;
        overflow:hidden;
        animation: pulse 2s ease-in-out infinite;
      }

      .erickson-session-strip .session-info * {
        white-space:nowrap;
      }

      .erickson-session-strip .session-title {
        overflow:hidden;
        text-overflow:ellipsis;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.85; }
      }

      .erickson-session-strip .upcomingfade-button {
        padding:6px 14px;
        border-radius:4px;
        background:linear-gradient(135deg, #ed592c 0%, #d63d15 100%);
        color:#fff;
        border:1px solid rgba(255,255,255,0.2);
        cursor:pointer;
        font-size:0.85em;
        white-space:nowrap;
        box-shadow: 0 2px 10px rgba(237,89,44,0.3);
        transition: all 0.2s ease;
        font-weight: 600;
        flex-shrink:0;
      }

      .erickson-session-strip .upcomingfade-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(237,89,44,0.5);
      }
      
      .upcome-badge {
        padding: 2px 6px;
        border-radius: 4px;
        background: #444;
        font-size: 0.85em;
        flex-shrink: 0;
      }

      .live-badge {
        background: #ff4444; 
        color: #fff;
      }

      .show-mobile-only { display: none !important; }

      @media (max-width:900px) {
        .hide-mobile { display:none !important; }
        .show-mobile-only { display: block !important; }
        .erickson-session-strip {
          padding:8px 12px;
          gap:10px;
          justify-content: space-between;
        }
        .erickson-session-strip .session-info {
          font-size:0.85em;
          flex: 1;
        }
        .erickson-session-strip .upcomingfade-button {
          padding:5px 10px;
          font-size:0.8em;
        }
      }
      </style>

      <div class="session-strip erickson-session-strip" id="sessionStrip" role="region" aria-label="Upcoming session" tabindex="0">
      <div class="session-info" id="sessionInfo">
        <!-- Content will be dynamically generated -->
      </div>
      <button class="upcomingfade-button" id="sessionButton" aria-label="Register or Join session">
        Register Now
      </button>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', sessionStripHTML);
  }

  // Helper: find the event to show:
  // - If an event is currently live (now between start and end) prefer that.
  // - Otherwise pick the next upcoming event (soonest start > now).
  // - Return null if none found.
  function findActiveOrNextEvent() {
    const now = Date.now();
    let liveEvent = null;
    let upcomingEvent = null;

    sessionEvents.forEach(event => {
      const start = new Date(event.eventDate).getTime();
      const duration = (event.durationHours || 2) * 60 * 60 * 1000;
      const end = start + duration;

      if (start <= now && now < end) {
        // currently live
        if (!liveEvent || start < new Date(liveEvent.eventDate).getTime()) {
          liveEvent = event;
        }
      } else if (start > now) {
        // upcoming - choose the soonest one
        if (!upcomingEvent || start < new Date(upcomingEvent.eventDate).getTime()) {
          upcomingEvent = event;
        }
      }
    });

    return liveEvent || upcomingEvent || null;
  }

  function updateSessionContent() {
    const now = Date.now();
    const event = findActiveOrNextEvent();
    const sessionInfo = document.getElementById('sessionInfo');
    const sessionButton = document.getElementById('sessionButton');
    const sessionStrip = document.getElementById('sessionStrip');

    if (!sessionInfo || !sessionButton || !sessionStrip) return;

    if (!event) {
      // No upcoming events
      sessionInfo.innerHTML = `
        <span class="upcome-badge">[Soon]</span>
        <span class="session-title">Stay tuned for our next masterclass announcement</span>
      `;
      sessionButton.style.display = "none";
      sessionStrip.onclick = null;
      return;
    }

    const start = new Date(event.eventDate).getTime();
    const duration = (event.durationHours || 2) * 60 * 60 * 1000;
    const end = start + duration;

    if (start <= now && now < end) {
      // LIVE
      sessionInfo.innerHTML = `
        <span class="upcome-badge live-badge" style="font-weight:bold;">LIVE</span>
        <div style="display:flex; flex-direction:column; overflow:hidden; min-width:0; width:100%;">
          <div style="display:flex; align-items:center; gap:6px; overflow:hidden; width:100%;">
            <span class="session-title" style="font-weight:500;">${event.title}</span>
            <span class="hide-mobile" style="opacity:0.6; font-size:0.9em; white-space:nowrap;">by ${event.presenter}</span>
          </div>
          <div class="show-mobile-only" style="font-size:0.8em; opacity:0.8; margin-top:1px;">
            by ${event.presenter}
          </div>
        </div>
      `;
      sessionButton.style.display = "inline-block";
      sessionButton.textContent = "Join";
      sessionButton.onclick = () => window.open(event.liveLink || event.registrationLink, '_blank');
      sessionStrip.onclick = () => window.open(event.liveLink || event.registrationLink, '_blank');
    } else {
      // Upcoming (next)
      const timeDiff = start - now;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const eventDateFormatted = new Date(event.eventDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
      });
      const shortDate = new Date(event.eventDate).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      });

      sessionInfo.innerHTML = `
        <span class="upcome-badge hide-mobile">Upcoming</span>
        <div style="display:flex; flex-direction:column; overflow:hidden; min-width:0; width:100%;">
          <div style="display:flex; align-items:baseline; gap:6px; overflow:hidden; width:100%;">
            <span class="session-title" style="font-weight: 500;">${event.title}</span>
            <span class="hide-mobile" style="opacity:0.6; font-size:0.9em; white-space:nowrap;">by ${event.presenter}</span>
            <span class="hide-mobile" style="opacity:0.6; font-size:0.9em; white-space:nowrap;">• ${eventDateFormatted}</span>
          </div>
          <div class="show-mobile-only" style="font-size:0.8em; opacity:0.8; margin-top:2px;">
            ${shortDate} <span style="color:#f59e0b; margin-left: 6px; font-weight: 600;">${days}d ${hours}h</span>
          </div>
        </div>
        <span class="countdown hide-mobile" style="margin-left:8px;font-weight:600;color:#f59e0b;flex-shrink:0;">${days}d ${hours}h</span>
      `;

      sessionButton.style.display = "inline-block";
      sessionButton.textContent = "Register";
      sessionButton.onclick = () => window.open(event.registrationLink || '#', '_blank');
      sessionStrip.onclick = () => window.open(event.registrationLink || '#', '_blank');
    }
  }

  async function initializeSessionSystem() {
    await loadEventsData();
    createSessionStrip();
    updateSessionContent();
    // Update more frequently around transitions
    setInterval(updateSessionContent, 30 * 1000); // every 30s
  }

  // small delay to ensure DOM readiness
  setTimeout(initializeSessionSystem, 100);
});