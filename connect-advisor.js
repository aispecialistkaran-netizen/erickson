// Connect with an Advisor JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Get the container where we'll add the advisors
  const advisorContainer = document.getElementById('advisor-grid');
  
  if (!advisorContainer) return;

  // Create popup modal HTML
  function createPopupModal() {
    const modal = document.createElement('div');
    modal.id = 'advisor-popup-modal';
    modal.className = 'advisor-popup-modal';
    modal.innerHTML = `
      <div class="advisor-popup-overlay">
        <div class="advisor-popup-content">
          <div class="advisor-popup-header">
            <h3>Connect with our Advisor</h3>
            <button class="advisor-popup-close" aria-label="Close popup">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="advisor-popup-body">
            <iframe 
              aria-label='Enroll Now' 
              frameborder="0" 
              style="height:500px;width:99%;border:none;" 
              src='https://forms.zohopublic.com/xmonks/form/EnrollNow/formperma/rYc6c1YvaQ6jXO7vVTZ8oTVOwXzo1E_XdFJ5KYI6ZLY'>
            </iframe>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  // Show popup modal
  function showPopup() {
    let modal = document.getElementById('advisor-popup-modal');
    if (!modal) {
      modal = createPopupModal();
    }
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Add close event listeners
    const closeBtn = modal.querySelector('.advisor-popup-close');
    const overlay = modal.querySelector('.advisor-popup-overlay');
    
    closeBtn.addEventListener('click', hidePopup);
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        hidePopup();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        hidePopup();
      }
    });
  }

  // Hide popup modal
  function hidePopup() {
    const modal = document.getElementById('advisor-popup-modal');
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }
  }
  
  // Import team members data
  import('./get-in-touch.js')
    .then(module => {
      const teamMembers = module.teamMembers;
      
      // Generate HTML for each team member
      teamMembers.forEach(member => {
        const advisorCard = document.createElement('div');
        advisorCard.className = 'advisor-card';
        
        // Create image container with circular shape
        const imageContainer = document.createElement('div');
        imageContainer.className = 'advisor-image-container';
        
        // Add profile image
        const image = document.createElement('img');
        image.className = 'advisor-image';
        image.src = member.image;
        image.alt = `${member.name}, ${member.designation}`;
        imageContainer.appendChild(image);
        
        // Create name with LinkedIn link
        const nameLink = document.createElement('a');
        nameLink.className = 'advisor-name';
        nameLink.href = member.linkedin;
        nameLink.target = "_blank";
        nameLink.rel = "noopener noreferrer";
        nameLink.textContent = member.name;
        
        // Add LinkedIn icon
        const linkedinIcon = document.createElement('i');
        linkedinIcon.className = 'fab fa-linkedin advisor-linkedin-icon';
        nameLink.appendChild(linkedinIcon);
        
        // Create designation
        const designation = document.createElement('div');
        designation.className = 'advisor-designation';
        designation.textContent = member.designation;
        
        // Create connect button - now opens popup instead of external link
        const connectButton = document.createElement('button');
        connectButton.className = 'advisor-connect-btn';
        connectButton.innerHTML = '<i class="fas fa-comment-dots"></i> Connect Now';
        
        // Add event listener to show popup
        connectButton.addEventListener('click', function(e) {
          e.preventDefault();
          showPopup();
          console.log(`${member.name} connect button clicked. Opening popup form.`);
        });
        
        // Append all elements to the card
        advisorCard.appendChild(imageContainer);
        advisorCard.appendChild(nameLink);
        advisorCard.appendChild(designation);
        advisorCard.appendChild(connectButton);
        
        // Add the card to the container
        advisorContainer.appendChild(advisorCard);
      });
    })
    .catch(error => {
      console.error('Error loading team members:', error);
      
      // Display an error message in the container
      if (advisorContainer) {
        advisorContainer.innerHTML = `
          <div style="text-align: center; color: #073F52; padding: 30px;">
            <i class="fas fa-exclamation-circle" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <p>We're sorry, but we couldn't load our advisor information at this time.</p>
          </div>
        `;
      }
    });
});
