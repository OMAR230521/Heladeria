// --- 1. BASES DE DATOS ---
const listaSaboresHelados = ["MOUSSE DE CHOCOLATE", "MOUSSE DE FRAMBUESA", "MOUSSE DE LEMON PIE", "MOUSSE DE MARACUYA", "MOUSSE DE LIMON", "ANANA AL AGUA", "DURAZNO AL AGUA", "FRANUI AL AGUA", "FRUTILLA AL AGUA", "FRUTOS PATAGONICOS AL AGUA", "LIMON AL AGUA", "LIMON, JENGIBRE Y MENTA(AL AGUA)", "LIMON, JENGIBRE Y ALBAHACA(AL AGUA)", "DULCE DE LECHE BOMBON", "DULCE DE LECHE BROWNIE", "DULCE DE LECHE CLASICO", "CHOCOTORTA", "COCO CON DULCE DE LECHE", "DULCE DE LECHE CRUNCH", "FLAN CON DULCE DE LECHE", "DULCE DE LECHE GRANIZADO", "SUPER DULCE DE LECHE", "CHOCOLATE BLANCO", "CHOCOLATE BLOCK", "CHOCOLATE BUENARDO", "CHOCOLATE CLASICO", "CHOCOLATE CON ALMENDRAS", "CHOCOLATE CON PASAs", "CHOCOLATE DOLCE BAJON", "CHOCOLATE HAVANNA", "CHOCOLATE KINDER", "CHOCOLATE MARROC", "CHOCOLATE MARQUISE", "CHOCOLATE NUCCIOLATO", "CHOCOLATE NUTELLA", "CHOCOLATE ROCHER", "CHOCOLATE SUIZO", "BANANITA DOLCA", "BANANA SPLIT", "BANANA SPLIT CON NUEZ", "BANANA CON NUTELLA", "CREMA BON O BOM", "CADBURY DE FRUTILLA", "CEREZA A LA CREMA", "CHEESECAKE", "CREMA DE ARANDANOS", "CREMA DEL CIELO", "CREMA OREO", "CREMA RUSA", "FORNITE", "FRAMTTINO", "FRAMBUESA CON PISTACHO", "FRUTOS DEL BOSQUE", "GRANIZADo", "KINOTOS AL WHISKY", "MANTECOL", "MASCARPONE CON FRUTOS ROJOS", "MENTA GRANIZADA", "PISTACHO", "TIRAMISU", "FRAMBUESA AL AGUA", "SAMBAYON ITALIANO", "MOUSSE DE LIMON HAVANNA", "FRAMBUESA A LA CREMA", "NONA VICENTA", "Açaí", "SCALONETA"];

const listaSaboresMilkshakes = ["Oreo", "Bon o bon", "Chocolate dubai", "Pistacho", "Ferrero rocher", "Frapuchino americana", "Frapuccino dulce de leche", "Dolce valentino", "Dulce de leche", "Belga furioso", "Chocolinas", "Creza silvestre"];

const tiposLeche = ["Entera", "Descremada", "Almendra"];

const variedadesCafe = ["Capuccino", "Latte", "Flat white", "Cortado", "Espresso simple", "Espresso doble", "Americano simple", "Americano doble"];

const listaSaboresSalsas = ["Chocolate", "Frutilla", "Frutos patagonicos", "Dulce de leche", "Caramelo"];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// --- 2. FUNCIONES DE LÓGICA (GLOBALES) ---
window.agregarAlCarrito = function(nombre, precio) {
    let tipo = "otro";
    let tope = 0;
    
    // --- CLASIFICACIÓN ---
    if (nombre.includes("1 Kg") || nombre.includes("1/2 Kg") || nombre.includes("1/4 Kg") || nombre.includes("Promo 2x1")) {
        tipo = "helado";
        if (nombre.includes("1 Kg")) tope = 4;
        else if (nombre.includes("1/2 Kg")) tope = 3;
        else if (nombre.includes("1/4 Kg")) tope = 2;
        else if (nombre.includes("Promo 2x1")) tope = 4;
    } 
    else if (nombre.toLowerCase().includes("batido de 3 bochas")) {
        tipo = "helado";
        tope = 3;
    } 
    else if (nombre.toLowerCase().includes("milkshake")) {
        tipo = "milkshake";
        tope = 1;
    }
    else if (nombre.toLowerCase().includes("doble sabor")) {
        tipo = "helado";
        tope = 8; 
    } 
    else if (nombre.toLowerCase().includes("café")) {
        tipo = "cafe";
    } 
    else if (nombre.toLowerCase().includes("mamuschka")) {
        tipo = "chocolate";
    }
    else if (nombre.toLowerCase().includes("mini salsas") || nombre.toLowerCase().includes("salsa")) {
        tipo = "salsa";
        tope = 1;
    }

    let precioNumerico = parseFloat(precio) || 0;

   
    const requierePersonalizar = (tipo === "helado" || tipo === "milkshake" || tipo === "cafe" || tipo === "chocolate" || tipo === "salsa");
    let id = requierePersonalizar ? Date.now() : nombre;
    
    let productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precioBase: precioNumerico,
            tipo: tipo,
            tope: tope,
            cantidad: 1,
            gustos: Array(tope).fill(""),
            variedad: "", // Inicializa vacío para forzar la selección
            leche: ""     // Inicializa vacío para forzar la selección
        });
    }
    guardarYRenderizar();
}

// --- 3. FUNCIONES DE APOYO (GLOBALES) ---
window.cambiarCantidad = function(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
    guardarYRenderizar();
}

window.eliminarDelCarrito = function(index) {
    carrito.splice(index, 1);
    guardarYRenderizar();
}

window.actualizarExtra = function(index, campo, valor) {
    carrito[index][campo] = valor;
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function guardarYRenderizar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContador();
}

// --- 4. RENDERIZADO (ADAPTADO A MODO OSCURO) ---
function renderizarCarrito() {
    const container = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    if (!container) return;

    let html = '';
    let totalGeneral = 0;

    carrito.forEach((p, index) => {
        let precioItem = p.precioBase * p.cantidad;
        totalGeneral += precioItem;

        const tieneSabores = (p.tipo === 'helado' || p.tipo === 'milkshake' || p.tipo === 'cafe' || p.tipo === 'chocolate' || p.tipo === 'salsa');

        // Cambiado: background usa var(--color-bg-base), bordes var(--color-border) y texto var(--color-text-main)
        html += `
        <div style="padding:15px; border-bottom:1px solid var(--color-border); background: var(--color-bg-base); margin-bottom: 8px; border-radius: var(--radius-sm); color: var(--color-text-main);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="font-weight:bold; font-size: 15px;">${p.nombre} ${!tieneSabores ? `(x${p.cantidad})` : ''}</div>
                <div style="display:flex; gap:5px;">
                    ${!tieneSabores ? `
                        <button onclick="cambiarCantidad(${index}, -1)" style="border:1px solid var(--color-secondary); border-radius:var(--radius-sm); width:30px; height:30px; background:transparent; color:var(--color-secondary); font-weight:bold; cursor:pointer;">-</button>
                        <button onclick="cambiarCantidad(${index}, 1)" style="border:1px solid var(--color-secondary); border-radius:var(--radius-sm); width:30px; height:30px; background:transparent; color:var(--color-secondary); font-weight:bold; cursor:pointer;">+</button>
                    ` : `
                        <button onclick="eliminarDelCarrito(${index})" style="background:var(--color-border); border:none; border-radius:50%; width:30px; height:30px; color:var(--color-secondary); font-weight:bold; cursor:pointer;">X</button>
                    `}
                </div>
            </div>
            <div style="color:var(--color-secondary); font-weight:bold; margin-bottom:10px;">$${precioItem.toLocaleString('es-AR')}</div>
            ${generarSelectores(p, index)}
        </div>`;
    });

    container.innerHTML = html;
    if (totalContainer) totalContainer.innerText = totalGeneral.toLocaleString('es-AR');
}

function generarSelectores(p, index) {
    let selectores = "";
    // Estilo base reutilizable para los selectores que se adapta al modo oscuro automáticamente
    const estiloSelect = `width:100%; padding:8px; margin-bottom:5px; border:1px solid var(--color-border); border-radius:var(--radius-sm); background:var(--color-bg-card); color:var(--color-text-main); font-family: 'Outfit', sans-serif;`;

    if (p.tipo === "helado") {
        selectores += `<div style="font-size:11px; color:var(--color-text-muted, #888); margin-bottom:5px;">SABORES (Elegí ${p.tope}):</div>`;
        selectores += `<div style="max-height: 180px; overflow-y: auto; padding-right: 5px;">`;
        for (let i = 0; i < p.tope; i++) {
            selectores += `
            <select onchange="guardarGusto(${index}, ${i}, this.value)" style="${estiloSelect}">
                <option value="" disabled ${p.gustos[i] === "" ? 'selected' : ''} style="color:var(--color-text-muted);">Gusto ${i + 1}</option>
                ${listaSaboresHelados.map(s => `<option value="${s}" ${p.gustos[i] === s ? 'selected' : ''} style="background:var(--color-bg-card); color:var(--color-text-main);">${s}</option>`).join('')}
            </select>`;
        }
        selectores += `</div>`;
    } 
    else if (p.tipo === "milkshake") {
        selectores += `
        <div style="font-size:11px; color:var(--color-text-muted, #888); margin-bottom:5px;">SABOR DE MILKSHAKE:</div>
        <select onchange="guardarGusto(${index}, 0, this.value)" style="${estiloSelect}">
            <option value="" disabled ${p.gustos[0] === "" ? 'selected' : ''} style="color:var(--color-text-muted);">Elegí un sabor</option>
            ${listaSaboresMilkshakes.map(s => `<option value="${s}" ${p.gustos[0] === s ? 'selected' : ''} style="background:var(--color-bg-card); color:var(--color-text-main);">${s}</option>`).join('')}
        </select>`;
    }
    else if (p.tipo === "cafe") {
        selectores += `
        <select onchange="actualizarExtra(${index}, 'variedad', this.value)" style="${estiloSelect}">
            <option value="" disabled ${!p.variedad ? 'selected' : ''} style="color:var(--color-text-muted);">Tipo de café</option>
            ${variedadesCafe.map(v => `<option value="${v}" ${p.variedad === v ? 'selected' : ''} style="background:var(--color-bg-card); color:var(--color-text-main);">${v}</option>`).join('')}
        </select>
        <select onchange="actualizarExtra(${index}, 'leche', this.value)" style="${estiloSelect}">
            <option value="" disabled ${!p.leche ? 'selected' : ''} style="color:var(--color-text-muted);">Tipo de leche</option>
            ${tiposLeche.map(l => `<option value="${l}" ${p.leche === l ? 'selected' : ''} style="background:var(--color-bg-card); color:var(--color-text-main);">${l}</option>`).join('')}
        </select>`;
    }
    else if (p.tipo === "chocolate") {
        selectores += `
        <select onchange="actualizarExtra(${index}, 'leche', this.value)" style="${estiloSelect}">
            <option value="" disabled ${!p.leche ? 'selected' : ''} style="color:var(--color-text-muted);">Tipo de leche</option>
            ${tiposLeche.map(l => `<option value="${l}" ${p.leche === l ? 'selected' : ''} style="background:var(--color-bg-card); color:var(--color-text-main);">${l}</option>`).join('')}
        </select>`;
    }
    else if (p.tipo === "salsa") {
        selectores += `
        <div style="font-size:11px; color:var(--color-text-muted, #888); margin-bottom:5px;">SABOR DE LA SALSA:</div>
        <select onchange="guardarGusto(${index}, 0, this.value)" style="${estiloSelect}">
            <option value="" disabled ${p.gustos[0] === "" ? 'selected' : ''} style="color:var(--color-text-muted);">Elegí un sabor</option>
            ${listaSaboresSalsas.map(s => `<option value="${s}" ${p.gustos[0] === s ? 'selected' : ''} style="background:var(--color-bg-card); color:var(--color-text-main);">${s}</option>`).join('')}
        </select>`;
    }
    return selectores;
}

window.toggleCart = function() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

window.toggleDireccion = function() {
    const campoDireccion = document.getElementById('campo-direccion');
    if (!campoDireccion) return;

    // Buscamos cuál de las dos opciones redondas está seleccionada en el HTML
    const opciones = document.getElementsByName('tipo-entrega');
    let valorSeleccionado = "";
    
    for (let i = 0; i < opciones.length; i++) {
        if (opciones[i].checked) {
            valorSeleccionado = opciones[i].value;
            break;
        }
    }

    if (valorSeleccionado === 'delivery') {
        // Si elige "Envío a Domicilio", le sacamos la clase que lo oculta
        campoDireccion.classList.remove('hidden');
    } else {
        // Si elige "Retiro en Local", lo volvemos a ocultar
        campoDireccion.classList.add('hidden');
    }
}

function actualizarContador() {
    const contador = document.getElementById('cart-count');
    if (!contador) return;
    
    // Suma las cantidades reales de cada producto acumulado
    let totalUnidades = carrito.reduce((acumulador, producto) => acumulador + producto.cantidad, 0);
    
    contador.innerText = totalUnidades;
}

window.guardarGusto = function(index, gustoIndex, valor) {
    carrito[index].gustos[gustoIndex] = valor;
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

window.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    renderizarCarrito();
});
