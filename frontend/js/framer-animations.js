document.addEventListener('DOMContentLoaded', () => {
    // Initialize Framer Motion
    const { motion, animate, spring, inView } = window.Motion;

    // Animation variants
    const animations = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
        },
        'slide-up': {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
        },
        'slide-down': {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
        },
        'slide-right': {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
        },
        'slide-left': {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
        },
        scale: {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1, transition: { duration: 0.6, ease: spring() } }
        },
        'scale-x': {
            initial: { scaleX: 0, opacity: 0 },
            animate: { scaleX: 1, opacity: 1, transition: { duration: 0.8, ease: spring() } }
        },
        spring: {
            initial: { scale: 0.9, rotate: -10 },
            animate: {
                scale: 1,
                rotate: 0,
                transition: {
                    type: 'spring',
                    stiffness: 200,
                    damping: 10
                }
            }
        },
        float: {
            animate: {
                y: [0, -10, 0],
                transition: {
                    duration: 3,
                    ease: 'easeInOut',
                    repeat: Infinity
                }
            }
        }
    };

    // Apply animations to elements
    document.querySelectorAll('[data-motion]').forEach(element => {
        const animationType = element.getAttribute('data-motion');
        const delay = element.getAttribute('data-delay') || 0;

        if (animations[animationType]) {
            const { initial, animate } = animations[animationType];

            // Create motion element
            const motionEl = motion(element, {
                initial,
                animate: {
                    ...animate,
                    transition: {
                        ...animate.transition,
                        delay: parseFloat(delay)
                    }
                }
            });

            // Add hover animations for interactive elements
            if (element.tagName === 'BUTTON' || element.classList.contains('logo-circle')) {
                motionEl.hover({
                    scale: 1.05,
                    transition: { duration: 0.2, ease: 'easeOut' }
                });
            }

            // Add tap animations for buttons
            if (element.tagName === 'BUTTON') {
                motionEl.tap({
                    scale: 0.95,
                    transition: { duration: 0.1 }
                });
            }

            // Special animation for logo
            if (element.classList.contains('logo-circle')) {
                motionEl.hover({
                    scale: 1.1,
                    rotate: 5,
                    transition: {
                        type: 'spring',
                        stiffness: 400,
                        damping: 10
                    }
                });
            }
        }
    });

    // Add scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animationType = element.getAttribute('data-motion');

                if (animations[animationType]) {
                    animate(element, animations[animationType].animate);
                }
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-motion]').forEach(element => {
        observer.observe(element);
    });

    // Add micro-interactions
    const addMicroInteraction = (element, options = {}) => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            animate(element, {
                background: `radial-gradient(circle at ${x}px ${y}px, rgba(92, 95, 239, 0.1) 0%, transparent 100%)`
            }, { duration: 0.3 });
        });

        element.addEventListener('mouseleave', () => {
            animate(element, {
                background: 'transparent'
            }, { duration: 0.3 });
        });
    };

    // Apply micro-interactions to interactive elements
    document.querySelectorAll('.search-container, .upload-container, .control-button').forEach(element => {
        addMicroInteraction(element);
    });

    // Add ripple effect to buttons
    const addRippleEffect = (button) => {
        button.addEventListener('click', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.width = '0px';
            ripple.style.height = '0px';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(92, 95, 239, 0.3)';
            ripple.style.pointerEvents = 'none';

            button.appendChild(ripple);

            animate(ripple, {
                width: '200px',
                height: '200px',
                opacity: 0
            }, {
                duration: 0.6,
                ease: 'easeOut',
                onComplete: () => ripple.remove()
            });
        });
    };

    // Apply ripple effect to buttons
    document.querySelectorAll('button').forEach(addRippleEffect);
}); 