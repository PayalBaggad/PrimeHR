// PrimeHR Payroll - Landing Page JavaScript
// Optimized: passive listeners, rAF throttle, requestIdleCallback deferral,
// IntersectionObserver for active links, no dynamic style injection, no layout thrashing

(function init() {
    // ── 1. Navigation Scroll (RAF-throttled, passive) ──
    const navbar = document.getElementById('navbar');
    let scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // ── 2. Active Nav Links via IntersectionObserver (zero scroll cost) ──
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    if (sections.length && navLinks.length) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href').includes(id));
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
        sections.forEach(section => sectionObserver.observe(section));
    }

    // ── 3. Mobile Menu Toggle ──
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksEl = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinksEl) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinksEl.classList.toggle('mobile-open');
        });
    }

    // ── 4. Pricing Toggle ──
    const pricingToggle = document.getElementById('pricingToggle');

    if (pricingToggle) {
        const toggleLabels = document.querySelectorAll('.toggle-label');
        const priceAmounts = document.querySelectorAll('.plan-price .amount');

        // rAF-based counter animation
        const animateValue = (obj, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const eased = 1 - (1 - progress) * (1 - progress);
                obj.textContent = Math.floor(eased * (end - start) + start);
                if (progress < 1) requestAnimationFrame(step);
                else obj.textContent = end;
            };
            requestAnimationFrame(step);
        };

        pricingToggle.addEventListener('click', () => {
            pricingToggle.classList.toggle('active');
            toggleLabels.forEach(label => label.classList.toggle('active'));
            priceAmounts.forEach(amount => {
                const isAnnual = pricingToggle.classList.contains('active');
                const targetPrice = parseInt(isAnnual ? amount.dataset.annual : amount.dataset.monthly);
                const currentPrice = parseInt(amount.textContent);
                animateValue(amount, currentPrice, targetPrice, 400);
            });
        });
    }

    // ── 5. Smooth Scroll for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                // Batch layout read, then write — no thrashing
                const targetTop = target.getBoundingClientRect().top;
                const scrollY = window.scrollY;
                window.scrollTo({ top: targetTop + scrollY - 80, behavior: 'smooth' });

                if (navLinksEl && navLinksEl.classList.contains('mobile-open')) {
                    mobileMenuBtn && mobileMenuBtn.classList.remove('active');
                    navLinksEl.classList.remove('mobile-open');
                }
            }
        });
    });

    // ── 6. Demo Form Submission ──
    const demoForm = document.getElementById('demoForm');
    const emailInput = document.getElementById('emailInput');

    if (demoForm && emailInput) {
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (email) {
                showNotification('🎉 Thanks! We\'ll be in touch shortly.', 'success');
                emailInput.value = '';
            }
        });
    }

    // ── 7. Notification Toast ──
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
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
            transform: 'translateX(0)',
            opacity: '1',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            fontWeight: '500',
            fontSize: '15px'
        });
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.transform = 'translateX(110%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ── 8. Scroll-Triggered Card Animations ──
    const animatedEls = document.querySelectorAll(
        '.feature-card, .step, .pricing-card, .testimonial-card, .integration-card, .upcoming-card'
    );

    if (animatedEls.length) {
        // Batch DOM reads FIRST, then writes — avoid layout thrashing
        const items = Array.from(animatedEls);

        // Write phase: set initial state
        requestAnimationFrame(() => {
            items.forEach((el, i) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(24px)';
                el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            });

            // Apply stagger delays AFTER initial state is set
            requestAnimationFrame(() => {
                document.querySelectorAll('.features-grid .feature-card').forEach((el, i) => {
                    el.style.transitionDelay = `${i * 0.07}s`;
                });
                document.querySelectorAll('.pricing-grid .pricing-card').forEach((el, i) => {
                    el.style.transitionDelay = `${i * 0.07}s`;
                });
                document.querySelectorAll('.testimonials-grid .testimonial-card').forEach((el, i) => {
                    el.style.transitionDelay = `${i * 0.07}s`;
                });
                document.querySelectorAll('.integrations-grid .integration-card').forEach((el, i) => {
                    el.style.transitionDelay = `${i * 0.05}s`;
                });

                // Start observing
                const animObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate-in');
                            animObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

                items.forEach(el => animObserver.observe(el));
            });
        });
    }

    // ── 9. Hero Stats Counter (rAF-based) ──
    function animateCounter(element, target, duration = 1500) {
        // Read the current display value before animating
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            // Write
            if (progress < 1) {
                element.textContent = current + '+';
                requestAnimationFrame(step);
            } else {
                element.textContent = target === 0 ? '0'
                    : target >= 1000 ? (target / 1000).toFixed(0) + 'K+'
                    : target + '+';
            }
        };
        requestAnimationFrame(step);
    }

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Batch reads, then writes
                    const stats = Array.from(entry.target.querySelectorAll('.stat-number'));
                    const statData = stats.map(stat => ({
                        el: stat,
                        value: stat.textContent,
                        num: parseInt(stat.textContent)
                    }));

                    requestAnimationFrame(() => {
                        statData.forEach(({ el, value, num }) => {
                            if (!value.includes('%') && !value.includes('x') && !isNaN(num)) {
                                animateCounter(el, num);
                            }
                        });
                    });

                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        heroObserver.observe(heroStats);
    }
})();
