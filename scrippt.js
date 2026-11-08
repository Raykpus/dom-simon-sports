

(function () {
  'use strict';

  var cart = [];                       // [{ name, price, qty }]
  var cartBadge = document.getElementById('cartCount');
  var cartButton = document.getElementById('cartButton');
  var cartDrawer = document.getElementById('cartDrawer');
  var cartOverlay = document.getElementById('cartOverlay');
  var cartItemsEl = document.getElementById('cartItems');
  var cartTotalEl = document.getElementById('cartTotal');
  var toast = document.getElementById('toast');
  var toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  function money(n) { return '$' + n.toFixed(2); }

  // ----- Cart pop-up: open / close -----
  function openCart() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('cartClose').focus();
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    cartButton.focus();
  }
  cartButton.addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  document.addEventListener('keydown', function (e) {
    if (!cartDrawer.classList.contains('open')) return;
    if (e.key === 'Escape') { closeCart(); return; }
    if (e.key === 'Tab') {                       // keep focus inside the pop-up
      var f = cartDrawer.querySelectorAll('button');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // ----- Cart pop-up: render the items -----
  function renderCart() {
    var totalQty = 0, totalPrice = 0;
    cartItemsEl.innerHTML = '';

    cart.forEach(function (item, i) {
      totalQty += item.qty;
      totalPrice += item.price * item.qty;

      var li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML =
        '<div><h3></h3><span class="unit"></span></div>' +
        '<span class="line-total"></span>' +
        '<div class="qty"><button type="button" data-act="dec" aria-label="Decrease quantity">&minus;</button>' +
        '<span></span><button type="button" data-act="inc" aria-label="Increase quantity">+</button></div>' +
        '<button type="button" class="remove-item" data-act="remove">Remove</button>';
      li.querySelector('h3').textContent = item.name;
      li.querySelector('.unit').textContent = money(item.price) + ' each';
      li.querySelector('.line-total').textContent = money(item.price * item.qty);
      li.querySelector('.qty span').textContent = item.qty;
      li.dataset.index = i;
      cartItemsEl.appendChild(li);
    });

    cartTotalEl.textContent = money(totalPrice);
    cartDrawer.classList.toggle('is-empty', cart.length === 0);

    cartBadge.textContent = totalQty;
    cartButton.setAttribute('aria-label', 'Shopping cart, ' + totalQty + (totalQty === 1 ? ' item' : ' items'));
    cartBadge.classList.remove('bump');
    void cartBadge.offsetWidth;                  // restart animation
    cartBadge.classList.add('bump');
  }

  // + / - / Remove buttons inside the pop-up
  cartItemsEl.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-act]');
    if (!btn) return;
    var i = Number(btn.closest('.cart-item').dataset.index);
    var act = btn.dataset.act;
    if (act === 'inc') cart[i].qty++;
    if (act === 'dec') cart[i].qty--;
    if (act === 'remove' || cart[i].qty < 1) cart.splice(i, 1);
    renderCart();
  });

  document.getElementById('clearCart').addEventListener('click', function () {
    cart = [];
    renderCart();
  });
  document.getElementById('checkoutBtn').addEventListener('click', function () {
    showToast('Checkout is a demo. Connect a payment provider to go live.');
  });

  // ----- Add to cart (used by trending cards AND search results) -----
  function addToCart(name, price) {
    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) { existing.qty++; } else { cart.push({ name: name, price: price, qty: 1 }); }
    renderCart();
    showToast(name + ' added to cart');
  }

  document.querySelectorAll('.add-to-cart').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.product-card');
      addToCart(card.querySelector('h3').textContent, parseFloat(card.dataset.price));
    });
  });

  renderCart();

  // Mobile nav + search toggles
  function bindToggle(buttonId, targetId, openLabel, closeLabel) {
    var button = document.getElementById(buttonId);
    var target = document.getElementById(targetId);
    button.addEventListener('click', function () {
      var open = target.classList.toggle('open');
      button.setAttribute('aria-expanded', open);
      if (openLabel) button.setAttribute('aria-label', open ? closeLabel : openLabel);
      if (open && targetId === 'searchForm') document.getElementById('searchInput').focus();
    });
    return { button: button, target: target };
  }
  var nav = bindToggle('menuToggle', 'mainNav', 'Open menu', 'Close menu');
  bindToggle('searchToggle', 'searchForm');

  nav.target.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.target.classList.remove('open');
      nav.button.setAttribute('aria-expanded', 'false');
      nav.button.setAttribute('aria-label', 'Open menu');
    }
  });

    // =====================================================
  // Product search
  // =====================================================
  // Every product the store sells. Add new items here and search picks them up.
  var PRODUCTS = [
    { name: 'AeroFit Training Tee',            price: 34,  cat: 'Activewear',            tags: 'shirt top t-shirt tshirt gym workout men women',        h: 210, r: 4,   n: 148 },
    { name: 'Flex Seamless Leggings',          price: 48,  cat: 'Activewear',            tags: 'tights pants yoga gym women',                            h: 300, r: 4.5, n: 203 },
    { name: 'Storm Shell Running Jacket',      price: 96,  cat: 'Activewear',            tags: 'jacket rain windbreaker coat run men women',             h: 195, r: 4.5, n: 87 },
    { name: 'Pulse Compression Shorts',        price: 29,  cat: 'Activewear',            tags: 'shorts gym training men',                                h: 170, r: 4,   n: 64 },
    { name: 'Court Dry Hoodie',                price: 64,  cat: 'Activewear',            tags: 'hoodie sweatshirt warm up men women',                    h: 25,  r: 4.5, n: 121 },
    { name: 'Velocity Pro Running Shoes',      price: 129, cat: 'Performance Footwear',  tags: 'shoes sneakers trainers run running jogging',            h: 18,  r: 4.5, n: 212 },
    { name: 'Apex Court Basketball Shoes',     price: 149, cat: 'Performance Footwear',  tags: 'shoes sneakers basketball court high top',               h: 350, r: 4.5, n: 96 },
    { name: 'TurfTrack Football Boots',        price: 99,  cat: 'Performance Footwear',  tags: 'boots cleats soccer football studs shoes',               h: 140, r: 4,   n: 133 },
    { name: 'Stride Everyday Trainers',        price: 84,  cat: 'Performance Footwear',  tags: 'shoes sneakers trainers casual gym walking',             h: 60,  r: 4,   n: 178 },
    { name: 'Iron Grip Adjustable Dumbbells',  price: 219, cat: 'Fitness & Gym Gear',    tags: 'weights dumbbell strength lifting home gym',             h: 0,   r: 5,   n: 89 },
    { name: 'FlexCore Yoga Mat',               price: 28,  cat: 'Fitness & Gym Gear',    tags: 'yoga mat pilates stretching exercise floor',             h: 270, r: 4.5, n: 164 },
    { name: 'Power Resistance Bands Set',      price: 24,  cat: 'Fitness & Gym Gear',    tags: 'bands resistance workout stretching strength home gym',  h: 330, r: 4.5, n: 255 },
    { name: 'Speed Jump Rope',                 price: 16,  cat: 'Fitness & Gym Gear',    tags: 'skipping rope cardio boxing workout',                    h: 45,  r: 4,   n: 72 },
    { name: 'Forge Kettlebell 16kg',           price: 45,  cat: 'Fitness & Gym Gear',    tags: 'kettlebell weights strength lifting gym',                h: 10,  r: 4.5, n: 58 },
    { name: 'Pitch Master Match Football',     price: 42,  cat: 'Outdoor & Team Sports', tags: 'ball soccer football match team pitch',                  h: 140, r: 4.5, n: 301 },
    { name: 'Slam Official Basketball',        price: 39,  cat: 'Outdoor & Team Sports', tags: 'ball basketball court indoor outdoor team',              h: 24,  r: 4.5, n: 142 },
    { name: 'Summit Trail Backpack 30L',       price: 78,  cat: 'Outdoor & Team Sports', tags: 'bag hiking trail camping rucksack outdoor',              h: 30,  r: 4,   n: 76 },
    { name: 'Trailblazer Water Bottle 1L',     price: 19,  cat: 'Outdoor & Team Sports', tags: 'bottle hydration flask hiking gym outdoor',              h: 190, r: 4,   n: 210 },
    { name: 'Grip Pro Tennis Racket',          price: 89,  cat: 'Outdoor & Team Sports', tags: 'tennis racquet racket court sport',                      h: 100, r: 4,   n: 54 }
  ];

  var searchForm = document.getElementById('searchForm');
  var searchInput = document.getElementById('searchInput');
  var suggestionsEl = document.getElementById('searchSuggestions');
  var resultsSection = document.getElementById('searchResultsSection');
  var resultsTitle = document.getElementById('searchResultsTitle');
  var resultsCount = document.getElementById('searchResultsCount');
  var searchGrid = document.getElementById('searchGrid');
  var searchEmpty = document.getElementById('searchEmpty');
  var activeIndex = -1;

  function escapeRegExp(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // Every word you type must match the START of a word in the name, category or tags.
  // "shoe" finds "shoes", "yoga mat" finds the yoga mat, "women" does not match "men".
  function findProducts(query) {
    var tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return PRODUCTS.map(function (p) {
      var name = p.name.toLowerCase();
      var haystack = name + ' ' + p.cat.toLowerCase() + ' ' + p.tags;
      var score = 0;
      for (var i = 0; i < tokens.length; i++) {
        var t = tokens[i];
        var alt = t.length > 3 ? t.replace(/s$/, '') : t;   // simple plural handling
        var re = new RegExp('\\b(' + escapeRegExp(t) + '|' + escapeRegExp(alt) + ')');
        if (!re.test(haystack)) return null;
        score += re.test(name) ? 2 : 1;                     // name matches rank higher
      }
      return { product: p, score: score };
    }).filter(Boolean).sort(function (a, b) {
      return b.score - a.score || a.product.name.localeCompare(b.product.name);
    }).map(function (x) { return x.product; });
  }

  // ----- Dropdown suggestions -----
  function openSuggestions() {
    suggestionsEl.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  }
  function closeSuggestions() {
    suggestionsEl.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }

  function renderSuggestions() {
    var query = searchInput.value.trim();
    suggestionsEl.innerHTML = '';
    activeIndex = -1;
    if (!query) { closeSuggestions(); return; }

    var matches = findProducts(query);
    if (!matches.length) {
      var empty = document.createElement('div');
      empty.className = 'suggestion-empty';
      empty.textContent = 'No products found for \u201C' + query + '\u201D. Try \u201Cshoes\u201D, \u201Cyoga\u201D or \u201Cfootball\u201D.';
      suggestionsEl.appendChild(empty);
    } else {
      matches.slice(0, 5).forEach(function (p) {
        var row = document.createElement('button');
        row.type = 'button';
        row.className = 'suggestion';
        row.setAttribute('role', 'option');
        row.dataset.name = p.name;
        row.innerHTML = '<span class="thumb"></span><span class="info"><strong></strong><small></small></span><span class="suggestion-price"></span>';
        var thumb = row.querySelector('.thumb');
        thumb.style.setProperty('--h', p.h);
        thumb.textContent = p.name.charAt(0);
        row.querySelector('strong').textContent = p.name;
        row.querySelector('small').textContent = p.cat;
        row.querySelector('.suggestion-price').textContent = money(p.price);
        suggestionsEl.appendChild(row);
      });
      var all = document.createElement('button');
      all.type = 'button';
      all.className = 'suggestion suggestion-all';
      all.setAttribute('role', 'option');
      all.dataset.all = '1';
      all.textContent = 'See all ' + matches.length + (matches.length === 1 ? ' result' : ' results');
      suggestionsEl.appendChild(all);
    }
    openSuggestions();
  }

  function setActive(index) {
    var options = suggestionsEl.querySelectorAll('.suggestion');
    if (!options.length) return;
    activeIndex = (index + options.length) % options.length;
    options.forEach(function (o, i) { o.classList.toggle('active', i === activeIndex); });
    options[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  // ----- Full results section -----
  function buildCard(p) {
    var card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.name = p.name;
    card.dataset.price = p.price;
    card.innerHTML =
      '<div class="product-media" role="img" aria-label="Product image placeholder"></div>' +
      '<div class="product-body"><h3></h3>' +
      '<div class="rating-row"><span class="stars" role="img">\u2605\u2605\u2605\u2605\u2605</span><span class="reviews"></span></div>' +
      '<p class="category-label"></p>' +
      '<div class="price-row"><span class="price"></span><button class="btn btn-primary" type="button">Add to Cart</button></div></div>';
    var media = card.querySelector('.product-media');
    media.style.setProperty('--h', p.h);
    media.textContent = p.name.charAt(0);
    card.querySelector('h3').textContent = p.name;
    var stars = card.querySelector('.stars');
    stars.style.setProperty('--r', p.r);
    stars.setAttribute('aria-label', p.r + ' out of 5 stars');
    card.querySelector('.reviews').textContent = '(' + p.n + ')';
    card.querySelector('.category-label').textContent = p.cat;
    card.querySelector('.price').textContent = money(p.price);
    return card;
  }

  function hideResults() {
    resultsSection.hidden = true;
    searchGrid.innerHTML = '';
  }

  function showResults(query) {
    query = query.trim();
    closeSuggestions();
    if (!query) { hideResults(); return; }

    var matches = findProducts(query);
    resultsTitle.textContent = 'Results for \u201C' + query + '\u201D';
    resultsCount.textContent = matches.length + (matches.length === 1 ? ' product found' : ' products found');
    searchGrid.innerHTML = '';
    matches.forEach(function (p) { searchGrid.appendChild(buildCard(p)); });
    searchEmpty.hidden = matches.length !== 0;
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  // ----- Events -----
  searchInput.addEventListener('input', renderSuggestions);
  searchInput.addEventListener('focus', function () { if (searchInput.value.trim()) renderSuggestions(); });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (suggestionsEl.hidden) renderSuggestions(); setActive(activeIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIndex - 1); }
    else if (e.key === 'Escape') { closeSuggestions(); }
  });

  // Enter key / search submit
  searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var options = suggestionsEl.querySelectorAll('.suggestion');
    if (activeIndex >= 0 && options[activeIndex]) { options[activeIndex].click(); }
    else { showResults(searchInput.value); }
  });

  // Click a suggestion
  suggestionsEl.addEventListener('click', function (e) {
    var row = e.target.closest('.suggestion');
    if (!row) return;
    if (row.dataset.all) { showResults(searchInput.value); }
    else { searchInput.value = row.dataset.name; showResults(row.dataset.name); }
  });

  // Add to Cart inside search results
  searchGrid.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-primary');
    if (!btn) return;
    var card = btn.closest('.product-card');
    addToCart(card.dataset.name, parseFloat(card.dataset.price));
  });

  document.getElementById('clearSearch').addEventListener('click', function () {
    searchInput.value = '';
    hideResults();
    searchInput.focus();
  });

  // Click anywhere outside the search bar closes the dropdown
  document.addEventListener('click', function (e) {
    if (!searchForm.contains(e.target)) closeSuggestions();
  });

  // Newsletter validation
  var form = document.getElementById('newsletterForm');
  var email = document.getElementById('newsletterEmail');
  var msg = document.getElementById('newsletterMsg');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var value = email.value.trim();
    msg.classList.remove('error');
    if (!value) {
      msg.textContent = 'Enter your email address to subscribe.';
      msg.classList.add('error');
      email.focus();
    } else if (!emailPattern.test(value)) {
      msg.textContent = 'That email looks incomplete. Use a format like name@example.com.';
      msg.classList.add('error');
      email.focus();
    } else {
      msg.textContent = 'You are subscribed. Watch your inbox for exclusive deals.';
      form.reset();
      showToast('Subscribed to the Dom Simon newsletter');
    }
  });
    // 3D "Why shop with us" cards: tilt on hover + flip-in on scroll
  (function () {
    var grid = document.querySelector('.feature-grid');
    var cards = grid.querySelectorAll('.feature');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduce) {
      cards.forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          if (e.pointerType === 'touch') return;
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--ry', (x * 16) + 'deg');
          card.style.setProperty('--rx', (-y * 16) + 'deg');
        });
        card.addEventListener('pointerleave', function () {
          card.style.setProperty('--rx', '0deg');
          card.style.setProperty('--ry', '0deg');
        });
      });
    }

    if ('IntersectionObserver' in window && !reduce) {
      grid.classList.add('reveal-ready');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var i = Array.prototype.indexOf.call(cards, entry.target);
          setTimeout(function () { entry.target.classList.add('in'); }, i * 130);
          io.unobserve(entry.target);
        });
      }, { threshold: 0.25 });
      cards.forEach(function (c) { io.observe(c); });
    }
  })();
})();
