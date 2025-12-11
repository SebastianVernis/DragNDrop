/**
 * DragNDrop Landing Page JavaScript
 * Handles animations, interactions, and dynamic content
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const demoOverlay = document.getElementById('demo-overlay');
    const demoStart = document.getElementById('demo-start');
    const faqItems = document.querySelectorAll('.faq-item');
    const proofValues = document.querySelectorAll('.proof-value');
    const aosElements = document.querySelectorAll('[data-aos]');

    // ============================================
    // Navigation
    // ============================================
    
    /**
     * Handle navbar scroll effect
     */
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    /**
     * Toggle mobile menu
     */
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    /**
     * Close mobile menu when clicking a link
     */
    function closeMobileMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * Smooth scroll to section
     */
    function smoothScrollToSection(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                closeMobileMenu();
            }
        }
    }

    // ============================================
    // Demo Section
    // ============================================
    
    /**
     * Handle demo overlay click
     */
    function handleDemoStart() {
        if (demoOverlay) {
            demoOverlay.classList.add('hidden');
        }
    }

    // ============================================
    // FAQ Accordion
    // ============================================
    
    /**
     * Toggle FAQ item
     */
    function toggleFaqItem(e) {
        const item = e.currentTarget.closest('.faq-item');
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(faq => {
            faq.classList.remove('active');
            faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });
        
        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
            item.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
        }
    }

    // ============================================
    // Animations
    // ============================================
    
    /**
     * Animate on scroll (AOS) implementation
     */
    function initAOS() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.aosDelay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        aosElements.forEach(el => observer.observe(el));
    }

    /**
     * Animate counter numbers
     */
    function animateCounters() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.dataset.count);
                    animateValue(target, 0, countTo, 2000);
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        proofValues.forEach(el => observer.observe(el));
    }

    /**
     * Animate a value from start to end
     */
    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const range = end - start;

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + range * easeOut);
            
            element.textContent = formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = formatNumber(end);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Format number with suffix (K, M)
     */
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K';
        }
        return num.toString();
    }

    // ============================================
    // Parallax Effects
    // ============================================
    
    /**
     * Simple parallax effect for hero section
     */
    function handleParallax() {
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual && window.innerWidth >= 1024) {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    }

    // ============================================
    // Active Navigation Link
    // ============================================
    
    /**
     * Highlight active navigation link based on scroll position
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Keyboard Navigation
    // ============================================
    
    /**
     * Handle keyboard navigation for FAQ
     */
    function handleFaqKeyboard(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFaqItem(e);
        }
    }

    // ============================================
    // Performance Optimizations
    // ============================================
    
    /**
     * Throttle function for scroll events
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Debounce function for resize events
     */
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ============================================
    // Event Listeners
    // ============================================
    
    function initEventListeners() {
        // Scroll events (throttled)
        const throttledScroll = throttle(() => {
            handleNavbarScroll();
            handleParallax();
            updateActiveNavLink();
        }, 16);
        
        window.addEventListener('scroll', throttledScroll, { passive: true });

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        // Navigation links
        document.querySelectorAll('.nav-link, .footer-column a[href^="#"]').forEach(link => {
            link.addEventListener('click', smoothScrollToSection);
        });

        // Demo overlay
        if (demoStart) {
            demoStart.addEventListener('click', handleDemoStart);
        }

        // FAQ items
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', toggleFaqItem);
                question.addEventListener('keydown', handleFaqKeyboard);
            }
        });

        // Close mobile menu on resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth >= 768) {
                closeMobileMenu();
            }
        }, 250));

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // ============================================
    // Initialization
    // ============================================
    
    function init() {
        // Initialize all features
        initEventListeners();
        initAOS();
        animateCounters();
        handleNavbarScroll();
        
        // Add loaded class for initial animations
        document.body.classList.add('loaded');
        
        console.log('🎨 DragNDrop Landing Page initialized');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
