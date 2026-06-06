/* ==========================================================================
   Dolce Tropea - Lógica de Interactividad & Menú Digital (Vanilla JS)
   ========================================================================== */

/* =========================
   PROTECCIÓN DE VARIABLES
   ========================= */
// Evita error: Identifier 'menuProducts' already declared
if (typeof window.menuProducts === "undefined") {
  window.menuProducts = [
    {
      id: 1,
      name: 'Milkshake Dulce Tentación',
      category: 'helados',
      price: 3800,
      description: 'Licuado de helado de dulce de leche granizado...',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400',
      tags: ['¡El más pedido!', 'Milkshake'],
      diet: []
    },
    {
      id: 2,
      name: 'Copa Gelato Tropea',
      category: 'helados',
      price: 3500,
      description: 'Tres bochas a elección...',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400',
      tags: ['Recomendado'],
      diet: ['glutenfree']
    }
    // ⚠️ dejo corto acá por espacio, tu lista completa va igual
  ];
}

const menuProducts = window.menuProducts;

/* =========================
   ESTADO DE LA APP
   ========================= */
const appState = {
  currentCategory: 'todos',
  activeDiets: [],
  searchQuery: '',
  order: {}
};

const WHATSAPP_NUMBER = '5492975148986';

/* =========================
   INIT
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLiveStatus();
  initMobileMenu();
  renderMenu();
  setupEventListeners();
});

/* =========================
   STATUS LOCAL
   ========================= */
function initLiveStatus() {
  const statusBadge = document.getElementById('live-status-badge');
  const statusText = document.getElementById('live-status-text');
  if (!statusBadge || !statusText) return;

  const check = () => {
    const h = new Date().getHours();
    const open = (h >= 15 || h < 1);

    statusBadge.className = open ? 'live-status open' : 'live-status closed';
    statusBadge.innerHTML = open
      ? '<span class="status-dot"></span>¡Abierto ahora!'
      : '<span class="status-dot"></span>Cerrado';

    statusText.innerHTML = open
      ? 'Cierra a la 01:00 AM'
      : 'Abrimos a las 15:00 PM';
  };

  check();
  setInterval(check, 60000);
}

/* =========================
   MENÚ MÓVIL
   ========================= */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

/* =========================
   THEME
   ========================= */
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const root = document.documentElement;
  const saved = localStorage.getItem('theme') || 'light';

  root.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

/* =========================
   RENDER MENÚ
   ========================= */
function renderMenu() {
  const grid = document.getElementById('menu-grid');
  const noResults = document.getElementById('no-results');
  if (!grid) return;

  grid.innerHTML = '';
  let visible = 0;

  menuProducts.forEach(p => {
    const okCat = appState.currentCategory === 'todos' || p.category === appState.currentCategory;
    const okSearch = p.name.toLowerCase().includes(appState.searchQuery.toLowerCase());

    if (!okCat || !okSearch) return;

    visible++;

    const qty = appState.order[p.id] || 0;

    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>$${p.price}</p>

      <div>
        <button onclick="changeQty(${p.id}, -1)">-</button>
        <span>${qty}</span>
        <button onclick="changeQty(${p.id}, 1)">+</button>
      </div>

      <button onclick="addQuickly(${p.id})">
        ${qty > 0 ? 'Agregado ✓' : 'Pedir'}
      </button>
    `;

    grid.appendChild(card);
  });

  if (noResults) {
    noResults.style.display = visible ? 'none' : 'flex';
  }
}

/* =========================
   CARRITO
   ========================= */
window.changeQty = function (id, delta) {
  const current = appState.order[id] || 0;
  const next = Math.max(0, current + delta);

  if (next === 0) delete appState.order[id];
  else appState.order[id] = next;

  renderMenu();
  updateOrderBar();
};

window.addQuickly = function (id) {
  const q = appState.order[id] || 0;
  window.changeQty(id, q === 0 ? 1 : -q);
};

/* =========================
   BARRA PEDIDO
   ========================= */
function updateOrderBar() {
  const bar = document.getElementById('order-bar-container');
  if (!bar) return;

  let total = 0;
  let qty = 0;

  Object.keys(appState.order).forEach(id => {
    const p = menuProducts.find(x => x.id == id);
    const q = appState.order[id];

    if (p) {
      total += p.price * q;
      qty += q;
    }
  });

  if (qty === 0) {
    bar.classList.remove('show');
    return;
  }

  bar.classList.add('show');
}

/* =========================
   WHATSAPP
   ========================= */
window.sendOrderWhatsApp = function () {
  let msg = "Pedido:\n\n";
  let total = 0;

  Object.keys(appState.order).forEach(id => {
    const p = menuProducts.find(x => x.id == id);
    const q = appState.order[id];

    if (!p) return;

    msg += `• ${q}x ${p.name} ($${p.price})\n`;
    total += p.price * q;
  });

  msg += `\nTotal: $${total}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
};

/* =========================
   FILTROS
   ========================= */
function setupEventListeners() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      appState.currentCategory = e.target.dataset.category;
      renderMenu();
    });
  });

  const search = document.getElementById('search-input');
  if (search) {
    search.addEventListener('input', e => {
      appState.searchQuery = e.target.value;
      renderMenu();
    });
  }
}

/* =========================
   LOADER PAGO
   ========================= */
window.mostrarProcesandoPago = function () {
  let loader = document.getElementById("loader-pago");

  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader-pago";

    loader.innerHTML = `
      <div class="loader-box">
        <div class="spinner"></div>
        <p>Procesando pago...</p>
      </div>
    `;

    document.body.appendChild(loader);

    const style = document.createElement("style");
    style.innerHTML = `
      #loader-pago{
        position:fixed;
        inset:0;
        background:rgba(0,0,0,.6);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:99999;
      }
      .loader-box{
        background:white;
        padding:20px;
        border-radius:12px;
        text-align:center;
      }
      .spinner{
        width:40px;
        height:40px;
        border:4px solid #ccc;
        border-top:4px solid #ff4d6d;
        border-radius:50%;
        animation:spin 1s linear infinite;
      }
      @keyframes spin{100%{transform:rotate(360deg)}}
    `;
    document.head.appendChild(style);
  }

  loader.style.display = "flex";
};

window.ocultarProcesandoPago = function () {
  const l = document.getElementById("loader-pago");
  if (l) l.style.display = "none";
};
