// Glossary Data - Load from JSON file
let glossaryData = {};

// Load glossary data from JSON file
async function loadGlossaryData() {
    try {
        const response = await fetch('glossary.json');
        glossaryData = await response.json();
        renderGlossary('all', '');
        initializeListeners();
    } catch (error) {
        console.error('Error loading glossary data:', error);
    }
}

// Get Icon for Glossary Item
function getIconForTerm(title) {

const iconMap = {
        'ACC (Associate Certified Coach)': 'fas fa-certificate',
        'Accountability': 'fas fa-balance-scale',
        'Accountability Coaching': 'fas fa-hand-holding-box',
        'Active Listening': 'fas fa-ear',
        'Adaptability': 'fas fa-random',
        'Agile Coaching': 'fas fa-tachometer-alt',
        'Authenticity': 'fas fa-heart',
        'Balance': 'fas fa-scale-balanced',
        'Boundaries': 'fas fa-border-all',
        'Business Coaching': 'fas fa-briefcase',
        'Career Coaching': 'fas fa-route',
        'Career Transition Coaching': 'fas fa-person-running',
        'Change Management': 'fas fa-shuffle',
        'Clarity': 'fas fa-crystal-ball',
        'CLEAR': 'fas fa-arrow-right',
        'Coaching Agreement': 'fas fa-file-contract',
        'Coaching Certification': 'fas fa-award',
        'Coaching Competencies': 'fas fa-toolbox',
        'Coaching Ethics': 'fas fa-gavel',
        'Coaching Models': 'fas fa-diagram-project',
        'Coaching Presence': 'fas fa-users-viewfinder',
        'Coaching Supervision': 'fas fa-eye',
        'Collaboration': 'fas fa-handshake',
        'Communication': 'fas fa-comments',
        'Confidence Coaching': 'fas fa-hands-clapping',
        'Confidentiality': 'fas fa-lock',
        'Conflict Resolution': 'fas fa-comments-dollar',
        'Creativity': 'fas fa-lightbulb',
        'Cross Cultural Coaching': 'fas fa-globe',
        'Decision Making': 'fas fa-check-double',
        'Delegation': 'fas fa-share',
        'Development': 'fas fa-chart-line',
        'Diversity': 'fas fa-people-group',
        'Diversity And Inclusion Coaching': 'fas fa-hands-heart',
        'Emotional Intelligence': 'fas fa-brain-circuit',
        'Emotional Regulation': 'fas fa-sliders-h',
        'Emotional Resilience': 'fas fa-wave-square',
        'Empathy': 'fas fa-face-smile',
        'Empowerment': 'fas fa-bolt',
        'Energy Leadership': 'fas fa-charging-station',
        'Engagement': 'fas fa-handshake-angle',
        'Executive Coaching': 'fas fa-user-tie',
        'Executive Presence': 'fas fa-sitemap',
        'Facilitation': 'fas fa-bridge',
        'Feedback': 'fas fa-comment-dots',
        'Focus': 'fas fa-crosshairs',
        'Goal Achievement Coaching': 'fas fa-bullseye',
        'Goal Setting': 'fas fa-target',
        'GROW': 'fas fa-leaf',
        'Growth Coaching': 'fas fa-seedling',
        'Growth Mindset': 'fas fa-brain',
        'Habit Coaching': 'fas fa-repeat',
        'Health Coaching': 'fas fa-heart-pulse',
        'Holistic Coaching': 'fas fa-yin-yang',
        'Icf Certification': 'fas fa-ribbon',
        'Inspiration': 'fas fa-star',
        'Integrity': 'fas fa-shield-check',
        'Intuition': 'fas fa-moon',
        'Leadership Coaching': 'fas fa-users-line',
        'Leadership Development': 'fas fa-person-chalkboard',
        'Learning Styles': 'fas fa-puzzle-piece',
        'Life Coaching': 'fas fa-house-chimney-user',
        'MCC (Master Certified Coach)': 'fas fa-crown',
        'Mentor Coaching': 'fas fa-hands-bound',
        'Mentoring': 'fas fa-graduation-cap',
        'Mindful Leadership': 'fas fa-person-rays',
        'Mindfulness': 'fas fa-person-circle-exclamation',
        'Mindset Coaching': 'fas fa-head-side-virus',
        'Motivation': 'fas fa-fire',
        'Motivational Interviewing': 'fas fa-magnifying-glass-chart',
        'Neuro Linguistic Programming Nlp': 'fas fa-language',
        'Neuroplasticity': 'fas fa-route-interstate',
        'Observation Skills': 'fas fa-binoculars',
        'Organizational Development Coaching': 'fas fa-building',
        'PCC (Professional Certified Coach)': 'fas fa-medal',
        'Peak Performance Coaching': 'fas fa-rocket',
        'Performance Coaching': 'fas fa-chart-simple',
        'Personal Branding Coaching': 'fas fa-id-card',
        'Personal Coaching': 'fas fa-user-shield',
        'Personal Development Coaching': 'fas fa-person-falling-a',
        'Positive Psychology': 'fas fa-face-laugh-squint',
        'post_title': 'fas fa-bookmark',
        'Rapport': 'fas fa-people-arrows',
        'Reflection': 'fas fa-mirror',
        'Reframing': 'fas fa-redo',
        'Resilience': 'fas fa-shield',
        'Resilience Coaching': 'fas fa-hand-holding-heart',
        'Self Awareness': 'fas fa-person-booth',
        'Self Development Coaching': 'fas fa-circle-notch',
        'Solution Focused Coaching': 'fas fa-key',
        'Spiritual Coaching': 'fas fa-dove',
        'Strategic Thinking': 'fas fa-chess-board',
        'Strengths Based Coaching': 'fas fa-dumbbell',
        'Stress Management Coaching': 'fas fa-umbrella',
        'Stress Reduction Techniques': 'fas fa-hand-sparkles',
        'Support': 'fas fa-hands-helping',
        'Systemic Coaching': 'fas fa-arrows-to-circle',
        'Team Coaching': 'fas fa-people-carry-box',
        'Team Dynamics Coaching': 'fas fa-shuffle-track',
        'Transformation': 'fas fa-wand-magic-sparkles',
        'Transformational Coaching': 'fas fa-meteor',
        'Trauma Informed Coaching': 'fas fa-hands-holding-child',
        'Trust': 'fas fa-handshake',
        'Values': 'fas fa-gem',
        'Vision': 'fas fa-eye-low-vision',
        'Vision Board Coaching': 'fas fa-table-cells',
        'Visionary Leadership': 'fas fa-lightbulb-on',
        'Visualization': 'fas fa-brain-gear',
        'Wellness': 'fas fa-spa'
    };
    
    // Find matching icon, or return default
    for (const [key, icon] of Object.entries(iconMap)) {
        if (title.includes(key) || key.includes(title.split(' ')[0])) {
            return icon;
        }
    }
    
    return 'fas fa-book';
}

// Render Glossary
function renderGlossary(filter = 'all', searchTerm = '') {
    const content = document.getElementById('glossary-content');
    const noResults = document.getElementById('no-results');
    
    if (!content) return;
    
    content.innerHTML = '';
    let hasResults = false;
    
    const letters = filter === 'all' ? Object.keys(glossaryData).sort() : [filter];
    
    letters.forEach(letter => {
        const items = glossaryData[letter] || [];
        
        // Filter by search term
        let filteredItems = items;
        if (searchTerm) {
            filteredItems = items.filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (filteredItems.length > 0) {
            hasResults = true;
            
            // Create letter section ONLY ONCE per letter
            const section = document.createElement('div');
            section.className = 'glossary-letter-section';
            
            // Add letter header ONLY ONCE
            const header = document.createElement('div');
            header.className = 'letter-header';
            header.innerHTML = `
                <div class="letter-icon">${letter}</div>
                <h2 class="letter-title">${letter}</h2>
            `;
            section.appendChild(header);
            
            // Terms grid
            const grid = document.createElement('div');
            grid.className = 'terms-grid';
            
            filteredItems.forEach(item => {
                const itemEl = document.createElement('a');
                itemEl.href = item.url;
                itemEl.target = '_blank';
                itemEl.rel = 'noopener noreferrer';
                itemEl.className = 'glossary-item';
                
                const icon = getIconForTerm(item.title);
                
                itemEl.innerHTML = `
                    <div class="glossary-item-header">
                        <div class="glossary-item-icon">
                            <i class="${icon}"></i>
                        </div>
                        <div class="glossary-item-title">${item.title}</div>
                    </div>
                    <div class="glossary-item-link">
                        <span>Learn More</span>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                `;
                
                grid.appendChild(itemEl);
            });
            
            section.appendChild(grid);
            content.appendChild(section);
        }
    });
    
    // Show/hide no results message
    if (!hasResults) {
        noResults.style.display = 'flex';
    } else {
        noResults.style.display = 'none';
    }
}

// Initialize event listeners
function initializeListeners() {
    // Alphabet button listeners
    const alphaButtons = document.querySelectorAll('.alpha-btn');
    alphaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const letter = this.getAttribute('data-letter');
            const searchInput = document.getElementById('glossary-search');
            const searchTerm = searchInput ? searchInput.value : '';
            
            // Update active button
            alphaButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Render glossary with selected letter
            renderGlossary(letter, searchTerm);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('glossary-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const activeBtn = document.querySelector('.alpha-btn.active');
            const filter = activeBtn ? activeBtn.getAttribute('data-letter') : 'all';
            
            renderGlossary(filter, searchTerm);
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Load glossary data from JSON file
    loadGlossaryData();
});
