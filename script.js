// Muhammad Ali Sheikh Portfolio - JavaScript
// Modern ES6+ JavaScript with GitHub API integration and smooth animations

class Portfolio {
    constructor() {
        this.isLoading = true;
        this.githubUsername = 'developmentbyali';
        this.loadingScreen = document.getElementById('loading-screen');
        this.scrollToTopBtn = document.getElementById('scroll-to-top');
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        
        this.init();
    }

    async init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    async initializeApp() {
        try {
            // Initialize all components
            this.setupEventListeners();
            this.initializeObservers();
            this.setupSmoothScrolling();
            this.initializeNavigation();
            this.setupScrollToTop();
            this.animateStatsCounter();
            
            // Fetch GitHub projects
            await this.fetchGitHubProjects();
            
            // Initialize contact form
            this.initializeContactForm();
            
            // Hide loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1500);
            
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            this.hideLoadingScreen();
        }
    }

    setupEventListeners() {
        // Window events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));
        
        window.addEventListener('resize', this.throttle(() => {
            this.handleResize();
        }, 250));
        
        // Navigation events
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
        
        // Keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    initializeObservers() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.fadeObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            this.fadeObserver.observe(el);
        });

        // Navigation active link observer
        this.setupNavigationActiveStates();
    }

    setupNavigationActiveStates() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentSection = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentSection}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => {
            navObserver.observe(section);
        });
    }

    setupSmoothScrolling() {
        // Enhanced smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = this.navbar.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navbarHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    this.closeMobileMenu();
                }
            });
        });
    }

    initializeNavigation() {
        // Navbar scroll effect
        let lastScrollY = window.scrollY;
        
        const handleNavbarScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                this.navbar.style.background = 'rgba(15, 23, 42, 0.95)';
                this.navbar.style.backdropFilter = 'blur(20px)';
            } else {
                this.navbar.style.background = 'rgba(15, 23, 42, 0.85)';
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 500) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', this.throttle(handleNavbarScroll, 10));
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupScrollToTop() {
        if (!this.scrollToTopBtn) return;

        this.scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Show/hide scroll to top button
        if (this.scrollToTopBtn) {
            if (scrollY > 500) {
                this.scrollToTopBtn.classList.add('visible');
            } else {
                this.scrollToTopBtn.classList.remove('visible');
            }
        }

        // Parallax effect for floating elements
        this.updateFloatingElements(scrollY);
    }

    updateFloatingElements(scrollY) {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 992) {
            this.closeMobileMenu();
        }
    }

    async fetchGitHubProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        const projectsError = document.getElementById('projects-error');
        
        if (!projectsGrid) return;

        try {
            // Show loading state
            projectsGrid.innerHTML = `
                <div class="projects-loading">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                    </div>
                    <p>Loading projects from GitHub...</p>
                </div>
            `;

            const response = await fetch(`https://api.github.com/users/${this.githubUsername}/repos?sort=updated&per_page=6`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const repos = await response.json();
            
            if (repos.length === 0) {
                throw new Error('No repositories found');
            }

            // Filter and sort repositories
            const filteredRepos = repos
                .filter(repo => !repo.fork && repo.description) // Exclude forks and repos without descriptions
                .slice(0, 6); // Limit to 6 projects

            this.renderProjects(filteredRepos);

        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            this.showProjectsError();
        }
    }

    renderProjects(repos) {
        const projectsGrid = document.getElementById('projects-grid');
        
        projectsGrid.innerHTML = repos.map(repo => `
            <div class="project-card fade-in">
                <div class="project-header">
                    <h3 class="project-title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                    <p class="project-description">${repo.description || 'A cool project built with modern technologies.'}</p>
                </div>
                <div class="project-meta">
                    <div class="project-language">
                        <span class="language-color" style="background-color: ${this.getLanguageColor(repo.language)}"></span>
                        <span>${repo.language || 'Mixed'}</span>
                    </div>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link">
                            View Code
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/>
                            </svg>
                        </a>
                        ${repo.homepage ? `
                            <a href="${repo.homepage}" target="_blank" rel="noopener" class="project-link">
                                Live Demo
                                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');

        // Re-observe new fade-in elements
        projectsGrid.querySelectorAll('.fade-in').forEach(el => {
            this.fadeObserver.observe(el);
        });
    }

    showProjectsError() {
        const projectsGrid = document.getElementById('projects-grid');
        const projectsError = document.getElementById('projects-error');
        
        projectsGrid.style.display = 'none';
        if (projectsError) {
            projectsError.style.display = 'block';
        }
    }

    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#2b7489',
            'Python': '#3572A5',
            'Java': '#b07219',
            'C++': '#f34b7d',
            'C': '#555555',
            'HTML': '#e34c26',
            'CSS': '#1572B6',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Swift': '#ffac45',
            'Kotlin': '#F18E33',
            'Dart': '#00B4AB',
            'Shell': '#89e051',
            'Vue': '#2c3e50',
            'React': '#61dafb'
        };
        return colors[language] || '#6b7280';
    }

    animateStatsCounter() {
        const stats = document.querySelectorAll('.stat-number');
        
        const animateCount = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const count = parseInt(element.innerText);
            const increment = target / 200;
            
            if (count < target) {
                element.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCount(element), 10);
            } else {
                element.innerText = target + '+';
            }
        };

        // Use intersection observer to trigger animation
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && !statNumber.classList.contains('animated')) {
                        statNumber.classList.add('animated');
                        animateCount(statNumber);
                    }
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-item').forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    initializeContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactFormSubmit(contactForm);
        });

        // Add real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    async handleContactFormSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Validate form
        if (!this.validateForm(form)) {
            return;
        }

        try {
            // Update button state
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            this.showMessage('Thank you! Your message has been sent successfully.', 'success');
            form.reset();

        } catch (error) {
            console.error('Error submitting form:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Minimum length validation
        else if (field.name === 'message' && value.length < 10) {
            errorMessage = 'Message should be at least 10 characters long';
            isValid = false;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = 'var(--error-color)';
        errorElement.style.fontSize = 'var(--font-size-sm)';
        errorElement.style.marginTop = 'var(--spacing-xs)';
        errorElement.style.display = 'block';
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showMessage(text, type = 'info') {
        // Remove existing messages
        document.querySelectorAll('.toast-message').forEach(msg => msg.remove());

        const message = document.createElement('div');
        message.className = `toast-message toast-${type}`;
        message.textContent = text;
        
        // Styles for the toast message
        Object.assign(message.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRadius: 'var(--radius-lg)',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px',
            boxShadow: 'var(--shadow-xl)'
        });

        // Set background color based on type
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            warning: 'var(--warning-color)',
            info: 'var(--primary-color)'
        };
        message.style.background = colors[type] || colors.info;

        document.body.appendChild(message);

        // Animate in
        requestAnimationFrame(() => {
            message.style.transform = 'translateX(0)';
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            message.style.transform = 'translateX(100%)';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
            
            setTimeout(() => {
                this.loadingScreen.remove();
            }, 500);
        }
    }

    // Utility function for throttling
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Utility function for debouncing
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// Enhanced error handling
window.addEventListener('error', (event) => {
    console.error('Portfolio error:', event.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Initialize portfolio when DOM is ready
new Portfolio();

// Add some additional enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation enhancements
    document.querySelectorAll('.btn, .nav-link, .project-link, .social-link').forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                element.click();
            }
        });
    });

    // Add focus-visible polyfill behavior for better accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add print styles optimization
    window.addEventListener('beforeprint', () => {
        document.body.classList.add('print-mode');
    });

    window.addEventListener('afterprint', () => {
        document.body.classList.remove('print-mode');
    });
});

// Add some print-specific styles
const printStyles = `
    @media print {
        .navbar, .scroll-to-top, .floating-elements, .loading-screen {
            display: none !important;
        }
        
        .hero-section {
            min-height: auto !important;
            page-break-after: always;
        }
        
        .section-title {
            color: #000 !important;
            -webkit-text-fill-color: #000 !important;
        }
        
        .btn {
            border: 2px solid #000 !important;
            color: #000 !important;
        }
        
        * {
            background: white !important;
            color: black !important;
            box-shadow: none !important;
        }
    }
`;

// Inject print styles
const styleElement = document.createElement('style');
styleElement.textContent = printStyles;
document.head.appendChild(styleElement);

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Portfolio;
}