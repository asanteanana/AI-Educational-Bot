document.addEventListener('DOMContentLoaded', () => {
    // Initialize animations
    const animateElement = (element, options) => {
        element.style.transition = `all ${options.duration || 0.3}s ${options.ease || 'cubic-bezier(0.25, 0.1, 0.25, 1)'}`;
        Object.assign(element.style, options.animate);
    };

    // Fade in header
    const header = document.querySelector('.header');
    if (header) {
        setTimeout(() => {
            header.style.opacity = '1';
        }, 100);
    }

    // Animate logo
    const logoCircle = document.querySelector('.logo-circle');
    if (logoCircle) {
        logoCircle.addEventListener('mouseenter', () => {
            logoCircle.style.transform = 'scale(1.1) rotate(180deg)';
        });
        logoCircle.addEventListener('mouseleave', () => {
            logoCircle.style.transform = 'scale(1) rotate(0deg)';
        });
    }

    // Animate search container
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        let mouseX = 0;
        let mouseY = 0;

        const updateGradient = (e) => {
            const rect = searchContainer.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            searchContainer.style.background = `
                radial-gradient(
                    circle at ${mouseX}px ${mouseY}px,
                    var(--color-surface) 0%,
                    var(--color-surface) 50%,
                    var(--color-surface) 100%
                )
            `;
        };

        searchContainer.addEventListener('mousemove', updateGradient);
        searchContainer.addEventListener('mouseleave', () => {
            searchContainer.style.background = 'var(--color-surface)';
        });
    }

    // Animate buttons
    document.querySelectorAll('.action-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            const rect = button.getBoundingClientRect();
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 1000);
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '20px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.motion-fade, .motion-slide-up, .motion-scale').forEach(
        element => {
            element.style.opacity = '0';
            if (element.classList.contains('motion-slide-up')) {
                element.style.transform = 'translateY(10px)';
            }
            observer.observe(element);
        }
    );

    // Initialize tab interactions
    const tabs = document.querySelectorAll('.learning-path-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}); 