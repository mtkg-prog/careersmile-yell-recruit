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
    var pcSlides = document.querySelectorAll('.hero-slider--pc .hero-slide');
    var spSlides = document.querySelectorAll('.hero-visual .hero-slide');
    var statusEl = document.querySelector('.hero-sr-status');

    var total = Math.max(pcSlides.length, spSlides.length);
    if (total === 0) return;

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
    var items = document.querySelectorAll('.faq-item');
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
    initHeroSlider();
    initScrollFadeIn();
    initFaqAccordion();
  });
})();
