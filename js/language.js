// Language Switcher Logic for Gospel Light Ministry

(function () {
    'use strict';

    const LanguageSwitcher = {
        currentLang: 'en',
        defaultLang: 'en',

        init() {
            // Load saved language or detect browser language
            this.currentLang = this.getSavedLanguage() || this.detectBrowserLanguage();
            this.applyLanguage(this.currentLang);
            this.setupEventListeners();
        },

        getSavedLanguage() {
            return localStorage.getItem('preferredLanguage');
        },

        detectBrowserLanguage() {
            const browserLang = navigator.language || navigator.userLanguage;
            const langCode = browserLang.split('-')[0]; // Get 'en' from 'en-US'

            // Check if we support this language
            if (translations[langCode]) {
                return langCode;
            }
            return this.defaultLang;
        },

        saveLanguage(lang) {
            localStorage.setItem('preferredLanguage', lang);
        },

        applyLanguage(lang) {
            if (!translations[lang]) {
                console.warn(`Language '${lang}' not found, using default`);
                lang = this.defaultLang;
            }

            this.currentLang = lang;
            this.saveLanguage(lang);
            this.updatePageContent(lang);
            this.updateLanguageSelector(lang);
        },

        updatePageContent(lang) {
            const trans = translations[lang];

            // Update all elements with data-i18n attribute
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (trans[key]) {
                    // Check if it's an input placeholder
                    if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                        element.placeholder = trans[key];
                    } else {
                        element.textContent = trans[key];
                    }
                }
            });

            // Update page title
            if (lang === 'es') {
                document.title = 'Aumenta Nuestra Fe Señor | Ministerio Luz del Evangelio';
            } else if (lang === 'fr') {
                document.title = 'Augmente Notre Foi Seigneur | Ministère Lumière de l\'Évangile';
            } else {
                document.title = 'Increase Our Faith Lord | Gospel Light Ministry';
            }
        },

        updateLanguageSelector(lang) {
            // Update both top bar and main nav language selectors
            const selectors = document.querySelectorAll('.language-selector-current');
            selectors.forEach(selector => {
                if (lang === 'en') {
                    selector.textContent = '🇺🇸 English';
                } else if (lang === 'es') {
                    selector.textContent = '🇪🇸 Español';
                } else if (lang === 'fr') {
                    selector.textContent = '🇫🇷 Français';
                }
            });

            // Update active state in dropdown
            document.querySelectorAll('.lang-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-lang') === lang) {
                    option.classList.add('active');
                }
            });
        },

        setupEventListeners() {
            // Language option clicks
            document.addEventListener('click', (e) => {
                // Handle language option selection
                if (e.target.classList.contains('lang-option')) {
                    e.preventDefault();
                    e.stopPropagation(); // Prevent bubbling to parent

                    const selectedLang = e.target.getAttribute('data-lang');
                    this.applyLanguage(selectedLang);
                    this.closeDropdowns();
                    return;
                }

                // Toggle dropdown when clicking selector
                if (e.target.closest('.language-selector')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const selector = e.target.closest('.language-selector');
                    const dropdown = selector.querySelector('.lang-dropdown');
                    if (dropdown) {
                        // Close all other dropdowns first
                        this.closeDropdowns();
                        // Toggle this dropdown
                        dropdown.classList.toggle('show');
                    }
                } else {
                    // Close dropdowns when clicking outside
                    this.closeDropdowns();
                }
            });

            // Close dropdown on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeDropdowns();
                }
            });
        },

        closeDropdowns() {
            document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        },

        switchLanguage(lang) {
            this.applyLanguage(lang);
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LanguageSwitcher.init());
    } else {
        LanguageSwitcher.init();
    }

    // Make switcher available globally for manual calls if needed
    window.LanguageSwitcher = LanguageSwitcher;

})();
