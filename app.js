/* ==========================================================================
   Dolce Tropea - Lógica de Interactividad & Menú Digital (Vanilla JS)
   ========================================================================== */

// Base de Datos de Productos del Menú (Ficticios pero realistas y tentadores)
const menuProducts = [
  {
    id: 1,
    name: 'Milkshake Dulce Tentación',
    category: 'helados',
    price: 3800,
    description: 'Licuado de helado de dulce de leche granizado, salsa de caramelo casera, nueces picadas y un copo gigante de crema batida.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=400',
    tags: ['¡El más pedido!', 'Milkshake'],
    diet: []
  },
  {
    id: 2,
    name: 'Copa Gelato Tropea',
    category: 'helados',
    price: 3500,
    description: 'Tres bochas a elección de nuestro gelato artesanal (sabor recomendado: Pistacho y Frambuesa) decoradas con salsa y obleas.',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400',
    tags: ['Recomendado'],
    diet: ['glutenfree']
  },
  {
    id: 3,
    name: 'Milkshake Choco-Oreo',
    category: 'helados',
    price: 3900,
    description: 'Delicioso milkshake de chocolate suizo, galletitas Oreo trituradas, salsa de fudge de chocolate y crema chantilly.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400',
    tags: ['Novedad'],
    diet: []
  },
  {
    id: 4,
    name: 'Helado Familiar (1 KG)',
    category: 'helados',
    price: 9500,
    description: 'Un kilo de pura felicidad. Elegí hasta 4 sabores artesanales de nuestra vitrina súper cremosa.',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&q=80&w=400',
    tags: ['Ideal para compartir'],
    diet: ['glutenfree']
  },
  {
    id: 5,
    name: 'Alfajor Artesanal de Pistacho',
    category: 'cafeteria',
    price: 1800,
    description: 'Tapas de chocolate amargo, relleno de abundante crema ganache de pistachos seleccionados y bañado en chocolate blanco.',
    image: 'https://images.unsplash.com/photo-1558961309-dbdf71799f5a?auto=format&fit=crop&q=80&w=400', // Cookie-like representing alfajor
    tags: ['Exclusivo'],
    diet: ['veggie']
  },
  {
    id: 6,
    name: 'Focaccia de Jamón Crudo & Brie',
    category: 'cafeteria',
    price: 4900,
    description: 'Focaccia casera tostada rellena con jamón crudo estacionado, queso brie derretido, rúcula fresca y aceite de oliva extra virgen.',
    image: 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&q=80&w=400',
    tags: ['Calentito'],
    diet: []
  },
  {
    id: 7,
    name: 'Café Capuchino Italiano',
    category: 'cafeteria',
    price: 2100,
    description: 'Doble shot de espresso premium con leche emulsionada sedosa y espolvoreado con cacao belga o canela.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=400',
    tags: [],
    diet: ['veggie', 'glutenfree']
  },
  {
    id: 8,
    name: 'Tostado de Masa Madre',
    category: 'cafeteria',
    price: 3600,
    description: 'Sándwich de pan de masa madre artesanal relleno de abundante queso gouda y jamón cocido natural, dorado a la plancha.',
    image: 'https://images.unsplash.com/photo-1479894720059-1f2678533fb5?auto=format&fit=crop&q=80&w=400',
    tags: [],
    diet: []
  },
  {
    id: 9,
    name: 'Promo Merienda de la Casa',
    category: 'promos',
    price: 6500,
    description: '1 Café con leche grande + 1 Exclusivo Alfajor de Pistacho + 1 Exprimido de naranja natural.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400',
    tags: ['15% OFF'],
    diet: ['veggie']
  },
  {
    id: 10,
    name: 'Promo Late Night Dulce',
    category: 'promos',
    price: 11500,
    description: 'Solo para antojos nocturnos de Comodoro: Llevá 1 KG de helado y te regalamos 2 Alfajores de Pistacho o 2 Cafés Expressos.',
    image: 'https://images.unsplash.com/photo-1560008511-11c63416e52d?auto=format&fit=crop&q=80&w=400',
    tags: ['Favorito nocturno'],
    diet: []
  }
];

// Estado de la Aplicación
const appState = {
  currentCategory: 'todos',
  activeDiets: [],
  searchQuery: '',
  order: {} // Estructura: { productId: cantidad }
};

// Número de WhatsApp de Dolce Tropea
const WHATSAPP_NUMBER = '5492975148986'; // Número real de Comodoro Rivadavia

// Elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLiveStatus();
  initMobileMenu();
  renderMenu();
  setupEventListeners();
});

/* ==========================================================================
   1. Control de Horarios Comercial (Comodoro Rivadavia - Cierra Tarde)
   ========================================================================== */
function initLiveStatus() {
  const statusBadge = document.getElementById('live-status-badge');
  const statusText = document.getElementById('live-status-text');
  
  if (!statusBadge || !statusText) return;

  // Horario comercial de Dolce Tropea: todos los días de 15:00 a 01:00 AM (madrugada del día siguiente)
  const checkOpeningStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    
    // De 15:00 (3 PM) a 01:00 AM del día siguiente está ABIERTO.
    // 00:00 y 00:59 pertenecen técnicamente a la madrugada.
    let isOpen = false;
    
    if (currentHour >= 15 || currentHour < 1) {
      isOpen = true;
    }
    
    if (isOpen) {
      statusBadge.className = 'live-status open';
      statusBadge.innerHTML = '<span class="status-dot"></span>¡Abierto ahora!';
      statusText.innerHTML = 'Cerrará a la <strong>01:00 AM</strong>. ¡Ideal para tu antojo nocturno!';
    } else {
      statusBadge.className = 'live-status closed';
      statusBadge.innerHTML = '<span class="status-dot"></span>Cerrado';
      statusText.innerHTML = 'Abrimos hoy a las <strong>15:00 PM</strong>. ¡Te esperamos!';
    }
  };

  checkOpeningStatus();
  // Actualizar cada minuto
  setInterval(checkOpeningStatus, 60000);
}

/* ==========================================================================
   2. Menú de Navegación Móvil
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-links a');

  if (!toggle || !nav) return;

  const toggleMenu = () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
  };

  toggle.addEventListener('click', toggleMenu);

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });
}

/* ==========================================================================
   3. Modo Claro / Oscuro (Guardado en LocalStorage)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  
  if (!toggleBtn) return;

  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  if (theme === 'dark') {
    toggleBtn.innerHTML = '☀️'; // Sol para cambiar a claro
    toggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
  } else {
    toggleBtn.innerHTML = '🌙'; // Luna para cambiar a oscuro
    toggleBtn.setAttribute('aria-label', 'Cambiar a modo oscuro');
  }
}

/* ==========================================================================
   4. Renderizado del Menú Digital Interactivo
   ========================================================================== */
function renderMenu() {
  const menuGrid = document.getElementById('menu-grid');
  const noResults = document.getElementById('no-results');
  
  if (!menuGrid) return;
  
  menuGrid.innerHTML = '';
  let visibleCount = 0;

  menuProducts.forEach(product => {
    // Filtrado por categoría
    const matchesCategory = appState.currentCategory === 'todos' || product.category === appState.currentCategory;
    
    // Filtrado por dietas (Sin TACC o Vegano) - Operador AND
    const matchesDiet = appState.activeDiets.every(diet => product.diet.includes(diet));
    
    // Filtrado por búsqueda textual
    const matchesSearch = product.name.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(appState.searchQuery.toLowerCase());

    if (matchesCategory && matchesDiet && matchesSearch) {
      visibleCount++;
      const currentQty = appState.order[product.id] || 0;
      
      const productCard = document.createElement('article');
      productCard.className = 'product-card';
      
      // Renderizar tags (badges de arriba)
      let tagBadges = '';
      product.tags.forEach(t => {
        tagBadges += `<span class="product-badge badge-featured">${t}</span>`;
      });
      if (product.diet.includes('glutenfree')) {
        tagBadges += `<span class="product-badge badge-sintacc">Sin TACC</span>`;
      }
      if (product.diet.includes('veggie')) {
        tagBadges += `<span class="product-badge badge-veggie">Vegano</span>`;
      }

      productCard.innerHTML = `
        <div class="product-img-wrapper">
          <div class="product-tags">
            ${tagBadges}
          </div>
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
        </div>
        <div class="product-content">
          <div class="product-title-row">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-price">$${product.price}</span>
          </div>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <div class="quantity-control">
              <button class="qty-btn dec" aria-label="Restar uno" onclick="changeQty(${product.id}, -1)">-</button>
              <span class="qty-val" id="qty-${product.id}">${currentQty}</span>
              <button class="qty-btn inc" aria-label="Sumar uno" onclick="changeQty(${product.id}, 1)">+</button>
            </div>
            <button class="btn-add-order ${currentQty > 0 ? 'in-cart' : ''}" onclick="addQuickly(${product.id})">
              ${currentQty > 0 ? 'Agregado ✓' : 'Pedir'}
            </button>
          </div>
        </div>
      `;
      menuGrid.appendChild(productCard);
    }
  });

  // Mostrar alerta si no hay resultados
  if (visibleCount === 0) {
    noResults.style.display = 'flex';
  } else {
    noResults.style.display = 'none';
  }
}

/* ==========================================================================
   5. Lógica del Pedido (WhatsApp Linker)
   ========================================================================== */
window.changeQty = function(productId, delta) {
  const currentQty = appState.order[productId] || 0;
  let newQty = currentQty + delta;
  
  if (newQty < 0) newQty = 0;
  
  if (newQty === 0) {
    delete appState.order[productId];
  } else {
    appState.order[productId] = newQty;
  }
  
  // Actualizar número en la card
  const qtyField = document.getElementById(`qty-${productId}`);
  if (qtyField) qtyField.textContent = newQty;
  
  // Refrescar solo elementos de estado sin re-renderizar todo
  updateOrderBar();
  
  // Refrescar botones de acción
  renderMenu();
};

window.addQuickly = function(productId) {
  const currentQty = appState.order[productId] || 0;
  if (currentQty === 0) {
    window.changeQty(productId, 1);
  } else {
    window.changeQty(productId, -currentQty); // Quita todos si hace clic de nuevo
  }
};

function updateOrderBar() {
  const orderBarContainer = document.getElementById('order-bar-container');
  const orderQtyText = document.getElementById('order-bar-qty');
  const orderTotalText = document.getElementById('order-bar-total');
  
  if (!orderBarContainer) return;
  
  let totalQty = 0;
  let totalPrice = 0;
  
  Object.keys(appState.order).forEach(productId => {
    const product = menuProducts.find(p => p.id === parseInt(productId));
    const qty = appState.order[productId];
    if (product && qty > 0) {
      totalQty += qty;
      totalPrice += product.price * qty;
    }
  });
  
  if (totalQty > 0) {
    orderQtyText.textContent = `${totalQty} producto(s) en tu selección`;
    orderTotalText.textContent = `Total: $${totalPrice}`;
    orderBarContainer.classList.add('show');
  } else {
    orderBarContainer.classList.remove('show');
  }
}

// Envío final del pedido a WhatsApp estructurado
window.sendOrderWhatsApp = function() {
  let message = '¡Hola Dolce Tropea! Me gustaría hacer un pedido:\n\n';
  let total = 0;
  
  Object.keys(appState.order).forEach(productId => {
    const product = menuProducts.find(p => p.id === parseInt(productId));
    const qty = appState.order[productId];
    if (product && qty > 0) {
      const subtotal = product.price * qty;
      message += `• *${qty}x* ${product.name} (_$${product.price}_) -> *$${subtotal}*\n`;
      total += subtotal;
    }
  });
  
  message += `\n💵 *Total estimado:* *$${total}*\n`;
  message += `📍 *Ubicación del local:* Av. Polonia 389, Comodoro Rivadavia.\n`;
  message += `\n💬 _Enviado desde el Menú Digital_ 🍦☕`;
  
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
  
  window.open(whatsappUrl, '_blank');
};

/* ==========================================================================
   6. Configuración de Escucha de Eventos (Filtros & Búsqueda)
   ========================================================================== */
function setupEventListeners() {
  // Configuración de las Pestañas (Tabs)
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      appState.currentCategory = e.target.getAttribute('data-category');
      renderMenu();
    });
  });

  // Configuración de Filtros Alimentarios (Sin TACC / Vegano)
  const dietButtons = document.querySelectorAll('.diet-btn');
  dietButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const filter = e.target.getAttribute('data-diet');
      e.target.classList.toggle('active');
      
      if (appState.activeDiets.includes(filter)) {
        appState.activeDiets = appState.activeDiets.filter(d => d !== filter);
      } else {
        appState.activeDiets.push(filter);
      }
      renderMenu();
    });
  });

  // Configuración de la Barra de Búsqueda
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.searchQuery = e.target.value;
      renderMenu();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  
  if (preloader) {
    // 🔍 Nos fijamos si el usuario ya entró a la web en esta sesión de navegación
    if (sessionStorage.getItem('dolce_tropea_loaded')) {
      // Si ya entró antes, eliminamos el loader de inmediato para no molestar
      preloader.style.display = 'none';
    } else {
      // Si es su primera vez, esperamos a que cargue toda la página (imágenes, fuentes, etc.)
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.classList.add('fade-out'); // Desaparece suavemente
          sessionStorage.setItem('dolce_tropea_loaded', 'true'); // Guarda el registro para que no vuelva a salir
        }, 800); // 800ms de retraso para que se luzca el spinner en pantalla
      });
    }
  }
});
