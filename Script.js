/* =============================================
   LUCKNOW COMPUTER HOME TUITION — script.js
   Pure Vanilla JavaScript — No frameworks
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     YEAR
     ============================================ */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================
     NAVBAR — scroll effect
     ============================================ */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ============================================
     MOBILE MENU
     ============================================ */
  var mobileMenu    = document.getElementById('mobile-menu');
  var hamburgerBtn  = document.getElementById('hamburger-btn');
  var closeMenuBtn  = document.getElementById('close-menu-btn');
  var mobileLinks   = document.querySelectorAll('.mobile-nav-link');
  var mobileWa      = document.querySelector('.mobile-whatsapp-btn');
  var mobileLogoLink = document.getElementById('mobile-logo-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Stagger animate links in
    mobileLinks.forEach(function (link) {
      var delay = parseFloat(link.getAttribute('data-delay')) * 80;
      link.style.animationDelay = delay + 'ms';
      link.classList.remove('animate-in');
      // Force reflow
      void link.offsetWidth;
      link.classList.add('animate-in');
    });
    if (mobileWa) {
      mobileWa.style.animationDelay = '500ms';
      mobileWa.classList.remove('animate-in');
      void mobileWa.offsetWidth;
      mobileWa.classList.add('animate-in');
    }
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn)  hamburgerBtn.addEventListener('click', openMenu);
  if (closeMenuBtn)  closeMenuBtn.addEventListener('click', closeMenu);
  if (mobileLogoLink) mobileLogoLink.addEventListener('click', closeMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ============================================
     SMOOTH SCROLL for all anchor links
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var navH = navbar ? navbar.offsetHeight : 64;
        var top = targetEl.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     SCROLL REVEAL (IntersectionObserver)
     ============================================ */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ============================================
     COUNTER ANIMATION (Stats section)
     ============================================ */
  var counterEl = document.querySelector('[data-counter]');
  var counterDone = false;

  function animateCounter() {
    if (counterDone || !counterEl) return;
    var end    = parseInt(counterEl.getAttribute('data-counter'), 10);
    var suffix = counterEl.getAttribute('data-suffix') || '';
    var duration = 2000;
    var stepTime = Math.floor(duration / end);
    var current = 0;
    counterDone = true;
    var timer = setInterval(function () {
      current += 1;
      counterEl.textContent = current + suffix;
      if (current >= end) clearInterval(timer);
    }, stepTime);
  }

  if ('IntersectionObserver' in window && counterEl) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterObserver.observe(counterEl);
  }

  /* ============================================
     TOAST helper
     ============================================ */
  var toastEl = document.getElementById('toast');
  var toastTimer = null;

  function showToast(msg, type) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.className = 'toast show ' + (type || 'success');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('show');
    }, 3500);
  }

  /* ============================================
     CONTACT FORM — submit to WhatsApp
     ============================================ */
  var contactForm = document.getElementById('contact-form');
  var formError   = document.getElementById('form-error');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('name').value.trim();
      var phone   = document.getElementById('phone').value.trim();
      var message = document.getElementById('message').value.trim();

      // Validate
      if (!name || !phone) {
        formError.textContent = 'Please fill in your name and phone number.';
        formError.style.display = 'block';
        return;
      }
      formError.style.display = 'none';

      var submitBtn = contactForm.querySelector('.btn-submit');
      submitBtn.disabled = true;

      var text = 'Hello! My name is ' + name + '. Phone: ' + phone + (message ? '. ' + message : '');
      var url  = 'https://wa.me/919120318426?text=' + encodeURIComponent(text.trim());
      window.open(url, '_blank');

      showToast('Opening WhatsApp...', 'success');

      // Reset form
      document.getElementById('name').value    = '';
      document.getElementById('phone').value   = '';
      document.getElementById('message').value = '';
      submitBtn.disabled = false;
    });
  }

  /* ============================================
     GALLERY — hover overlay (optional enhancement)
     Done in CSS; JS not needed here.
     ============================================ */

  /* ============================================
     LAZY IMAGES polyfill (for older browsers)
     ============================================ */
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading supported — no action needed
  } else {
    var lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            imgObserver.unobserve(img);
          }
        });
      });
      lazyImgs.forEach(function (img) { imgObserver.observe(img); });
    }
  }

});
