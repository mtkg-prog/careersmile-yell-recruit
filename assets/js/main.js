/**
 * キャリスマエール 採用サイト - Main JS
 */

(function () {
  'use strict';

  /* ===================================
     Hero Slider - Fade transition
     =================================== */
  function initHeroSlider() {
    var slides = document.querySelectorAll('.hero-slide');
    var statusEl = document.querySelector('.hero-sr-status');
    if (slides.length === 0) return;

    var current = 0;
    var total = slides.length;
    var interval = 4000;
    var timer = null;

    function showSlide(index) {
      slides[current].classList.remove('is-active');
      current = index % total;
      slides[current].classList.add('is-active');

      if (statusEl) {
        statusEl.textContent = 'スライド ' + (current + 1) + ' / ' + total;
      }
    }

    function next() {
      showSlide(current + 1);
    }

    function startTimer() {
      if (timer) return;
      timer = setInterval(next, interval);
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    // Pause when tab is not visible
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
    var targets = document.querySelectorAll('.intro-inner');
    if (!('IntersectionObserver' in window) || targets.length === 0) {
      // Fallback: show immediately
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
     Init
     =================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroSlider();
    initScrollFadeIn();
  });
})();
