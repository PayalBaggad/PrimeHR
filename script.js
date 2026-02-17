// PrimeHR Payroll - Landing Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Scroll Effect
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;

        // Active Link Highlighting
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').includes(id)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
        });
    }

    // Pricing Toggle
    const pricingToggle = document.getElementById('pricingToggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const priceAmounts = document.querySelectorAll('.plan-price .amount');

    if (pricingToggle) {
        // Animation function for numbers
        const animateValue = (obj, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                // Easing function for smoother effect (easeOutQuad)
                const easeProgress = 1 - (1 - progress) * (1 - progress);

                obj.textContent = Math.floor(easeProgress * (end - start) + start);

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    obj.textContent = end;
                }
            };
            window.requestAnimationFrame(step);
        };

        pricingToggle.addEventListener('click', () => {
            pricingToggle.classList.toggle('active');

            toggleLabels.forEach(label => {
                label.classList.toggle('active');
            });

            priceAmounts.forEach(amount => {
                const isAnnual = pricingToggle.classList.contains('active');
                const targetPrice = parseInt(isAnnual ? amount.dataset.annual : amount.dataset.monthly);
                const currentPrice = parseInt(amount.textContent);

                // Animate to the new price over 400ms
                animateValue(amount, currentPrice, targetPrice, 400);
            });
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('mobile-open')) {
                    mobileMenuBtn.classList.remove('active');
                    navLinks.classList.remove('mobile-open');
                }
            }
        });
    });

    // Demo Form Submission
    const demoForm = document.getElementById('demoForm');
    const emailInput = document.getElementById('emailInput');

    if (demoForm) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (email) {
                // Show success message (in production, this would be an API call)
                showNotification('🎉 Thanks! We\'ll be in touch shortly.', 'success');
                emailInput.value = '';
            }
        });
    }

    // Notification Function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = message;

        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '16px 24px',
            background: type === 'success' ? '#22c55e' : '#6366f1',
            color: 'white',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            zIndex: '10000',
            animation: 'slideIn 0.3s ease',
            fontWeight: '500',
            fontSize: '15px'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .nav-links.mobile-open {
            display: flex !important;
            position: absolute;
            top: 70px;
            left: 0;
            right: 0;
            flex-direction: column;
            background: white;
            padding: 24px;
            gap: 16px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(style);

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .mini-feature, .step, .pricing-card, .testimonial-card, .integration-card, .feature-section').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.09s ease, transform 0.09s ease';
        observer.observe(el);
    });

    // Add animate-in class styles
    const animateStyle = document.createElement('style');
    animateStyle.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(animateStyle);

    // Add stagger delay for grid items
    document.querySelectorAll('.features-grid .feature-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
    });

    document.querySelectorAll('.mini-features-grid .mini-feature').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.05}s`;
    });

    document.querySelectorAll('.pricing-grid .pricing-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
    });

    document.querySelectorAll('.testimonials-grid .testimonial-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.1}s`;
    });

    // Counter Animation for Stats
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                // Formatting: 1K+, 0 (no plus), others+
                if (target === 0) {
                    element.textContent = '0';
                } else if (target >= 1000) {
                    element.textContent = (target / 1000).toFixed(target % 1000 === 0 ? 0 : 1) + 'K+';
                } else {
                    element.textContent = target + '+';
                }
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }

    // Animate stats when hero is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const value = stat.textContent;
                    if (value.includes('K')) {
                        const num = parseFloat(value) * 1000;
                        animateCounter(stat, num);
                    } else if (value.includes('%')) {
                        // Keep as is for percentage
                    } else {
                        const num = parseInt(value);
                        if (!isNaN(num)) {
                            animateCounter(stat, num);
                        }
                    }
                });
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroObserver.observe(heroStats);
    }
});
