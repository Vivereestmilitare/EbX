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

    // --- DOM ELEMENTS (with existence checks) ---
    const getElement = (id) => {
        const el = document.getElementById(id);
        if (!el) console.error(`Element with ID "${id}" not found.`);
        return el;
    };

    const themeToggle = getElement('themeToggle');
    const langToggle = getElement('langToggle');
    const emailForm = getElement('emailForm');
    const nameInput = getElement('name');
    const emailInput = getElement('email');
    const consentCheckbox = getElement('consent');
    const submitBtn = getElement('submitBtn');
    const cookieBanner = getElement('cookieBanner');
    const backToTopBtn = getElement('backToTopBtn');

    // --- THEME MANAGEMENT ---
    const applyTheme = (theme) => {
        document.documentElement.className = `theme-${theme}`;
        localStorage.setItem('theme', theme);
        updateThemeVisuals(theme);
        handleVanta(theme);
    };

    const updateThemeVisuals = (theme) => {
        if (typeof feather !== 'undefined' && themeToggle) {
            const icon = theme === 'dark' ? 'sun' : 'moon';
            const i = themeToggle.querySelector('i');
            if(i) i.setAttribute('data-feather', icon);
            feather.replace();
        }
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
        if (langToggle) langToggle.textContent = lang.toUpperCase();
        if (submitBtn) submitBtn.textContent = translations[lang]?.subscribe || 'Subscribe';
    };

    // --- FORM MANAGEMENT ---
    const validateForm = () => {
        if (submitBtn && nameInput && emailInput && consentCheckbox) {
            submitBtn.disabled = !(nameInput.checkValidity() && emailInput.checkValidity() && consentCheckbox.checked);
        }
    };
    
    const showFormMessage = (type, lang) => {
        document.querySelectorAll('.success-message, .error-message').forEach(el => el.style.display = 'none');
        if (type === 'success') {
            const successMsgId = lang === 'de' ? 'successMessageDE' : 'successMessage';
            const el = getElement(successMsgId);
            if(el) el.style.display = 'block';
            if(emailForm) emailForm.style.display = 'none';
        } else if (type === 'error') {
            const errorMsgId = lang === 'de' ? 'errorMessageDE' : 'errorMessage';
            const el = getElement(errorMsgId);
            if(el) el.style.display = 'flex';
            if (typeof feather !== 'undefined') feather.replace({ width: '18px', height: '18px' });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const lang = localStorage.getItem('language') || 'en';
        const formData = new FormData(emailForm);
        
        if(submitBtn) submitBtn.disabled = true;

        try {
            const response = await fetch(emailForm.action, { method: 'POST', body: formData });
            const text = await response.text();

            if (text === "OK") {
                showFormMessage('success', lang);
            } else {
                throw new Error(text);
            }
        } catch (error) {
            console.error("Form submission error:", error);
            showFormMessage('error', lang);
            if(submitBtn) submitBtn.disabled = false;
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
        if (!header || !backToTopBtn) return;
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
            const modal = getElement(modalId);
            const closeBtn = getElement(closeId);
            if (!modal || !closeBtn) return;
            document.querySelectorAll(linkSelector).forEach(link => {
                link.addEventListener('click', (e) => { e.preventDefault(); modal.style.display = 'flex'; });
            });
            closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        };
        setupModalToggle('.privacy-link', 'privacyModal', 'closePrivacy');
        setupModalToggle('.impressum-link', 'impressumPanel', 'closeImpressum');
    };
    
    const loadAnalytics = () => {
        const script = document.createElement('script');
        script.async = true;
        script.setAttribute('data-goatcounter', 'https://YOUR-CODE.goatcounter.com/count');
        script.src = '//gc.zgo.at/count.js';
        document.head.appendChild(script);
    };

    const setupCookieBanner = () => {
        if (!cookieBanner) return;
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.classList.add('active');
        }
        document.querySelectorAll('.cookie-btn').forEach(button => {
            button.addEventListener('click', () => {
                const consent = button.dataset.consent;
                localStorage.setItem('cookiesAccepted', consent);
                cookieBanner.classList.remove('active');
                if (consent === 'all') loadAnalytics();
            });
        });
    };

    // --- INITIALIZATION ---
    const init = () => {
        try {
            if (typeof feather !== 'undefined') feather.replace();
            
            const savedTheme = localStorage.getItem('theme') || 'dark';
            const savedLang = localStorage.getItem('language') || 'en';
            applyTheme(savedTheme);
            applyLanguage(savedLang);
            
            if (themeToggle) themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light';
                applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
            });
            if (langToggle) langToggle.addEventListener('click', () => {
                const currentLang = localStorage.getItem('language') || 'en';
                applyLanguage(currentLang === 'en' ? 'de' : 'en');
            });
            if (nameInput) nameInput.addEventListener('input', validateForm);
            if (emailInput) emailInput.addEventListener('input', validateForm);
            if (consentCheckbox) consentCheckbox.addEventListener('change', validateForm);
            if (emailForm) emailForm.addEventListener('submit', handleFormSubmit);
            if (backToTopBtn) backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            handleUiVisibility();
            setupScrollAnimations();
            setupModals();
            setupCookieBanner();

            if (localStorage.getItem('cookiesAccepted') === 'all') loadAnalytics();

        } catch (error) {
            console.error("An error occurred during initialization:", error);
        } finally {
            window.setTimeout(() => {
                document.body.classList.remove('loading');
            }, 100);
        }
    };

    init();
});

