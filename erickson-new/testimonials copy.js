// Testimonials Data - will be loaded from JSON
let testimonialsData = [];

// Variables for pagination and filtering
let currentPage = 0;
const itemsPerPage = 6;
let currentFilter = 'all';
let filteredTestimonials = [];

// DOM Elements
const testimonialsContainer = document.getElementById('testimonials-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('testimonial-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalName = document.getElementById('modal-name');
const modalAvatar = document.getElementById('modal-avatar');
const modalProgram = document.getElementById('modal-program');
const modalText = document.getElementById('modal-text');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadTestimonialsData();
    setupEventListeners();
});

// Load testimonials from JSON file
async function loadTestimonialsData() {
    try {
        const response = await fetch('testimonialss.json');
        if (!response.ok) {
            throw new Error('Failed to load testimonials');
        }
        const rawData = await response.json();
        
        // Process the data to add missing fields and a unique ID
        testimonialsData = rawData.map((testimonial, index) => {
            return {
                ...testimonial,
                id: index, // Add a unique ID for reliable lookups
                program: testimonial.program || getDefaultProgram(testimonial.text),
                category: testimonial.category || getDefaultCategory(testimonial.text),
                rating: testimonial.rating || 5
            };
        });
        
        // ✨ NEW: Sort testimonials to show those with images first
        testimonialsData.sort((a, b) => {
            const aHasImage = a.image ? 1 : 0;
            const bHasImage = b.image ? 1 : 0;
            return bHasImage - aHasImage; // Sorts by putting items with images first
        });
        
        filteredTestimonials = [...testimonialsData];
        loadTestimonials();
        populateInfiniteScroll();
    } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonialsContainer.innerHTML = '<div class="error-message">Failed to load testimonials. Please try again later.</div>';
    }
}

// Helper function to determine program based on content
function getDefaultProgram(text) {
    if (text.toLowerCase().includes('acc')) return 'ACC Certification';
    if (text.toLowerCase().includes('art and science') || text.toLowerCase().includes('art & science')) return 'The Art & Science of Coaching';
    if (text.toLowerCase().includes('executive')) return 'Executive Coaching';
    if (text.toLowerCase().includes('leadership')) return 'Leadership Coaching';
    return 'Coaching Certification';
}

// Helper function to determine category based on content
function getDefaultCategory(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('transformation') || lowerText.includes('journey') || lowerText.includes('shift') || lowerText.includes('change')) return 'transformation';
    if (lowerText.includes('skill') || lowerText.includes('technique') || lowerText.includes('learn')) return 'skills';
    if (lowerText.includes('career') || lowerText.includes('leadership') || lowerText.includes('executive')) return 'career';
    return 'transformation'; // default category
}

// Setup event listeners
function setupEventListeners() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            setActiveFilter(this);
            filterTestimonials(filter);
        });
    });

    loadMoreBtn.addEventListener('click', loadMoreTestimonials);
    
    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Set active filter button
function setActiveFilter(activeBtn) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

// Filter testimonials
function filterTestimonials(filter) {
    currentFilter = filter;
    currentPage = 0;
    
    if (filter === 'all') {
        filteredTestimonials = [...testimonialsData];
    } else {
        filteredTestimonials = testimonialsData.filter(testimonial => 
            testimonial.category === filter
        );
    }
    
    testimonialsContainer.innerHTML = '';
    loadTestimonials();
}

// Load testimonials with pagination
function loadTestimonials() {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const testimonialsToShow = filteredTestimonials.slice(startIndex, endIndex);
    
    testimonialsToShow.forEach(testimonial => {
        const testimonialCard = createTestimonialCard(testimonial);
        testimonialsContainer.appendChild(testimonialCard);
    });
    
    currentPage++;
    
    if (endIndex >= filteredTestimonials.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }
}

// Load more testimonials
function loadMoreTestimonials() {
    loadTestimonials();
}

// Create testimonial card
function createTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    const avatar = testimonial.image 
        ? `<img src="${testimonial.image}" alt="${testimonial.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="avatar-fallback" style="display:none;">${getInitials(testimonial.name)}</div>`
        : `<div class="avatar-fallback">${getInitials(testimonial.name)}</div>`;
    
    const truncatedText = truncateText(testimonial.text, 150);
    const needsReadMore = testimonial.text.length > 150;
    
    card.innerHTML = `
        <div class="testimonial-header">
            <div class="testimonial-avatar">
                ${avatar}
            </div>
            <div class="testimonial-info">
                <h3>${testimonial.name}</h3>
                <div class="program">${testimonial.program}</div>
            </div>
        </div>
        <div class="testimonial-text">
            ${truncatedText}
            ${needsReadMore ? '<span class="read-more-text">...</span>' : ''}
        </div>
        ${needsReadMore ? `
        <div class="testimonial-footer">
            <button class="read-more-btn" onclick="openModal(${testimonial.id})">Read More</button>
        </div>
        ` : ''}
    `;
    
    return card;
}

// Open modal
function openModal(testimonialId) {
    // Find testimonial by its unique ID
    const testimonial = testimonialsData.find(t => t.id === testimonialId);
    if (!testimonial) return;
    
    modalName.textContent = testimonial.name;
    modalProgram.textContent = testimonial.program;
    modalText.textContent = testimonial.text;
    
    if (testimonial.image) {
        modalAvatar.innerHTML = `<img src="${testimonial.image}" alt="${testimonial.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                 <div class="avatar-fallback" style="display:none;">${getInitials(testimonial.name)}</div>`;
    } else {
        modalAvatar.innerHTML = `<div class="avatar-fallback">${getInitials(testimonial.name)}</div>`;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Get initials from name
function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength);
}

// Populate infinite scroll section
function populateInfiniteScroll() {
    const scrollContent = document.getElementById('scroll-content');
    if (!scrollContent) return;
    
    // The infinite scroll can use the already sorted data
    const scrollTestimonials = testimonialsData.slice(0, 8);
    
    const allScrollTestimonials = [...scrollTestimonials, ...scrollTestimonials];
    
    scrollContent.innerHTML = '';
    
    allScrollTestimonials.forEach(testimonial => {
        const scrollCard = createScrollTestimonialCard(testimonial);
        scrollContent.appendChild(scrollCard);
    });
}

// Create scroll testimonial card
function createScrollTestimonialCard(testimonial) {
    const card = document.createElement('div');
    card.className = 'scroll-testimonial';
    
    const avatar = testimonial.image 
        ? `<img src="${testimonial.image}" alt="${testimonial.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="avatar-fallback" style="display:none;">${getInitials(testimonial.name)}</div>`
        : `<div class="avatar-fallback">${getInitials(testimonial.name)}</div>`;
    
    const truncatedText = truncateText(testimonial.text, 350);
    
    card.innerHTML = `
        <div class="scroll-testimonial-text">
            ${truncatedText}
        </div>
        <div class="scroll-testimonial-author">
            <div class="scroll-author-avatar">
                ${avatar}
            </div>
            <div class="scroll-author-info">
                <h4>${testimonial.name}</h4>
                <div class="scroll-author-program">${testimonial.program}</div>
            </div>
        </div>
    `;
    
    return card;
}