/* ==========================================================================
   Navigation — Active links, mobile menu, cart badge
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Update cart badge on every page
  if (window.ClothStore) {
    window.ClothStore.updateCartBadge();
  }

  // Mobile menu
  var hamburger = document.getElementById('hamburger-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileClose = document.getElementById('mobile-menu-close');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
});
