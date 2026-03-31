/* ==========================================================================
   Product Detail — Size selector, quantity, add to cart
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Get product ID from URL
  var params = new URLSearchParams(window.location.search);
  var productId = parseInt(params.get('id')) || 1;
  var product = window.ClothStore.getProduct(productId);

  if (!product) {
    product = window.ClothStore.products[0];
  }

  // Populate product details
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-price').textContent = '$ ' + product.price;
  document.getElementById('breadcrumb-name').textContent = product.name;
  document.getElementById('product-description').textContent = product.description;
  document.title = product.name + ' — Elegant Vogue';

  // Set main image placeholder color
  var mainPlaceholder = document.getElementById('main-placeholder');
  if (mainPlaceholder) {
    mainPlaceholder.style.background = product.color;
    mainPlaceholder.textContent = product.name.charAt(0);
  }

  // Size selector
  var selectedSize = 'S';
  var sizeSelector = document.getElementById('size-selector');

  // Rebuild size buttons from product data
  if (sizeSelector) {
    sizeSelector.innerHTML = '';
    product.sizes.forEach(function(size) {
      var btn = document.createElement('button');
      btn.className = 'size-selector__btn';
      btn.dataset.size = size;
      btn.textContent = size;
      if (size === selectedSize) btn.classList.add('active');
      sizeSelector.appendChild(btn);
    });

    sizeSelector.addEventListener('click', function(e) {
      var btn = e.target.closest('.size-selector__btn');
      if (!btn) return;
      sizeSelector.querySelectorAll('.size-selector__btn').forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      selectedSize = btn.dataset.size;
    });
  }

  // Quantity selector
  var quantity = 1;
  var qtyValue = document.getElementById('qty-value');
  var qtyMinus = document.getElementById('qty-minus');
  var qtyPlus = document.getElementById('qty-plus');

  if (qtyMinus) {
    qtyMinus.addEventListener('click', function() {
      if (quantity > 1) {
        quantity--;
        qtyValue.textContent = quantity;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener('click', function() {
      quantity++;
      qtyValue.textContent = quantity;
    });
  }

  // Add to cart
  var addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      window.ClothStore.addToCart(product, selectedSize, quantity);

      // Visual feedback
      var originalText = addBtn.textContent;
      addBtn.textContent = 'Added!';
      addBtn.style.background = 'var(--color-charcoal)';
      setTimeout(function() {
        addBtn.textContent = originalText;
        addBtn.style.background = '';
      }, 1500);
    });
  }

  // Thumbnail gallery
  var thumbs = document.querySelectorAll('.product-gallery__thumb');
  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      thumbs.forEach(function(t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      // In a real app this would swap the main image
      if (mainPlaceholder) {
        mainPlaceholder.style.background = thumb.style.background || product.color;
      }
    });
  });
});
