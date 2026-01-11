// ===== PAGE TRANSITION =====
document.addEventListener('DOMContentLoaded', () => {
    // Add page load animation
    const transition = document.querySelector('.page-transition');
    
    // Check if we arrived via back/forward navigation
    const navigationType = performance.getEntriesByType('navigation')[0]?.type;
    const isBackForward = navigationType === 'back_forward';
    
    // If back/forward navigation, skip the transition animation
    if (isBackForward) {
        transition.classList.remove('active');
        document.body.classList.remove('page-transitioning');
    } else {
        // Animate in on page load (for normal navigation)
        setTimeout(() => {
            transition.classList.add('active');
            setTimeout(() => {
                transition.classList.remove('active');
            }, 100);
        }, 100);
    }

    // Handle all internal links
    const links = document.querySelectorAll('a[href^="index.html"], a[href^="about.html"], a[href^="projects.html"], a[href^="skills.html"], a[href^="experience.html"], a[href^="contact.html"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Trigger transition
            transition.classList.add('active');
            document.body.classList.add('page-transitioning');
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });
});

// Handle browser back/forward buttons
window.addEventListener('pageshow', (event) => {
    // If page is being restored from cache (back/forward navigation)
    if (event.persisted) {
        const transition = document.querySelector('.page-transition');
        transition.classList.remove('active');
        document.body.classList.remove('page-transitioning');
    }
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const nav = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
    }
});

// ===== CONTACT FORM HANDLING (FORMSUBMIT AJAX) =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn-submit');
        const formMessage = document.getElementById('formMessage');
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        formMessage.style.display = 'none';
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            _subject: 'New Contact Form Submission - Portfolio',
            _captcha: 'false',
            _template: 'table'
        };
        
        try {
            const response = await fetch('https://formsubmit.co/hemanthbobba246@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                // Show success message
                formMessage.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // Show error message
            formMessage.textContent = '⚠️ Oops! Something went wrong. Please email me directly at hemanthbobba246@gmail.com';
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
            
            console.error('Form error:', error);
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// ===== FORM FIELD ANIMATIONS =====
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
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

// ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements that need scroll animations (except those with animate-up class)
const animateElements = document.querySelectorAll('.project-card, .skill-card, .timeline-item, .highlight-card');
animateElements.forEach(el => {
    if (!el.classList.contains('animate-up')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    }
});

// ===== COPY EMAIL ON CLICK =====
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const email = link.href.replace('mailto:', '');
        
        // Copy to clipboard
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                // Show temporary tooltip
                const originalText = link.textContent;
                link.textContent = 'Email copied!';
                link.style.color = 'var(--success)';
                
                setTimeout(() => {
                    link.textContent = originalText;
                    link.style.color = '';
                }, 2000);
            });
        }
    });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC to close mobile menu
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    }
});

// ===== PRELOAD NEXT PAGE =====
// Preload linked pages for faster navigation
const preloadLinks = () => {
    const links = document.querySelectorAll('a[href$=".html"]');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const href = link.getAttribute('href');
            const preload = document.createElement('link');
            preload.rel = 'prefetch';
            preload.href = href;
            document.head.appendChild(preload);
        }, { once: true });
    });
};

preloadLinks();

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Hi there!', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cLooking at the code? I appreciate your curiosity!', 'font-size: 14px; color: #64748b;');
console.log('%cFeel free to reach out if you want to discuss this project.', 'font-size: 14px; color: #64748b;');

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images if any are added
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}
