// ===============================
// 🔥 LOADING OVERLAY
// ===============================
function mostrarProcesandoPago() {
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
                top:0;
                left:0;
                width:100%;
                height:100%;
                background:rgba(0,0,0,0.6);
                display:flex;
                justify-content:center;
                align-items:center;
                z-index:99999;
            }
            .loader-box{
                background:var(--color-bg-card, #fff);
                padding:25px 30px;
                border-radius:12px;
                text-align:center;
                color:var(--color-text-main, #000);
                font-family:Arial;
            }
            .spinner{
                width:45px;
                height:45px;
                border:5px solid #ccc;
                border-top:5px solid #ff4d6d;
                border-radius:50%;
                animation:spin 1s linear infinite;
                margin:0 auto 10px auto;
            }
            @keyframes spin{
                0%{transform:rotate(0deg);}
                100%{transform:rotate(360deg);}
            }
        `;
        document.head.appendChild(style);
    }

    loader.style.display = "flex";
}

function ocultarProcesandoPago() {
    const loader = document.getElementById("loader-pago");
    if (loader) loader.style.display = "none";
}

// ===============================
// 🧠 BASE DE DATOS
// ===============================
const listaSaboresHelados = ["MOUSSE DE CHOCOLATE","MOUSSE DE FRAMBUESA","MOUSSE DE LEMON PIE","MOUSSE DE MARACUYA","MOUSSE DE LIMON","ANANA AL AGUA","DURAZNO AL AGUA","FRANUI AL AGUA","FRUTILLA AL AGUA","FRUTOS PATAGONICOS AL AGUA","LIMON AL AGUA","LIMON, JENGIBRE Y MENTA(AL AGUA)","LIMON, JENGIBRE Y ALBAHACA(AL AGUA)","DULCE DE LECHE BOMBON","DULCE DE LECHE BROWNIE","DULCE DE LECHE CLASICO","CHOCOTORTA","COCO CON DULCE DE LECHE","DULCE DE LECHE CRUNCH","FLAN CON DULCE DE LECHE","DULCE DE LECHE GRANIZADO","SUPER DULCE DE LECHE","CHOCOLATE BLANCO","CHOCOLATE BLOCK","CHOCOLATE BUENARDO","CHOCOLATE CLASICO","CHOCOLATE CON ALMENDRAS","CHOCOLATE CON PASAs","CHOCOLATE DOLCE BAJON","CHOCOLATE HAVANNA","CHOCOLATE KINDER","CHOCOLATE MARROC","CHOCOLATE MARQUISE","CHOCOLATE NUCCIOLATO","CHOCOLATE NUTELLA","CHOCOLATE ROCHER","CHOCOLATE SUIZO","BANANITA DOLCA","BANANA SPLIT","BANANA SPLIT CON NUEZ","BANANA CON NUTELLA","CREMA BON O BOM","CADBURY DE FRUTILLA","CEREZA A LA CREMA","CHEESECAKE","CREMA DE ARANDANOS","CREMA DEL CIELO","CREMA OREO","CREMA RUSA","FORNITE","FRAMTTINO","FRAMBUESA CON PISTACHO","FRUTOS DEL BOSQUE","GRANIZADo","KINOTOS AL WHISKY","MANTECOL","MASCARPONE CON FRUTOS ROJOS","MENTA GRANIZADA","PISTACHO","TIRAMISU","FRAMBUESA AL AGUA","SAMBAYON ITALIANO","MOUSSE DE LIMON HAVANNA","FRAMBUESA A LA CREMA","NONA VICENTA","Açaí","SCALONETA"];

const listaSaboresMilkshakes = ["Oreo","Bon o bon","Chocolate dubai","Pistacho","Ferrero rocher","Frapuchino americana","Frapuccino dulce de leche","Dolce valentino","Dulce de leche","Belga furioso","Chocolinas","Creza silvestre"];

const tiposLeche = ["Entera","Descremada","Almendra"];
const variedadesCafe = ["Capuccino","Latte","Flat white","Cortado","Espresso simple","Espresso doble","Americano simple","Americano doble"];
const listaSaboresSalsas = ["Chocolate","Frutilla","Frutos patagonicos","Dulce de leche","Caramelo"];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// ===============================
// 🛒 CARRITO
// ===============================
window.agregarAlCarrito = function(nombre, precio) {

    let tipo = "otro";
    let tope = 0;

    if (nombre.includes("1 Kg") || nombre.includes("1/2 Kg") || nombre.includes("1/4 Kg") || nombre.includes("Promo 2x1")) {
        tipo = "helado";
        tope = nombre.includes("1 Kg") ? 4 : nombre.includes("1/2 Kg") ? 3 : nombre.includes("1/4 Kg") ? 2 : 4;
    } else if (nombre.toLowerCase().includes("batido de 3 bochas")) {
        tipo = "helado"; tope = 3;
    } else if (nombre.toLowerCase().includes("milkshake")) {
        tipo = "milkshake"; tope = 1;
    } else if (nombre.toLowerCase().includes("doble sabor")) {
        tipo = "helado"; tope = 8;
    } else if (nombre.toLowerCase().includes("café")) {
        tipo = "cafe";
    } else if (nombre.toLowerCase().includes("mamuschka")) {
        tipo = "chocolate";
    } else if (nombre.toLowerCase().includes("salsa")) {
        tipo = "salsa"; tope = 1;
    }

    const requiere = ["helado","milkshake","cafe","chocolate","salsa"].includes(tipo);
    let id = requiere ? Date.now() : nombre;

    let item = carrito.find(p => p.id === id);

    if (item) {
        item.cantidad++;
    } else {
        carrito.push({
            id,
            nombre,
            precioBase: parseFloat(precio) || 0,
            tipo,
            tope,
            cantidad: 1,
            gustos: Array(tope).fill(""),
            variedad: "",
            leche: ""
        });
    }

    guardarYRenderizar();
};

window.cambiarCantidad = function(i, d) {
    carrito[i].cantidad += d;
    if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
    guardarYRenderizar();
};

window.eliminarDelCarrito = function(i) {
    carrito.splice(i, 1);
    guardarYRenderizar();
};

window.actualizarExtra = function(i, campo, valor) {
    carrito[i][campo] = valor;
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

// ===============================
function guardarYRenderizar() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    actualizarContador();
}

// ===============================
// 🎨 RENDER
// ===============================
function renderizarCarrito() {
    const container = document.getElementById("cart-items");
    const totalContainer = document.getElementById("cart-total");
    if (!container) return;

    let html = "";
    let total = 0;

    carrito.forEach((p,i) => {
        let subtotal = p.precioBase * p.cantidad;
        total += subtotal;

        html += `
        <div style="padding:15px;border-bottom:1px solid var(--color-border);">
            <b>${p.nombre}</b>
            <div>$${subtotal.toLocaleString('es-AR')}</div>

            ${generarSelectores(p,i)}
        </div>`;
    });

    container.innerHTML = html;
    if (totalContainer) totalContainer.innerText = total.toLocaleString('es-AR');
}

// ===============================
function generarSelectores(p,i){
    if (p.tipo === "milkshake") {
        return `<select onchange="guardarGusto(${i},0,this.value)">
            ${listaSaboresMilkshakes.map(s=>`<option ${p.gustos[0]===s?"selected":""}>${s}</option>`).join("")}
        </select>`;
    }
    return "";
}

window.guardarGusto = function(i, g, v){
    carrito[i].gustos[g]=v;
    localStorage.setItem("carrito",JSON.stringify(carrito));
};

// ===============================
// 📊 contador
// ===============================
function actualizarContador(){
    const c=document.getElementById("cart-count");
    if(!c)return;
    c.innerText=carrito.reduce((a,p)=>a+p.cantidad,0);
}

// ===============================
// 💳 PAGO CON LOADING
// ===============================
window.procesarPago = function() {

    mostrarProcesandoPago();

    const nombre = document.getElementById('cliente-nombre')?.value.trim();
    const apellido = document.getElementById('cliente-apellido')?.value.trim();
    const telefono = document.getElementById('cliente-telefono')?.value.trim();
    const direccion = document.getElementById('cliente-direccion')?.value.trim();

    const opciones = document.getElementsByName('tipo-entrega');
    let tipoEntrega = "retiro";

    for (let o of opciones) {
        if (o.checked) tipoEntrega = o.value;
    }

    if (!nombre || !apellido || !telefono) {
        ocultarProcesandoPago();
        alert("Completa los datos");
        return;
    }

    if (tipoEntrega === "delivery" && !direccion) {
        ocultarProcesandoPago();
        alert("Falta dirección");
        return;
    }

    const datosPedido = {
        idPedido: "DT-" + Math.floor(1000 + Math.random()*9000),
        cliente:{nombre,apellido,telefono},
        entrega:{tipo:tipoEntrega,direccion:tipoEntrega==="delivery"?direccion:"Retiro"},
        total: document.getElementById("cart-total")?.innerText || "0",
        productos: carrito
    };

    localStorage.setItem("pedido_pendiente_pago", JSON.stringify(datosPedido));

    setTimeout(() => {
        window.open("pagar.html","_blank");
        ocultarProcesandoPago();
    }, 1200);
};

// ===============================
window.addEventListener("DOMContentLoaded", () => {
    actualizarContador();
    renderizarCarrito();
});
