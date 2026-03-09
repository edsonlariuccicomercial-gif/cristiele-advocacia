// Cristiele Ribeiro Landing Page — Analytics JS
// GA4 + Meta Pixel event tracking

(function () {
  'use strict';

  // Helper: safe gtag call
  function sendGA4(eventName, params) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  }

  // Helper: safe fbq call
  function sendFBQ(eventName, params) {
    if (typeof fbq === 'function') {
      fbq('track', eventName, params);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initWhatsAppTracking();
    initScrollDepthTracking();
    initSocialClickTracking();
    initFAQTracking();
    initNavTracking();
  });

  // Track WhatsApp CTA clicks — GA4 + Meta Pixel
  function initWhatsAppTracking() {
    document.querySelectorAll('a[href*="api.whatsapp.com"]').forEach(function (link) {
      link.addEventListener('click', function () {
        var section = link.closest('section');
        var sectionId = section ? section.id : 'floating';

        sendGA4('whatsapp_click', {
          event_category: 'conversion',
          event_label: sectionId
        });

        sendFBQ('Contact', {
          content_name: sectionId
        });
      });
    });
  }

  // Track scroll depth at 25%, 50%, 75%, 100%
  function initScrollDepthTracking() {
    var milestones = [25, 50, 75, 100];
    var triggered = {};

    window.addEventListener('scroll', function () {
      var scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;

      var scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

      milestones.forEach(function (m) {
        if (scrollPercent >= m && !triggered[m]) {
          triggered[m] = true;
          sendGA4('scroll_depth', { percent: m });
        }
      });
    }, { passive: true });
  }

  // Track social media link clicks
  function initSocialClickTracking() {
    var platforms = {
      'instagram.com': 'instagram',
      'facebook.com': 'facebook',
      'tiktok.com': 'tiktok'
    };

    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      Object.keys(platforms).forEach(function (domain) {
        if (href.indexOf(domain) !== -1) {
          link.addEventListener('click', function () {
            sendGA4('social_click', { platform: platforms[domain] });
          });
        }
      });
    });
  }

  // Track FAQ item expansion
  function initFAQTracking() {
    document.querySelectorAll('.faq-question').forEach(function (button) {
      button.addEventListener('click', function () {
        var isExpanding = button.getAttribute('aria-expanded') !== 'true';
        if (isExpanding) {
          var questionText = (button.textContent || '').trim().substring(0, 60);
          sendGA4('faq_expand', { question: questionText });
        }
      });
    });
  }

  // Track nav link clicks
  function initNavTracking() {
    document.querySelectorAll('nav a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        var target = link.getAttribute('href').replace('#', '');
        sendGA4('nav_click', { target: target });
      });
    });
  }
})();
