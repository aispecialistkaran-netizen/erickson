// Events Data
const sessionEvents = [
    {
        title: "ACC Pathway: Your Guide to Exam Success",
        presenter: "Gaurav Arora",
        eventDate: "Oct 9, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: null,
        liveLink: null
    },
    {
        title: "ACC Pathway: Your Guide to Exam Success",
        presenter: "Gaurav Arora",
        eventDate: "Oct 16, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: null,
        liveLink: null
    },
    {
        title: "India Coaching Forward: Awakening a Nation of Conscious Coaches",
        presenter: "Gaurav Arora",
        eventDate: "Nov 26, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_I1Tra6nlQDuXaBqQPqQ1Dw#/registration",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_I1Tra6nlQDuXaBqQPqQ1Dw#/registration"
    },
    {
        title: "Experience Coaching- Experience Clarity",
        presenter: "Gaurav Arora, MCC",
        eventDate: "Oct 29, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_im17Cx08RdC-NVtJSYFwhg",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_im17Cx08RdC-NVtJSYFwhg"
    },
    {
        title: "Coaching at the Heart of Building Human Centered Organisations",
        presenter: "Anupam Arun",
        eventDate: "Nov 4, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_rW8fPxGVREW5pbTeWENDqA",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_rW8fPxGVREW5pbTeWENDqA"
    },
    {
        title: "Building Block of the Coaching Mindset",
        presenter: "Gaurav Arora, MCC",
        eventDate: "Nov 12, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_ilhqBolLRJiwDkefna0zRg",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_ilhqBolLRJiwDkefna0zRg"
    },
    {
        title: "Leading in Uncertainty- Why Coaching Skills are a Leader's Superpower",
        presenter: "Ashish Taneja",
        eventDate: "Nov 18, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_OUSmj4dxQBqTXERJxQj5aw",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_OUSmj4dxQBqTXERJxQj5aw"
    },
    {
        title: "India Coaching Forward- Awakening a Nation of Conscious Coaches",
        presenter: "Emmanuel D, ACC",
        eventDate: "Nov 26, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_I1Tra6nlQDuXaBqQPqQ1Dw",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_I1Tra6nlQDuXaBqQPqQ1Dw"
    },
    {
        title: "Coaching is no Longer optional for Today's Leaders",
        presenter: "Bhushan Kulkarni, PCC",
        eventDate: "Dec 2, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_M0pg6hMORLqLcRmp5uzYgQ",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_M0pg6hMORLqLcRmp5uzYgQ"
    },
    {
        title: "From Good Manager to Great Coaches- Shift that changes everything",
        presenter: "Hariharan S, ACC",
        eventDate: "Dec 10, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_WkCf6lh2TpSisEOHjmh-lA",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_WkCf6lh2TpSisEOHjmh-lA"
    },
    {
        title: "Listening at the Global Level",
        presenter: "Raghavan Veera",
        eventDate: "Dec 16, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_qSFYPIHqRgGF8Usl0qlAfw",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_qSFYPIHqRgGF8Usl0qlAfw"
    },
    {
        title: "Building Human Centered Leadership through Coaching",
        presenter: "Pankaj K",
        eventDate: "Dec 23, 2025 7:00 PM",
        durationHours: 1,
        registrationLink: "https://us02web.zoom.us/webinar/register/WN_NSLSxW0qQMCB4WqcUdddeQ",
        liveLink: "https://us02web.zoom.us/webinar/register/WN_NSLSxW0qQMCB4WqcUdddeQ"
    }
];

// Utility function to format date
function formatEventDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return dateString;
    }
}

// Utility function to get time from date string
function getTime(dateString) {
    try {
        const time = dateString.split(' ').slice(-2).join(' ');
        return time;
    } catch (e) {
        return '';
    }
}

// Create Event Card HTML
function createEventCard(event, index) {
    const formattedDate = formatEventDate(event.eventDate);
    const time = getTime(event.eventDate);
    const eventDate = new Date(event.eventDate);
    const today = new Date('2025-10-30'); // Current date
    const isUpcoming = eventDate >= today;
    const isPast = eventDate < today;

    return `
        <div class="event-card ${isPast ? 'past-event' : ''}" style="animation-delay: ${index * 0.1}s">
            <div class="event-status ${isUpcoming ? 'upcoming' : 'previous'}">
                ${isUpcoming ? 'Upcoming' : 'Previous'}
            </div>
            <div class="event-card-header">
                <div class="event-date">
                    <i class="fas fa-calendar-alt"></i> ${formattedDate}
                </div>
                <h3 class="event-title">${event.title}</h3>
                <p class="event-presenter">
                    <i class="fas fa-user-circle"></i> ${event.presenter}
                </p>
            </div>
            <div class="event-card-body">
                <div class="event-details">
                    <div class="detail-item">
                        <i class="fas fa-clock"></i>
                        <span>${time}</span>
                    </div>
                    <div class="detail-item">
                        <i class="fas fa-hourglass-half"></i>
                        <span>${event.durationHours} Hours</span>
                    </div>
                </div>
                <p class="event-description">
                    Join us for an interactive webinar session focused on professional development and coaching excellence.
                </p>
            </div>
            <div class="event-card-footer">
                ${isUpcoming ? `
                    <a href="${event.registrationLink}" target="_blank" rel="noopener noreferrer" class="event-btn btn-register">
                        <i class="fas fa-clipboard-list"></i>
                        Register
                    </a>
                    <a href="${event.liveLink}" target="_blank" rel="noopener noreferrer" class="event-btn btn-join">
                        <i class="fas fa-play-circle"></i>
                        Join Live
                    </a>
                ` : `
                    <button class="event-btn btn-view-details" disabled>
                        <i class="fas fa-eye"></i>
                        Event Completed
                    </button>
                `}
            </div>
        </div>
    `;
}

// Global variables for filtering
let currentFilter = 'all';
let currentSearchTerm = '';
let currentSortBy = 'date';

// Render Events
function renderEvents() {
    const eventsGrid = document.getElementById('events-grid');
    const noEventsMessage = document.getElementById('no-events-message');

    // Filter events based on current filter, search term, and date
    let filteredEvents = sessionEvents.filter(event => {
        // Apply search filter
        const searchLower = currentSearchTerm.toLowerCase();
        const matchesSearch = (
            event.title.toLowerCase().includes(searchLower) ||
            event.presenter.toLowerCase().includes(searchLower) ||
            event.eventDate.toLowerCase().includes(searchLower)
        );

        if (!matchesSearch) return false;

        // Apply date filter
        const eventDate = new Date(event.eventDate);
        const today = new Date('2025-10-30'); // Current date updated

        if (currentFilter === 'upcoming') {
            return eventDate >= today;
        } else if (currentFilter === 'previous') {
            return eventDate < today;
        }

        return true; // 'all' filter
    });

    // Sort events - Upcoming first (by nearest date), then past events
    filteredEvents.sort((a, b) => {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        const today = new Date('2025-10-30');
        
        // Separate upcoming and past
        const aIsUpcoming = dateA >= today;
        const bIsUpcoming = dateB >= today;
        
        // Upcoming first
        if (aIsUpcoming && !bIsUpcoming) return -1;
        if (!aIsUpcoming && bIsUpcoming) return 1;
        
        // Both upcoming or both past - sort by date (earliest first for upcoming, latest first for past)
        if (aIsUpcoming && bIsUpcoming) {
            return dateA - dateB; // Nearest upcoming first
        } else {
            return dateB - dateA; // Most recent past first
        }
    });

    // Render or show no results
    if (filteredEvents.length === 0) {
        eventsGrid.innerHTML = '';
        noEventsMessage.style.display = 'block';
    } else {
        eventsGrid.innerHTML = filteredEvents
            .map((event, index) => createEventCard(event, index))
            .join('');
        noEventsMessage.style.display = 'none';
    }

    // Update event count and filter counts
    updateCounts(filteredEvents.length);
}

// Update filter counts and main event count
function updateCounts(filteredCount) {
    const today = new Date('2025-10-30'); // Current date

    // Calculate counts for each filter
    const allCount = sessionEvents.length;
    const upcomingCount = sessionEvents.filter(event => new Date(event.eventDate) >= today).length;
    const previousCount = sessionEvents.filter(event => new Date(event.eventDate) < today).length;

    // Update main event count in hero
    document.getElementById('event-count').textContent = filteredCount;

    // Update filter tab counts
    document.querySelector('[data-filter="all"] .count').textContent = allCount;
    document.querySelector('[data-filter="upcoming"] .count').textContent = upcomingCount;
    document.querySelector('[data-filter="previous"] .count').textContent = previousCount;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('event-search');
    const sortSelect = document.getElementById('sort-select');

    // Initial render
    renderEvents();

    // Filter tab functionality
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Remove active class from all tabs
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            e.target.classList.add('active');

            // Update current filter
            currentFilter = e.target.dataset.filter;

            // Re-render events
            renderEvents();
        });
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        renderEvents();
    });

    // Sort functionality
    sortSelect.addEventListener('change', (e) => {
        currentSortBy = e.target.value;
        renderEvents();
    });

    // Smooth scroll for CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById('events-grid');
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // Add hover animation for cards
    document.addEventListener('mouseover', (e) => {
        const card = e.target.closest('.event-card');
        if (card) {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    });
});
