(function () {
  // Ensure the script only runs once
  if (window.__xmonksFormInitialized) return;
  window.__xmonksFormInitialized = true;

  // Add FontAwesome for icons if not already present
  if (!document.getElementById('font-awesome-css')) {
    const link = document.createElement('link');
    link.id = 'font-awesome-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }

  // Inject Stylesheet
  const style = document.createElement('style');
  style.textContent = `
    /* Modal Backdrop */
    .xm-modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    .xm-modal-backdrop.active {
      opacity: 1;
      pointer-events: auto;
    }

    /* Modal Wrapper */
    .xm-modal-wrapper {
      background: #fff;
      width: 95%;
      max-width: 1050px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      transform: scale(0.95) translateY(20px);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: row;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .xm-modal-backdrop.active .xm-modal-wrapper {
      transform: scale(1) translateY(0);
    }

    /* Left Section - Info Panel */
    .xm-info-panel {
      width: 55%;
      background: linear-gradient(135deg, #075985 0%, #0369a1 40%, #0284c7 100%);
      color: #fff;
      padding: 35px 35px 0 35px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    /* Background pattern shapes */
    .xm-info-panel::before {
      content: '';
      position: absolute;
      top: -10%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 50%;
      pointer-events: none;
    }

    .xm-info-panel-content {
      position: relative;
      z-index: 2;
    }

    .xm-badge {
      display: inline-block;
      background: #f97316;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 6px 14px;
      border-radius: 4px;
      margin-bottom: 20px;
      letter-spacing: 0.5px;
    }

    .xm-title {
      font-size: 32px;
      font-weight: 800;
      line-height: 1.2;
      margin: 0 0 8px 0;
      color: #ffffff;
    }

    .xm-subtitle {
      font-size: 16px;
      color: #e0f2fe;
      margin: 0 0 30px 0;
      font-weight: 500;
    }

    /* Features Row */
    .xm-features-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 30px;
    }

    .xm-feature-card {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 12px 8px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .xm-feature-card i {
      font-size: 18px;
      color: #38bdf8;
      margin-bottom: 8px;
    }

    .xm-feature-text {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      line-height: 1.3;
    }

    /* Parts Grid */
    .xm-parts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 30px;
    }

    .xm-part-box {
      background: #ffffff;
      border-radius: 14px;
      padding: 15px;
      color: #0f172a;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      position: relative;
    }

    .xm-part-header {
      display: inline-block;
      background: #0284c7;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 12px;
      border-radius: 20px;
      margin-bottom: 10px;
    }

    .xm-part-header.part2 {
      background: #f97316;
    }

    .xm-part-date-wrapper {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .xm-part-date-wrapper i {
      color: #0284c7;
      margin-top: 2px;
      font-size: 14px;
    }

    .xm-part-date {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
      color: #334155;
    }

    /* Core Points Banner */
    .xm-points-section {
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 20px;
      margin-bottom: 25px;
    }

    .xm-points-header {
      font-size: 11px;
      font-weight: 800;
      color: #38bdf8;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
      text-transform: uppercase;
    }

    .xm-points-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .xm-point-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 600;
      color: #e2e8f0;
    }

    .xm-point-item i {
      color: #38bdf8;
      font-size: 10px;
    }

    /* Golden Award Badge */
    .xm-award-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: 3px solid #eab308;
      color: #1e293b;
      border-radius: 50%;
      width: 110px;
      height: 110px;
      margin: 0 auto -20px auto;
      text-align: center;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      z-index: 10;
      position: relative;
    }

    .xm-award-year {
      font-size: 12px;
      font-weight: 800;
      color: #854d0e;
    }

    .xm-award-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1.1;
      letter-spacing: 0.2px;
      color: #eab308;
      margin: 2px 0;
    }

    .xm-award-desc {
      font-size: 8px;
      font-weight: 700;
      color: #64748b;
    }

    .xm-award-icf {
      font-size: 12px;
      font-weight: 900;
      color: #0369a1;
      margin-top: 1px;
    }

    /* Info Gold Banner */
    .xm-info-footer-banner {
      background: #fef08a;
      color: #854d0e;
      font-size: 11px;
      font-weight: 700;
      text-align: center;
      padding: 12px 20px;
      margin: 0 -35px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-top: 1px solid #fef9c3;
    }

    /* Right Section - Form Panel */
    .xm-form-panel {
      width: 45%;
      padding: 40px;
      background: #ffffff;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* Close Button */
    .xm-modal-close-btn {
      position: absolute;
      top: 20px;
      right: 20px;
      background: #f1f5f9;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
      font-size: 18px;
      transition: all 0.2s ease;
      z-index: 10;
    }

    .xm-modal-close-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
      transform: rotate(90deg);
    }

    .xm-form-header {
      text-align: center;
      margin-bottom: 25px;
    }

    .xm-form-title {
      font-size: 28px;
      font-weight: 800;
      color: #0369a1;
      margin: 0 0 6px 0;
    }

    .xm-form-subtitle {
      font-size: 14px;
      font-weight: 700;
      color: #f97316;
      margin: 0 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Colored Dots */
    .xm-dots-separator {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
    }

    .xm-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .xm-dot-1 { background: #38bdf8; }
    .xm-dot-2 { background: #f97316; }
    .xm-dot-3 { background: #fcd34d; }

    /* Inputs Styling */
    .xm-input-group {
      margin-bottom: 16px;
      position: relative;
    }

    .xm-input-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 6px;
    }

    .xm-input-label span {
      color: #ef4444;
    }

    .xm-input-wrapper {
      position: relative;
    }

    .xm-input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 14px;
      pointer-events: none;
    }

    .xm-input {
      width: 100%;
      padding: 12px 14px 12px 38px;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      font-size: 14px;
      color: #0f172a;
      background: #f8fafc;
      outline: none;
      transition: all 0.3s ease;
      box-sizing: border-box;
    }

    .xm-input:focus {
      border-color: #0284c7;
      background: #ffffff;
      box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.15);
    }

    /* Submit Button */
    .xm-submit-btn {
      width: 100%;
      background: #f97316;
      color: #ffffff;
      border: none;
      padding: 14px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s ease;
      margin-top: 24px;
      box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2);
    }

    .xm-submit-btn:hover {
      background: #ea580c;
      box-shadow: 0 10px 15px -3px rgba(249, 115, 22, 0.3);
      transform: translateY(-1px);
    }

    .xm-submit-btn:active {
      transform: translateY(1px);
    }

    .xm-submit-btn:disabled {
      background: #cbd5e1;
      color: #94a3b8;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* Footer text */
    .xm-form-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11px;
      color: #64748b;
      margin-top: 15px;
      font-weight: 500;
    }

    .xm-form-footer i {
      font-size: 12px;
    }

    /* Status Div */
    .xm-form-status {
      margin-top: 15px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      min-height: 20px;
      transition: all 0.3s ease;
    }

    /* Responsive */
    @media (max-width: 900px) {
      .xm-modal-wrapper {
        flex-direction: column;
        max-width: 550px;
        max-height: 90vh;
        overflow-y: auto;
      }
      .xm-info-panel {
        width: 100%;
        padding: 30px 30px 0 30px;
      }
      .xm-form-panel {
        width: 100%;
        padding: 30px;
      }
      .xm-award-badge {
        margin: 20px auto 20px auto;
      }
      .xm-info-footer-banner {
        margin: 0 -30px;
      }
    }
  `;
  document.head.appendChild(style);

  // Inject HTML Elements
  const backdrop = document.createElement('div');
  backdrop.className = 'xm-modal-backdrop';
  backdrop.id = 'xmRegisterModalBackdrop';

  backdrop.innerHTML = `
    <div class="xm-modal-wrapper">
      <!-- Left Panel: Info Section -->
      <div class="xm-info-panel">
        <div class="xm-info-panel-content">
          <span class="xm-badge">Erickson ICF Certification</span>
          <h2 class="xm-title">The Art & Science of Coaching (TASC)</h2>
          <p class="xm-subtitle">Essentials (Part I & II) • ICF Accredited Coach Training</p>
          
          <!-- Features -->
          <div class="xm-features-row">
            <div class="xm-feature-card">
              <i class="fa-solid fa-desktop"></i>
              <div class="xm-feature-text">Virtual<br>Live Sessions</div>
            </div>
            <div class="xm-feature-card">
              <i class="fa-solid fa-calendar-days"></i>
              <div class="xm-feature-text">Weekend Batches<br>(Sat - Sun)</div>
            </div>
            <div class="xm-feature-card">
              <i class="fa-solid fa-award"></i>
              <div class="xm-feature-text">ICF Accredited<br>Certification</div>
            </div>
          </div>

          <!-- Schedule/Dates -->
          <div class="xm-parts-grid">
            <div class="xm-part-box">
              <span class="xm-part-header">PART I</span>
              <div class="xm-part-date-wrapper">
                <i class="fa-solid fa-calendar-check"></i>
                <div class="xm-part-date">Sep 17-20 &<br>Sep 24-27, 2026</div>
              </div>
            </div>
            <div class="xm-part-box">
              <span class="xm-part-header part2">PART II</span>
              <div class="xm-part-date-wrapper">
                <i class="fa-solid fa-calendar-check"></i>
                <div class="xm-part-date">Oct 8-11 &<br>Oct 15-18, 2026</div>
              </div>
            </div>
          </div>

          <!-- Core Points -->
          <div class="xm-points-section">
            <div class="xm-points-header">Transform Conversations. Create Lasting Impact.</div>
            <div class="xm-points-list">
              <div class="xm-point-item"><i class="fa-solid fa-circle-check"></i> Learn from Master Coaches</div>
              <div class="xm-point-item"><i class="fa-solid fa-circle-check"></i> Solution-Focused Method</div>
              <div class="xm-point-item"><i class="fa-solid fa-circle-check"></i> Enhance Leadership Impact</div>
              <div class="xm-point-item"><i class="fa-solid fa-circle-check"></i> Global ICF Recognition</div>
            </div>
          </div>
        </div>

        <!-- Award Badge -->
        <div class="xm-award-badge">
          <span class="xm-award-year">2024</span>
          <span class="xm-award-title">Coaching Impact</span>
          <span class="xm-award-desc">Award Winner</span>
          <span class="xm-award-icf">ICF</span>
        </div>

        <!-- Footer Yellow Banner -->
        <div class="xm-info-footer-banner">
          <i class="fa-solid fa-circle-chevron-right"></i>
          <span>Begin your journey as a certified coach and unlock your potential.</span>
        </div>
      </div>

      <!-- Right Panel: Form Section -->
      <div class="xm-form-panel">
        <button class="xm-modal-close-btn" id="xmModalCloseBtn" aria-label="Close modal">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="xm-form-header">
          <h3 class="xm-form-title">Reserve Your Seat!</h3>
          <p class="xm-form-subtitle">Limited Seats. Enroll Now!</p>
          <div class="xm-dots-separator">
            <div class="xm-dot xm-dot-1"></div>
            <div class="xm-dot xm-dot-2"></div>
            <div class="xm-dot xm-dot-3"></div>
          </div>
        </div>

        <form id="xmonks-contact-form" novalidate>
          <div class="xm-input-group">
            <label class="xm-input-label" for="lead-firstname">First Name<span>*</span></label>
            <div class="xm-input-wrapper">
              <i class="fa-regular fa-user xm-input-icon"></i>
              <input class="xm-input" type="text" id="lead-firstname" required placeholder="Enter your first name">
            </div>
          </div>

          <div class="xm-input-group">
            <label class="xm-input-label" for="lead-lastname">Last Name<span>*</span></label>
            <div class="xm-input-wrapper">
              <i class="fa-regular fa-user xm-input-icon"></i>
              <input class="xm-input" type="text" id="lead-lastname" required placeholder="Enter your last name">
            </div>
          </div>

          <div class="xm-input-group">
            <label class="xm-input-label" for="lead-email">Email<span>*</span></label>
            <div class="xm-input-wrapper">
              <i class="fa-regular fa-envelope xm-input-icon"></i>
              <input class="xm-input" type="email" id="lead-email" required placeholder="Enter your email address">
            </div>
          </div>

          <div class="xm-input-group">
            <label class="xm-input-label" for="lead-phone">Mobile Number<span>*</span></label>
            <div class="xm-input-wrapper">
              <i class="fa-solid fa-phone xm-input-icon"></i>
              <input class="xm-input" type="tel" id="lead-phone" required placeholder="Enter your 10-digit mobile number">
            </div>
          </div>

          <div class="xm-input-group">
            <label class="xm-input-label" for="lead-company">Company<span>*</span></label>
            <div class="xm-input-wrapper">
              <i class="fa-regular fa-building xm-input-icon"></i>
              <input class="xm-input" type="text" id="lead-company" required placeholder="Enter your company name">
            </div>
          </div>

          <button class="xm-submit-btn" type="submit" id="submit-btn">
            <span>REGISTER NOW</span>
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </form>

        <div class="xm-form-status" id="form-status"></div>

        <div class="xm-form-footer">
          <i class="fa-solid fa-lock"></i>
          <span>Your information is safe with us.</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  // Functions to Open/Close Modal
  function openModal() {
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable scroll under modal
  }

  function closeModal() {
    backdrop.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    // Clear status
    const statusDiv = document.getElementById('form-status');
    if (statusDiv) statusDiv.textContent = '';
  }

  // Bind close events
  document.getElementById('xmModalCloseBtn').addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) {
    if (e.target === backdrop) closeModal();
  });

  // Esc key close
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && backdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // Expose triggers globally
  window.openRegisterModal = openModal;
  window.closeRegisterModal = closeModal;

  // Intercept element clicks matching class "open-register-modal"
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.open-register-modal');
    if (trigger) {
      e.preventDefault();
      openModal();
    }
  });

  // Form Submission & Webhook Handling
  const form = document.getElementById('xmonks-contact-form');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const statusDiv = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    const firstName = document.getElementById('lead-firstname').value.trim();
    const lastName = document.getElementById('lead-lastname').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();
    const company = document.getElementById('lead-company').value.trim();

    // Client-side Validation
    if (!firstName || !lastName || !email || !phone || !company) {
      statusDiv.style.color = '#ef4444';
      statusDiv.textContent = 'Please fill out all required fields.';
      return;
    }

    // Basic email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      statusDiv.style.color = '#ef4444';
      statusDiv.textContent = 'Please enter a valid email address.';
      return;
    }

    statusDiv.style.color = '#0284c7';
    statusDiv.textContent = 'Processing lead with AI Intelligence...';
    submitBtn.disabled = true;

    // Gather form input field values (combining first and last name)
    const payload = {
      name: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
      company: company,
      message: 'Enquiry for TASC ICF Coaching Certification (Part I & II)',
      sourcePage: window.location.href
    };

    try {
      const response = await fetch('https://xmonksapi.vercel.app/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'xm_live_47cyz6ze9211kronqf'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        statusDiv.style.color = '#10b981'; // Green status
        statusDiv.textContent = 'Inquiry submitted successfully! Thank you.';
        form.reset(); // Clear form fields
        
        // Auto-close modal after 2.5 seconds on success
        setTimeout(closeModal, 2500);
      } else {
        throw new Error(data.error || 'Server rejected lead submission.');
      }
    } catch (err) {
      console.error('Lead submission failure:', err);
      statusDiv.style.color = '#ef4444'; // Red status
      statusDiv.textContent = `Submission Error: ${err.message}`;
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
