// --- 1. BASES DE DATOS ---
const listaSaboresHelados = ["MOUSSE DE CHOCOLATE", "MOUSSE DE FRAMBUESA", "MOUSSE DE LEMON PIE", "MOUSSE DE MARACUYA", "MOUSSE DE LIMON", "ANANA AL AGUA", "DURAZNO AL AGUA", "FRANUI AL AGUA", "FRUTILLA AL AGUA", "FRUTOS PATAGONICOS AL AGUA", "LIMON AL AGUA", "LIMON, JENGIBRE Y MENTA(AL AGUA)", "LIMON, JENGIBRE Y ALBAHACA(AL AGUA)", "DULCE DE LECHE BOMBON", "DULCE DE LECHE BROWNIE", "DULCE DE LECHE CLASICO", "CHOCOTORTA", "COCO CON DULCE DE LECHE", "DULCE DE LECHE CRUNCH", "FLAN CON DULCE DE LECHE", "DULCE DE LECHE GRANIZADO", "SUPER DULCE DE LECHE", "CHOCOLATE BLANCO", "CHOCOLATE BLOCK", "CHOCOLATE BUENARDO", "CHOCOLATE CLASICO", "CHOCOLATE CON ALMENDRAS", "CHOCOLATE CON PASAs", "CHOCOLATE DOLCE BAJON", "CHOCOLATE HAVANNA", "CHOCOLATE KINDER", "CHOCOLATE MARROC", "CHOCOLATE MARQUISE", "CHOCOLATE NUCCIOLATO", "CHOCOLATE NUTELLA", "CHOCOLATE ROCHER", "CHOCOLATE SUIZO", "BANANITA DOLCA", "BANANA SPLIT", "BANANA SPLIT CON NUEZ", "BANANA CON NUTELLA", "CREMA BON O BOM", "CADBURY DE FRUTILLA", "CEREZA A LA CREMA", "CHEESECAKE", "CREMA DE ARANDANOS", "CREMA DEL CIELO", "CREMA OREO", "CREMA RUSA", "FORNITE", "FRAMTTINO", "FRAMBUESA CON PISTACHO", "FRUTOS DEL BOSQUE", "GRANIZADo", "KINOTOS AL WHISKY", "MANTECOL", "MASCARPONE CON FRUTOS ROJOS", "MENTA GRANIZADA", "PISTACHO", "TIRAMISU", "FRAMBUESA AL AGUA", "SAMBAYON ITALIANO", "MOUSSE DE LIMON HAVANNA", "FRAMBUESA A LA CREMA", "NONA VICENTA", "Açaí", "SCALONETA"];
const tiposLeche = ["Entera", "Descremada", "Almendra"];
const variedadesCafe = ["Capuccino", "Latte", "Flat white", "Cortado", "Espresso simple", "Espresso doble", "Americano simple", "Americano doble"];
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
    else if (nombre.toLowerCase().includes("doble sabor") || nombre.toLowerCase().includes("milkshake")) {
        tipo = "helado";
        tope = 8; 
    } 
    else if (nombre.toLowerCase().includes("café")) {
        tipo = "cafe";
    } 
    else if (nombre.toLowerCase().includes("mamuschka")) {
        tipo = "chocolate";
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

// --- 4. RENDERIZADO ---
function renderizarCarrito() {
    const container = document.getElementById('cart-items');
    const totalContainer = document.getElementById('cart-total');
    if (!container) return;

    let html = '';
    let totalGeneral = 0;

    carrito.forEach((p, index) => {
        let precioItem = p.precioBase * p.cantidad;
        totalGeneral += precioItem;

        html += `
        <div style="padding:15px; border-bottom:1px solid #eee; background:#fff; margin-bottom: 5px; border-radius: 8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="font-weight:bold; font-size: 15px;">${p.nombre} ${p.tipo !== 'helado' ? `(x${p.cantidad})` : ''}</div>
                <div style="display:flex; gap:5px;">
                    ${p.tipo !== 'helado' ? `
                        <button onclick="cambiarCantidad(${index}, -1)" style="border:1px solid #ff477e; border-radius:5px; width:30px; height:30px;">-</button>
                        <button onclick="cambiarCantidad(${index}, 1)" style="border:1px solid #ff477e; border-radius:5px; width:30px; height:30px;">+</button>
                    ` : `
                        <button onclick="eliminarDelCarrito(${index})" style="background:#ffccd8; border:none; border-radius:50%; width:30px; height:30px;">X</button>
                    `}
                </div>
            </div>
            <div style="color:#ff477e; font-weight:bold; margin-bottom:10px;">$${precioItem.toLocaleString('es-AR')}</div>
            ${generarSelectores(p, index)}
        </div>`;
    });

    container.innerHTML = html;
    if (totalContainer) totalContainer.innerText = totalGeneral.toLocaleString('es-AR');
}

function generarSelectores(p, index) {
    let selectores = "";

    if (p.tipo === "helado") {
        selectores += `<div style="font-size:11px; color:#888; margin-bottom:5px;">SABORES (Elegí ${p.tope}):</div>`;
        for (let i = 0; i < p.tope; i++) {
            selectores += `
            <select onchange="guardarGusto(${index}, ${i}, this.value)" style="width:100%; padding:8px; margin-bottom:5px; border:1px solid #ffccd8; border-radius:8px; background:#fff;">
                <option value="">Gusto ${i + 1}</option>
                ${listaSaboresHelados.map(s => `<option value="${s}" ${p.gustos[i] === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>`;
        }
    } 
    else if (p.tipo === "cafe") {
        selectores += `
        <select onchange="actualizarExtra(${index}, 'variedad', this.value)" style="width:100%; padding:8px; margin-bottom:5px; border:1px solid #ffccd8; border-radius:8px;">
            ${variedadesCafe.map(v => `<option value="${v}" ${p.variedad === v ? 'selected' : ''}>${v}</option>`).join('')}
        </select>
        <select onchange="actualizarExtra(${index}, 'leche', this.value)" style="width:100%; padding:8px; margin-bottom:5px; border:1px solid #ffccd8; border-radius:8px;">
            ${tiposLeche.map(l => `<option value="${l}" ${p.leche === l ? 'selected' : ''}>${l}</option>`).join('')}
        </select>`;
    }
    else if (p.tipo === "chocolate") {
        selectores += `
        <select onchange="actualizarExtra(${index}, 'leche', this.value)" style="width:100%; padding:8px; margin-bottom:5px; border:1px solid #ffccd8; border-radius:8px;">
            ${tiposLeche.map(l => `<option value="${l}" ${p.leche === l ? 'selected' : ''}>${l}</option>`).join('')}
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

function actualizarContador() {
    const contador = document.getElementById('cart-count');
    if (contador) contador.innerText = carrito.length;
}

window.guardarGusto = function(index, gustoIndex, valor) {
    carrito[index].gustos[gustoIndex] = valor;
    localStorage.setItem('carrito', JSON.stringify(carrito));
};

window.addEventListener('DOMContentLoaded', () => {
    actualizarContador();
    renderizarCarrito();
});
