// Modern Events Page JavaScript

// Events Data - Dynamic object-based structure
let eventsData = [];

// Event Management Functions
function addNewEvent(eventData) {
    // Assign new ID
    eventData.id = eventsData.length + 1;
    
    // Add to events array
    eventsData.push(eventData);
    
    // Re-render events
    renderEvents();
    
    // Show success notification
    showNotification(`Event "${eventData.title}" added successfully!`, 'success');
}

function removeEvent(eventId) {
    const index = eventsData.findIndex(event => event.id === eventId);
    if (index !== -1) {
        const removedEvent = eventsData.splice(index, 1)[0];
        renderEvents();
        showNotification(`Event "${removedEvent.title}" removed successfully!`, 'success');
        return true;
    }
    return false;
}

function updateEvent(eventId, updatedData) {
    const index = eventsData.findIndex(event => event.id === eventId);
    if (index !== -1) {
        eventsData[index] = { ...eventsData[index], ...updatedData };
        renderEvents();
        showNotification(`Event updated successfully!`, 'success');
        return true;
    }
    return false;
}

function getEventById(eventId) {
    return eventsData.find(event => event.id === eventId);
}

// Populate the featured event card in hero section
function populateFeaturedEventCard() {
    const featuredCard = document.getElementById('featured-event-card');
    if (!featuredCard) return;
    
    // Get the next upcoming event (soonest date)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingEvents = eventsData
        .filter(event => event.status === 'upcoming' && new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (upcomingEvents.length === 0) {
        // No upcoming events, show a placeholder
        featuredCard.innerHTML = `
            <div class="featured-card-image">
                <div class="featured-image-circle"></div>
            </div>
            <div class="card-header">
                <div class="event-status-badge">No Upcoming Events</div>
            </div>
            <div class="card-content">
                <h3>Check Back Soon!</h3>
                <p>We'll have more exciting events coming up.</p>
            </div>
        `;
        return;
    }
    
    const nextEvent = upcomingEvents[0];
    const eventDate = new Date(nextEvent.date);
    const day = eventDate.getDate().toString().padStart(2, '0');
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    
    featuredCard.innerHTML = `
        <div class="featured-card-image">
            ${nextEvent.image ? `<img src="${nextEvent.image}" alt="${nextEvent.title}" class="featured-image-content" />` : ''}
            <div class="featured-image-circle"></div>
        </div>
        <div class="card-header">
            <div class="event-status-badge">Next Event</div>
            <div class="event-date-display">
                <span class="date">${day}</span>
                <span class="month">${month}</span>
            </div>
        </div>
        <div class="card-content">
            <h3>${nextEvent.title}</h3>
            <p>${nextEvent.description}</p>
            <div class="event-meta">
                <span><i class="fas fa-clock"></i> ${nextEvent.duration}</span>
                <span><i class="fas fa-users"></i> ${nextEvent.type}</span>
            </div>
            ${nextEvent.registrationLink ? `
                <a href="${nextEvent.registrationLink}" target="_blank" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full mt-4 flex items-center justify-center gap-2" style="display: flex; text-decoration: none;">
                    Register Now
                    <i class="fas fa-arrow-right"></i>
                </a>
            ` : `
                <button class="bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg w-full mt-4" disabled>
                    Registration Closed
                </button>
            `}
        </div>
    `;
}

// Global variables for load more functionality
let currentDisplayCount = 6; // Show 6 events initially
const cardsPerLoad = 6;
let currentFilter = 'all'; // Track current filter
let currentSearchTerm = ''; // Track current search term
let currentFilteredEvents = [];

// Update event statuses based on current date
function updateEventStatuses() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    
    eventsData.forEach(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
        
        // If event date is in the past and status was "upcoming", mark as "completed"
        if (eventDate < today && event.status === 'upcoming') {
            event.status = 'completed';
            event.statusLabel = 'Completed';
            event.pricing = {
                type: 'completed',
                label: 'Status',
                value: 'Completed'
            };
        }
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch('./events.json');
        if (!response.ok) throw new Error('Failed to fetch events.json');
        eventsData = await response.json();
        currentFilteredEvents = [...eventsData]; // Initialize filtered events
        
        // Update event statuses first based on current date
        updateEventStatuses();
        
        // Update event counts in filter tabs
        updateEventCounts();
        
        // Initialize all functionality
        renderEvents(eventsData, currentDisplayCount);
        populateFeaturedEventCard();
        initFilters();
        initDropdowns();
        initEventCards();
        initNewsletter();
        initScrollAnimations();
    } catch (error) {
        console.error('Error loading events:', error);
    }
});

// Dynamic Event Rendering Functions
function renderEvents(events = eventsData, showCount = 6) {
    const grid = document.querySelector('.events-grid');
    if (!grid) return;
    
    currentFilteredEvents = events;
    grid.innerHTML = '';
    
    // Sort by date (nearest upcoming first, then past events)
    const sorted = [...events].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Separate upcoming and completed
        const aIsUpcoming = a.status === 'upcoming' && dateA >= today;
        const bIsUpcoming = b.status === 'upcoming' && dateB >= today;
        
        // Upcoming first
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
        
        // If both are upcoming: nearest future event first (Ascending)
        if (aIsUpcoming && bIsUpcoming) {
            return dateA - dateB;
        }
        
        // If both are past/completed: most recent past event first (Descending)
        return dateB - dateA;
    });
    
    // Render only first 'showCount' cards
    sorted.slice(0, showCount).forEach(event => {
        const card = createEventCard(event);
        grid.appendChild(card);
    });
    
    updateLoadMoreButton(sorted.length, showCount);
    attachCardInteractions();
}

function updateLoadMoreButton(totalEvents, currentDisplay) {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const loadMoreText = document.querySelector('.load-more-text');
    
    if (loadMoreBtn && loadMoreText) {
        if (currentDisplay >= totalEvents) {
            loadMoreBtn.style.display = 'none';
            loadMoreText.textContent = `Showing all ${totalEvents} events`;
        } else {
            loadMoreBtn.style.display = 'inline-flex';
            loadMoreText.textContent = `Showing ${currentDisplay} of ${totalEvents} events`;
        }
    }
}

function loadMoreEvents() {
    currentDisplayCount += cardsPerLoad;
    renderEvents(currentFilteredEvents, currentDisplayCount);
}

// Attach interactions to event cards
function attachCardInteractions() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        // Heart button for favorites
        const heartBtn = card.querySelector('.btn-outline');
        if (heartBtn) {
            heartBtn.addEventListener('click', function(e) {
                e.preventDefault();
                this.querySelector('i').classList.toggle('fas');
                this.querySelector('i').classList.toggle('far');
            });
        }
        
        // Register button
        const registerBtn = card.querySelector('.btn-primary');
        if (registerBtn) {
            registerBtn.addEventListener('click', function(e) {
                // Registration handled by onclick attribute
            });
        }
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = `event-card ${event.status === 'completed' ? 'past-event' : ''} ${event.featured ? 'featured' : ''}`;
    card.setAttribute('data-category', event.category);
    card.setAttribute('data-date', event.date);
    card.setAttribute('data-event-id', event.id);
    
    // Format date for display
    const eventDate = new Date(event.date);
    const dayNumber = eventDate.getDate().toString().padStart(2, '0');
    const monthName = eventDate.toLocaleDateString('en-US', { month: 'long' });
    
    // Generate action buttons based on event status
    const actionButtons = generateActionButtons(event);
    
    card.innerHTML = `
        <div class="card-image">
            <div class="image-overlay"></div>
            <div class="card-image-bg" style="background-image: url('https://www.erickson.edu/hubfs/award-bg-1.svg');"></div>
            ${event.image ? `<img src="${event.image}" alt="${event.title}" class="card-image-content" />` : ''}
            <div class="event-type">${event.type}</div>
            <div class="event-status ${event.status}">${event.statusLabel}</div>
        </div>
        <div class="card-content">
            <div class="event-date">
                <span class="date-day">${dayNumber}</span>
                <div class="date-info">
                    <span class="date-month">${monthName}</span>
                    <span class="date-time">${event.time}</span>
                </div>
            </div>
            <h3 class="event-title">${event.title}</h3>
            <p class="event-description">${event.description}</p>
            <div class="event-details">
                <div class="detail-item">
                    <i class="fas fa-user-graduate"></i>
                    <span>${event.presenter}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>${event.duration}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-video"></i>
                    <span>${event.virtual ? 'Virtual Event' : 'In-Person Event'}</span>
                </div>
            </div>
            <div class="event-tags">
                ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="card-footer">
            <div class="pricing">
                <span class="price-label">${event.pricing.label}</span>
                <span class="price ${event.pricing.type === 'free' ? 'free-price' : event.pricing.type}">${event.pricing.value}</span>
            </div>
            <div class="card-actions">
                ${actionButtons}
            </div>
        </div>
    `;
    
    return card;
}

function generateActionButtons(event) {
    if (event.status === 'completed') {
        return `
            <button class="btn-outline" type="button" disabled aria-label="Event completed">
                <i class="fas fa-clock"></i>
            </button>
            <button class="btn-secondary" type="button" disabled>
                ${event.type} Ended
            </button>
        `;
    } else if (event.status === 'upcoming' && event.registrationLink) {
        return `
            <button class="btn-outline" type="button" aria-label="Add to favorites">
                <i class="far fa-heart"></i>
            </button>
            <button class="btn-primary" type="button" onclick="window.open('${event.registrationLink}', '_blank')">
                Register Now
            </button>
        `;
    } else if (event.status === 'upcoming' && !event.registrationLink) {
        return `
            <button class="btn-outline" type="button" aria-label="Add to favorites">
                <i class="far fa-heart"></i>
            </button>
            <button class="btn-secondary" type="button" disabled>
                TBD
            </button>
        `;
    } else {
        return `
            <button class="btn-outline" type="button" aria-label="Add to favorites">
                <i class="far fa-heart"></i>
            </button>
            <button class="btn-secondary" type="button" disabled>
                Registration Closed
            </button>
        `;
    }
}

function updateEventCounts() {
    const allEvents = eventsData.length;
    const upcomingEvents = eventsData.filter(e => e.status === 'upcoming').length;
    const completedEvents = eventsData.filter(e => e.status === 'completed').length;
    const featuredEvents = eventsData.filter(e => e.featured).length;
    const freeEvents = eventsData.filter(e => e.free).length;
    
    // Update filter tab counts
    updateTabCount('all', allEvents);
    updateTabCount('upcoming', upcomingEvents);
    updateTabCount('completed', completedEvents);
    updateTabCount('featured', featuredEvents);
    updateTabCount('free', freeEvents);
    
    // Update load more text
    const loadMoreText = document.querySelector('.load-more-text');
    if (loadMoreText) {
        loadMoreText.textContent = `Showing ${allEvents} events total`;
    }
}

// Function to update tab count dynamically
function updateTabCount(filterType, count) {
    const tab = document.querySelector(`.filter-tab[data-filter="${filterType}"]`);
    if (tab) {
        const countSpan = tab.querySelector('.tab-count');
        if (countSpan) {
            countSpan.textContent = count;
        }
    }
}



// Filter system functionality - Updated for dynamic events
function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const searchInput = document.getElementById('event-search');
    
    // Set initial active tab
    const allTab = Array.from(filterTabs).find(tab => tab.getAttribute('data-filter') === 'all');
    if (allTab) allTab.classList.add('active');
    
    // Filter tabs
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            filterEventsByTab(filterValue);
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterEventsBySearch(searchTerm);
        });
    }
    
    function filterEventsByTab(filter) {
        currentFilter = filter;
        let filteredEvents = eventsData;
        
        switch(filter) {
            case 'all':
                filteredEvents = eventsData;
                break;
            case 'upcoming':
                filteredEvents = eventsData.filter(event => event.status === 'upcoming');
                break;
            case 'completed':
                filteredEvents = eventsData.filter(event => event.status === 'completed');
                break;
            case 'free':
                filteredEvents = eventsData.filter(event => event.free === true);
                break;
            default:
                filteredEvents = eventsData;
        }
        
        // Reset display count and update filtered events
        currentDisplayCount = 6;
        currentFilteredEvents = filteredEvents;
        renderEvents(filteredEvents, 6);
    }
    
    function filterEventsBySearch(searchTerm) {
        currentSearchTerm = searchTerm;
        if (!searchTerm) {
            currentDisplayCount = 6;
            currentFilteredEvents = eventsData;
            renderEvents(eventsData, 6);
            return;
        }
        
        const filteredEvents = eventsData.filter(event => {
            return event.title.toLowerCase().includes(searchTerm) ||
                   event.description.toLowerCase().includes(searchTerm) ||
                   event.presenter.toLowerCase().includes(searchTerm) ||
                   event.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        });
        
        // Reset display count and update filtered events
        currentDisplayCount = 6;
        currentFilteredEvents = filteredEvents;
        renderEvents(filteredEvents, 6);
    }
}

// Enhanced event card interactions for dynamic content
function initEventCardInteractions() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Heart button functionality
        const heartBtn = card.querySelector('.btn-outline:not([disabled])');
        if (heartBtn) {
            heartBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const icon = this.querySelector('i');
                
                if (icon.classList.contains('fas')) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    this.style.color = '#6B7684';
                } else {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    this.style.color = '#EF4444';
                }
                
                // Add animation
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }
    });
}

// Dropdown functionality
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.filter-dropdown, .sort-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (trigger && menu) {
            trigger.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Close other dropdowns
                dropdowns.forEach(d => {
                    if (d !== dropdown) {
                        d.querySelector('.dropdown-menu').style.display = 'none';
                    }
                });
                
                // Toggle current dropdown
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });
            
            // Handle menu item clicks
            menu.querySelectorAll('a').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const text = this.textContent;
                    trigger.querySelector('span').textContent = text;
                    menu.style.display = 'none';
                    
                    // Handle sorting or filtering
                    const sortValue = this.getAttribute('data-sort');
                    const filterValue = this.getAttribute('data-filter');
                    
                    if (sortValue) {
                        sortEvents(sortValue);
                    }
                    
                    if (filterValue) {
                        filterEventsByCategory(filterValue);
                    }
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = 'none';
            }
        });
    });
}

// Event card interactions - Updated for dynamic content
function initEventCards() {
    // This function now just handles the load more button
    // Individual card interactions are handled by initEventCardInteractions()
    
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreEvents();
        });
    }
}



// Newsletter functionality
function initNewsletter() {
    // Newsletter is now a simple link to contact page
    // No form functionality needed
    console.log('Newsletter redirects to contact page');
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.event-card, .section-header, .filter-system');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Parallax effect for hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroPattern = document.querySelector('.hero-pattern');
        const floatingElements = document.querySelectorAll('.float-element');
        
        if (heroPattern) {
            heroPattern.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Utility functions
function scrollToEvents() {
    const eventsSection = document.getElementById('events-section');
    if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Updated sorting functionality for dynamic events
function sortEvents(sortBy) {
    // Get current filtered events
    let eventsToSort = eventsData;
    
    // Apply current filter
    if (currentFilter !== 'all') {
        switch(currentFilter) {
            case 'upcoming':
                eventsToSort = eventsData.filter(event => event.status === 'upcoming');
                break;
            case 'featured':
                eventsToSort = eventsData.filter(event => event.featured === true);
                break;
            case 'free':
                eventsToSort = eventsData.filter(event => event.free === true);
                break;
        }
    }
    
    // Apply current search if exists
    if (currentSearchTerm) {
        eventsToSort = eventsToSort.filter(event => {
            return event.title.toLowerCase().includes(currentSearchTerm) ||
                   event.description.toLowerCase().includes(currentSearchTerm) ||
                   event.presenter.toLowerCase().includes(currentSearchTerm) ||
                   event.tags.some(tag => tag.toLowerCase().includes(currentSearchTerm));
        });
    }
    
    let sortedEvents = [...eventsToSort];
    
    switch (sortBy) {
        case 'date':
            sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'date-desc':
            sortedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'name':
            sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'popularity':
            // Sort by featured events first, then by date
            sortedEvents.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return new Date(a.date) - new Date(b.date);
            });
            break;
        default:
            // No sorting needed
            break;
    }
    
    renderEvents(sortedEvents, currentEventLimit);
}

function filterEventsByCategory(category) {
    currentFilter = category === 'all' ? 'all' : category;
    let filteredEvents = eventsData;
    
    if (category !== 'all') {
        filteredEvents = eventsData.filter(event => event.category === category);
    }
    
    // Reset limit when filtering by category
    currentEventLimit = 6;
    renderEvents(filteredEvents, currentEventLimit);
    updateFilterResultsCount(filteredEvents.length);
}

// Utility function for updating filter results count
function updateFilterResultsCount(count) {
    const loadMoreText = document.querySelector('.load-more-text');
    if (loadMoreText) {
        loadMoreText.textContent = `Showing ${count} events`;
    }
}

// Remove unused functions for creating fake events
// createEventCard and animateNewCard functions removed

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .modern-nav.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 1rem;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(style);