// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initThemeToggle();
    initScrollAnimations();
    initContactForm();
    initSmoothScrolling();
    initCounterAnimations();
    initMobileMenu();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme, icon);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, icon);
        
        // Add transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(theme, icon) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Mobile menu functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to section function for buttons
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const offsetTop = target.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Enhanced scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-animation') || 'slide-up';
                
                // Apply different animations based on data-animation attribute
                switch(animationType) {
                    case 'slide-left':
                        element.classList.add('animate-slide-in-left');
                        break;
                    case 'slide-right':
                        element.classList.add('animate-slide-in-right');
                        break;
                    case 'fade-scale':
                        element.classList.add('animate-fade-in-scale');
                        break;
                    case 'bounce':
                        element.classList.add('animate-bounce-in');
                        break;
                    default:
                        element.classList.add('animate-slide-in-up');
                }
                
                // Trigger counter animation for stat cards
                if (element.classList.contains('stat-card')) {
                    animateCounter(element);
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation attributes
    document.querySelectorAll('[data-aos]').forEach((el, index) => {
        el.style.opacity = '0';
        observer.observe(el);
        
        // Add stagger delay classes
        if (el.parentElement && el.parentElement.classList.contains('grid')) {
            el.classList.add(`stagger-${(index % 6) + 1}`);
        }
    });
    
    // Ensure stat numbers are always visible
    document.querySelectorAll('.stat-number').forEach(el => {
        el.style.opacity = '1';
    });
}

// Counter animations for statistics
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        counter.style.opacity = '1';
    });
}

function animateCounter(statCard) {
    const counter = statCard.querySelector('.stat-number');
    if (!counter || counter.classList.contains('animated')) return;
    
    counter.classList.add('animated');
    counter.style.opacity = '1';
    
    const originalText = counter.textContent;
    
    // Check if the text contains only letters (like "NAAC A++")
    if (!/\d/.test(originalText)) {
        // For non-numeric text, just ensure it's visible
        counter.textContent = originalText;
        return;
    }
    
    const target = parseInt(originalText.replace(/[^\d]/g, ''));
    if (isNaN(target)) {
        counter.textContent = originalText;
        return;
    }
    
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            counter.textContent = originalText; // Restore original text
            return;
        }
        
        // Format the number with appropriate suffix
        let displayValue = Math.floor(current);
        if (originalText.includes('+')) {
            if (target >= 1000) {
                displayValue = Math.floor(displayValue / 1000) + ',000+';
            } else {
                displayValue = displayValue + '+';
            }
        } else if (originalText.includes('%')) {
            displayValue = displayValue + '%';
        }
        counter.textContent = displayValue;
    }, 20);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Simulate form submission
                submitContactForm(data);
            }
        });
    }
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.subject) {
        errors.push('Please select a subject');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showNotification('Please fix the following errors:\n' + errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitContactForm(data) {
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Thank you for your message! We will get back to you soon.', 'success');
        
        // Log form data (in real app, this would be sent to server)
        console.log('Contact form submitted:', data);
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${getNotificationStyles(type)}
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getNotificationStyles(type) {
    switch (type) {
        case 'success':
            return 'background: #10b981; color: white;';
        case 'error':
            return 'background: #dc2626; color: white;';
        case 'warning':
            return 'background: #f59e0b; color: white;';
        default:
            return 'background: #3b82f6; color: white;';
    }
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Utility functions
function debounce(func, wait) {
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

function throttle(func, limit) {
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

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const floatingElements = document.querySelectorAll('.float-element');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
        
        floatingElements.forEach((element, index) => {
            const speed = 0.2 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 10));
}

// Initialize parallax effect
initParallaxEffect();

// Initialize scroll effects
initScrollEffects();

// Scroll effects for sections
function initScrollEffects() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update progress bar on scroll
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
    
    // Section entrance animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('section-enter');
    });
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Add background animation to alternating sections
                if (Array.from(sections).indexOf(entry.target) % 2 === 1) {
                    entry.target.classList.add('bg-animate');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Parallax effect for hero sections
    const heroSections = document.querySelectorAll('.hero, .dashboard-header');
    heroSections.forEach(hero => {
        hero.classList.add('parallax-bg');
    });
    
    // Enhanced parallax scrolling
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero sections
        heroSections.forEach(hero => {
            const rate = scrolled * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        });
        
        // Floating elements parallax
        document.querySelectorAll('.float-element').forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.02}deg)`;
        });
        
        // Background elements parallax
        document.querySelectorAll('.floating-elements').forEach(container => {
            const rate = scrolled * 0.1;
            container.style.transform = `translateY(${rate}px)`;
        });
    }, 10));
}

// Loading animation
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading Parul University...</p>
        </div>
    `;
    
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--primary-50), var(--emerald-50));
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(loader);
    
    // Remove loader after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 500);
        }, 1000);
    });
}

// Hide loading screen when page loads
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    if (loading) {
        setTimeout(() => {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
    
    // Arrow keys for navigation (optional)
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        const sections = document.querySelectorAll('section[id]');
        const currentSection = getCurrentSection();
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        
        if (currentIndex < sections.length - 1) {
            scrollToSection(sections[currentIndex + 1].id);
        }
    }
    
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        const sections = document.querySelectorAll('section[id]');
        const currentSection = getCurrentSection();
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        
        if (currentIndex > 0) {
            scrollToSection(sections[currentIndex - 1].id);
        }
    }
});

function getCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    return current;
}

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading="lazy" for better performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
        
        // Add error handling
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
            this.alt = 'Image not found';
        });
    });
}

// Initialize image optimization
optimizeImages();

// Gallery carousel functionality
function initGalleryCarousel() {
    const track = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const galleryImages = document.querySelectorAll('.gallery-image');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalClose = document.getElementById('modalClose');
    
    if (!track) return;
    
    let currentIndex = 0;
    const totalItems = track.children.length;
    
    // Auto-play carousel
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }, 4000);
    
    // Navigation buttons
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });
    
    function updateCarousel() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // Image click to open modal
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modal.classList.add('active');
        });
    });
    
    // Close modal
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

// Initialize gallery carousel
initGalleryCarousel();

// Chat Assistant functionality
function initChatAssistant() {
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatBubble) return;
    
    // Demo responses
    const responses = {
        'hello': 'Hello! Welcome to Parul University. How can I assist you today?',
        'admission': 'For admissions, please visit our admission portal or call +91 2668 260277. Application deadline is March 31, 2025.',
        'fees': 'Fee structure varies by program. B.Tech: ₹1,50,000/year, MBBS: ₹8,50,000/year, MBA: ₹2,00,000/year.',
        'courses': 'We offer 450+ programs across Engineering, Medicine, Management, Applied Sciences, and more.',
        'contact': 'You can reach us at +91 2668 260277 or email info@paruluniversity.ac.in',
        'campus': 'Our campus spans 100 acres with modern facilities, hostels, sports complex, and research labs.',
        'default': 'Thank you for your question! For detailed information, please contact our admission office at +91 2668 260277.'
    };
    
    // Toggle chat window
    chatBubble.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });
    
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Generate bot response
        setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, 'bot');
        }, 1000);
    }
    
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (key !== 'default' && lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses.default;
    }
    
    // Event listeners
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatBubble.contains(e.target) && !chatWindow.contains(e.target)) {
            chatWindow.classList.remove('active');
        }
    });
}

// Initialize chat assistant
initChatAssistant();

// Analytics and tracking (placeholder)
function trackPageView(page) {
    console.log(`Page view tracked: ${page}`);
    // In a real application, you would send this data to your analytics service
}

function trackEvent(category, action, label) {
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
    // In a real application, you would send this data to your analytics service
}

// Track initial page load
trackPageView('home');

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        trackEvent('Button', 'Click', e.target.textContent.trim());
    }
    
    if (e.target.classList.contains('nav-link')) {
        trackEvent('Navigation', 'Click', e.target.textContent.trim());
    }
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Add CSS for loader spinner
const loaderStyles = document.createElement('style');
loaderStyles.textContent = `
    .loader-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid var(--primary-200);
        border-top: 4px solid var(--primary-600);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .loader-content {
        text-align: center;
        color: var(--text-primary);
    }
    
    .loader-content p {
        font-size: 1.1rem;
        font-weight: 500;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

document.head.appendChild(loaderStyles);