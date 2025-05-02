// Animations for enhancing user experience

document.addEventListener('DOMContentLoaded', function() {
    // Apply entrance animations to elements
    applyEntranceAnimations();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
    
    // Add hover effects to buttons and cards
    addHoverEffects();
    
    // Add typing effect to headers if needed
    initTypingEffect();
});

// Function to apply entrance animations to elements
function applyEntranceAnimations() {
    // Animate header
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
        mainHeader.classList.add('fade-in');
    }
    
    // Animate post cards with staggered delay
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('slide-in');
    });
    
    // Animate buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach((button, index) => {
        button.style.animationDelay = `${0.5 + (index * 0.1)}s`;
        button.classList.add('fade-in');
    });
}

// Function to initialize scroll-triggered animations
function initScrollAnimations() {
    // Get all elements that should animate on scroll
    const scrollAnimElements = document.querySelectorAll('.scroll-anim');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Function to handle scroll events
    function handleScrollAnimations() {
        scrollAnimElements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('animated')) {
                const animationType = element.dataset.animation || 'fade-in';
                element.classList.add(animationType, 'animated');
            }
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Trigger once on page load
    handleScrollAnimations();
}

// Function to add hover effects to various elements
function addHoverEffects() {
    // Add hover effect class to specific elements
    const hoverElements = document.querySelectorAll('.category-badge, .nav-link, .social-icon');
    hoverElements.forEach(element => {
        element.classList.add('btn-hover-effect');
    });
}

// Function for typing effect (for headers, intros, etc.)
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        let i = 0;
        const speed = 50; // Typing speed (ms)
        
        function typeWriter() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start the typing effect
        typeWriter();
    });
}

// Function for animated counter (for stats, etc.)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // Update every 16ms for 60fps
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Function to add parallax effect (for backgrounds, etc.)
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// Initialize any custom animations for specific pages
if (document.querySelector('.home-page')) {
    // Special animations only for the home page
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.classList.add('fade-in');
    }
}

// Initialize any success/error message animations
const flashMessages = document.querySelectorAll('.alert');
flashMessages.forEach(message => {
    // Add slide-in animation
    message.classList.add('slide-in');
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        message.classList.add('slide-out');
        setTimeout(() => {
            message.remove();
        }, 500);
    }, 5000);
});
