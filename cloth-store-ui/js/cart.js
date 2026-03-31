/* ==========================================================================
   Cart Module — localStorage-based cart state
   ========================================================================== */

(function() {
  'use strict';

  var STORAGE_KEY = 'clothstore_cart';

  // Product catalog
  var products = [
    {
      id: 1,
      name: 'Basic Slim Fit T-Shirt',
      price: 199,
      badge: 'New',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      color: 'linear-gradient(145deg, #d9d9d9 0%, #f5f5f5 100%)',
      description: 'A wardrobe essential crafted from premium cotton. This slim-fit t-shirt features a clean silhouette, ribbed crew neck, and a soft hand feel that only gets better with each wash.'
    },
    {
      id: 2,
      name: 'Full Sleeve Zipper',
      price: 349,
      badge: '',
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'linear-gradient(145deg, #1e1e1e 0%, #5d5d5d 100%)',
      description: 'A premium full-sleeve jacket with a modern zipper design. Crafted from durable fabric with a sleek finish for a polished, urban look.'
    },
    {
      id: 3,
      name: 'Cotton Crew Neck Sweater',
      price: 279,
      badge: 'New',
      sizes: ['XS', 'S', 'M', 'L'],
      color: 'linear-gradient(145deg, #eae8d9 0%, #dbdcce 100%)',
      description: 'Soft, breathable cotton sweater with a relaxed crew neck. The perfect layering piece for transitional weather.'
    },
    {
      id: 4,
      name: 'Linen Summer Dress',
      price: 450,
      badge: '',
      sizes: ['XS', 'S', 'M', 'L'],
      color: 'linear-gradient(145deg, #ebe7db 0%, #c8c8c8 100%)',
      description: 'Effortlessly elegant linen dress designed for warm-weather comfort. Features a flattering A-line silhouette and natural drape.'
    },
    {
      id: 5,
      name: 'Tailored Wool Blazer',
      price: 599,
      badge: '',
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'linear-gradient(145deg, #272727 0%, #787878 100%)',
      description: 'Impeccably tailored blazer in fine wool blend. Sharp shoulders, slim fit, and subtle details elevate any outfit.'
    },
    {
      id: 6,
      name: 'High-Waist Straight Pants',
      price: 320,
      badge: 'New',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      color: 'linear-gradient(145deg, #8a8a8a 0%, #dfdfdf 100%)',
      description: 'Clean-lined high-waist trousers with a straight leg. Versatile enough for office or weekend, crafted in a comfortable stretch fabric.'
    },
    {
      id: 7,
      name: 'Oversized Cotton Hoodie',
      price: 249,
      badge: '',
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'linear-gradient(145deg, #a2a2a2 0%, #f5f5f5 100%)',
      description: 'Relaxed-fit hoodie in heavyweight cotton fleece. Features a kangaroo pocket, ribbed cuffs, and a cozy brushed interior.'
    },
    {
      id: 8,
      name: 'Silk Blend Scarf',
      price: 129,
      badge: 'New',
      sizes: ['One Size'],
      color: 'linear-gradient(145deg, #dbdcce 0%, #eae8d9 100%)',
      description: 'Luxurious silk-blend scarf with a subtle sheen. Lightweight and versatile — drape, tie, or wrap for an instant style upgrade.'
    },
    {
      id: 9,
      name: 'Denim Jacket Classic',
      price: 389,
      badge: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      color: 'linear-gradient(145deg, #000d8a 0%, #5d5d5d 100%)',
      description: 'A timeless denim jacket in a rich indigo wash. Button front, chest pockets, and a relaxed fit that pairs with everything.'
    }
  ];

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addToCart(product, size, quantity) {
    var cart = getCart();
    var existing = cart.find(function(item) {
      return item.id === product.id && item.size === size;
    });

    if (existing) {
      existing.quantity += (quantity || 1);
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        size: size || 'M',
        quantity: quantity || 1,
        color: product.color
      });
    }

    saveCart(cart);
    updateCartBadge();
  }

  function removeFromCart(id) {
    var cart = getCart().filter(function(item) { return item.id !== id; });
    saveCart(cart);
    updateCartBadge();
  }

  function updateQuantity(id, qty) {
    var cart = getCart();
    if (qty <= 0) {
      cart = cart.filter(function(item) { return item.id !== id; });
    } else {
      var item = cart.find(function(i) { return i.id === id; });
      if (item) item.quantity = qty;
    }
    saveCart(cart);
    updateCartBadge();
  }

  function getCartCount() {
    return getCart().reduce(function(sum, item) { return sum + item.quantity; }, 0);
  }

  function getProduct(id) {
    return products.find(function(p) { return p.id === id; });
  }

  function updateCartBadge() {
    var count = getCartCount();
    var badges = document.querySelectorAll('#cart-count');
    badges.forEach(function(badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    });
  }

  // Expose API
  window.ClothStore = {
    products: products,
    getCart: getCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQuantity: updateQuantity,
    getCartCount: getCartCount,
    getProduct: getProduct,
    updateCartBadge: updateCartBadge
  };
})();
