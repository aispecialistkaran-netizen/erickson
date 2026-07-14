class TestimonialsV2 {
    constructor() {
        this.testimonials = [];
        this.filteredTestimonials = [];
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.displayedCount = 6;
        this.batchSize = 6;
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        console.log('TestimonialsV2 init called');
        this.setupEventListeners();
        console.log('Event listeners set up');
        await this.loadTestimonials();
        console.log('Testimonials loaded');
        this.animateStats();
        console.log('Stats animation set up');
        this.setupIntersectionObserver();
        console.log('Intersection observer set up');
        
        // Add simple delegated click handler for testimonial cards
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.testimonial-card');
            if (card) {
                console.log('Delegated click on card:', card);
                const testimonialId = parseInt(card.dataset.testimonialId);
                const testimonial = this.testimonials.find(t => t.id === testimonialId);
                if (testimonial) {
                    console.log('Opening modal with testimonial:', testimonial);
                    this.openModal(testimonial);
                }
            }
        });
        console.log('Init completed');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchTerm = e.target.value.toLowerCase().trim();
                    this.filterTestimonials();
                }, 300);
            });
        }

        // Filter chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                // Remove active class from all chips
                document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked chip
                e.target.classList.add('active');
                
                this.currentFilter = e.target.dataset.filter;
                this.displayedCount = this.batchSize; // Reset displayed count
                this.filterTestimonials();
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMore();
            });
        }

        // Sort select
        const sortSelect = document.getElementById('sort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.applySort(e.target.value);
            });
        }

        // Modal functionality
        this.setupModalEventListeners();

        // Mobile menu toggle
        const menuToggle = document.querySelector('.erickson-menu-toggle');
        const menu = document.querySelector('.erickson-menu');
        
        if (menuToggle && menu) {
            menuToggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                }
            });
        }

        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Header scroll effect
        this.setupHeaderScrollEffect();
    }

    setupHeaderScrollEffect() {
        const header = document.querySelector('.erickson-header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }

            lastScrollY = currentScrollY;
        });
    }

    setupModalEventListeners() {
        const modal = document.getElementById('modal');
        const modalClose = document.getElementById('modal-close');

        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // ESC key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    async loadTestimonials() {
        console.log('loadTestimonials called');
        try {
            this.showLoading();
            console.log('Loading started');
            
            // Try to load from the existing testimonials file
            let response = await fetch('testimonialss.json');
            
            if (!response.ok) {
                console.log('testimonialss.json not found, using sample data');
                // Fallback to sample data if file doesn't exist
                this.testimonials = this.getSampleTestimonials();
            } else {
                console.log('testimonialss.json loaded successfully');
                this.testimonials = await response.json();
                
                // Debug: Check what categories exist in the data
                const categories = [...new Set(this.testimonials.map(t => t.category).filter(Boolean))];
                console.log('Available categories in data:', categories);
                
                // If no categories or empty categories, assign random ones
                if (categories.length === 0 || categories.every(cat => !cat)) {
                    console.log('No categories found, assigning random ones');
                    const filterCategories = ['leadership', 'corporate', 'transformation', 'personal'];
                    this.testimonials = this.testimonials.map((testimonial, index) => ({
                        ...testimonial,
                        category: filterCategories[index % filterCategories.length]
                    }));
                }
            }

            console.log('Testimonials loaded:', this.testimonials.length);
            this.filteredTestimonials = [...this.testimonials];
            console.log('About to render testimonials...');
            this.renderTestimonials();
            this.updateFilterCounts();
            this.updateLoadMoreButton();
            this.hideLoading();
            console.log('Load completed');
            // Render featured after initial load
            this.renderFeatured();
            
        } catch (error) {
            console.log('Error loading testimonials:', error);
            console.log('Using sample testimonials data');
            this.testimonials = this.getSampleTestimonials();
            this.filteredTestimonials = [...this.testimonials];
            console.log('Sample testimonials:', this.testimonials.length);
            this.renderTestimonials();
            this.updateFilterCounts();
            this.updateLoadMoreButton();
            this.hideLoading();
        }
    }

    getSampleTestimonials() {
        return [
            {
                id: 1,
                name: "Sarah Johnson",
                role: "Executive Coach",
                text: "The Erickson coaching program transformed my approach to leadership development. The tools and techniques I learned have helped me guide countless professionals to achieve their breakthrough moments.",
                category: "Leadership",
                rating: 5,
                image: null
            },
            {
                id: 2,
                name: "Michael Chen",
                role: "HR Director",
                text: "What impressed me most was the practical application of coaching principles. The program doesn't just teach theory - it provides real-world solutions that work immediately.",
                category: "Corporate",
                rating: 5,
                image: null
            },
            {
                id: 3,
                name: "Emily Rodriguez",
                role: "Life Coach",
                text: "The transformation I experienced personally during the program was profound. I discovered new depths of empathy and communication skills that have enhanced every aspect of my life.",
                category: "Personal",
                rating: 5,
                image: null
            },
            {
                id: 4,
                name: "David Thompson",
                role: "Team Leader",
                text: "The coaching methodologies I learned have revolutionized how I manage my team. We've seen a 40% improvement in productivity and team satisfaction since implementing these approaches.",
                category: "Leadership",
                rating: 5,
                image: null
            },
            {
                id: 5,
                name: "Lisa Park",
                role: "Career Transition Coach",
                text: "The comprehensive nature of the program exceeded my expectations. From neuroscience-based techniques to practical communication strategies, every module was valuable and immediately applicable.",
                category: "Transformation",
                rating: 5,
                image: null
            },
            {
                id: 6,
                name: "James Wilson",
                role: "Corporate Trainer",
                text: "The quality of instruction and the supportive learning environment made this program exceptional. I've recommended it to several colleagues who have all had equally positive experiences.",
                category: "Corporate",
                rating: 5,
                image: null
            },
            {
                id: 7,
                name: "Amanda Foster",
                role: "Wellness Coach",
                text: "The program's emphasis on ethical coaching practices and professional development gave me the confidence to start my own coaching practice. The ongoing support has been invaluable.",
                category: "Personal",
                rating: 5,
                image: null
            },
            {
                id: 8,
                name: "Robert Martinez",
                role: "Change Management Consultant",
                text: "The tools for managing organizational change that I learned in this program have been game-changing. My clients consistently see faster and more sustainable transformations.",
                category: "Transformation",
                rating: 5,
                image: null
            },
            {
                id: 9,
                name: "Jennifer Adams",
                role: "Team Manager",
                text: "The leadership skills I developed through this program have been transformational. My team's engagement scores increased by 60% after implementing the coaching techniques.",
                category: "Leadership",
                rating: 5,
                image: null
            },
            {
                id: 10,
                name: "Mark Stevens",
                role: "Business Consultant",
                text: "The ROI on this program has been incredible. The coaching methodologies have helped me deliver better results for my clients and grow my consulting practice significantly.",
                category: "Corporate",
                rating: 5,
                image: null
            },
            {
                id: 11,
                name: "Rachel Kim",
                role: "Life Transformation Coach",
                text: "This program didn't just teach me coaching techniques - it transformed my entire approach to helping others. The results my clients achieve now are remarkable.",
                category: "Personal",
                rating: 5,
                image: null
            },
            {
                id: 12,
                name: "Alex Rivera",
                role: "Organizational Development Specialist",
                text: "The change management frameworks I learned have revolutionized how we approach organizational transformation. We're seeing 3x faster adoption rates.",
                category: "Transformation",
                rating: 5,
                image: null
            }
        ];
    }

    filterTestimonials() {
        let filtered = [...this.testimonials];

        // Apply search filter only (no category filter)
        if (this.searchTerm) {
            filtered = filtered.filter(testimonial =>
                testimonial.name.toLowerCase().includes(this.searchTerm) ||
                (testimonial.role && testimonial.role.toLowerCase().includes(this.searchTerm)) ||
                testimonial.text.toLowerCase().includes(this.searchTerm)
            );
        }

        this.filteredTestimonials = filtered;
        this.displayedCount = Math.min(this.batchSize, this.filteredTestimonials.length);
        this.renderTestimonials();
        this.updateLoadMoreButton();
        this.updateFilterCounts();
    }

    updateFilterCounts() {
        const chips = document.querySelectorAll('.chip');
        chips.forEach(chip => {
            const filter = chip.dataset.filter;
            if (filter === 'all') {
                const count = this.testimonials.length;
                // Update chip text with count
                chip.textContent = `All Stories (${count})`;
            }
        });
    }

    renderTestimonials() {
        console.log('renderTestimonials called');
        const grid = document.getElementById('testimonials-grid');
        console.log('Grid element:', grid);
        if (!grid) {
            console.error('testimonials-grid element not found!');
            return;
        }

        console.log('Filtered testimonials to show:', this.filteredTestimonials.length);
        console.log('Display count:', this.displayedCount);

        // Show loading state (skeletons)
        if (this.isLoading) {
            const skeletons = Array.from({ length: 6 }).map(() => `
                <div class="card-skeleton">
                    <div style="display:flex; gap:1rem; align-items:center; margin-bottom:1rem;">
                        <div class="avatar skeleton"></div>
                        <div style="flex:1;">
                            <div class="line skeleton" style="width:40%"></div>
                            <div class="line skeleton" style="width:25%"></div>
                        </div>
                    </div>
                    <div class="wide-line skeleton" style="width:100%"></div>
                    <div class="wide-line skeleton" style="width:90%"></div>
                    <div class="wide-line skeleton" style="width:80%"></div>
                </div>
            `).join('');
            grid.innerHTML = skeletons;
            return;
        }

        // Show testimonials to display
        const testimonialsToShow = this.filteredTestimonials.slice(0, this.displayedCount);
        console.log('Testimonials to show:', testimonialsToShow.length);
        
        if (testimonialsToShow.length === 0) {
            console.log('No testimonials to show');
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 5rem 2rem; color: var(--text-secondary); background: rgba(255,255,255,0.7); border-radius: var(--radius-xl); box-shadow: var(--shadow-sm); backdrop-filter: blur(5px);">
                    <i class="fas fa-search" style="font-size: 3.5rem; margin-bottom: 1.5rem; opacity: 0.5; color: var(--primary-color);"></i>
                    <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--text-primary);">No stories found</h3>
                    <p style="font-size: 1.1rem; max-width: 400px; margin: 0 auto;">Try adjusting your search or filter criteria to find what you're looking for.</p>
                </div>
            `;
            return;
        }

        console.log('Generating HTML for testimonials...');
        
        // First, clear the grid
        grid.innerHTML = "";
        
        // Then append each testimonial card as a separate element
        testimonialsToShow.forEach((testimonial, index) => {
            // Generate a random length for the testimonial excerpt to create visual variety
            const excerptLength = Math.floor(Math.random() * 50) + 100; // Random between 100-150 chars
            const shortText = testimonial.text.length > excerptLength 
                ? testimonial.text.substring(0, excerptLength) + '...' 
                : testimonial.text;
                
            // Prepare a background pattern for visual interest (subtle)
            const patterns = [
                'radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.03) 0%, transparent 50%)',
                'radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.03) 0%, transparent 50%)',
                'linear-gradient(120deg, rgba(37, 99, 235, 0.02) 0%, transparent 70%)',
                'linear-gradient(60deg, rgba(16, 185, 129, 0.02) 0%, transparent 70%)'
            ];
            const randomPattern = patterns[index % patterns.length];
            
            // Create a staggered animation delay for a nice cascade effect
            const delay = (index % 3) * 0.1 + (Math.floor(index / 3) * 0.1);
            
            // Make wide cards properly spaced - make the first and every 4th card wide
            const wide = (index === 0 || (index - 1) % 4 === 0);
            
            // Create the card element
            const cardElement = document.createElement('div');
            cardElement.className = `testimonial-card ${wide ? 'wide' : ''}`;
            cardElement.dataset.testimonialId = testimonial.id;
            cardElement.dataset.testimonialIndex = index;
            cardElement.style.animationDelay = `${delay}s`;
            cardElement.style.cursor = 'pointer';
            cardElement.style.backgroundImage = randomPattern;
            
            // Add shine effect element
            const shineElement = document.createElement('div');
            shineElement.className = 'testimonial-card-shine';
            cardElement.appendChild(shineElement);
            
            // Add corner accents
            const cornerTL = document.createElement('div');
            cornerTL.className = 'testimonial-card-corner testimonial-card-corner-tl';
            cardElement.appendChild(cornerTL);
            
            const cornerBR = document.createElement('div');
            cornerBR.className = 'testimonial-card-corner testimonial-card-corner-br';
            cardElement.appendChild(cornerBR);
            
            // Add wide card indicator (top border with gradient)
            if (wide) {
                const indicator = document.createElement('div');
                indicator.className = 'testimonial-card-indicator';
                cardElement.appendChild(indicator);
            }
            
            // Add card content
            cardElement.innerHTML = `
                <div class="testimonial-header">
                    <div class="testimonial-avatar">
                        ${testimonial.image ? 
                            `<img src="${testimonial.image}" alt="${testimonial.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                            testimonial.name.charAt(0).toUpperCase()
                        }
                    </div>
                    <div class="testimonial-info">
                        <h3>${testimonial.name}</h3>
                        <div class="testimonial-role">${testimonial.role || 'Verified Client'}</div>
                    </div>
                </div>
                <p class="testimonial-text">${shortText}</p>
                <div class="testimonial-footer">
                    <div class="testimonial-rating">
                        ${this.generateStars(testimonial.rating || 5)}
                    </div>
                    ${testimonial.category ? 
                        `<div class="testimonial-category">${this.capitalizeCategory(testimonial.category)}</div>` :
                        ''
                    }
                </div>
                <div class="read-more-indicator">
                    <span>Read full story</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            `;
            
            // Add click event
            cardElement.addEventListener('click', () => this.openModalByIndex(index));
            
            // Append to grid
            grid.appendChild(cardElement);
        });

        console.log('HTML generated and inserted');
        console.log('Grid innerHTML length:', grid.innerHTML.length);

        // Add click listeners to testimonial cards
        this.addCardClickListeners();
    }

    applySort(mode) {
        if (!['latest', 'rating', 'name'].includes(mode)) return;
        // Add a synthetic date for demo if none exists
        const withDates = this.filteredTestimonials.map((t, i) => ({
            ...t,
            _date: t.date ? new Date(t.date) : new Date(Date.now() - i * 86400000)
        }));

        if (mode === 'latest') {
            withDates.sort((a, b) => b._date - a._date);
        } else if (mode === 'rating') {
            withDates.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (mode === 'name') {
            withDates.sort((a, b) => a.name.localeCompare(b.name));
        }

        this.filteredTestimonials = withDates.map(({ _date, ...rest }) => rest);
        this.displayedCount = Math.min(this.batchSize, this.filteredTestimonials.length);
        this.renderTestimonials();
        this.updateLoadMoreButton();
    }

    renderFeatured() {
        const strip = document.getElementById('featured-strip');
        if (!strip || !this.testimonials.length) return;
        // Pick top-rated or first few as featured
        const featured = [...this.testimonials]
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 10);

        strip.innerHTML = featured.map((t, idx) => `
            <article class="featured-card" role="button" tabindex="0" onclick="window.testimonialsV2.openModalById(${t.id})">
                <div class="title">${t.name}</div>
                <div class="meta">${t.role || 'Verified Client'} • ${this.generateStars(t.rating || 5)}</div>
                <p style="margin-top:0.5rem;color:var(--text-secondary);">${t.text.substring(0, 110)}...</p>
            </article>
        `).join('');

        // Controls
        const container = strip;
        const prev = document.querySelector('.featured-btn.prev');
        const next = document.querySelector('.featured-btn.next');
        const scrollBy = () => container.clientWidth * 0.8;
        if (prev) prev.onclick = () => container.scrollBy({ left: -scrollBy(), behavior: 'smooth' });
        if (next) next.onclick = () => container.scrollBy({ left: scrollBy(), behavior: 'smooth' });
    }

    addCardClickListeners() {
        console.log('Adding click listeners to cards...');
        const cards = document.querySelectorAll('.testimonial-card');
        console.log('Found cards:', cards.length);
        
        cards.forEach((card, index) => {
            console.log(`Setting up card ${index}:`, card);
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Card clicked!', card);
                const testimonialId = parseInt(card.dataset.testimonialId);
                console.log('Testimonial ID:', testimonialId);
                const testimonial = this.testimonials.find(t => t.id === testimonialId);
                console.log('Found testimonial:', testimonial);
                if (testimonial) {
                    this.openModal(testimonial);
                } else {
                    console.log('Testimonial not found!');
                }
            });
        });
    }

    generateStars(rating) {
        return Array.from({length: 5}, (_, i) => 
            `<i class="fas fa-star star" style="color: ${i < rating ? 'var(--secondary-color)' : 'var(--border-color)'}"></i>`
        ).join('');
    }

    capitalizeCategory(category) {
        if (!category || category === 'undefined' || category === 'null') {
            return 'General';
        }
        return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    }

    loadMore() {
        if (this.displayedCount >= this.filteredTestimonials.length) return;

        this.displayedCount = Math.min(
            this.displayedCount + this.batchSize,
            this.filteredTestimonials.length
        );

        this.renderTestimonials();
        this.updateLoadMoreButton();
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        const container = document.querySelector('.load-more-container');
        
        if (!loadMoreBtn || !container) return;

        if (this.displayedCount >= this.filteredTestimonials.length || this.filteredTestimonials.length === 0) {
            container.style.display = 'none';
        } else {
            container.style.display = 'block';
            const remaining = this.filteredTestimonials.length - this.displayedCount;
            
            // Get or create the span element for the text
            let textSpan = loadMoreBtn.querySelector('span');
            if (!textSpan) {
                textSpan = document.createElement('span');
                loadMoreBtn.prepend(textSpan);
            }
            
            // Update the text content
            textSpan.textContent = `Load More Stories (${remaining} remaining)`;
        }
    }

    openModal(testimonial) {
        console.log('Opening modal for:', testimonial);
        const modal = document.getElementById('modal');
        const modalContent = document.querySelector('.modal-content');

        if (!modal || !modalContent) {
            console.error('Modal elements not found');
            return;
        }

        console.log('Modal elements found, preparing content');

        // Format text with paragraphs for better readability
        let formattedText = testimonial.text;
        if (formattedText.length > 200 && !formattedText.includes('</p>')) {
            // Split into paragraphs if it's a longer text without HTML
            const sentences = formattedText.split(/(?<=\.)\s+/);
            if (sentences.length > 3) {
                // Group sentences into paragraphs of roughly equal length
                const paragraphCount = Math.min(Math.ceil(sentences.length / 3), 4);
                const sentencesPerParagraph = Math.ceil(sentences.length / paragraphCount);
                
                let paragraphs = [];
                for (let i = 0; i < sentences.length; i += sentencesPerParagraph) {
                    paragraphs.push(sentences.slice(i, i + sentencesPerParagraph).join(' '));
                }
                
                formattedText = paragraphs.map(p => `<p>${p}</p>`).join('');
            } else {
                formattedText = `<p>${formattedText}</p>`;
            }
        }

        // Create avatar with initial if no image
        const avatarContent = testimonial.image 
            ? `<img src="${testimonial.image}" alt="${testimonial.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`
            : testimonial.name.charAt(0).toUpperCase();

        // Create modal content with enhanced structure
        modalContent.innerHTML = `
            <div class="modal-header">
                <div class="modal-avatar" id="modal-avatar">
                    ${avatarContent}
                </div>
                <div class="modal-info">
                    <h3 id="modal-name">${testimonial.name}</h3>
                    <div class="modal-role">${testimonial.role || 'Verified Client'}</div>
                </div>
            </div>
            <div class="modal-body" id="modal-text">
                ${formattedText}
            </div>
            <div class="modal-footer" style="display: flex; justify-content: space-between; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px dashed rgba(var(--border-color-rgb, 229, 231, 235), 0.5);">
                <div class="testimonial-rating">
                    ${this.generateStars(testimonial.rating || 5)}
                </div>
                ${testimonial.category ? 
                    `<div class="testimonial-category">${this.capitalizeCategory(testimonial.category)}</div>` : 
                    ''
                }
            </div>
        `;

        if (modal) {
            console.log('Adding active class to modal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Add animation class to modal components with slight delays
            setTimeout(() => {
                const modalHeader = modal.querySelector('.modal-header');
                const modalBody = modal.querySelector('.modal-body');
                const modalFooter = modal.querySelector('.modal-footer');

                if (modalHeader) modalHeader.style.opacity = '1';
                
                if (modalBody) {
                    setTimeout(() => {
                        modalBody.style.opacity = '1';
                    }, 200);
                }

                if (modalFooter) {
                    setTimeout(() => {
                        modalFooter.style.opacity = '1';
                    }, 400);
                }
            }, 100);
        }
    }

    closeModal() {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showLoading() {
        console.log('showLoading called');
        this.isLoading = true;
        this.renderTestimonials();
    }

    hideLoading() {
        console.log('hideLoading called');
        this.isLoading = false;
        this.renderTestimonials();
    }

    animateStats() {
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumbers = entry.target.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.target);
                        this.animateNumber(stat, 0, target, 2000);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const statsSection = document.querySelector('.quick-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    animateNumber(element, start, end, duration) {
        const startTime = Date.now();
        const range = end - start;

        const updateNumber = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easedProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            const current = Math.round(start + (range * easedProgress));
            element.textContent = current + (element.parentElement.querySelector('.stat-label').textContent.includes('%') ? '' : '');

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = end + (element.parentElement.querySelector('.stat-label').textContent.includes('%') ? '' : '');
            }
        };

        requestAnimationFrame(updateNumber);
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay for nice cascading effect
                    setTimeout(() => {
                        entry.target.classList.add('card-visible');
                    }, index * 100); // Staggered delay of 100ms per card
                }
            });
        }, observerOptions);

        // Observe testimonial cards as they're created
        const observeCards = () => {
            document.querySelectorAll('.testimonial-card:not(.observed)').forEach(card => {
                card.classList.add('observed');
                observer.observe(card);
            });
        };

        // Add necessary CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .testimonial-card {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), 
                            transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .testimonial-card.card-visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        // Initial observation
        setTimeout(observeCards, 100);

        // Re-observe after filtering/loading
        const originalRenderTestimonials = this.renderTestimonials.bind(this);
        this.renderTestimonials = function() {
            originalRenderTestimonials();
            setTimeout(observeCards, 100);
        };
    }

    // Utility method for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Performance optimization: Lazy loading for images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Public method to refresh testimonials
    async refresh() {
        await this.loadTestimonials();
        this.filterTestimonials();
    }

    // Public method to search programmatically
    search(term) {
        const searchInput = document.getElementById('search');
        if (searchInput) {
            searchInput.value = term;
            this.searchTerm = term.toLowerCase().trim();
            this.filterTestimonials();
        }
    }

    // Public method to set filter programmatically
    setFilter(category) {
        const chip = document.querySelector(`[data-filter="${category}"]`);
        if (chip) {
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            this.currentFilter = category;
            this.displayedCount = this.batchSize;
            this.filterTestimonials();
        }
    }

    // Test method to check if modal works
    testModal() {
        console.log('Testing modal...');
        const testTestimonial = {
            id: 999,
            name: "Test User",
            role: "Test Role",
            text: "This is a test testimonial to check if the modal is working properly. If you can see this, the modal functionality is working!",
            category: "test"
        };
        this.openModal(testTestimonial);
    }

    // Method to open modal by testimonial ID
    openModalById(id) {
        console.log('Opening modal by ID:', id);
        console.log('Available testimonials:', this.testimonials.map(t => ({id: t.id, name: t.name})));
        const testimonial = this.testimonials.find(t => t.id === parseInt(id));
        console.log('Found testimonial:', testimonial);
        if (testimonial) {
            this.openModal(testimonial);
        } else {
            console.log('Testimonial not found for ID:', id);
            console.log('Trying to find by index instead...');
            const testimonialByIndex = this.testimonials[parseInt(id) - 1];
            if (testimonialByIndex) {
                console.log('Found by index:', testimonialByIndex);
                this.openModal(testimonialByIndex);
            }
        }
    }

    // Method to open modal by testimonial index in filteredTestimonials
    openModalByIndex(index) {
        console.log('Opening modal by index:', index);
        console.log('Filtered testimonials:', this.filteredTestimonials.map(t => ({id: t.id, name: t.name})));
        const testimonial = this.filteredTestimonials[index];
        console.log('Found testimonial at index:', testimonial);
        if (testimonial) {
            this.openModal(testimonial);
        } else {
            console.log('Testimonial not found at index:', index);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing TestimonialsV2...');
    window.testimonialsV2 = new TestimonialsV2();
    console.log('TestimonialsV2 instance created:', window.testimonialsV2);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialsV2;
}
