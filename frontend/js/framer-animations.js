document.addEventListener('DOMContentLoaded', () => {
    // Initialize Framer Motion
    const { motion } = window.framerMotion;

    // Animation variants
    const fadeIn = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
    };

    const slideUp = {
        initial: { y: 10, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
    };

    const scaleIn = {
        initial: { scale: 0.98, opacity: 0 },
        animate: { scale: 1, opacity: 1, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } }
    };

    // Apply animations to elements
    document.querySelectorAll('[data-motion]').forEach(element => {
        const type = element.dataset.motion;
        const delay = element.dataset.delay || 0;

        let animation;
        switch (type) {
            case 'fade':
                animation = fadeIn;
                break;
            case 'slide-up':
                animation = slideUp;
                break;
            case 'scale':
                animation = scaleIn;
                break;
            default:
                animation = fadeIn;
        }

        motion(element, {
            ...animation,
            animate: {
                ...animation.animate,
                transition: {
                    ...animation.animate.transition,
                    delay: parseFloat(delay)
                }
            }
        });
    });

    // Logo animation
    const logoCircle = document.querySelector('.logo-circle');
    if (logoCircle) {
        motion(logoCircle, {
            whileHover: { scale: 1.1, rotate: 180, transition: { duration: 0.3 } },
            whileTap: { scale: 0.95 }
        });
    }

    // Search container hover effect
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        let mouseX = 0;
        let mouseY = 0;

        searchContainer.addEventListener('mousemove', (e) => {
            const rect = searchContainer.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            searchContainer.style.background = `
                radial-gradient(
                    circle at ${mouseX}px ${mouseY}px,
                    rgba(247, 247, 248, 1) 0%,
                    rgba(247, 247, 248, 0.95) 50%,
                    rgba(247, 247, 248, 0.9) 100%
                )
            `;
        });

        searchContainer.addEventListener('mouseleave', () => {
            searchContainer.style.background = '#f7f7f8';
        });
    }

    // Button hover animations
    document.querySelectorAll('.action-button').forEach(button => {
        motion(button, {
            whileHover: { scale: 1.05, transition: { duration: 0.2 } },
            whileTap: { scale: 0.95 }
        });

        // Add ripple effect
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 1000);
        });
    });

    // Scroll animations
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll('.motion-fade, .motion-slide-up, .motion-scale').forEach(
        element => observer.observe(element)
    );
}); 