document.addEventListener('DOMContentLoaded', () => {
    // --- STATE & CONFIG ---
    let vantaEffect = null;
    const translations = {
        en: {
            subscribe: 'Subscribe',
            formError: 'An error occurred. Please try again.'
        },
        de: {
            subscribe: 'Abonnieren',
            formError: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
        }
    };

    // --- DOM ELEMENTS ---
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('email');
    const consentCheckbox = document.getElementById('consent');
    const submitBtn = document.getElementById('submitBtn');
    const cookieBanner = document.getElementById('cookieBanner');
    const backToTopBtn = document.getElementById('backToTopBtn');

    // --- THEME MANAGEMENT ---
    const applyTheme = (theme) => {
        document.documentElement.className = `theme-${theme}`;
        localStorage.setItem('theme', theme);
        updateThemeVisuals(theme);
        handleVanta(theme);
    };

    const updateThemeVisuals = (theme) => {
        const icon = theme === 'dark' ? 'sun' : 'moon';
        themeToggle.querySelector('i').setAttribute('data-feather', icon);
        feather.replace();
        // Logo switching is now handled purely by CSS
    };

    const handleVanta = (theme) => {
        if (theme === 'dark' && !vantaEffect) {
            if (typeof VANTA !== 'undefined') {
                vantaEffect = VANTA.GLOBE({
                    el: "#vantaBg",
                    mouseControls: true, touchControls: true, gyroControls: false,
                    minHeight: 200.00, minWidth: 200.00, scale: 1.00, scaleMobile: 1.00,
                    color: getComputedStyle(document.documentElement).getPropertyValue('--clr-primary'),
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--clr-bg')
                });
            }
        } else if (theme === 'light' && vantaEffect) {
            vantaEffect.destroy();
            vantaEffect = null;
        }
    };

    // --- LANGUAGE MANAGEMENT ---
    const applyLanguage = (lang) => {
        document.querySelectorAll('[data-lang]').forEach(el => {
            el.style.display = el.dataset.lang === lang ? '' : 'none';
        });
        localStorage.setItem('language', lang);
        langToggle.textContent = lang.toUpperCase();
        submitBtn.textContent = translations[lang].subscribe;
    };

    // --- FORM MANAGEMENT ---
    const validateForm = () => {
        submitBtn.disabled = !(emailInput.checkValidity() && consentCheckbox.checked);
    };
    
    const showFormMessage = (type, lang) => {
        // Hide all messages first
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('successMessageDE').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'none';
        document.getElementById('errorMessageDE').style.display = 'none';

        if (type === 'success') {
            const successMsgId = lang === 'de' ? 'successMessageDE' : 'successMessage';
            document.getElementById(successMsgId).style.display = 'block';
            emailForm.style.display = 'none'; // Hide form on success
        } else if (type === 'error') {
            const errorMsgId = lang === 'de' ? 'errorMessageDE' : 'errorMessage';
            document.getElementById(errorMsgId).style.display = 'block';
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('language') || 'en';
        const formData = new FormData(emailForm);
        try {
            const response = await fetch(emailForm.action, {
                method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                showFormMessage('success', lang);
            } else {
                showFormMessage('error', lang);
            }
        } catch (error) {
            showFormMessage('error', lang);
        }
    };

    // --- UI & ANIMATIONS ---
    const setupScrollAnimations = () => {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.anim-on-scroll').forEach(el => observer.observe(el));
    };
    
    const handleUiVisibility = () => {
        const header = document.querySelector('header');
        let ticking = false;
        const update = () => {
            const scrollY = window.scrollY;
            header.classList.toggle('visible', scrollY > 50);
            backToTopBtn.classList.toggle('visible', scrollY > 300);
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        });
    };

    // --- MODALS & COOKIES ---
    const setupModals = () => {
        const setupModalToggle = (linkSelector, modalId, closeId) => {
            const modal = document.getElementById(modalId);
            document.querySelectorAll(linkSelector).forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.style.display = 'flex';
                });
            });
            document.getElementById(closeId).addEventListener('click', () => {
                modal.style.display = 'none';
            });
        };
        setupModalToggle('.privacy-link', 'privacyModal', 'closePrivacy');
        setupModalToggle('.impressum-link', 'impressumPanel', 'closeImpressum');
    };
    
    const loadAnalytics = () => {
        const script = document.createElement('script');
        script.defer = true;
        script.setAttribute('data-domain', 'yourdomain.com');
        script.src = 'https://plausible.io/js/script.js';
        document.head.appendChild(script);
    };

    const setupCookieBanner = () => {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.classList.add('active');
        }
        document.querySelectorAll('.cookie-btn').forEach(button => {
            button.addEventListener('click', () => {
                const consent = button.dataset.consent;
                localStorage.setItem('cookiesAccepted', consent);
                cookieBanner.classList.remove('active');
                if (consent === 'all') {
                    loadAnalytics();
                }
            });
        });
    };

    // --- INITIALIZATION ---
    const init = () => {
        // Initial setup
        const savedTheme = localStorage.getItem('theme') || 'dark';
        const savedLang = localStorage.getItem('language') || 'en';
        applyTheme(savedTheme);
        applyLanguage(savedLang);
        
        // Event Listeners
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
        langToggle.addEventListener('click', () => {
            const currentLang = localStorage.getItem('language') || 'en';
            applyLanguage(currentLang === 'en' ? 'de' : 'en');
        });
        emailInput.addEventListener('input', validateForm);
        consentCheckbox.addEventListener('change', validateForm);
        emailForm.addEventListener('submit', handleFormSubmit);
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // UI Modules
        handleUiVisibility();
        setupScrollAnimations();
        setupModals();
        setupCookieBanner();
        
        feather.replace(); // Needs to be called for Back to Top icon

        // Load analytics if previously consented
        if (localStorage.getItem('cookiesAccepted') === 'all') {
            loadAnalytics();
        }
        
        // Fade in page
        window.setTimeout(() => {
            document.body.classList.remove('loading');
        }, 100);
    };

    init();
});

