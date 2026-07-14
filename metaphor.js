

// Metaphor data will be loaded from metaphors.js script tag
// Make sure metaphors.js is loaded BEFORE this script in the HTML

        // JavaScript for interaction and animations
        document.addEventListener('DOMContentLoaded', () => {
            const metaphorList = document.getElementById('metaphor-list');
            const loadMoreBtn = document.getElementById('load-more-btn');
            const searchInput = document.getElementById('search-input');
            const programFilter = document.getElementById('program-filter');
            
            let currentPage = 1;
            const itemsPerPage = 18; // Show more metaphors initially

            // Core metaphor functions
            function createMetaphorCard(item) {
                // Create a card element
                const card = document.createElement('div');
                card.classList.add('metaphor-card');
                
                // Force visibility with inline styles to override any CSS
                card.style.opacity = '1';
                card.style.visibility = 'visible';
                card.style.display = 'block';
                card.style.transform = 'translateY(0)';
                
                // Add proper content with safe HTML encoding
                card.innerHTML = `
                    <p class="author">${item.name || 'Unknown Author'}</p>
                    <p class="metaphor-title"> ${item.metaphor || 'Untitled'}</p>
                    <p class="text">${item.text || 'No description available'}</p>
                    ${item.detailed ? '<p class="has-details-indicator">📖 Full Story</p>' : ''}
                `;
                
                // Debug check to ensure card creation
                if (!item.name || !item.metaphor || !item.text) {
                    console.warn('Created card with missing data:', item);
                }
                
                // Add hover functionality for detailed popup
                if (item.detailed) {
                    card.addEventListener('mouseenter', (e) => {
                        showDetailedPopup(item, card);
                    });
                    card.addEventListener('click', (e) => {
                        // Prevent closing on card click
                        e.stopPropagation();
                    });
                }
                
                // Add animation class with a slight delay to ensure rendering
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, 10);
                
                return card;
            }

            // Detailed popup functions
            let currentPopup = null;
            let currentPopupEscapeHandler = null;

            function showDetailedPopup(item, triggerCard) {
                // Remove existing popup if any
                hideDetailedPopup();

                // Create popup element
                const popup = document.createElement('div');
                popup.classList.add('metaphor-detailed-popup');
                
                // Generate short name (first name or initials)
                const getShortName = (fullName) => {
                    const names = fullName.trim().split(' ');
                    if (names.length > 1) {
                        return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
                    }
                    return fullName.substring(0, 2).toUpperCase();
                };
                
                // Generate image or name display with short name
                const shortName = getShortName(item.name);
                const imageOrNameHTML = item.image ? 
                    `<div class="popup-image"><img src="${item.image}" alt="${item.name}" /></div>` :
                    `<div class="popup-name-display">${shortName}</div>`;
                
                popup.innerHTML = `
                    <div class="popup-content">
                        <div class="popup-header">
                            <span class="popup-close">✕</span>
                        </div>
                        <div class="popup-profile">
                            ${imageOrNameHTML}
                            <div class="popup-profile-info">
                                <h3 class="popup-author-name">${item.name}</h3>
                                <p class="popup-metaphor-title">${item.metaphor}</p>
                            </div>
                        </div>
                        <div class="popup-body">
                            <span class="popup-label">Full Story:</span>
                            <p class="popup-story-text">${item.detailed || item.text || 'No additional details available'}</p>
                        </div>
                    </div>
                `;

                // Add close button functionality
                const closeBtn = popup.querySelector('.popup-close');
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    hideDetailedPopup();
                });

                // Close on outside click (click on the backdrop)
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) {
                        hideDetailedPopup();
                    }
                });

                // Close on Escape key
                const escapeHandler = (e) => {
                    if (e.key === 'Escape' && currentPopup) {
                        hideDetailedPopup();
                        document.removeEventListener('keydown', escapeHandler);
                    }
                };
                document.addEventListener('keydown', escapeHandler);

                // Add to body
                document.body.appendChild(popup);
                currentPopup = popup;
                currentPopupEscapeHandler = escapeHandler;

                // Show popup with animation
                setTimeout(() => {
                    popup.classList.add('show');
                }, 10);
            }

            function hideDetailedPopup() {
                if (currentPopup) {
                    currentPopup.classList.remove('show');
                    setTimeout(() => {
                        if (currentPopup && currentPopup.parentNode) {
                            currentPopup.parentNode.removeChild(currentPopup);
                        }
                        currentPopup = null;
                    }, 200);
                    
                    // Remove escape key listener
                    if (currentPopupEscapeHandler) {
                        document.removeEventListener('keydown', currentPopupEscapeHandler);
                        currentPopupEscapeHandler = null;
                    }
                }
            }

            function renderMetaphors(metaphors, isAppend = false) {
                if (!isAppend) {
                    metaphorList.innerHTML = '';
                    currentPage = 1;
                }

                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = Math.min(startIndex + itemsPerPage, metaphors.length);
                const itemsToRender = metaphors.slice(startIndex, endIndex);

                itemsToRender.forEach(item => {
                    const card = createMetaphorCard(item);
                    metaphorList.appendChild(card);
                });
                
                toggleLoadMoreButton(metaphors.length);
            }
            
            function getFilteredMetaphors() {
                // Guard: ensure we have data
                if (!metaphorData || metaphorData.length === 0) {
                    console.warn('No metaphor data available');
                    return [];
                }
                
                const query = searchInput.value.toLowerCase();
                const selectedBatch = programFilter.value;

                return metaphorData.filter(item => {
                    const matchesQuery = query === '' || 
                        item.name.toLowerCase().includes(query) ||
                        item.metaphor.toLowerCase().includes(query) ||
                        item.text.toLowerCase().includes(query);
                    
                    const matchesBatch = selectedBatch === 'all' || !selectedBatch || item.batch === selectedBatch;
                    
                    return matchesQuery && matchesBatch;
                });
            }

            function handleRender() {
                const filtered = getFilteredMetaphors();
                
                // Clear the list before rendering
                metaphorList.innerHTML = '';
                
                // Debug message for monitoring
                console.log(`Found ${filtered.length} metaphors matching current filters`);
                
                // Render first batch of items
                const itemsToShow = Math.min(itemsPerPage, filtered.length);
                const itemsToRender = filtered.slice(0, itemsToShow);
                
                // Use a fragment for better performance
                const fragment = document.createDocumentFragment();

                // Add each item to the fragment
                itemsToRender.forEach(item => {
                    const card = createMetaphorCard(item);
                    fragment.appendChild(card);
                });
                
                // Add all cards at once to minimize reflows
                metaphorList.appendChild(fragment);
                
                // Force layout recalculation
                metaphorList.offsetHeight;
                
                // Make sure all metaphor cards are visible
                document.querySelectorAll('.metaphor-card').forEach(card => {
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                    card.style.display = 'block';
                    card.style.transform = 'translateY(0)';
                });
                
                // Update button visibility
                toggleLoadMoreButton(filtered.length);
                
                // Debug log of what's been rendered
                console.log(`Initially showing ${metaphorList.children.length} of ${filtered.length} total metaphors`);
            }

            function loadMore() {
                const filtered = getFilteredMetaphors();
                const currentlyShowing = metaphorList.children.length;
                
                // Debug first to check what we're working with
                console.log(`Currently showing ${currentlyShowing} items of ${filtered.length} total metaphors`);
                
                // Make sure we have items left to show
                if (currentlyShowing < filtered.length) {
                    // Calculate how many more items to load
                    const itemsToLoad = Math.min(itemsPerPage, filtered.length - currentlyShowing);
                    
                    // Get the next batch of items
                    const newItems = filtered.slice(currentlyShowing, currentlyShowing + itemsToLoad);
                    
                    // Create a document fragment to improve performance
                    const fragment = document.createDocumentFragment();
                    
                    // Add new items to the fragment first
                    newItems.forEach(item => {
                        const card = createMetaphorCard(item);
                        
                        // Force the card to be visible immediately
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        
                        fragment.appendChild(card);
                    });
                    
                    // Then add all items at once to the DOM
                    metaphorList.appendChild(fragment);
                    
                    console.log(`Added ${newItems.length} new items, now showing ${metaphorList.children.length} of ${filtered.length} total`);
                } else {
                    console.log('No more items to load');
                }
                
                // Update button visibility
                toggleLoadMoreButton(filtered.length);
            }

            function toggleLoadMoreButton(totalCount) {
                // Get the current count directly from the DOM to ensure accuracy
                const currentlyShowing = metaphorList.children.length;
                
                console.log(`Toggle button check: showing ${currentlyShowing} of ${totalCount} total`);
                
                // Update button state based on whether there are more items to load
                if (currentlyShowing >= totalCount) {
                    // All items are shown
                    loadMoreBtn.style.display = 'none';
                    loadMoreBtn.textContent = 'All metaphors loaded';
                    loadMoreBtn.disabled = true;
                } else {
                    // More items can be loaded
                    loadMoreBtn.style.display = 'inline-block';
                    loadMoreBtn.disabled = false;
                    
                    // Show how many more can be loaded
                    const remaining = totalCount - currentlyShowing;
                    loadMoreBtn.textContent = `Load More (${currentlyShowing} of ${totalCount}, ${remaining} remaining)`;
                }
            }

            // Event listeners for metaphor functionality
            searchInput.addEventListener('input', handleRender);
            programFilter.addEventListener('change', handleRender);
            loadMoreBtn.addEventListener('click', loadMore);
            
            // Check if metaphor data is loaded from metaphors.js
            console.log('Checking for metaphorData from metaphors.js...');
            if (typeof metaphorData !== 'undefined' && metaphorData.length > 0) {
                console.log('✓ metaphorData loaded successfully:', metaphorData.length, 'items');
                console.log('First item:', metaphorData[0]);
                console.log('Sample batches:', [...new Set(metaphorData.map(m => m.batch))]);
            } else {
                console.error('✗ metaphorData not found! Make sure metaphors.js is loaded before metaphor.js');
            }
            
            // Render metaphors
            handleRender();

            // Smooth scrolling for hero CTA
            const heroCTA = document.querySelector('.hero-cta');
            if (heroCTA) {
                heroCTA.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector('#metaphors');
                    if (target) {
                        target.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            }

            // PDF Modal functionality
            const pdfViewers = document.querySelectorAll('.pdf-viewer');
            let pdfModal = null;

            // Create PDF modal for fullscreen viewing
            function createPDFModal() {
                if (!pdfModal) {
                    pdfModal = document.createElement('div');
                    pdfModal.className = 'pdf-modal';
                    pdfModal.innerHTML = `
                        <div class="pdf-modal-content">
                            <div class="pdf-modal-header">
                                <h3 id="pdf-modal-title">Document Viewer</h3>
                                <button class="pdf-modal-close">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <iframe id="pdf-modal-iframe"></iframe>
                        </div>
                    `;
                    document.body.appendChild(pdfModal);

                    // Close modal on click outside or close button
                    pdfModal.addEventListener('click', (e) => {
                        if (e.target === pdfModal || e.target.closest('.pdf-modal-close')) {
                            closePDFModal();
                        }
                    });

                    // Close on escape key
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && pdfModal.classList.contains('active')) {
                            closePDFModal();
                        }
                    });
                }
                return pdfModal;
            }

            function openPDFModal(src, title) {
                const modal = createPDFModal();
                const iframe = modal.querySelector('#pdf-modal-iframe');
                const titleElement = modal.querySelector('#pdf-modal-title');
                
                iframe.src = src;
                titleElement.textContent = title || 'Document Viewer';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closePDFModal() {
                if (pdfModal) {
                    pdfModal.classList.remove('active');
                    const iframe = pdfModal.querySelector('#pdf-modal-iframe');
                    iframe.src = '';
                    document.body.style.overflow = '';
                }
            }

            // Add click handlers to PDF viewers for fullscreen view
            pdfViewers.forEach((viewer, index) => {
                if (viewer.tagName.toLowerCase() === 'iframe') {
                    viewer.style.cursor = 'pointer';
                    viewer.addEventListener('click', () => {
                        const src = viewer.src;
                        const card = viewer.closest('.pdf-card');
                        const title = card ? card.querySelector('h3').textContent : 'Document Viewer';
                        openPDFModal(src, title);
                    });
                }
            });

            // Enhanced scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        entry.target.classList.add('animate-in');
                        
                        // For metaphor cards, ensure they're fully visible
                        if (entry.target.classList.contains('metaphor-card')) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }
                    }
                });
            }, observerOptions);

            // Function to observe new elements that are added to the page
            function observeNewElements() {
                document.querySelectorAll('.pdf-card, .scroll-card').forEach(el => {
                    if (!el.classList.contains('observed')) {
                        observer.observe(el);
                        el.classList.add('observed');
                    }
                });
            }
            
            // Observe elements for animation
            observeNewElements();
            
            // Staggered animation for PDF cards on page load
            document.querySelectorAll('.pdf-card').forEach((card, index) => {
                setTimeout(() => {
                    card.style.animationPlayState = 'running';
                    card.classList.add('animate-in');
                    card.style.opacity = '1';
                }, 150 * (index + 1));
            });
            
            // Update PDF thumbnails with batch-specific icons
            const pdfThumbnails = {
                'pdf-thumb-1': { icon: 'fa-book', year: '2023' },
                'pdf-thumb-2': { icon: 'fa-bookmark', year: '2024' },
                'pdf-thumb-3': { icon: 'fa-lightbulb', year: '2024' },
                'pdf-thumb-4': { icon: 'fa-feather', year: '2024' },
                'pdf-thumb-5': { icon: 'fa-pen-fancy', year: '2025' }
            };
            
            // Apply additional content to thumbnails
            Object.keys(pdfThumbnails).forEach(thumbId => {
                const thumb = document.getElementById(thumbId);
                if (thumb) {
                    const data = pdfThumbnails[thumbId];
                    const batchNum = thumbId.replace('pdf-thumb-', '');
                    
                    // Create batch icon
                    const icon = document.createElement('i');
                    icon.className = `fas ${data.icon}`;
                    icon.style.fontSize = '2rem';
                    icon.style.marginBottom = '0.5rem';
                    icon.style.color = 'var(--primary-color)';
                    
                    // Create year badge
                    const yearBadge = document.createElement('span');
                    yearBadge.textContent = data.year;
                    yearBadge.style.position = 'absolute';
                    yearBadge.style.bottom = '10px';
                    yearBadge.style.right = '10px';
                    yearBadge.style.background = 'rgba(0, 95, 158, 0.1)';
                    yearBadge.style.color = 'var(--primary-color)';
                    yearBadge.style.padding = '0.2rem 0.6rem';
                    yearBadge.style.borderRadius = '20px';
                    yearBadge.style.fontSize = '0.8rem';
                    
                    // Apply to thumbnail
                    thumb.appendChild(icon);
                    thumb.appendChild(yearBadge);
                }
            });
        });

        // PDF viewer: embed only on user click using the page modal
        (function() {
            const pdfCards = document.querySelectorAll('.pdf-card');
            const pageModal = document.getElementById('pdf-viewer-modal');
            const pageModalTitle = document.getElementById('pdf-viewer-title');
            const pageModalClose = document.getElementById('pdf-viewer-close');
            const pageModalContainer = document.getElementById('pdf-viewer-container');

            if (!pageModal) return; // nothing to do if modal isn't on the page

            function openPageModal(src, title) {
                if (!src) return;
                pageModalTitle.textContent = title || 'Document Viewer';
                
                // Show loading spinner
                pageModalContainer.innerHTML = `
                    <div class="pdf-loading">
                        <div class="pdf-spinner"></div>
                        <p>Loading document...</p>
                    </div>
                `;
                
                pageModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Add fade-in animation
                setTimeout(() => {
                    pageModal.classList.add('fade-in');
                }, 10);
                
                // Embed PDF after modal is shown (slight delay for better UX)
                setTimeout(() => {
                    if (window.PDFObject) {
                        PDFObject.embed(src, '#pdf-viewer-container', {
                            height: '100%',
                            pdfOpenParams: {
                                navpanes: 1,
                                toolbar: 1,
                                statusbar: 1,
                                view: "FitV"
                            }
                        });
                    } else {
                        // Fallback to iframe if PDFObject is missing
                        pageModalContainer.innerHTML = `<iframe src="${src}" style="width:100%;height:100%;border:0" onload="this.style.opacity=1"></iframe>`;
                    }
                }, 200);
            }

            function closePageModal() {
                pageModal.classList.remove('fade-in');
                
                // Add fade-out animation before closing
                setTimeout(() => {
                    pageModal.classList.remove('active');
                    // remove embedded object/iframe to free memory
                    pageModalContainer.innerHTML = '';
                    document.body.style.overflow = '';
                }, 200);
            }

            // Attach click handlers to pdf cards
            pdfCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    // ensure clicks only open modal, not trigger child links
                    const src = card.dataset.pdfSrc;
                    const title = card.dataset.pdfTitle || (card.querySelector('h3') ? card.querySelector('h3').textContent : 'Document');
                    openPageModal(src, title);
                });
            });

            // Close interactions
            pageModalClose && pageModalClose.addEventListener('click', closePageModal);
            pageModal.addEventListener('click', (e) => {
                if (e.target === pageModal) closePageModal();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && pageModal.classList.contains('active')) closePageModal();
            });
        })();
