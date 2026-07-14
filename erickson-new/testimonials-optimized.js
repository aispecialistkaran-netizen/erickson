// Optimized Testimonials Manager - Performance & Memory Optimized
class OptimizedTestimonialsManager {
    constructor() {
        // Core data
        this.testimonials = [];
        this.filteredTestimonials = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.currentPage = 1;
        this.testimonialsPerPage = 6; // Smaller chunks for better performance
        this.isLoading = false;
        this.isModalOpen = false;
        
        // Event listeners registry for cleanup
        this.eventListeners = new Map();
        this.observers = new Set();
        this.timeouts = new Set();
        
        // Debounced functions
        this.debouncedSearch = this.debounce(this.handleSearch.bind(this), 300);
        this.debouncedResize = this.debounce(this.handleResize.bind(this), 100);
        
        // Cached DOM elements
        this.domCache = new Map();
        
        this.init();
    }
    
    // Initialize with error handling
    async init() {
        try {
            await this.loadTestimonials();
            this.cacheElements();
            this.setupEventListeners();
            this.updateCounts();
            this.renderTestimonials();
            // Remove intersection observer to prevent conflicts
            // this.setupIntersectionObserver();
            // Initialize hero testimonial slider with the same data
            this.initHeroTestimonialSlider();
        } catch (error) {
            console.error('Failed to initialize testimonials:', error);
            this.showErrorState();
        }
    }
    
    // Cache frequently used DOM elements
    cacheElements() {
        const elements = [
            'search-input', 'search-clear', 'testimonials-grid', 
            'load-more-btn', 'testimonial-modal', 'modal-close',
            'modal-name', 'modal-image', 'modal-testimonial-text',
            'all-count', 'verified-count', 'leadership-count',
            'transformation-count', 'corporate-count', 'testimonial-count'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                this.domCache.set(id, element);
            }
        });
    }
    
    // Get cached element
    getElement(id) {
        return this.domCache.get(id);
    }
    
    // Optimized testimonials loading
    async loadTestimonials() {
        try {
            const response = await fetch('testimonialss.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const testimonialsData = await response.json();
            
            // Process data efficiently
            this.testimonials = testimonialsData.map((testimonial, index) => ({
                ...testimonial,
                id: index + 1,
                rating: 5,
                date: this.generateRandomDate(),
                categories: this.categorizeTestimonial(testimonial.text),
                hasImage: !!testimonial.image,
                truncatedText: this.truncateText(testimonial.text, 200)
            }));
            
            this.filteredTestimonials = [...this.testimonials];
            
        } catch (error) {
            console.error('Error loading testimonials:', error);
            this.testimonials = [];
            this.filteredTestimonials = [];
            throw error;
        }
    }
    
    // Efficient event listener setup with proper cleanup tracking
    setupEventListeners() {
        this.cleanupEventListeners(); // Clean any existing listeners
        
        // Search functionality
        const searchInput = this.getElement('search-input');
        const searchClear = this.getElement('search-clear');
        
        if (searchInput) {
            this.addEventListenerTracked(searchInput, 'input', this.debouncedSearch);
        }
        
        if (searchClear) {
            this.addEventListenerTracked(searchClear, 'click', this.clearSearch.bind(this));
        }
        
        // Filter tabs with event delegation
        const tabContainer = document.querySelector('.filter-tabs');
        if (tabContainer) {
            this.addEventListenerTracked(tabContainer, 'click', this.handleTabClick.bind(this));
        }
        
        // Load more button - simplified
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreTestimonials();
            });
        }
        
        // Modal listeners
        this.setupModalListeners();
        
        // Global listeners
        this.addEventListenerTracked(document, 'keydown', this.handleGlobalKeydown.bind(this));
        this.addEventListenerTracked(window, 'resize', this.debouncedResize);
        
        // Page visibility API for performance
        this.addEventListenerTracked(document, 'visibilitychange', this.handleVisibilityChange.bind(this));
    }
    
    // Track event listeners for cleanup
    addEventListenerTracked(element, event, handler, options) {
        element.addEventListener(event, handler, options);
        
        const key = `${element.constructor.name}-${event}-${Date.now()}`;
        this.eventListeners.set(key, { element, event, handler, options });
    }
    
    // Clean up all event listeners
    cleanupEventListeners() {
        for (const [key, { element, event, handler, options }] of this.eventListeners) {
            try {
                element.removeEventListener(event, handler, options);
            } catch (error) {
                console.warn('Failed to remove event listener:', error);
            }
        }
        this.eventListeners.clear();
    }
    
    // Bulletproof modal system - completely isolated
    setupModalListeners() {
        // Remove all existing modal elements and recreate them
        this.initializeModal();
    }
    
    initializeModal() {
        const modal = document.getElementById('testimonial-modal');
        if (!modal) return;
        
        // Clear all event listeners by cloning
        const newModal = modal.cloneNode(true);
        modal.parentNode.replaceChild(newModal, modal);
        
        // Set up fresh event listeners
        const closeBtn = newModal.querySelector('#modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                this.forceCloseModal();
            });
        }
        
        // Background click to close
        newModal.addEventListener('click', (e) => {
            if (e.target === newModal) {
                e.stopImmediatePropagation();
                this.forceCloseModal();
            }
        });
        
        // Escape key - single global listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                e.stopImmediatePropagation();
                this.forceCloseModal();
            }
        }, true);
    }
    
    // Efficient search handling
    handleSearch(e) {
        const value = e.target.value.toLowerCase().trim();
        this.searchTerm = value;
        this.currentPage = 1;
        this.filterAndRender();
        
        const searchClear = this.getElement('search-clear');
        if (searchClear) {
            searchClear.style.display = value ? 'block' : 'none';
        }
    }
    
    // Clear search
    clearSearch() {
        const searchInput = this.getElement('search-input');
        const searchClear = this.getElement('search-clear');
        
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        
        if (searchClear) {
            searchClear.style.display = 'none';
        }
        
        this.searchTerm = '';
        this.currentPage = 1;
        this.filterAndRender();
    }
    
    // Handle tab clicks with event delegation
    handleTabClick(e) {
        const tabBtn = e.target.closest('.tab-btn');
        if (!tabBtn) return;
        
        e.preventDefault();
        
        // Update active state efficiently
        const allTabs = document.querySelectorAll('.tab-btn');
        allTabs.forEach(tab => tab.classList.remove('active'));
        tabBtn.classList.add('active');
        
        // Update filter
        this.currentFilter = tabBtn.dataset.filter || 'all';
        this.currentPage = 1;
        this.filterAndRender();
        
        // Update active indicator
        this.updateActiveIndicator(tabBtn);
    }
    
    // Global keydown handler
    handleGlobalKeydown(e) {
        if (e.key === 'Escape' && this.isModalOpen) {
            e.preventDefault();
            this.closeModal();
        }
    }
    
    // Handle window resize
    handleResize() {
        // Update any responsive elements
        this.updateResponsiveElements();
    }
    
    // Handle page visibility changes for performance
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, pause animations
            this.pauseAnimations();
        } else {
            // Page is visible, resume animations
            this.resumeAnimations();
        }
    }
    
    // Optimized filter and render with better UX
    filterAndRender() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.currentPage = 1; // Reset to first page when filtering
        
        // Show loading state for better UX
        const grid = document.getElementById('testimonials-grid');
        if (grid) {
            grid.innerHTML = this.getLoadingStateHTML();
        }
        
        // Use setTimeout for smooth UI updates
        setTimeout(() => {
            this.applyFilters();
            this.renderTestimonials();
            this.updateCounts();
            this.isLoading = false;
        }, 100);
    }
    
    // Efficient filtering
    applyFilters() {
        let filtered = this.testimonials;
        
        // Search filter
        if (this.searchTerm) {
            filtered = filtered.filter(testimonial => {
                const searchableText = `${testimonial.name} ${testimonial.text}`.toLowerCase();
                return searchableText.includes(this.searchTerm);
            });
        }
        
        // Category filter based on actual data structure
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(testimonial => {
                const text = testimonial.text.toLowerCase();
                switch (this.currentFilter) {
                    case 'verified': 
                        return testimonial.image && testimonial.image.trim() !== '';
                    case 'leadership': 
                        return text.includes('leadership') || text.includes('leader') || text.includes('coaching');
                    case 'transformation': 
                        return text.includes('transformation') || text.includes('transform') || 
                               text.includes('growth') || text.includes('change');
                    case 'corporate': 
                        return text.includes('corporate') || text.includes('business') || 
                               text.includes('professional') || text.includes('organization');
                    default: 
                        return true;
                }
            });
        }
        
        this.filteredTestimonials = filtered;
    }
    
    // Efficient chunked rendering for better performance
    renderTestimonials() {
        const grid = document.getElementById('testimonials-grid');
        const loadMoreBtn = document.getElementById('load-more-btn');
        
        if (!grid) return;
        
        const startIndex = (this.currentPage - 1) * this.testimonialsPerPage;
        const endIndex = startIndex + this.testimonialsPerPage;
        
        // For first page, clear the grid
        if (this.currentPage === 1) {
            grid.innerHTML = '';
        }
        
        const testimonialsToShow = this.filteredTestimonials.slice(startIndex, endIndex);
        
        if (testimonialsToShow.length === 0 && this.currentPage === 1) {
            grid.innerHTML = this.getEmptyStateHTML();
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }
        
        // Use DocumentFragment for efficient DOM manipulation
        const fragment = document.createDocumentFragment();
        
        testimonialsToShow.forEach((testimonial, index) => {
            const card = this.createTestimonialCard(testimonial, startIndex + index);
            fragment.appendChild(card);
        });
        
        // Append new cards (don't replace existing ones)
        grid.appendChild(fragment);
        
        // Update load more button
        if (loadMoreBtn) {
            const hasMore = endIndex < this.filteredTestimonials.length;
            loadMoreBtn.style.display = hasMore ? 'flex' : 'none';
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = `Load More (${this.filteredTestimonials.length - endIndex} remaining)`;
        }
        
        console.log(`Rendered ${testimonialsToShow.length} testimonials (page ${this.currentPage})`);
    }
    
    // Optimized card creation
    // Proper testimonial card creation with correct image handling
    createTestimonialCard(testimonial, index) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';
        card.style.animationDelay = `${Math.min(index * 0.1, 1)}s`;
        
        const hasImage = testimonial.image && testimonial.image.trim() !== '';
        const truncatedText = testimonial.text.length > 150 ? 
            testimonial.text.substring(0, 150) + '...' : testimonial.text;
        
        // Determine category based on text content
        const category = this.determineCategory(testimonial.text);
        
        card.innerHTML = `
            <div class="testimonial-header">
                <div class="testimonial-avatar">
                    ${hasImage ? 
                        `<img src="${testimonial.image}" alt="${testimonial.name}" loading="lazy">
                         <div class="verified-badge"><i class="fas fa-check"></i></div>` :
                        `<div class="avatar-placeholder">${this.getInitials(testimonial.name)}</div>`
                    }
                </div>
                <div class="testimonial-info">
                    <h3 class="testimonial-name">${testimonial.name}</h3>
                    <div class="testimonial-role">Verified Client</div>
                    <div class="testimonial-categories">
                        <span class="category-tag ${category}">${this.getCategoryDisplay(category)}</span>
                    </div>
                </div>
            </div>
            <div class="testimonial-text">
                <p>${truncatedText}</p>
            </div>
            <div class="testimonial-footer">
                <div class="testimonial-actions">
                    <button class="read-more-btn">Read Full Story</button>
                </div>
            </div>
        `;
        
        // Bulletproof card click handling
        card.addEventListener('click', (e) => {
            // Don't interfere with category tags
            if (e.target.closest('.category-tag')) return;
            
            // Stop all propagation
            e.preventDefault();
            e.stopImmediatePropagation();
            
            // Small delay to ensure clean execution
            setTimeout(() => {
                this.openModal(testimonial);
            }, 50);
        });
        
        return card;
    }
    
    // Helper function to get initials for placeholder
    getInitials(name) {
        if (!name) return 'U';
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }
    
    // Helper function to determine category from text content
    determineCategory(text) {
        const lowercaseText = text.toLowerCase();
        if (lowercaseText.includes('leadership') || lowercaseText.includes('leader')) {
            return 'leadership';
        } else if (lowercaseText.includes('transformation') || lowercaseText.includes('transform') || lowercaseText.includes('growth')) {
            return 'transformation';
        } else if (lowercaseText.includes('corporate') || lowercaseText.includes('business') || lowercaseText.includes('professional')) {
            return 'corporate';
        }
        return 'verified';
    }
    
    // Helper function to get category display name
    getCategoryDisplay(category) {
        const displays = {
            'leadership': 'Leadership',
            'transformation': 'Transformation',
            'corporate': 'Corporate',
            'verified': 'Verified Client'
        };
        return displays[category] || 'Client';
    }
    
    // Handle card clicks efficiently
    handleCardClick(e, testimonial) {
        if (e.target.closest('.category-tag') || this.isModalOpen) return;
        
        e.preventDefault();
        this.openModal(testimonial);
    }
    
    // Simplified modal operations - no conflicts
    // Bulletproof modal operations
    openModal(testimonial) {
        if (this.isModalOpen) {
            this.forceCloseModal(); // Force close any existing modal
        }
        
        const modal = document.getElementById('testimonial-modal');
        const modalName = document.getElementById('modal-name');
        const modalImage = document.getElementById('modal-image');
        const modalText = document.getElementById('modal-testimonial-text');
        
        if (!modal || !modalName || !modalText) return;
        
        // Set modal state first
        this.isModalOpen = true;
        
        // Set content
        modalName.textContent = testimonial.name || 'Client';
        modalText.textContent = testimonial.text || '';
        
        if (modalImage && testimonial.image) {
            modalImage.src = testimonial.image;
            modalImage.alt = testimonial.name;
            modalImage.style.display = 'block';
        } else if (modalImage) {
            modalImage.style.display = 'none';
        }
        
        // Show modal with timeout to ensure DOM is ready
        setTimeout(() => {
            modal.style.display = 'flex';
            modal.style.opacity = '1';
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    }
    
    forceCloseModal() {
        const modal = document.getElementById('testimonial-modal');
        if (!modal) return;
        
        // Force close regardless of state
        this.isModalOpen = false;
        
        // Hide modal immediately
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear any pending timeouts
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts.clear();
    }
    
    // Alias for compatibility
    closeModal() {
        this.forceCloseModal();
    }
    
    // Optimized intersection observer
    setupIntersectionObserver() {
        if (this.mainObserver) {
            this.mainObserver.disconnect();
        }
        
        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in', 'reveal');
                    this.mainObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        this.observers.add(this.mainObserver);
    }
    
    // Observe new cards
    observeNewCards() {
        if (!this.mainObserver) return;
        
        const cards = document.querySelectorAll('.testimonial-card:not(.observed)');
        cards.forEach(card => {
            card.classList.add('observed');
            this.mainObserver.observe(card);
        });
    }
    
    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            this.timeouts.add(timeout);
        };
    }
    
    generateRandomDate() {
        const start = new Date(2020, 0, 1);
        const end = new Date();
        const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return randomDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
    
    categorizeTestimonial(text) {
        const categories = [];
        const lowercaseText = text.toLowerCase();
        
        const categoryMap = {
            leadership: ['leadership', 'leader', 'executive', 'management'],
            transformation: ['transformation', 'transform', 'journey', 'growth', 'change'],
            corporate: ['corporate', 'company', 'business', 'organization', 'workplace']
        };
        
        for (const [category, keywords] of Object.entries(categoryMap)) {
            if (keywords.some(keyword => lowercaseText.includes(keyword))) {
                categories.push(category);
            }
        }
        
        return categories;
    }
    
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim();
    }
    
    getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    
    generateStars(rating) {
        return Array(5).fill(0).map((_, i) => 
            `<i class="fa${i < rating ? 's' : 'r'} fa-star"></i>`
        ).join('');
    }
    
    createCategoryTags(categories) {
        const icons = {
            leadership: 'fa-chess-queen',
            transformation: 'fa-bolt',
            corporate: 'fa-building'
        };
        
        return categories.map(category => 
            `<span class="category-tag"><i class="fas ${icons[category] || 'fa-tag'}"></i>${this.capitalizeFirstLetter(category)}</span>`
        ).join('');
    }
    
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Fixed update counts - properly target filter tab counts
    updateCounts() {
        const totalTestimonials = this.testimonials.length;
        
        const counts = {
            all: totalTestimonials,
            // Calculate based on actual data structure
            'with-image': this.testimonials.filter(t => t.image && t.image.trim() !== '').length,
            leadership: this.testimonials.filter(t => 
                t.text.toLowerCase().includes('leadership') || 
                t.text.toLowerCase().includes('leader') ||
                t.text.toLowerCase().includes('coaching')
            ).length,
            transformation: this.testimonials.filter(t => 
                t.text.toLowerCase().includes('transformation') || 
                t.text.toLowerCase().includes('transform') ||
                t.text.toLowerCase().includes('growth') ||
                t.text.toLowerCase().includes('change')
            ).length,
            corporate: this.testimonials.filter(t => 
                t.text.toLowerCase().includes('corporate') || 
                t.text.toLowerCase().includes('business') ||
                t.text.toLowerCase().includes('professional') ||
                t.text.toLowerCase().includes('organization')
            ).length
        };
        
        console.log('Calculated testimonial counts:', counts);
        
        // Update filter tab counts specifically
        Object.entries(counts).forEach(([key, count]) => {
            let elementId;
            if (key === 'all') {
                elementId = 'all-count';
            } else if (key === 'with-image') {
                elementId = 'verified-count';
            } else {
                elementId = `${key}-count`;
            }
            
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = count;
                console.log(`Updated ${elementId}: ${count}`);
            } else {
                console.warn(`Element not found: ${elementId}`);
            }
        });
        
        // Also update testimonial count in hero stats if exists
        const testimonialCountElement = document.getElementById('testimonial-count');
        if (testimonialCountElement && testimonialCountElement.closest('.stats-card')) {
            const counterSpan = testimonialCountElement.querySelector('.counter');
            if (counterSpan) {
                counterSpan.textContent = totalTestimonials;
            }
        }
        
        // Don't touch trust section counters - they have their own predefined values
        console.log(`Testimonial stats updated: ${totalTestimonials} total testimonials`);
        console.log('Trust section counters (100% ICF, 200+ Coaches, 95% Success, 24/7) left unchanged');
    }
    
    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No testimonials found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
    }
    
    getLoadingStateHTML() {
        return `
            <div class="loading-state">
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading testimonials...</p>
            </div>
        `;
    }
    
    showErrorState() {
        const grid = this.getElement('testimonials-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Unable to load testimonials</h3>
                    <p>Please try refreshing the page.</p>
                    <button onclick="location.reload()" class="retry-btn">
                        <i class="fas fa-refresh"></i> Try Again
                    </button>
                </div>
            `;
        }
    }
    
    // Improved load more with loading state and smooth scrolling
    loadMoreTestimonials() {
        if (this.isLoading) return;
        
        console.log('Loading more testimonials...');
        this.isLoading = true;
        
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.textContent = 'Loading...';
        }
        
        // Add a small delay to prevent rapid clicking
        setTimeout(() => {
            this.currentPage++;
            this.renderTestimonials();
            this.isLoading = false;
            
            // Smooth scroll to new content
            setTimeout(() => {
                const newCards = document.querySelectorAll('.testimonial-card');
                if (newCards.length > 0) {
                    const lastCard = newCards[newCards.length - this.testimonialsPerPage];
                    if (lastCard) {
                        lastCard.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }
                }
            }, 100);
        }, 300);
    }
    
    updateActiveIndicator(element) {
        const indicator = document.querySelector('.active-filter-indicator');
        if (!indicator || !element) return;
        
        const parentLeft = element.parentElement.getBoundingClientRect().left;
        const elementRect = element.getBoundingClientRect();
        const left = elementRect.left - parentLeft;
        
        indicator.style.width = `${elementRect.width}px`;
        indicator.style.left = `${left}px`;
    }
    
    updateResponsiveElements() {
        // Handle responsive updates
    }
    
    pauseAnimations() {
        document.body.classList.add('paused-animations');
    }
    
    resumeAnimations() {
        document.body.classList.remove('paused-animations');
    }
    
    // Cleanup method to prevent memory leaks
    destroy() {
        this.cleanupEventListeners();
        
        // Clear observers
        this.observers.forEach(observer => {
            try {
                observer.disconnect();
            } catch (error) {
                console.warn('Failed to disconnect observer:', error);
            }
        });
        this.observers.clear();
        
        // Clear timeouts
        this.timeouts.forEach(timeout => {
            try {
                clearTimeout(timeout);
            } catch (error) {
                console.warn('Failed to clear timeout:', error);
            }
        });
        this.timeouts.clear();
        
        // Clear cache
        this.domCache.clear();
        
        // Reset state
        this.testimonials = [];
        this.filteredTestimonials = [];
    }
    
    // Hero testimonial slider functionality
    initHeroTestimonialSlider() {
        if (!this.testimonials || this.testimonials.length === 0) return;
        
        this.createHeroTestimonialSlides();
        // Setup controls after DOM update
        setTimeout(() => {
            this.setupHeroSliderControls();
        }, 100);
    }
    
    createHeroTestimonialSlides() {
        const showcase = document.querySelector('.testimonial-showcase');
        if (!showcase) return;
        
        const indicatorsContainer = showcase.querySelector('.testimonial-indicators');
        if (!indicatorsContainer) return;
        
        // Clear existing content
        const existingCards = showcase.querySelectorAll('.testimonial-card');
        existingCards.forEach(card => card.remove());
        indicatorsContainer.innerHTML = '';
        
        // Select featured testimonials
        const featuredTestimonials = this.selectFeaturedTestimonials();
        
        if (featuredTestimonials.length === 0) {
            this.createFallbackHeroTestimonials(showcase, indicatorsContainer);
            return;
        }
        
        // Create testimonial cards and indicators
        featuredTestimonials.forEach((testimonial, index) => {
            const card = document.createElement('div');
            card.className = `testimonial-card ${index === 0 ? 'active' : ''}`;
            card.id = `testimonial-${index + 1}`;
            
            const shortText = this.extractShortTestimonial(testimonial.text);
            card.innerHTML = this.createHeroCardHTML(testimonial, shortText);
            
            showcase.insertBefore(card, indicatorsContainer);
            
            // Create indicator
            const indicator = document.createElement('span');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.testimonial = `testimonial-${index + 1}`;
            indicatorsContainer.appendChild(indicator);
            
            // Initially hide non-active cards
            if (index !== 0) {
                card.style.display = 'none';
            }
        });
    }
    
    selectFeaturedTestimonials() {
        const withImages = this.testimonials.filter(item => item.image && item.image.trim() !== '');
        
        if (withImages.length >= 3) {
            return withImages.slice(0, 3);
        }
        
        const featured = [...withImages];
        const withoutImages = this.testimonials.filter(item => !item.image || item.image.trim() === '');
        const needed = 3 - featured.length;
        
        if (needed > 0 && withoutImages.length > 0) {
            featured.push(...withoutImages.slice(0, needed));
        }
        
        return featured;
    }
    
    extractShortTestimonial(text) {
        if (!text) return "This coaching program has been transformative";
        
        const cleanText = text.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
        const firstSentence = cleanText.split(/[.!?]/)[0];
        
        if (firstSentence && firstSentence.length <= 120) {
            return firstSentence;
        }
        
        if (cleanText.length > 100) {
            const truncated = cleanText.substring(0, 100);
            return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
        }
        
        return cleanText;
    }
    
    createHeroCardHTML(testimonial, shortText) {
        return `
            <div class="testimonial-content">
                <div class="quote-icon">
                    <i class="fas fa-quote-right"></i>
                </div>
                <p class="quote-text">"${shortText}"</p>
                <div class="author">
                    <div class="author-image" style="background: ${testimonial.image ? 'none' : 'linear-gradient(135deg, var(--primary-light), var(--primary-color))'}">
                        ${testimonial.image ? `<img src="${testimonial.image}" alt="${testimonial.name}">` : ''}
                    </div>
                    <div class="author-details">
                        <span class="author-name">${testimonial.name || 'Satisfied Client'}</span>
                        <span class="author-title">Verified Client</span>
                    </div>
                    <div class="verification-badge">
                        <i class="fas fa-check-circle"></i>
                    </div>
                </div>
            </div>
        `;
    }
    
    createFallbackHeroTestimonials(showcase, indicatorsContainer) {
        const fallbackData = [
            { name: "Neha Sharma", text: "This coaching program perfectly integrates cultural wisdom with global best practices" },
            { name: "Rajiv Mehta", text: "The coaching techniques I learned have transformed my leadership approach entirely" },
            { name: "Priya Patel", text: "Erickson Coaching provided me with insights I couldn't have gained anywhere else" }
        ];
        
        fallbackData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = `testimonial-card ${index === 0 ? 'active' : ''}`;
            card.id = `testimonial-${index + 1}`;
            card.innerHTML = this.createHeroCardHTML(item, item.text);
            
            showcase.insertBefore(card, indicatorsContainer);
            
            if (index !== 0) card.style.display = 'none';
            
            const indicator = document.createElement('span');
            indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
            indicator.dataset.testimonial = `testimonial-${index + 1}`;
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    setupHeroSliderControls() {
        const indicators = document.querySelectorAll('.indicator');
        if (!indicators.length) return;
        
        let currentIndex = 0;
        const maxIndex = indicators.length - 1;
        let autoRotateTimer;
        
        const showTestimonial = (index) => {
            const testimonials = document.querySelectorAll('[id^="testimonial-"]');
            if (!testimonials.length) return;
            
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'none';
                testimonial.classList.remove('active');
            });
            
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            const selected = document.getElementById(`testimonial-${index + 1}`);
            const selectedIndicator = indicators[index];
            
            if (selected && selectedIndicator) {
                selected.style.display = 'block';
                setTimeout(() => {
                    selected.classList.add('active');
                    selected.classList.add('animate-in');
                    setTimeout(() => selected.classList.remove('animate-in'), 1000);
                }, 10);
                selectedIndicator.classList.add('active');
            }
            
            currentIndex = index;
        };
        
        // Add click events to indicators
        indicators.forEach((indicator, index) => {
            this.addEventListenerTracked(indicator, 'click', () => {
                showTestimonial(index);
                resetAutoRotate();
            });
        });
        
        const startAutoRotate = () => {
            autoRotateTimer = setInterval(() => {
                const newIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
                showTestimonial(newIndex);
            }, 6000);
        };
        
        const resetAutoRotate = () => {
            clearInterval(autoRotateTimer);
            startAutoRotate();
        };
        
        // Pause on hover
        const container = document.querySelector('.testimonial-showcase');
        if (container) {
            this.addEventListenerTracked(container, 'mouseenter', () => clearInterval(autoRotateTimer));
            this.addEventListenerTracked(container, 'mouseleave', startAutoRotate);
        }
        
        startAutoRotate();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.testimonialsManager = new OptimizedTestimonialsManager();
    
    // Initialize trust section counters separately
    initializeTrustCounters();
});

// Trust section counter animation (separate from testimonial counts)
function initializeTrustCounters() {
    const trustCounters = document.querySelectorAll('.trust-section .counter[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // Animate counters when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                observer.unobserve(counter); // Only animate once
            }
        });
    }, { threshold: 0.5 });
    
    trustCounters.forEach(counter => {
        observer.observe(counter);
    });
    
    console.log('Trust section counters initialized:', trustCounters.length);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.testimonialsManager) {
        window.testimonialsManager.destroy();
    }
});
