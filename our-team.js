// Modern Team Page JavaScript
// Enhanced team member data with additional information
export const teamMembers = [
    {
        "name": "M S Mani",
        "designation": "Mentor",
        "image": "https://xmonks.com/Mani%20M%20S.png",
        "linkedin": "https://www.linkedin.com/in/mani-m-s-36967823/"
    },
    {
        name: "Gaurav Arora",
        designation: "Founder & CEO",
        image: "gaurav.png",
        linkedin: "https://in.linkedin.com/in/gauravaroragrv",
        featured: false
    },
    {
        name: "Preeti Verma",
        designation: "Director-Leadership and Coaching Practice",
        image: "preeti.jpeg",
        linkedin: "https://in.linkedin.com/in/preetivj",
        featured: false
    },
    {
        name: "Karan Verma",
        designation: "Marketing Head",
        image: "karan.png",
        linkedin: "https://www.linkedin.com/in/karan-verma-95944a219/?originalSubdomain=in",
        featured: false
    },
    {
        name: "Aakib Posharkar",
        designation: "Associate Business Head",
        image: "aakib.png",
        linkedin: "https://www.linkedin.com/in/aakib-posharkar-7aa337114/?originalSubdomain=in",
        featured: false
    },
    {
        name: "Rejna Balan",
        designation: "Senior Client Partner",
        image: "profileimages/rejna_balan.jpg",
        linkedin: "https://www.linkedin.com/in/rejna-balan-24375127/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        featured: false
    },
    {
        name: "Saurav Tiwari",
        designation: "Senior Client Partner",
        image: "saurav.png",
        linkedin: "https://www.linkedin.com/in/saurav-tiwari-570885ba/?original_referer=",
        featured: false
    },
    {
        name: "Savneet Kaur",
        designation: "Business Development Manager",
        image: "profileimages/savneet_kaur.jpg",
        linkedin: "https://www.linkedin.com/in/savneet-kaur-236474142/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        featured: false
    },
    { name: "Govind Bhardwaj", designation: "Senior Client Partner", image: "govind.png", linkedin: "https://www.linkedin.com/in/govind-bhardwaj-97b28a7b/", featured: false },

    {
        name: "Deepak Gautam",
        designation: "Senior Data Analyst",
        image: "profileimages/deepak_gautam.jpg",
        linkedin: "https://www.linkedin.com/in/deepak-gautam-09408358/",
        featured: false
    },
    {
        name: "Vikram",
        designation: "FInance & Administration",
        image: "profileimages/vikram.jpg",
        linkedin: "https://www.linkedin.com/in/vikram-sheoran-913993a9/?originalSubdomain=in",
        featured: false
    },
    {
        name: "Navneet Pandey",
        designation: "Fullstack Developer",
        image: "navneetmain.png",
        linkedin: "#",
        featured: false
    },

];

// Enhanced team card generation with modern design
function createTeamCard(member, index) {
    const cardClass = member.featured ? 'team-card featured' : 'team-card';

    return `
        <div class="${cardClass}" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="team-image-container">
                <img src="${member.image}" alt="${member.name}" class="team-image" loading="lazy">
            </div>
            <div class="team-content">
                <h3 class="team-name">${member.name}</h3>
                <p class="team-designation">${member.designation}</p>
                <div class="team-social">
                    ${member.linkedin ? `<a href="${member.linkedin}" class="team-social-link" target="_blank" rel="noopener noreferrer" aria-label="${member.name}'s LinkedIn">
                        <i class="fab fa-linkedin-in"></i>
                    </a>` : ''}
                </div>
            </div>
        </div>
    `;
}

// Enhanced team grid generation with loading animation
function generateTeamGrid() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;

    // Clear existing content
    teamGrid.innerHTML = '';

    // Add loading state
    teamGrid.classList.add('loading');

    // Generate team cards with staggered animation
    teamMembers.forEach((member, index) => {
        const cardHTML = createTeamCard(member, index);
        teamGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Remove loading state after a short delay
    setTimeout(() => {
        teamGrid.classList.remove('loading');
    }, 300);
}

// Enhanced intersection observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.style.opacity = '1';
                entry.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe team cards
    document.querySelectorAll('.team-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Enhanced hover effects for team cards
function initializeHoverEffects() {
    document.querySelectorAll('.team-card').forEach(card => {
        const image = card.querySelector('.team-image');

        card.addEventListener('mouseenter', () => {
            if (image) image.style.transform = 'scale(1.04)';
        });

        card.addEventListener('mouseleave', () => {
            if (image) image.style.transform = 'scale(1)';
        });
    });
}

// Enhanced scroll-triggered animations
function initializeScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-aos]');

    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('aos-animate');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('aos-animate');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
}

// Enhanced team member modal (optional future feature)
function initializeTeamModal() {
    // This can be expanded for detailed team member profiles
    document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.team-social-link')) {
                // Handle card click for modal or detailed view
                console.log('Team card clicked:', card.querySelector('.team-name').textContent);
            }
        });
    });
}

// Performance optimization: Lazy load images
function initializeLazyLoading() {
    const images = document.querySelectorAll('.team-image[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => img.classList.add('loaded'));
    }
}

// Initialize all team page functionality
function initializeTeamPage() {
    // Generate team grid
    generateTeamGrid();

    // Wait for DOM to be ready, then initialize other features
    setTimeout(() => {
        initializeAnimations();
        initializeHoverEffects();
        initializeScrollAnimations();
        initializeTeamModal();
        initializeLazyLoading();

        // Add smooth scrolling for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }, 100);
}

// Export for potential use in other modules
export { initializeTeamPage };

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeTeamPage);

// Handle dynamic content loading (for SPA-like behavior)
window.addEventListener('load', () => {
    // Ensure all images are loaded before removing loading states
    const images = document.querySelectorAll('.team-image');
    let loadedImages = 0;

    images.forEach(img => {
        if (img.complete) {
            loadedImages++;
        } else {
            img.addEventListener('load', () => {
                loadedImages++;
                if (loadedImages === images.length) {
                    document.body.classList.add('images-loaded');
                }
            });
        }
    });

    if (loadedImages === images.length) {
        document.body.classList.add('images-loaded');
    }
});
