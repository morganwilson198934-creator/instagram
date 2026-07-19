// ========================================
// Internationalization (i18n) Engine
// ========================================
(function() {
  // Current language
  window.__currentLang = localStorage.getItem('ig-lang') || 'en';

  // Translation function
  window.t = function(key) {
    var lang = window.__currentLang || 'en';
    if (I18N.strings[lang] && I18N.strings[lang][key] !== undefined) {
      return I18N.strings[lang][key];
    }
    if (I18N.strings.en && I18N.strings.en[key] !== undefined) {
      return I18N.strings.en[key];
    }
    return key;
  };

  // Apply translations to DOM
  window.applyTranslations = function() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      var translated = t(key);
      if (translated) el.textContent = translated;
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var translated = t(key);
      if (translated) el.placeholder = translated;
    });

    // InnerHTML (for elements with links)
    document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-html');
      var translated = t(key);
      if (translated) el.innerHTML = translated;
    });

    // Update chat widget elements
    document.querySelectorAll('.chat-agent-name[data-i18n]').forEach(function(el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('.chat-agent-status[data-i18n]').forEach(function(el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('.chat-input[data-i18n-placeholder]').forEach(function(el) {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });

    // Update lang switcher button
    var langBtn = document.getElementById('langBtn');
    if (langBtn) {
      var langData = I18N.languages[window.__currentLang];
      langBtn.querySelector('.lang-flag').textContent = langData.flag;
      langBtn.querySelector('.lang-name').textContent = langData.name;
    }
  };

  // Set language
  window.setLanguage = function(lang) {
    if (!I18N.languages[lang]) return;
    window.__currentLang = lang;
    localStorage.setItem('ig-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = I18N.languages[lang].dir;
    
    if (lang === 'ar') {
      document.body.classList.add('rtl-mode');
    } else {
      document.body.classList.remove('rtl-mode');
    }

    applyTranslations();
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: lang } }));
  };

  // Build language switcher
  function buildLangSwitcher() {
    // Check if there's a lang-switcher container in the nav
    var container = document.getElementById('langSwitcherContainer');
    if (!container) {
      // Try to find the nav and add it
      var nav = document.querySelector('.nav-container');
      if (nav) {
        container = document.createElement('div');
        container.id = 'langSwitcherContainer';
        var ctaBtn = nav.querySelector('.nav-cta');
        if (ctaBtn) {
          nav.insertBefore(container, ctaBtn);
        } else {
          nav.appendChild(container);
        }
      }
    }
    if (!container) return;

    var switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.id = 'langSwitcher';

    var btn = document.createElement('button');
    btn.className = 'lang-switcher-btn';
    btn.id = 'langBtn';
    btn.innerHTML = '<span class="lang-flag">\u{1F1FA}\u{1F1F8}</span><span class="lang-name">English</span><svg class="lang-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';

    var dropdown = document.createElement('div');
    dropdown.className = 'lang-dropdown';
    dropdown.id = 'langDropdown';

    // Populate dropdown
    Object.keys(I18N.languages).forEach(function(langCode) {
      var langInfo = I18N.languages[langCode];
      var option = document.createElement('button');
      option.className = 'lang-option';
      if (langCode === window.__currentLang) option.classList.add('active');
      option.setAttribute('data-lang', langCode);
      option.innerHTML = '<span class="lang-option-flag">' + langInfo.flag + '</span><span class="lang-option-name">' + langInfo.name + '</span>';
      option.addEventListener('click', function() {
        setLanguage(langCode);
        dropdown.querySelectorAll('.lang-option').forEach(function(o) { o.classList.remove('active'); });
        option.classList.add('active');
        dropdown.classList.remove('open');
      });
      dropdown.appendChild(option);
    });

    switcher.appendChild(btn);
    switcher.appendChild(dropdown);
    container.appendChild(switcher);

    // Toggle dropdown
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!switcher.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  // Also build a language switcher for the mobile menu
  function buildMobileLangSwitcher() {
    var mobileMenu = document.getElementById('navMobile');
    if (!mobileMenu) return;

    var mobileLangDiv = document.createElement('div');
    mobileLangDiv.className = 'mobile-lang-switcher';
    
    var select = document.createElement('select');
    select.id = 'mobileLangSelect';
    select.className = 'mobile-lang-select';
    
    Object.keys(I18N.languages).forEach(function(langCode) {
      var langInfo = I18N.languages[langCode];
      var option = document.createElement('option');
      option.value = langCode;
      option.textContent = langInfo.flag + ' ' + langInfo.name;
      if (langCode === window.__currentLang) option.selected = true;
      select.appendChild(option);
    });
    
    select.addEventListener('change', function() {
      setLanguage(this.value);
      // Update desktop dropdown active state too
      document.querySelectorAll('.lang-option').forEach(function(o) {
        o.classList.toggle('active', o.getAttribute('data-lang') === select.value);
      });
    });

    mobileLangDiv.appendChild(select);
    // Insert before the CTA button in mobile menu
    var mobileCta = mobileMenu.querySelector('.btn-primary');
    if (mobileCta) {
      mobileMenu.insertBefore(mobileLangDiv, mobileCta);
    } else {
      mobileMenu.appendChild(mobileLangDiv);
    }
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    buildLangSwitcher();
    buildMobileLangSwitcher();
    setLanguage(window.__currentLang);
  });
})();
