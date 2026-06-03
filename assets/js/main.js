/**
 * キャリスマエール 採用サイト - Main JS
 */

(function () {
  'use strict';

  /* ===================================
     Hero Slider - Fade transition
     PC (.hero-slider--pc) と SP (.hero-visual)
     の両スライダーを同期して切り替える
     =================================== */
  function initHeroSlider() {
    var hero = document.querySelector('.hero');
    var pcSlides = document.querySelectorAll('.hero-slider--pc .hero-slide');
    var spSlides = document.querySelectorAll('.hero-visual .hero-slide');
    var statusEl = document.querySelector('.hero-sr-status');
    var reduceMotionQuery = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

    var total = Math.max(pcSlides.length, spSlides.length);
    if (total === 0) return;
    if (hero && hero.dataset.sliderInitialized === 'true') return;
    if (hero) hero.dataset.sliderInitialized = 'true';

    var current = 0;
    var interval = 4000;
    var timer = null;

    function showSlide(index) {
      var next = index % total;

      // PC slides
      if (pcSlides[current]) pcSlides[current].classList.remove('is-active');
      if (pcSlides[next]) pcSlides[next].classList.add('is-active');

      // SP slides
      if (spSlides[current]) spSlides[current].classList.remove('is-active');
      if (spSlides[next]) spSlides[next].classList.add('is-active');

      current = next;

      if (statusEl) {
        statusEl.textContent = 'スライド ' + (current + 1) + ' / ' + total;
      }
    }

    if (statusEl) {
      statusEl.textContent = 'スライド 1 / ' + total;
    }

    if (reduceMotionQuery && reduceMotionQuery.matches) {
      return;
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    function startTimer() {
      if (timer) return;
      timer = setInterval(nextSlide, interval);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    });

    startTimer();
  }

  /* ===================================
     Header Navigation
     =================================== */
  function initHeaderNav() {
    var header = document.querySelector('.header');
    var btn = document.querySelector('.header-menu-btn');
    var nav = document.querySelector('#header-nav');

    if (!header || !btn || !nav) return;
    if (header.dataset.navInitialized === 'true') return;
    header.dataset.navInitialized = 'true';

    function setOpen(isOpen) {
      header.classList.toggle('is-nav-open', isOpen);
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    }

    btn.addEventListener('click', function () {
      setOpen(!header.classList.contains('is-nav-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('click', function (event) {
      if (!header.contains(event.target)) {
        setOpen(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    });
  }

  /* ===================================
     Scroll Fade-in (IntersectionObserver)
     =================================== */
  function initScrollFadeIn() {
    var targets = document.querySelectorAll('.section-inner');
    if (!('IntersectionObserver' in window) || targets.length === 0) {
      targets.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ===================================
     FAQ Accordion
     =================================== */
  function initFaqAccordion() {
    var list = document.querySelector('.faq-list');
    var items = document.querySelectorAll('.faq-item');
    if (list && list.dataset.accordionInitialized === 'true') return;
    if (list) list.dataset.accordionInitialized = 'true';

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-item__question');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var otherBtn = other.querySelector('.faq-item__question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ===================================
     Init
     =================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initHeaderNav();
    initHeroSlider();
    initScrollFadeIn();
    initFaqAccordion();
  });
})();
