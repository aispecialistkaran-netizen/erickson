/**
 * Blogs Page JavaScript
 * Handles WordPress API integration, search functionality, and dynamic content loading
 */

class BlogsManager {
    constructor() {
        this.apiBaseUrl = 'https://www.erickson.co.in/wp-json/wp/v2';
        this.posts = [];
        this.filteredPosts = [];
        this.currentPage = 1;
        this.postsPerPage = 12;
        this.searchQuery = '';
        this.selectedCategories = [];
        this.availableCategories = [];
        this.isLoading = false;
        this.hasMorePosts = true;

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadCategories();
        this.loadBlogPosts();
    }

    async loadCategories() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/categories?per_page=100`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categories = await response.json();
            this.availableCategories = categories.filter(cat => cat.name !== 'Uncategorized');
            this.renderCategoryFilters();
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    renderCategoryFilters() {
        const desktopFilters = document.getElementById('category-filters-desktop');
        const mobileSelect = document.getElementById('category-filters-mobile');

        if (!desktopFilters || !mobileSelect) return;

        // Desktop buttons
        const allButton = '<button class="category-filter-btn active" data-category="all">All Categories</button>';
        const categoryButtons = this.availableCategories.map(cat =>
            `<button class="category-filter-btn" data-category="${cat.id}">${cat.name}</button>`
        ).join('');

        desktopFilters.innerHTML = allButton + categoryButtons;

        // Mobile select
        const allOption = '<option value="all">All Categories</option>';
        const categoryOptions = this.availableCategories.map(cat =>
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');

        mobileSelect.innerHTML = allOption + categoryOptions;
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('blog-search');
        const searchClear = document.getElementById('search-clear');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.trim();
                console.log('Search query:', this.searchQuery); // Debug log
                this.handleSearch();
            });

            searchInput.addEventListener('keyup', (e) => {
                // Also trigger on keyup for better responsiveness
                this.searchQuery = e.target.value.trim();
                this.handleSearch();
            });
        }

        if (searchClear) {
            searchClear.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                }
                this.searchQuery = '';
                this.handleSearch();
                searchClear.style.display = 'none';
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                if (searchClear) {
                    searchClear.style.display = searchInput.value ? 'block' : 'none';
                }
            });
        }

        // Category filter events
        this.bindCategoryEvents();

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMorePosts();
            });
        }
    }

    bindCategoryEvents() {
        // Desktop category buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-filter-btn')) {
                e.preventDefault();
                const categoryId = e.target.dataset.category;

                // Update active state
                document.querySelectorAll('.category-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');

                // Update mobile select
                const mobileSelect = document.getElementById('category-filters-mobile');
                if (mobileSelect) {
                    mobileSelect.value = categoryId;
                }

                this.handleCategoryFilter(categoryId);
            }
        });

        // Mobile category select
        const mobileSelect = document.getElementById('category-filters-mobile');
        if (mobileSelect) {
            mobileSelect.addEventListener('change', (e) => {
                const categoryId = e.target.value;

                // Update desktop buttons
                document.querySelectorAll('.category-filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.category === categoryId) {
                        btn.classList.add('active');
                    }
                });

                this.handleCategoryFilter(categoryId);
            });
        }
    }

    handleCategoryFilter(categoryId) {
        this.currentPage = 1;
        this.hasMorePosts = true;

        if (categoryId === 'all') {
            this.selectedCategories = [];
        } else {
            this.selectedCategories = [parseInt(categoryId)];
        }

        this.applyFilters();
    }

    applyFilters() {
        let filtered = this.posts;

        // Apply search filter
        if (this.searchQuery) {
            const searchLower = this.searchQuery.toLowerCase();
            filtered = filtered.filter(post => {
                // Check title
                const titleMatch = post.title && post.title.rendered &&
                    post.title.rendered.toLowerCase().includes(searchLower);

                // Check excerpt
                const excerptMatch = post.excerpt && post.excerpt.rendered &&
                    post.excerpt.rendered.toLowerCase().includes(searchLower);

                // Check author
                const authorMatch = post._embedded && post._embedded.author &&
                    post._embedded.author[0] && post._embedded.author[0].name &&
                    post._embedded.author[0].name.toLowerCase().includes(searchLower);

                // Check for "erickson india" in search
                const brandMatch = 'erickson india'.includes(searchLower);

                return titleMatch || excerptMatch || authorMatch || brandMatch;
            });
        }

        // Apply category filter
        if (this.selectedCategories.length > 0) {
            filtered = filtered.filter(post => {
                if (!post._embedded || !post._embedded['wp:term'] || !post._embedded['wp:term'][0]) {
                    return false;
                }
                const postCategories = post._embedded['wp:term'][0];
                return this.selectedCategories.some(catId =>
                    postCategories.some(cat => cat.id === catId)
                );
            });
        }

        this.filteredPosts = filtered;
        this.renderPosts();
        this.updateLoadMoreButton();
    }

    async loadBlogPosts(isLoadMore = false) {
        if (this.isLoading) return;

        // Only show full page loading for initial load, not for load more
        if (!isLoadMore) {
            this.showLoadingState();
        }
        this.isLoading = true;

        try {
            const response = await fetch(`${this.apiBaseUrl}/posts?_embed&per_page=${this.postsPerPage}&page=${this.currentPage}`);

            if (!response.ok) {
                // If it's a 404 or 400 (page not found/bad request) and we're in load more mode, it means no more posts
                if ((response.status === 404 || response.status === 400) && isLoadMore) {
                    this.hasMorePosts = false;
                    this.updateLoadMoreButton();
                    this.hideLoadMoreLoading();
                    return; // Exit early without showing error
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newPosts = await response.json();

            if (newPosts.length === 0) {
                this.hasMorePosts = false;
            } else {
                this.posts = [...this.posts, ...newPosts];
            }

            // Always apply filters and render posts after loading
            this.applyFilters();
            this.updateLoadMoreButton();

            // Hide error state if posts were loaded successfully
            this.hideErrorState();

        } catch (error) {
            console.error('Error loading blog posts:', error);
            // Only show error state for initial load, not for load more
            if (!isLoadMore) {
                this.showErrorState();
            }
        } finally {
            // Only hide full page loading for initial load
            if (!isLoadMore) {
                this.hideLoadingState();
            }
            this.hideLoadMoreLoading();
            this.isLoading = false;
        }
    }

    async loadMorePosts() {
        if (!this.hasMorePosts || this.isLoading) return;

        // Show loading state in button only
        this.showLoadMoreLoading();

        this.currentPage++;
        await this.loadBlogPosts(true); // Pass true to indicate this is a load more operation
    }

    handleSearch() {
        this.currentPage = 1;
        this.hasMorePosts = true;
        this.applyFilters();
    }

    renderPosts() {
        const container = document.getElementById('blog-posts-container');

        if (this.filteredPosts.length === 0) {
            this.showNoResultsState();
            return;
        }

        this.hideNoResultsState();

        const postsHTML = this.filteredPosts.map(post => this.createPostCard(post)).join('');
        container.innerHTML = postsHTML;
    }

    createPostCard(post) {
        const featuredImage = post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]
            ? post._embedded['wp:featuredmedia'][0].source_url
            : 'https://via.placeholder.com/400x200/073F52/FFFFFF?text=Erickson+Blog';

        // Always show "Erickson India" as author
        const author = 'Erickson India';

        // Get categories for display
        const categories = post._embedded && post._embedded['wp:term'] && post._embedded['wp:term'][0]
            ? post._embedded['wp:term'][0].filter(cat => cat.name !== 'Uncategorized')
            : [];
        const categoryTags = categories.map(cat =>
            `<span class="blog-post-category-tag">${cat.name}</span>`
        ).join('');

        const publishDate = new Date(post.date);
        const day = publishDate.getDate();
        const month = publishDate.toLocaleDateString('en-US', { month: 'short' });
        const year = publishDate.getFullYear();

        const excerpt = post.excerpt && post.excerpt.rendered
            ? post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
            : 'No excerpt available...';

        const readTime = post.content && post.content.rendered
            ? this.calculateReadTime(post.content.rendered)
            : 1;

        return `
            <article class="blog-post-card" onclick="window.open('${post.link}', '_blank')">
                <div class="blog-post-date-badge">
                    <div class="date-number">${day}</div>
                    <div class="date-month-year">
                        <span class="date-month">${month}</span>
                        <span class="date-year">${year}</span>
                    </div>
                </div>
                <img src="${featuredImage}" alt="${post.title.rendered}" class="blog-post-image" loading="lazy">
                <div class="blog-post-content">
                    <div class="blog-post-meta">
                        <div class="blog-post-author">
                            <i class="fas fa-user"></i>
                            ${author}
                        </div>
                        <span class="blog-post-read-time">${readTime} min read</span>
                    </div>
                    ${categoryTags ? `<div class="blog-post-categories">${categoryTags}</div>` : ''}
                    <h3 class="blog-post-title">${post.title.rendered}</h3>
                    <p class="blog-post-excerpt">${excerpt}</p>
                    <div class="blog-post-footer">
                        <button class="read-more-btn" onclick="event.stopPropagation(); window.open('${post.link}', '_blank')">
                            <span>Read More</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    calculateReadTime(content) {
        if (!content) return 1;

        const wordsPerMinute = 200;
        const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes || 1; // Ensure at least 1 minute
    }

    showLoadMoreLoading() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<span>Loading...</span><i class="fas fa-spinner fa-spin"></i>';
            loadMoreBtn.disabled = true;
        }
    }

    hideLoadMoreLoading() {
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.innerHTML = '<span>Load More Articles</span><i class="fas fa-arrow-down"></i>';
            loadMoreBtn.disabled = false;
        }
    }

    showLoadingState() {
        const loadingState = document.getElementById('loading-state');
        const blogContainer = document.getElementById('blog-posts-container');
        if (loadingState) {
            loadingState.style.display = 'block';
        }
        if (blogContainer) {
            blogContainer.innerHTML = '';
        }
    }

    hideLoadingState() {
        const loadingState = document.getElementById('loading-state');
        if (loadingState) {
            loadingState.style.display = 'none';
        }
    }

    showErrorState() {
        const errorState = document.getElementById('error-state');
        const blogContainer = document.getElementById('blog-posts-container');
        if (errorState) {
            errorState.style.display = 'block';
        }
        if (blogContainer) {
            blogContainer.innerHTML = '';
        }
    }

    hideErrorState() {
        const errorState = document.getElementById('error-state');
        if (errorState) {
            errorState.style.display = 'none';
        }
    }

    showNoResultsState() {
        document.getElementById('no-results').style.display = 'block';
        document.getElementById('blog-posts-container').innerHTML = '';
    }

    hideNoResultsState() {
        document.getElementById('no-results').style.display = 'none';
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-btn');

        // Hide button if no more posts are available
        if (!this.hasMorePosts) {
            loadMoreBtn.style.display = 'none';
            return;
        }

        // Show button if we have posts and there might be more to load
        if (this.filteredPosts.length >= this.postsPerPage) {
            loadMoreBtn.style.display = 'inline-flex';
            loadMoreBtn.innerHTML = '<span>Load More Articles</span><i class="fas fa-arrow-down"></i>';
            loadMoreBtn.disabled = false;
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }

    clearSearch() {
        document.getElementById('blog-search').value = '';
        this.searchQuery = '';
        this.handleSearch();
    }
}

// Initialize the blogs manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogsManager = new BlogsManager();
});

// Make functions globally available for onclick handlers
window.loadBlogPosts = function(isLoadMore = false) {
    if (window.blogsManager) {
        window.blogsManager.loadBlogPosts(isLoadMore);
    }
};

window.clearSearch = function() {
    if (window.blogsManager) {
        window.blogsManager.clearSearch();
    }
};

window.clearCategoryFilters = function() {
    if (window.blogsManager) {
        // Reset to "All Categories"
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'all') {
                btn.classList.add('active');
            }
        });

        const mobileSelect = document.getElementById('category-filters-mobile');
        if (mobileSelect) {
            mobileSelect.value = 'all';
        }

        window.blogsManager.handleCategoryFilter('all');
    }
};
