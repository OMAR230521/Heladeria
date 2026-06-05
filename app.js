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

  // 1. BASES DE DATOS DEL MENÚ COMPLETO (DOLCE TROPEA)

  const listaSaboresHelados = [

    "MOUSSE DE CHOCOLATE", "MOUSSE DE FRAMBUESA", "MOUSSE DE LEMON PIE", "MOUSSE DE MARACUYA", "MOUSSE DE LIMON",

    "ANANA AL AGUA", "DURAZNO AL AGUA", "FRANUI AL AGUA", "FRUTILLA AL AGUA", "FRUTOS PATAGONICOS AL AGUA", "LIMON AL AGUA",

    "LIMON, JENGIBRE Y MENTA(AL AGUA)", "LIMON, JENGIBRE Y ALBAHACA(AL AGUA)", "DULCE DE LECHE BOMBON", "DULCE DE LECHE BROWNIE",

    "DULCE DE LECHE CLASICO", "CHOCOTORTA", "COCO CON DULCE DE LECHE", "DULCE DE LECHE CRUNCH", "FLAN CON DULCE DE LECHE",

    "DULCE DE LECHE GRANIZADO", "SUPER DULCE DE LECHE", "CHOCOLATE BLANCO", "CHOCOLATE BLOCK", "CHOCOLATE BUENARDO",

    "CHOCOLATE CLASICO", "CHOCOLATE CON ALMENDRAS", "CHOCOLATE CON PASAs", "CHOCOLATE DOLCE BAJON", "CHOCOLATE HAVANNA",

    "CHOCOLATE KINDER", "CHOCOLATE MARROC", "CHOCOLATE MARQUISE", "CHOCOLATE NUCCIOLATO", "CHOCOLATE NUTELLA",

    "CHOCOLATE ROCHER", "CHOCOLATE SUIZO", "BANANITA DOLCA", "BANANA SPLIT", "BANANA SPLIT CON NUEZ", "BANANA CON NUTELLA",

    "CREMA BON O BOM", "CADBURY DE FRUTILLA", "CEREZA A LA CREMA", "CHEESECAKE", "CREMA DE ARANDANOS", "CREMA DEL CIELO",

    "CREMA OREO", "CREMA RUSA", "FORNITE", "FRAMTTINO", "FRAMBUESA CON PISTACHO", "FRUTOS DEL BOSQUE", "GRANIZADo",

    "KINOTOS AL WHISKY", "MANTECOL", "MASCARPONE CON FRUTOS ROJOS", "MENTA GRANIZADA", "PISTACHO", "TIRAMISU",

    "FRAMBUESA AL AGUA", "SAMBAYON ITALIANO", "MOUSSE DE LIMON HAVANNA", "FRAMBUESA A LA CREMA", "NONA VICENTA", "Açaí", "SCALONETA"

  ];



  const listaMilkshakes = [

    "Oreo", "Bon o bon", "Chocolate dubai", "Pistacho", "Ferrero rocher", 

    "Frapuchino americana", "Frapuccino dulce de leche", "Dolce valentino", 

    "Dulce de leche", "Belga furioso", "Chocolinas", "Creza silvestre"

  ];



  const listaSalsas = ["Chocolate", "Frutilla", "Frutos Patagónicos", "Dulce de Leche", "Caramelo"];

  const opcionesDubai = ["Amargo", "Amargo con sal"];

  const opcionesGrajeas = ["Naranja con chocolate semiamargo", "Avellanas con chocolate caramelizado"];

  

  // NUEVAS LISTAS DE CAFETERÍA

  const listaVariedadesCafe = ["Capuccino", "Latte", "Flat white", "Cortado", "Espresso simple", "Espresso doble", "Americano simple", "Americano doble"];

  const listaLeches = ["Entera", "Deslactosada", "Vegetal (Almendras)"];



  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];



  // 2. FUNCIÓN DE RENDERIZADO: Dibuja las opciones exactas en pantalla

  function renderizarCarrito() {

    const cartItemsContainer = document.getElementById('cart-items');

    const cartTotalContainer = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotalContainer) return;



    if (carrito.length === 0) {

      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';

      cartTotalContainer.innerText = '0';

      return;

    }



    let html = '';

    let totalGeneral = 0;



    carrito.forEach((producto, index) => {

      // Calcular extras dinámicos (como los de Lorenzo)

      let precioExtra = 0;

      if (producto.nombre.includes("Lorenzo") && producto.extras) {

        precioExtra += (parseInt(producto.extras.avellanas) || 0) * 1;

        precioExtra += (parseInt(producto.extras.coco) || 0) * 1;

      }



      let precioFinalItem = producto.precioBase + precioExtra;

      totalGeneral += precioFinalItem;



      html += `

        <div class="cart-item" style="border-bottom: 1px solid #f0f0f0; padding-bottom: 12px; margin-bottom: 12px;">

          <div style="display: flex; justify-content: space-between; align-items: center;">

            <div>

              <span style="font-weight: 600; color: #333; font-size: 15px;">${producto.nombre}</span>

              <div style="color: #ff477e; font-weight: bold; font-size: 14px;">$${precioFinalItem.toLocaleString('es-AR')}</div>

            </div>

            <button onclick="eliminarDelCarrito(${index})" style="background: none; border: none; cursor: pointer; font-size: 14px;">❌</button>

          </div>

          <div style="margin-top: 8px; background: #fdf2f4; padding: 8px; border-radius: 8px; font-size: 12px;">

      `;



      // CASO A: Helados Tradicionales o Promos

      if (producto.tipo === "helado") {

        html += `<div style="font-weight: bold; color: #ff477e; margin-bottom: 4px;">SABORES (MÁX. ${producto.tope}):</div>`;

        for (let i = 0; i < producto.tope; i++) {

          html += `

            <select onchange="guardarOpcionEspecial(${index}, 'gustos', this.value, ${i})" style="width:100%; margin-bottom:4px; padding:4px; border-radius:4px; border:1px solid #ffccd8; background: #fff;">

              <option value="">-- Gusto ${i+1} --</option>

              ${listaSaboresHelados.map(s => `<option value="${s}" ${producto.gustos && producto.gustos[i] === s ? 'selected' : ''}>${s}</option>`).join('')}

            </select>`;

        }

      }

      

      // CASO B: Milkshakes

      else if (producto.tipo === "milkshake") {

        html += `

          <div style="font-weight: bold; color: #ff477e; margin-bottom: 4px;">ELEGÍ EL SABOR:</div>

          <select onchange="guardarOpcionEspecial(${index}, 'sabor', this.value)" style="width:100%; padding:4px; border-radius:4px; border:1px solid #ffccd8; background: #fff;">

            <option value="">-- Seleccionar Sabores --</option>

            ${listaMilkshakes.map(m => `<option value="${m}" ${producto.sabor === m ? 'selected' : ''}>${m}</option>`).join('')}

          </select>`;

      }



      // CASO C: Mini Salsas

      else if (producto.tipo === "salsa") {

        html += `

          <div style="font-weight: bold; color: #ff477e; margin-bottom: 4px;">ELEGÍ TU SALSA:</div>

          <select onchange="guardarOpcionEspecial(${index}, 'sabor', this.value)" style="width:100%; padding:4px; border-radius:4px; border:1px solid #ffccd8; background: #fff;">

            <option value="">-- Seleccionar Salsa --</option>

            ${listaSalsas.map(s => `<option value="${s}" ${producto.sabor === s ? 'selected' : ''}>${s}</option>`).join('')}

          </select>`;

      }



      // CASO D: Chocolates Dubai

      else if (producto.tipo === "dubai") {

        html += `<div style="font-weight: bold; color: #ff477e; margin-bottom: 4px;">OPCIÓN PERCANTA:</div>`;

        let cantidadDubai = producto.nombre.includes("2 Chocolates") ? 2 : 1;

        for (let i = 0; i < cantidadDubai; i++) {

          html += `

            <select onchange="guardarOpcionEspecial(${index}, 'opciones', this.value, ${i})" style="width:100%; margin-bottom:4px; padding:4px; border-radius:4px; border:1px solid #ffccd8; background: #fff;">

              <option value="">-- Variante Chocolate ${i+1} --</option>

              ${opcionesDubai.map(o => `<option value="${o}" ${producto.opciones && producto.opciones[i] === o ? 'selected' : ''}>${o}</option>`).join('')}

            </select>`;

        }

      }



      // CASO E: Chocolate Lorenzo

      else if (producto.tipo === "lorenzo") {

        html += `

          <div style="font-weight: bold; color: #ff477e; margin-bottom: 6px;">AGREGAR EXTRAS (+$1 c/u):</div>

          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">

            <span>Avellanas:</span>

            <input type="number" min="0" max="100" value="${producto.extras ? producto.extras.avellanas : 0}" onchange="guardarExtraLorenzo(${index}, 'avellanas', this.value)" style="width:60px; text-align:center; border:1px solid #ffccd8; border-radius:4px;">

          </div>

          <div style="display:flex; justify-content:space-between;">

            <span>Coco en escamas:</span>

            <input type="number" min="0" max="100" value="${producto.extras ? producto.extras.coco : 0}" onchange="guardarExtraLorenzo(${index}, 'coco', this.value)" style="width:60px; text-align:center; border:1px solid #ffccd8; border-radius:4px;">

          </div>`;

      }



      // CASO F: Grajeas

      else if (producto.tipo === "grajeas") {

        html += `

          <div style="font-weight: bold; color: #ff477e; margin-bottom: 4px;">SELECCIONÁ UNA COMBINACIÓN:</div>

          <select onchange="guardarOpcionEspecial(${index}, 'sabor', this.value)" style="width:100%; padding:4px; border-radius:4px; border:1px solid #ffccd8; background: #fff;">

            <option value="">-- Seleccionar Opción --</option>

            ${opcionesGrajeas.map(g => `<option value="${g}" ${producto.sabor === g ? 'selected' : ''}>${g}</option>`).join('')}

          </select>`;

      }



      // NUEVO CASO G: Cafés (Pide Variante y Leche)

      else if (producto.tipo === "cafe") {

        html += `

          <div style="font-weight: bold; color: #ff477e; margin-bottom: 4px;">ESTILO DE CAFÉ:</div>

          <select onchange="guardarOpcionEspecial(${index}, 'sabor', this.value)" style="width:100%; margin-bottom:6px; padding:4px; border-radius:4px; border:1px solid #ffccd8; background: #fff;">

            <option value="">-- Seleccionar Tipo --</option>

            ${listaVariedadesCafe.map(c => `<option value="${c}" ${producto.sabor === c ? 'selected' : ''}>${c}</option>`).join('')}

          </select>

          <div style="font-weight: bold; color: #ff477e; margin-bottom: 4px;">TIPO DE LECHE:</div>

          <select onchange="guardarOpcionEspecial(${index}, 'leche', this.value)" style="width:100%; padding:4px; border-radius:4px; border:1px solid #ffccd8; background: #fff;">

            <option value="">-- Seleccionar Leche --</option>

            ${listaLeches.map(l => `<option value="${l}" ${producto.leche === l ? 'selected' : ''}>${l}</option>`).join('')}

          </select>`;

      }



      // NUEVO CASO H: Chocolate Mamuschka (Solo pide Leche)

      else if (producto.tipo === "chocolate-mamuschka") {

        html += `

          <div style="font-weight: bold; color: #ff477e; margin-bottom: 4px;">TIPO DE LECHE:</div>

          <select onchange="guardarOpcionEspecial(${index}, 'leche', this.value)" style="width:100%; padding:4px; border-radius:4px; border:1px solid #ffccd8; background: #fff;">

            <option value="">-- Seleccionar Leche --</option>

            ${listaLeches.map(l => `<option value="${l}" ${producto.leche === l ? 'selected' : ''}>${l}</option>`).join('')}

          </select>`;

      }



      html += `</div></div>`;

    });



    cartItemsContainer.innerHTML = html;

    cartTotalContainer.innerText = totalGeneral.toLocaleString('es-AR');

  }



  // 3. AGREGAR AL CARRITO INTELIGENTE

  function agregarAlCarrito(nombre, precio) {

    let tipo = "otro";

    let tope = 0;



    // Clasificación total de productos

    if (nombre.includes("1 Kg")) { tipo = "helado"; tope = 4; }

    else if (nombre.includes("1/2 Kg")) { tipo = "helado"; tope = 3; }

    else if (nombre.includes("1/4 Kg")) { tipo = "helado"; tope = 2; }

    else if (nombre.includes("2kg") || nombre.includes("Doble felicidad")) { tipo = "helado"; tope = 8; }

    else if (nombre.includes("Promo Especial 2x1")) { tipo = "helado"; tope = 4; }

    else if (nombre.toLowerCase().includes("batido de 3 bochas")) { tipo = "helado"; tope = 3; }

    else if (nombre.toLowerCase().includes("milkshake")) { tipo = "milkshake"; }

    else if (nombre.toLowerCase().includes("mini salsa")) { tipo = "salsa"; }

    else if (nombre.toLowerCase().includes("dubai")) { tipo = "dubai"; }

    else if (nombre.toLowerCase().includes("lorenzo")) { tipo = "lorenzo"; }

    else if (nombre.toLowerCase().includes("grajeas")) { tipo = "grajeas"; }

    else if (nombre.toLowerCase().includes("cafe") || nombre.toLowerCase().includes("café")) { tipo = "cafe"; }

    else if (nombre.toLowerCase().includes("mamuschka")) { tipo = "chocolate-mamuschka"; }



    let nuevoItem = {

      nombre: nombre,

      precioBase: parseFloat(precio),

      tipo: tipo,

      tope: tope

    };



    // Estructuras de inicio

    if (tipo === "helado") nuevoItem.gustos = Array(tope).fill("");

    if (tipo === "dubai") nuevoItem.opciones = nombre.includes("2 Chocolates") ? ["", ""] : [""];

    if (tipo === "lorenzo") nuevoItem.extras = { avellanas: 0, coco: 0 };

    if (tipo === "cafe") { nuevoItem.sabor = ""; nuevoItem.leche = ""; }

    if (tipo === "chocolate-mamuschka") { nuevoItem.leche = ""; }



    carrito.push(nuevoItem);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarContador();

    renderizarCarrito();

  }



  function guardarOpcionEspecial(indexProducto, propiedad, valor, subIndex = null) {

    if (subIndex !== null) {

      carrito[indexProducto][propiedad][subIndex] = valor;

    } else {

      carrito[indexProducto][propiedad] = valor;

    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

  }



  function guardarExtraLorenzo(indexProducto, ingrediente, valor) {

    if (parseInt(valor) < 0) valor = 0;

    if (parseInt(valor) > 100) valor = 100;

    carrito[indexProducto].extras[ingrediente] = parseInt(valor) || 0;

    localStorage.setItem('carrito', JSON.stringify(carrito));

    renderizarCarrito();

  }



  function eliminarDelCarrito(index) {

    carrito.splice(index, 1);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarContador();

    renderizarCarrito();

  }



  function actualizarContador() {

    const contador = document.getElementById('cart-count');

    if (contador) contador.innerText = carrito.length;

  }



  window.addEventListener('DOMContentLoaded', () => {

    actualizarContador();

    renderizarCarrito();

  });



  function toggleCart() {

    const modal = document.getElementById('cart-modal');

    modal.classList.toggle('hidden');

    if (!modal.classList.contains('hidden')) renderizarCarrito();

  }



  function toggleDireccion() {

    const campoDireccion = document.getElementById('campo-direccion');

    const opcionDelivery = document.querySelector('input[name="tipo-entrega"][value="delivery"]').checked;

    if (opcionDelivery) campoDireccion.classList.remove('hidden');

    else campoDireccion.classList.add('hidden');

  }



  // 4. PASO FINAL: ENVIAR TODO ORDENADO A WHATSAPP

  function procesarPago() {

    const nombre = document.getElementById('cliente-nombre').value.trim();

    const apellido = document.getElementById('cliente-apellido').value.trim();

    const telefono = document.getElementById('cliente-telefono').value.trim();

    const tipoEntrega = document.querySelector('input[name="tipo-entrega"]:checked').value;

    const direccion = document.getElementById('cliente-direccion').value.trim();



    if (!nombre || !apellido || !telefono) {

      alert("Por favor, completa tus datos de contacto (Nombre, Apellido y Teléfono).");

      return;

    }

    if (tipoEntrega === "delivery" && !direccion) {

      alert("Por favor, ingresa tu dirección para el envío a domicilio.");

      return;

    }

    if (carrito.length === 0) {

      alert("El carrito está vacío.");

      return;

    }



    let mensaje = `🍦 *NUEVO PEDIDO - DOLCE TROPEA* 🍦\n\n`;

    mensaje += `👤 *Cliente:* ${nombre} ${apellido}\n`;

    mensaje += `📞 *Teléfono:* ${telefono}\n`;

    mensaje += `🛵 *Entrega:* ${tipoEntrega === 'delivery' ? 'Envío a Domicilio' : 'Retiro en Local'}\n`;

    if (tipoEntrega === 'delivery') mensaje += `📍 *Dirección:* ${direccion}\n`;

    

    mensaje += `\n🛒 *DETALLE DEL PEDIDO:*\n`;

    let totalFactura = 0;



    carrito.forEach((prod) => {

      let extra = 0;

      let detalleExtras = "";



      if (prod.tipo === "helado" && prod.gustos) {

        let gustosFiltrados = prod.gustos.filter(g => g !== "");

        detalleExtras = `\n   · Gustos: ${gustosFiltrados.length > 0 ? gustosFiltrados.join(', ') : 'No seleccionados'}`;

      } else if ((prod.tipo === "milkshake" || prod.tipo === "salsa" || prod.tipo === "grajeas") && prod.sabor) {

        detalleExtras = `\n   · Variante: ${prod.sabor}`;

      } else if (prod.tipo === "dubai" && prod.opciones) {

        let opcionesFiltradas = prod.opciones.filter(o => o !== "");

        detalleExtras = `\n   · Opciones: ${opcionesFiltradas.length > 0 ? opcionesFiltradas.join(', ') : 'No seleccionadas'}`;

      } else if (prod.tipo === "lorenzo" && prod.extras) {

        extra += prod.extras.avellanas * 1;

        extra += prod.extras.coco * 1;

        detalleExtras = `\n   · Extras: ${prod.extras.avellanas} Avellanas, ${prod.extras.coco} Coco en escamas`;

      } else if (prod.tipo === "cafe") {

        detalleExtras = `\n   · Estilo: ${prod.sabor || 'No seleccionado'}\n   · Leche: ${prod.leche || 'No seleccionada'}`;

      } else if (prod.tipo === "chocolate-mamuschka") {

        detalleExtras = `\n   · Leche: ${prod.leche || 'No seleccionada'}`;

      }



      let precioItem = prod.precioBase + extra;

      totalFactura += precioItem;

      mensaje += `• *${prod.nombre}* - $${precioItem.toLocaleString('es-AR')}${detalleExtras}\n`;

    });



    mensaje += `\n💰 *TOTAL A PAGAR:* $${totalFactura.toLocaleString('es-AR')}`;



    // CONFIGURACIÓN DE TU WHATSAPP (Poné tu número real sin el + ni espacios)

    const numeroCelular = "542971234567"; 

    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${numeroCelular}&text=${encodeURIComponent(mensaje)}`;

    

    // Vaciar carrito

    localStorage.removeItem('carrito');

    carrito = [];

    actualizarContador();

    renderizarCarrito();

    toggleCart();



    window.open(urlWhatsapp, '_blank');

  }


