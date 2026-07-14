import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

(function () {
  // Ensure the script only runs once
  if (window.__xmonksFormInitialized) return;
  window.__xmonksFormInitialized = true;

  // Firebase Config
  const firebaseConfig = {
    apiKey: "AIzaSyC8nW0CAFgqLwvk481WNuMSfLUfqpT3Vps",
    authDomain: "erickson-f7954.firebaseapp.com",
    projectId: "erickson-f7954",
    storageBucket: "erickson-f7954.firebasestorage.app",
    messagingSenderId: "76152124770",
    appId: "1:76152124770:web:21c39dfc6156adb33ae83b",
    measurementId: "G-RWTHJ5ZFDM"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

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
      background: #ffffff;
      width: 95%;
      max-width: 1080px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
      position: relative;
      transform: scale(0.95) translateY(20px);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: row;
      border: 1px solid rgba(0, 0, 0, 0.05);
    }

    .xm-modal-backdrop.active .xm-modal-wrapper {
      transform: scale(1) translateY(0);
    }

    /* Left Section - Info Panel */
    .xm-info-panel {
      width: 60%;
      background: #ffffff;
      color: #0f172a;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    .xm-info-content {
      position: relative;
      z-index: 3;
      padding: 35px 35px 20px 35px;
      max-width: 58%;
    }

    /* Slanted Orange Ribbon Badge */
    .xm-badge-ribbon {
      display: inline-block;
      background: #ea580c;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 6px 18px 6px 12px;
      margin-bottom: 16px;
      letter-spacing: 0.5px;
      clip-path: polygon(0 0, 94% 0, 100% 100%, 0 100%);
    }

    .xm-title {
      font-size: 34px;
      font-weight: 800;
      line-height: 1.15;
      margin: 0 0 2px 0;
      color: #0f172a;
    }

    .xm-subtitle {
      font-size: 26px;
      font-weight: 700;
      color: #ea580c;
      margin: 0 0 6px 0;
    }

    .xm-tagline {
      font-size: 15px;
      font-weight: 600;
      color: #0284c7;
      margin: 0 0 22px 0;
    }

    /* Features Row */
    .xm-features-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .xm-feature-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 85px;
    }

    .xm-feature-icon-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 6px;
      color: #ffffff;
      font-size: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
    }

    .xm-feature-icon-circle.teal { background: #0284c7; }
    .xm-feature-icon-circle.orange { background: #ea580c; }
    .xm-feature-icon-circle.gold { background: #eab308; }

    .xm-feature-text {
      font-size: 9px;
      font-weight: 700;
      color: #0f172a;
      text-transform: uppercase;
      line-height: 1.3;
    }

    /* Parts Grid */
    .xm-parts-grid {
      display: flex;
      gap: 12px;
      margin-bottom: 10px;
      max-width: 380px;
    }

    .xm-part-box {
      flex: 1;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      position: relative;
      padding: 14px 10px 10px 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .xm-part-header {
      position: absolute;
      top: -9px;
      left: 10px;
      font-size: 9px;
      font-weight: 800;
      color: #ffffff;
      padding: 2px 8px;
      border-radius: 4px;
      background: #0284c7;
      letter-spacing: 0.3px;
    }

    .xm-part-header.part2 {
      background: #ea580c;
    }

    .xm-part-icon {
      font-size: 16px;
    }
    .xm-part-icon.teal { color: #0284c7; }
    .xm-part-icon.orange { color: #ea580c; }

    .xm-part-date {
      font-size: 11.5px;
      font-weight: 700;
      color: #334155;
      line-height: 1.3;
    }

    /* Curved Divider & BG Panel */
    .xm-info-curve {
      position: absolute;
      top: 0;
      right: 0;
      width: 46%;
      height: 100%;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-left: 4px solid #0284c7;
      border-radius: 140% 0 0 140% / 100% 0 0 100%;
      z-index: 1;
      pointer-events: none;
    }

    /* Woman Photo */
    .xm-info-woman {
      position: absolute;
      bottom: 80px;
      right: -2%;
      width: 44%;
      height: auto;
      z-index: 2;
      pointer-events: none;
    }

    /* Golden Award Badge */
    .xm-award-badge {
      position: absolute;
      bottom: 55px;
      right: 34%;
      background: #ffffff;
      border: 3px double #d97706;
      border-radius: 50%;
      width: 115px;
      height: 115px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 6px;
      box-sizing: border-box;
      text-align: center;
      line-height: 1.15;
    }

    .xm-award-year {
      font-size: 11px;
      font-weight: 800;
      color: #b45309;
      margin-bottom: 1px;
    }

    .xm-award-title1 {
      font-size: 7.5px;
      font-weight: 800;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .xm-award-title2 {
      font-size: 12px;
      font-weight: 900;
      color: #d97706;
      text-transform: uppercase;
      margin: 1px 0;
    }

    .xm-award-desc {
      font-size: 7.5px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .xm-award-icf {
      font-size: 13px;
      font-weight: 900;
      color: #0284c7;
      margin-top: 1px;
    }

    /* Bottom Teal Tagline Panel */
    .xm-bottom-teal-panel {
      background: #005d73;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 3;
      position: relative;
    }

    .xm-teal-left {
      font-size: 10.5px;
      font-weight: 800;
      line-height: 1.3;
      letter-spacing: 0.3px;
      color: #ffffff;
    }

    .xm-teal-left span {
      color: #fcd34d;
    }

    .xm-teal-right {
      display: flex;
      gap: 12px;
    }

    .xm-teal-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 65px;
    }

    .xm-teal-icon {
      font-size: 13px;
      color: #ffffff;
      margin-bottom: 3px;
    }

    .xm-teal-text {
      font-size: 7.5px;
      font-weight: 500;
      color: #e2e8f0;
      line-height: 1.25;
    }

    /* Bottom Gold/Yellow Panel */
    .xm-bottom-gold-panel {
      background: #e9b62f;
      padding: 8px 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      z-index: 3;
      position: relative;
    }

    .xm-gold-icon {
      color: #0f172a;
      font-size: 12px;
    }

    .xm-gold-text {
      font-size: 10px;
      font-weight: 700;
      color: #0f172a;
      text-align: center;
    }

    /* Right Section - Form Panel */
    .xm-form-panel {
      width: 40%;
      padding: 30px;
      background: #ffffff;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 5;
    }

    /* Close Button */
    .xm-modal-close-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      background: #ffffff;
      border: 1.5px solid #0f172a;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #0f172a;
      font-size: 12px;
      transition: all 0.2s ease;
      z-index: 10;
    }

    .xm-modal-close-btn:hover {
      background: #0f172a;
      color: #ffffff;
      transform: rotate(90deg);
    }

    .xm-form-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .xm-form-title {
      font-size: 26px;
      font-weight: 800;
      color: #075985;
      margin: 0 0 4px 0;
    }

    .xm-form-subtitle {
      font-size: 13px;
      font-weight: 700;
      color: #ea580c;
      margin: 0;
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
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .xm-dot-1 { background: #0284c7; }
    .xm-dot-2 { background: #ea580c; }
    .xm-dot-3 { background: #eab308; }

    /* Inputs Styling */
    .xm-input-group {
      margin-bottom: 12px;
      position: relative;
    }

    .xm-input-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .xm-input-label span {
      color: #ef4444;
    }

    .xm-input-wrapper {
      position: relative;
    }

    .xm-input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 13px;
      pointer-events: none;
    }

    .xm-input {
      width: 100%;
      padding: 10px 12px 10px 34px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
      color: #0f172a;
      background: #ffffff;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .xm-input:focus {
      border-color: #0284c7;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
    }

    /* Submit Button */
    .xm-submit-btn {
      width: 100%;
      background: #ea580c;
      color: #ffffff;
      border: none;
      padding: 12px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
      margin-top: 18px;
      box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2);
    }

    .xm-submit-btn:hover {
      background: #d04a07;
      box-shadow: 0 8px 12px -3px rgba(234, 88, 12, 0.3);
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
      gap: 5px;
      font-size: 10.5px;
      color: #64748b;
      margin-top: 12px;
      font-weight: 500;
    }

    .xm-form-footer i {
      font-size: 11px;
    }

    /* Status Div */
    .xm-form-status {
      margin-top: 10px;
      font-size: 13px;
      font-weight: 600;
      text-align: center;
      min-height: 20px;
      transition: all 0.3s ease;
    }

    /* Responsive styling */
    @media (max-width: 900px) {
      .xm-modal-wrapper {
        flex-direction: column;
        max-width: 550px;
        max-height: 90vh;
        overflow-y: auto;
      }
      .xm-info-panel {
        width: 100%;
      }
      .xm-info-content {
        max-width: 100%;
        padding: 30px 25px;
      }
      .xm-info-curve {
        display: none;
      }
      .xm-info-woman {
        display: none;
      }
      .xm-award-badge {
        position: relative;
        bottom: auto;
        right: auto;
        margin: 15px auto;
      }
      .xm-bottom-teal-panel {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }
      .xm-teal-right {
        justify-content: center;
        flex-wrap: wrap;
      }
      .xm-bottom-gold-panel {
        padding: 10px 15px;
      }
      .xm-form-panel {
        width: 100%;
        padding: 30px 25px;
        border-top: 1px solid #cbd5e1;
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
        <div class="xm-info-curve"></div>
        <img class="xm-info-woman" src="banner_woman.png" alt="TASC Coach Certification">
        
        <div class="xm-info-content">
          <span class="xm-badge-ribbon">Erickson ICF Certification</span>
          <h2 class="xm-title">The Art & Science</h2>
          <h2 class="xm-title">of Coaching (TASC)</h2>
          <p class="xm-subtitle">Essentials (Part I & II)</p>
          <p class="xm-tagline">ICF Accredited Coach Training Program</p>
          
          <!-- Features -->
          <div class="xm-features-row">
            <div class="xm-feature-card">
              <div class="xm-feature-icon-circle teal">
                <i class="fa-solid fa-desktop"></i>
              </div>
              <div class="xm-feature-text">Virtual<br>Live Sessions</div>
            </div>
            <div class="xm-feature-card">
              <div class="xm-feature-icon-circle orange">
                <i class="fa-solid fa-calendar-days"></i>
              </div>
              <div class="xm-feature-text">Weekend Batches<br>(Sat – Sun)</div>
            </div>
            <div class="xm-feature-card">
              <div class="xm-feature-icon-circle gold">
                <i class="fa-solid fa-award"></i>
              </div>
              <div class="xm-feature-text">ICF Accredited<br>Certification</div>
            </div>
          </div>

          <!-- Schedule/Dates -->
          <div class="xm-parts-grid">
            <div class="xm-part-box">
              <span class="xm-part-header">PART I</span>
              <i class="fa-solid fa-calendar-check xm-part-icon teal"></i>
              <div class="xm-part-date">Sep 17–20 &<br>Sep 24–27, 2026</div>
            </div>
            <div class="xm-part-box">
              <span class="xm-part-header part2">PART II</span>
              <i class="fa-solid fa-calendar-check xm-part-icon orange"></i>
              <div class="xm-part-date">Oct 8–11 &<br>Oct 15–18, 2026</div>
            </div>
          </div>
        </div>

        <!-- Award Badge overlapping -->
        <div class="xm-award-badge">
          <span class="xm-award-year">2024</span>
          <span class="xm-award-title1">Coaching</span>
          <span class="xm-award-title2">Impact</span>
          <span class="xm-award-desc">Award Winner</span>
          <span class="xm-award-icf">ICF</span>
        </div>

        <!-- Bottom Teal Tagline Panel -->
        <div class="xm-bottom-teal-panel">
          <div class="xm-teal-left">
            TRANSFORM CONVERSATIONS.<br>
            <span>CREATE LASTING IMPACT.</span>
          </div>
          <div class="xm-teal-right">
            <div class="xm-teal-block">
              <i class="fa-solid fa-users-gear xm-teal-icon"></i>
              <div class="xm-teal-text">Learn from<br>Master Coaches</div>
            </div>
            <div class="xm-teal-block">
              <i class="fa-solid fa-brain xm-teal-icon"></i>
              <div class="xm-teal-text">Solution-Focused<br>Methodology</div>
            </div>
            <div class="xm-teal-block">
              <i class="fa-solid fa-arrow-trend-up xm-teal-icon"></i>
              <div class="xm-teal-text">Enhance<br>Leadership Impact</div>
            </div>
            <div class="xm-teal-block">
              <i class="fa-solid fa-medal xm-teal-icon"></i>
              <div class="xm-teal-text">Global Recognition<br>by ICF</div>
            </div>
          </div>
        </div>

        <!-- Bottom Gold Yellow Banner -->
        <div class="xm-bottom-gold-panel">
          <i class="fa-solid fa-shield-halved xm-gold-icon"></i>
          <span class="xm-gold-text">Begin your journey as a certified coach and unlock your potential to create meaningful change.</span>
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
            <i class="fa-solid fa-angle-right"></i>
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
      // Save to Firestore leads collection
      const docRef = await addDoc(collection(db, "leads"), {
        ...payload,
        timestamp: serverTimestamp()
      });
      console.log("Document written to Firestore with ID: ", docRef.id);

      // Submit to webhook, catching errors separately
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
        if (!response.ok || !data.success) {
          console.warn('Webhook rejected lead submission:', data.error);
        }
      } catch (webhookErr) {
        console.warn('Webhook submission failed, but lead was successfully saved to Firestore:', webhookErr);
      }

      // Success behavior (since it successfully wrote to Firestore)
      statusDiv.style.color = '#10b981'; // Green status
      statusDiv.textContent = 'Inquiry submitted successfully! Thank you.';
      form.reset(); // Clear form fields
      
      // Auto-close modal after 2.5 seconds on success
      setTimeout(closeModal, 2500);
    } catch (err) {
      console.error('Lead submission failure:', err);
      statusDiv.style.color = '#ef4444'; // Red status
      statusDiv.textContent = `Submission Error: ${err.message}`;
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
