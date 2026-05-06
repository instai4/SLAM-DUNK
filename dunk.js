// ─── DATA ───────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 0, name: 'Official Game Ball', series: 'Classic Series', price: 34.99, color: '#FF5500', seam: '#1a0a00', label: 'SPALDING', emissive: 0x220a00, bgHex: 0xff5500, envColor: '#220a00', features: ['Full Grain Leather', 'NBA Official'], court: 'wood' },
  { id: 1, name: 'Pro Tournament', series: 'Elite Series', price: 59.99, color: '#1a4aff', seam: '#000c33', label: 'WILSON', emissive: 0x000a22, bgHex: 0x1a4aff, envColor: '#000a22', features: ['Microfiber Cover', 'Tournament Spec'], court: 'wood' },
  { id: 2, name: 'Street Slam Rider', series: 'Street Series', price: 24.99, color: '#1e1e1e', seam: '#ff5500', label: 'STREET', emissive: 0x0a0a0a, bgHex: 0x222222, envColor: '#1a1a1a', features: ['All-Surface Grip', 'Scuff Resistant'], court: 'asphalt' },
  { id: 3, name: 'Midnight Edition', series: 'Signature Series', price: 89.99, color: '#8B1A1A', seam: '#ffcc00', label: 'CUSTOM', emissive: 0x1a0000, bgHex: 0x8B1A1A, envColor: '#1a0000', features: ['Gold Seams', 'Collector Drop'], court: 'wood' },
  { id: 4, name: 'Arctic Frost', series: 'Frost Series', price: 49.99, color: '#e0f7fa', seam: '#006064', label: 'ARCTIC', emissive: 0x001111, bgHex: 0xe0f7fa, envColor: '#001a1a', features: ['Thermal Grip', 'Frost Vein Texture'], court: 'asphalt' },
  { id: 5, name: 'Lava Core', series: 'Magma Series', price: 54.99, color: '#212121', seam: '#ff3d00', label: 'LAVA', emissive: 0x441100, bgHex: 0x212121, envColor: '#220500', features: ['Heat Reactive', 'Magma Glow'], court: 'asphalt' },
  { id: 6, name: 'Gold Standard', series: 'Luxury Series', price: 99.99, color: '#ffd700', seam: '#000000', label: 'LUXURY', emissive: 0x221100, bgHex: 0xffd700, envColor: '#1a1400', features: ['24K Metallic', 'Premium Display'], court: 'wood' },
  { id: 7, name: 'Ocean Deep', series: 'Marine Series', price: 39.99, color: '#004d40', seam: '#e0f2f1', label: 'OCEAN', emissive: 0x001111, bgHex: 0x004d40, envColor: '#000d0d', features: ['Hydro-Grip Tech', 'Deep Sea Teal'], court: 'asphalt' },
  { id: 8, name: 'Candy Rush', series: 'Pop Series', price: 44.99, color: '#f06292', seam: '#fff176', label: 'CANDY', emissive: 0x110011, bgHex: 0xf06292, envColor: '#1a000d', features: ['Hyper Bounce', 'Pop Aesthetics'], court: 'wood' },
  { id: 9, name: 'Quantum Pro', series: 'Elite Pro Series', price: 129.99, color: '#6200ea', seam: '#ffab00', label: 'QUANTUM', emissive: 0x1a0033, bgHex: 0x6200ea, envColor: '#2a0047', features: ['Advanced Polymer', 'Precision Grip'], court: 'wood' },
];

// ─── STATE ───────────────────────────────────────────────────────────────────
let cur = 0, prev = 0;
let cart = [], wish = new Set();
let ballScale = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // target scales
let ballY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let ballScaleCur = [1, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001, 0.001];
let isTransitioning = false;

// ─── CURSOR ──────────────────────────────────────────────────────────────────
let mx = 0, my = 0, rx = 0, ry = 0;
const curEl = document.getElementById('cur'), ringEl = document.getElementById('cur-ring');
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function aCursor() { rx += (mx - rx) * .12; ry += (my - ry) * .12; curEl.style.left = mx + 'px'; curEl.style.top = my + 'px'; ringEl.style.left = rx + 'px'; ringEl.style.top = ry + 'px'; requestAnimationFrame(aCursor); })();
document.querySelectorAll('button,a,.dot,.color-dot,.size-opt').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

// ─── TOAST ───────────────────────────────────────────────────────────────────
let toastId = 0;
function showToast(type, title, sub) {
  const w = document.getElementById('toast-wrap');
  const id = 't' + (toastId++);
  const icons = { cart: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`, wish: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`, remove: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`, info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` };
  const ic = icons[type] || icons.info;
  const cls = type === 'cart' ? 'cart' : type === 'wish' ? 'wish' : type === 'remove' ? 'remove' : 'cart';
  const el = document.createElement('div');
  el.className = 'toast'; el.id = id;
  el.innerHTML = `<div class="toast-icon ${cls}">${ic}</div><div class="toast-text"><div class="toast-title">${title}</div><div class="toast-sub">${sub}</div></div>`;
  w.appendChild(el);
  setTimeout(() => el.classList.add('show'), 30);
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3200);
}

// ─── CART ─────────────────────────────────────────────────────────────────────
function addToCart(id) {
  const p = PRODUCTS[id];
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty++; } else { cart.push({ ...p, qty: 1 }); }
  updateCartUI();
  triggerBurst(); // Visual energy feedback
  showToast('cart', 'Added to Cart', p.name + ' — $' + p.price.toFixed(2));
}

function triggerBurst() {
  const cartBtn = document.getElementById('cartBtn');
  const target = cartBtn.getBoundingClientRect();
  const startX = innerWidth / 2;
  const startY = innerHeight / 2;

  for (let i = 0; i < 12; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
                    position: fixed;
                    left: ${startX}px;
                    top: ${startY}px;
                    width: 8px;
                    height: 8px;
                    background: var(--orange);
                    border-radius: 50%;
                    box-shadow: 0 0 15px var(--orange);
                    z-index: 9999;
                    pointer-events: none;
                    transition: all ${0.6 + Math.random() * 0.4}s cubic-bezier(0.4, 0, 0.2, 1);
                `;
    document.body.appendChild(el);

    // Animate to cart icon
    requestAnimationFrame(() => {
      const jitterX = (Math.random() - 0.5) * 100;
      const jitterY = (Math.random() - 0.5) * 100;
      el.style.left = (target.left + target.width / 2 + jitterX) + 'px';
      el.style.top = (target.top + target.height / 2 + jitterY) + 'px';
      el.style.opacity = '0';
      el.style.transform = 'scale(0.2)';
    });

    setTimeout(() => el.remove(), 1000);
  }

  // Pulse the cart icon
  cartBtn.style.transform = 'scale(1.3)';
  setTimeout(() => cartBtn.style.transform = 'scale(1)', 300);
}
function removeFromCart(id) {
  const p = PRODUCTS[id];
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
  showToast('remove', 'Removed', p.name + ' removed from cart');
}
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}
function getBallSVG(color) {
  return `
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="${color}"/>
                    <path d="M12 0a12 12 0 0 1 0 24" stroke="rgba(0,0,0,0.2)" stroke-width="0.8" fill="none"/>
                    <path d="M0 12h24" stroke="rgba(0,0,0,0.2)" stroke-width="0.8" fill="none"/>
                    <path d="M3 5.5a11 11 0 0 1 18 13" stroke="rgba(0,0,0,0.2)" stroke-width="0.8" fill="none"/>
                    <path d="M3 18.5a11 11 0 0 0 18-13" stroke="rgba(0,0,0,0.2)" stroke-width="0.8" fill="none"/>
                    <circle cx="9" cy="8" r="4" fill="white" fill-opacity="0.1"/>
                </svg>
            `;
}

function updateCartUI() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-count').classList.toggle('show', count > 0);
  document.getElementById('cart-badge').textContent = count;
  document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
  const ci = document.getElementById('cartItems');
  if (cart.length === 0) { ci.innerHTML = '<div class="empty-cart" id="emptyCart"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><p>Your cart is empty</p></div>'; return; }
  ci.innerHTML = cart.map(i => `
                <div class="cart-item">
                    <div class="cart-item-color">${getBallSVG(i.color)}</div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${i.name}</div>
                        <div class="cart-item-meta">${i.series}</div>
                        <div class="cart-qty">
                            <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
                            <span class="qty-num">${i.qty}</span>
                            <button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
                        <div class="cart-item-price">$${(i.price * i.qty).toFixed(2)}</div>
                        <button class="cart-item-remove" onclick="removeFromCart(${i.id})">✕</button>
                    </div>
                </div>
            `).join('');
}
function openCart() { document.getElementById('cart-drawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('show'); }
function closeCart() { document.getElementById('cart-drawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('show'); }
function checkout() { if (cart.length === 0) { showToast('info', 'Cart Empty', 'Add items before checking out'); return; } showToast('cart', 'Order Placed!', 'Thank you for your purchase 🏀'); cart = []; updateCartUI(); closeCart(); }

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
function toggleWish(id) {
  const p = PRODUCTS[id];
  const btn = document.getElementById('wish-' + id);
  if (wish.has(id)) {
    wish.delete(id);
    btn.classList.remove('wish-active');
    showToast('remove', 'Removed from Wishlist', p.name);
  } else {
    wish.add(id);
    btn.classList.add('wish-active');
    showToast('wish', 'Saved to Wishlist', p.name);
  }
  updateWishUI();
}
function updateWishUI() {
  const wc = document.getElementById('wishCount');
  wc.textContent = wish.size;
  wc.classList.toggle('show', wish.size > 0);
  const wi = document.getElementById('wishItems');
  if (wish.size === 0) { wi.innerHTML = '<div class="empty-cart"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg><p>No items saved yet</p></div>'; return; }
  wi.innerHTML = [...wish].map(id => {
    const p = PRODUCTS[id];
    return `
                    <div class="wish-item">
                        <div class="wish-ball">${getBallSVG(p.color)}</div>
                        <div class="wish-info">
                            <div class="wish-name">${p.name}</div>
                            <div class="wish-price">$${p.price.toFixed(2)}</div>
                        </div>
                        <button class="wish-remove" onclick="toggleWish(${id})">✕</button>
                    </div>
                `;
  }).join('');
}
function openWish() { document.getElementById('wish-panel').classList.add('open'); document.getElementById('wishOverlay').classList.add('show'); }
function closeWish() { document.getElementById('wish-panel').classList.remove('open'); document.getElementById('wishOverlay').classList.remove('show'); }

// ─── SHARE ────────────────────────────────────────────────────────────────────
function shareProduct(id) {
  const p = PRODUCTS[id];
  if (navigator.share) { navigator.share({ title: p.name, text: 'Check out ' + p.name + ' at Slam Dunk!', url: window.location.href }); }
  else { navigator.clipboard.writeText(window.location.href).then(() => showToast('info', 'Link Copied!', p.name + ' link copied to clipboard')); }
}


// ─── SEARCH ───────────────────────────────────────────────────────────────────
function toggleSearch() {
  const sb = document.getElementById('searchBar');
  const isOpen = sb.classList.toggle('open');
  if (isOpen) document.getElementById('searchInput').focus();
}
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Escape') toggleSearch();
  if (e.key === 'Enter') {
    const v = e.target.value.trim();
    if (v) showToast('info', 'Searching…', '"' + v + '" — feature coming soon');
    toggleSearch();
  }
});

// ─── SIZE PICKERS ────────────────────────────────────────────────────────────
document.querySelectorAll('.size-picker').forEach(picker => {
  picker.querySelectorAll('.size-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      picker.querySelectorAll('.size-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast('info', 'Size Selected', 'Size ' + btn.dataset.size + ' selected');
    });
  });
});

// ─── DOTS & COUNTER ──────────────────────────────────────────────────────────
const dotsWrap = document.getElementById('dots');
PRODUCTS.forEach((_, i) => { const d = document.createElement('div'); d.className = 'dot' + (i === 0 ? ' active' : ''); d.addEventListener('click', () => setSlide(i)); dotsWrap.appendChild(d); });
function updateDots() { document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === cur)); document.getElementById('pgCur').textContent = String(cur + 1).padStart(2, '0'); }

// ─── SLIDE LOGIC ─────────────────────────────────────────────────────────────
function setSlide(idx) {
  if (idx === cur) return;
  prev = cur; cur = idx;
  document.querySelector('.sl.active').classList.remove('active');
  document.getElementById('sl-' + cur).classList.add('active');
  updateDots();

  // bg text swap
  const bg = document.getElementById('bgTxt');
  bg.style.transition = 'opacity .25s ease,transform .25s ease';
  bg.style.opacity = '0'; bg.style.transform = 'translateY(24px) scale(.95)';
  setTimeout(() => {
    bg.textContent = PRODUCTS[cur].label;
    bg.style.transform = 'translateY(0) scale(1)'; bg.style.opacity = '1';
  }, 280);

  // ball transition: discrete resets removed for continuous scroll scaling
  // state update is enough, animation loop handles the rest

  // Update Tooltips
  const t1 = document.getElementById('tooltip-1'), t2 = document.getElementById('tooltip-2');
  t1.classList.remove('show'); t2.classList.remove('show');
  // Tooltips appear after the ball has started growing (synchronized with lerp)
  setTimeout(() => {
    document.getElementById('tt-text-1').textContent = PRODUCTS[cur].features[0];
    document.getElementById('tt-text-2').textContent = PRODUCTS[cur].features[1];
    t1.classList.add('show'); t2.classList.add('show');
  }, 600); // Increased delay for better sync with smooth scroll lerp


  // Update Vignette Color
  document.documentElement.style.setProperty('--vig-color', PRODUCTS[cur].envColor);

  // Sync customizer with current ball if it's the custom one
  if (cur === 3) {
    // optional: auto-open or sync state
  }
}

// ─── CUSTOMIZER LOGIC ────────────────────────────────────────────────────────
let customState = { base: '#FF5500', seam: '#1a0a00', pattern: 'classic', text: '' };
const COLORS = ['#FF5500', '#1a4aff', '#1e1e1e', '#8B1A1A', '#e0f7fa', '#212121', '#ffd700', '#004d40', '#f06292', '#ffffff'];
const SEAMS = ['#1a0a00', '#ffffff', '#ff5500', '#ffcc00', '#006064'];

function initCustomizer() {
  const bc = document.getElementById('baseColors');
  bc.innerHTML = COLORS.map(c => `<div class="swatch" style="background:${c}" onclick="setCustomBase('${c}', this)"></div>`).join('');
  const sc = document.getElementById('seamColors');
  sc.innerHTML = SEAMS.map(c => `<div class="swatch" style="background:${c}" onclick="setCustomSeam('${c}', this)"></div>`).join('');
}
initCustomizer();

function openCustom() { document.getElementById('custom-drawer').classList.add('open'); document.getElementById('customOverlay').classList.add('show'); }
function closeCustom() { document.getElementById('custom-drawer').classList.remove('open'); document.getElementById('customOverlay').classList.remove('show'); }

function updateCustomBall() {
  const ball = balls[3]; // We use Midnight Edition (idx 3) as our live preview target
  const tex = makeTex(customState.pattern === 'classic' ? 0 : (customState.pattern === 'camo' ? 2 : (customState.pattern === 'marble' ? 4 : 5)), customState.base, customState.seam);

  if (customState.text) {
    const ctx = tex.image.getContext('2d');
    ctx.font = 'bold 80px "Bebas Neue"';
    ctx.fillStyle = customState.seam;
    ctx.textAlign = 'center';
    ctx.fillText(customState.text.toUpperCase(), 512, 420);
    tex.needsUpdate = true;
  }

  ball.material.map = tex;
  ball.material.needsUpdate = true;

  // Navigate to custom ball
  const stage = document.getElementById('stage');
  const stH = stage.offsetHeight - innerHeight;
  window.scrollTo({ top: (3 / (PRODUCTS.length - 1)) * stH, behavior: 'smooth' });
}

function setCustomBase(c, el) {
  customState.base = c;
  document.querySelectorAll('#baseColors .swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  updateCustomBall();
}
function setCustomSeam(c, el) {
  customState.seam = c;
  document.querySelectorAll('#seamColors .swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  updateCustomBall();
}
function setPattern(p, el) {
  customState.pattern = p;
  document.querySelectorAll('.pattern-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  updateCustomBall();
}
function setEngraving(t) { customState.text = t; updateCustomBall(); }

function addCustomToCart() {
  const p = { ...PRODUCTS[3], name: 'Custom ' + (customState.text || 'Edition'), color: customState.base, price: 129.99 };
  cart.push({ ...p, qty: 1 });
  updateCartUI();
  triggerBurst();
  closeCustom();
  showToast('cart', 'Custom Build Added', p.name);
}


window.goSlide = function (d) {
  const nextIdx = Math.max(0, Math.min(PRODUCTS.length - 1, cur + d));
  const stage = document.getElementById('stage');
  if (!stage) return;
  const stH = stage.offsetHeight - innerHeight;
  const targetY = (nextIdx / (PRODUCTS.length - 1)) * stH;
  window.scrollTo({ top: targetY, behavior: 'smooth' });
};
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goSlide(1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goSlide(-1);
});

// ─── THREE.JS ────────────────────────────────────────────────────────────────
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
camera.position.set(0, 0, 5);
function resize() { const w = canvas.clientWidth, h = canvas.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.position.z = w < 768 ? 7.5 : 5; camera.updateProjectionMatrix(); }
resize(); window.addEventListener('resize', resize);

// Lighting
const amb = new THREE.AmbientLight(0xffffff, .25); scene.add(amb);
const kl = new THREE.DirectionalLight(0xffffff, 2.8); kl.position.set(3, 5, 3); kl.castShadow = true; scene.add(kl);
const rl = new THREE.DirectionalLight(0xff6622, .9); rl.position.set(-4, 0, -3); scene.add(rl);
const envLight = new THREE.PointLight(0x4488ff, .5, 20); envLight.position.set(-3, 2, 2); scene.add(envLight);

function makeTex(id, color, seam) {
  const S = 1024, c = document.createElement('canvas'); c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = color; ctx.fillRect(0, 0, S, S);

  // ─── UNIQUE PATTERNS ───
  if (id === 0 || id === 1) { // Standard Pebbles
    for (let i = 0; i < 25000; i++) {
      const x = Math.random() * S, y = Math.random() * S, r = Math.random() * 2 + .5;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * .15 + .05})`; ctx.fill();
    }
  } else if (id === 2) { // Street - Gritty Camo/Grunge
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * .05})`;
      ctx.beginPath(); ctx.arc(Math.random() * S, Math.random() * S, Math.random() * 40 + 10, 0, 7); ctx.fill();
    }
    for (let i = 0; i < 30000; i++) {
      const x = Math.random() * S, y = Math.random() * S;
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * .3})`; ctx.fillRect(x, y, 1.5, 1.5);
    }
  } else if (id === 3) { // Midnight - Luxury Marble Swirl
    for (let i = 0; i < 15; i++) {
      const g = ctx.createLinearGradient(Math.random() * S, 0, Math.random() * S, S);
      g.addColorStop(0, 'transparent'); g.addColorStop(.5, `rgba(255,200,0,${Math.random() * .15})`); g.addColorStop(1, 'transparent');
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(Math.random() * S, Math.random() * S, S, S * .2, Math.random() * 7, 0, 7); ctx.fill();
    }
  } else if (id === 4) { // Arctic - Frost Veins
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1;
    for (let i = 0; i < 100; i++) {
      let x = Math.random() * S, y = Math.random() * S;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let j = 0; j < 10; j++) {
        x += (Math.random() - .5) * 60; y += (Math.random() - .5) * 60;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else if (id === 5) { // Lava - Cracked Earth
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = '#ff4400'; ctx.lineWidth = 3;
    for (let i = 0; i < 60; i++) {
      let x = Math.random() * S, y = Math.random() * S;
      ctx.beginPath(); ctx.moveTo(x, y);
      for (let j = 0; j < 8; j++) {
        x += (Math.random() - .5) * 150; y += (Math.random() - .5) * 150;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 15; ctx.shadowColor = '#ff2200'; ctx.stroke(); ctx.shadowBlur = 0;
    }
  } else if (id === 6) { // Gold - Geometric Luxury
    ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 2;
    for (let i = 0; i < S; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(S, i); ctx.stroke();
    }
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * .2})`;
      ctx.fillRect(Math.random() * S, Math.random() * S, 30, 30);
    }
  } else if (id === 7) { // Ocean - Waves/Ripples
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 15;
    for (let i = -100; i < S + 100; i += 40) {
      ctx.beginPath();
      for (let j = 0; j < S; j += 10) {
        ctx.lineTo(j, i + Math.sin(j * 0.02) * 20);
      }
      ctx.stroke();
    }
  } else if (id === 8) { // Candy - Polka Dots
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * .4})`;
      ctx.beginPath(); ctx.arc(Math.random() * S, Math.random() * S, Math.random() * 15 + 5, 0, 7); ctx.fill();
    }
  }

  // ─── SEAMS ───
  ctx.strokeStyle = seam; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.moveTo(S / 2, 0); ctx.bezierCurveTo(S / 2 - 90, S / 4, S / 2 + 90, S * 3 / 4, S / 2, S); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, S / 2); ctx.bezierCurveTo(S / 4, S / 2 - 90, S * 3 / 4, S / 2 + 90, S, S / 2); ctx.stroke();
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, S / 2); ctx.bezierCurveTo(S * .25, S * .15, S * .75, S * .15, S, S / 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, S / 2); ctx.bezierCurveTo(S * .25, S * .85, S * .75, S * .85, S, S / 2); ctx.stroke();

  // ─── HIGHLIGHT ───
  const g = ctx.createRadialGradient(S * .35, S * .28, 0, S * .35, S * .28, S * .55);
  g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(.4, 'rgba(255,255,255,.02)'); g.addColorStop(1, 'rgba(0,0,0,.15)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
  return new THREE.CanvasTexture(c);
}
function makeCourtTex(type) {
  const S = 1024, c = document.createElement('canvas'); c.width = c.height = S; const ctx = c.getContext('2d');
  if (type === 'wood') {
    ctx.fillStyle = '#2a1a0a'; ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < S; i += 60) {
      ctx.fillStyle = i % 120 === 0 ? '#3a2a1a' : '#2a1a0a';
      ctx.fillRect(0, i, S, 60);
      ctx.strokeStyle = '#1a0a00'; ctx.lineWidth = 2; ctx.strokeRect(0, i, S, 60);
      for (let j = 0; j < 10; j++) {
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        ctx.fillRect(Math.random() * S, i, Math.random() * 200, 60);
      }
    }
  } else { // asphalt
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, S, S);
    for (let i = 0; i < 50000; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * S, Math.random() * S, 1, 1);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath(); ctx.moveTo(Math.random() * S, 0); ctx.lineTo(Math.random() * S, S); ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(4, 4);
  return tex;
}
const woodTex = makeCourtTex('wood'), asphaltTex = makeCourtTex('asphalt');

function makeNorm() {
  const S = 512, c = document.createElement('canvas'); c.width = c.height = S; const ctx = c.getContext('2d');
  ctx.fillStyle = '#8080ff'; ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 5000; i++) { const x = Math.random() * S, y = Math.random() * S, r = Math.random() * 4 + 1; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, '#9090ff'); g.addColorStop(.5, '#8888ff'); g.addColorStop(1, '#7878ff'); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); }
  return new THREE.CanvasTexture(c);
}
const normMap = makeNorm();
const geo = new THREE.SphereGeometry(1.6, 64, 64);
const balls = PRODUCTS.map((p, i) => {
  const mat = new THREE.MeshStandardMaterial({
    map: makeTex(p.id, p.color, p.seam),
    normalMap: normMap,
    normalScale: new THREE.Vector2(.45, .45),
    roughness: p.id === 6 ? 0.2 : 0.68,
    metalness: p.id === 6 ? 0.8 : 0,
    emissive: new THREE.Color(p.emissive),
    emissiveIntensity: p.id === 5 ? 1.5 : 0.4
  });
  const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.position.set(0, 0, 0); scene.add(m);
  return m;
});

// ground
const groundMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.05, metalness: 0.3 });
const sp = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), groundMat);
sp.rotation.x = -Math.PI / 2; sp.position.y = -2; sp.receiveShadow = true; scene.add(sp);

// shadow overlay
const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: .3 }));
shadowPlane.rotation.x = -Math.PI / 2; shadowPlane.position.y = -1.99; shadowPlane.receiveShadow = true; scene.add(shadowPlane);


// Per-ball state
const ballPos = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
const ballRot = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
let scrollProgress = 0; // Current smooth scroll progress
let scrollProgressTarget = 0;
let mxN = 0, myN = 0;
let spinVel = 0; // Power spin velocity

canvas.addEventListener('mousedown', () => { spinVel = 0.8; showToast('info', 'Trick Shot!', 'Applying power spin 🏀'); });

document.addEventListener('mousemove', e => { mxN = (e.clientX / innerWidth - .5) * 2; myN = (e.clientY / innerHeight - .5) * 2; });

let t = 0;
function animate() {
  requestAnimationFrame(animate); t += .007;

  // Smoothly lerp scroll progress
  scrollProgress += (scrollProgressTarget - scrollProgress) * 0.12;

  balls.forEach((ball, i) => {
    // Calculate dynamic scale based on distance to center
    // Each ball gets its peak at its own index
    const ballCenter = i / (PRODUCTS.length - 1);
    const dist = Math.abs(scrollProgress - ballCenter) * (PRODUCTS.length - 1);

    // Gaussian-like falloff for smooth scaling
    const targetScale = Math.max(0.001, Math.exp(-dist * dist * 6.5));

    ballScaleCur[i] += (targetScale - ballScaleCur[i]) * 0.15;
    ball.scale.setScalar(ballScaleCur[i]);
    ball.visible = ballScaleCur[i] > 0.05;

    // bounce only for current
    const bounce = i === cur ? Math.sin(t * 1.3) * .045 : 0;
    ball.position.y = bounce;

    // rotation
    spinVel *= 0.96; // Decelerate spin
    const tRY = i === cur ? t * .28 + mxN * .35 + spinVel * 20 : ball.rotation.y;
    const tRX = i === cur ? myN * .22 : ball.rotation.x;
    ballRot[i].x += (tRX - ballRot[i].x) * .04;
    ballRot[i].y += (tRY - ballRot[i].y) * .04;
    ball.rotation.x = ballRot[i].x;
    ball.rotation.y = ballRot[i].y;
  });

  // Adaptive Lighting & Floor Lerp
  const targetCol = new THREE.Color(PRODUCTS[cur].envColor);
  envLight.color.lerp(targetCol, 0.05);
  amb.intensity += ((cur === 4 || cur === 6 ? 0.4 : 0.25) - amb.intensity) * 0.05;

  const targetFloor = PRODUCTS[cur].court === 'wood' ? woodTex : asphaltTex;
  if (groundMat.map !== targetFloor) {
    groundMat.map = targetFloor;
    groundMat.roughness = PRODUCTS[cur].court === 'wood' ? 0.1 : 0.8;
    groundMat.needsUpdate = true;
  }

  camera.position.x = Math.sin(t * .18) * .12;
  camera.position.y = Math.cos(t * .13) * .08;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}
animate();

// ─── SCROLL ───────────────────────────────────────────────────────────────────
let lastScrollTime = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  const sy = scrollY;
  const sh = document.getElementById('scroll-hint');
  if (sy > 80) sh.classList.add('hidden'); else sh.classList.remove('hidden');

  const stage = document.getElementById('stage');
  if (!stage) return;
  const stH = stage.offsetHeight - innerHeight;
  const p = Math.max(0, Math.min(1, sy / stH));
  scrollProgressTarget = p; // continuous target for scale lerp

  const idx = Math.min(PRODUCTS.length - 1, Math.round(p * (PRODUCTS.length - 1)));

  if (idx !== cur && now - lastScrollTime > 40) {
    setSlide(idx);
    lastScrollTime = now;
  }
});


// ─── COLOR DOTS ──────────────────────────────────────────────────────────────
function updateBallColor(ballIdx, color) {
  const p = PRODUCTS[ballIdx];
  const tex = makeTex(p.id, color, p.seam);
  balls[ballIdx].material.map = tex;
  balls[ballIdx].material.needsUpdate = true;
  // Update the product data for cart
  p.color = color;
}

document.querySelectorAll('.color-picker').forEach((picker, ballIdx) => {
  picker.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      picker.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      const color = dot.dataset.color;
      updateBallColor(ballIdx, color);
      showToast('info', 'Color Applied', dot.title || 'Color changed');
    });
  });
});

// init
updateCartUI(); updateWishUI();

// ─── MAGNETIC BUTTONS ────────────────────────────────────────────────────────
function initMagnetic() {
  const btns = document.querySelectorAll('.btn-primary, .btn-ghost, .nav-icon-btn, .arr, .magnetic');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0, 0) scale(1)`;
    });
  });
}
initMagnetic();
