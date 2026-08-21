/**
 * Hermanos Jota — Carrito simulado
 * Sin backend: el carrito vive en localStorage para persistir entre páginas.
 */

const CARRITO_KEY = "hj_carrito";

function leerCarrito() {
  try {
    const data = localStorage.getItem(CARRITO_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("No se pudo leer el carrito:", error);
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderizarCarritoPanel();
}

function agregarAlCarrito(slug, nombre, precio, imagen) {
  const carrito = leerCarrito();
  const existente = carrito.find((item) => item.slug === slug);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ slug, nombre, precio, imagen, cantidad: 1 });
  }

  guardarCarrito(carrito);
}

function quitarDelCarrito(slug) {
  const carrito = leerCarrito().filter((item) => item.slug !== slug);
  guardarCarrito(carrito);
}

function cambiarCantidad(slug, delta) {
  const carrito = leerCarrito();
  const item = carrito.find((p) => p.slug === slug);
  if (!item) return;

  const nuevaCantidad = item.cantidad + delta;
  if (nuevaCantidad <= 0) {
    quitarDelCarrito(slug);
    return;
  }

  item.cantidad = nuevaCantidad;
  guardarCarrito(carrito);
}

function contarItemsCarrito() {
  return leerCarrito().reduce((total, item) => total + item.cantidad, 0);
}

function calcularTotalCarrito() {
  return leerCarrito().reduce((total, item) => total + item.precio * item.cantidad, 0);
}

function actualizarContadorCarrito() {
  const badges = document.querySelectorAll("[data-cart-count]");
  const total = contarItemsCarrito();
  badges.forEach((badge) => {
    badge.textContent = total;
    badge.classList.toggle("is-visible", total > 0);
  });
}

/**
 * Renderiza el contenido del carrito en el panel flotante
 */
function renderizarCarritoPanel() {
  const body = document.getElementById("cart-body");
  const totalEl = document.getElementById("cart-total");
  const carrito = leerCarrito();

  if (!body) return;

  if (carrito.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
          <path d="M3 6h18"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Tu carrito está vacío</p>
        <p style="font-size:0.85rem; margin-top:0.25rem;">Agregá productos para comenzar</p>
      </div>
    `;
    if (totalEl) totalEl.textContent = formatearPrecio(0);
    return;
  }

  let html = "";
  carrito.forEach((item) => {
    html += `
      <div class="cart-item" data-slug="${item.slug}">
        <div class="cart-item__image">
          <img src="${item.imagen}" alt="${item.nombre}" loading="lazy">
        </div>
        <div class="cart-item__info">
          <p class="cart-item__name">${item.nombre}</p>
          <span class="cart-item__price">${formatearPrecio(item.precio)}</span>
          <div class="cart-item__controls">
            <button class="cart-qty-btn" data-slug="${item.slug}" data-delta="-1" aria-label="Restar">−</button>
            <span class="qty">${item.cantidad}</span>
            <button class="cart-qty-btn" data-slug="${item.slug}" data-delta="1" aria-label="Sumar">+</button>
            <button class="cart-item__remove" data-slug="${item.slug}">✖️</button>
          </div>
        </div>
      </div>
    `;
  });

  body.innerHTML = html;
  if (totalEl) totalEl.textContent = formatearPrecio(calcularTotalCarrito());

  // Event listeners para los controles del carrito
  body.querySelectorAll(".cart-qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const slug = btn.dataset.slug;
      const delta = Number(btn.dataset.delta);
      cambiarCantidad(slug, delta);
    });
  });

  body.querySelectorAll(".cart-item__remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const slug = btn.dataset.slug;
      quitarDelCarrito(slug);
    });
  });
}

/**
 * Abre/cierra el panel flotante del carrito
 */
function toggleCarrito() {
  const overlay = document.getElementById("cart-overlay");
  const body = document.body;
  const isOpen = overlay.classList.toggle("is-open");
  body.classList.toggle("no-scroll", isOpen);
  if (isOpen) renderizarCarritoPanel();
}

function cerrarCarrito() {
  const overlay = document.getElementById("cart-overlay");
  overlay.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

/**
 * Muestra un pequeño aviso flotante ("toast") cuando se agrega un producto.
 */
function mostrarToast(mensaje) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = mensaje;
  toast.classList.add("is-visible");

  clearTimeout(toast._timeoutId);
  toast._timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

/**
 * Delegación de eventos: cualquier botón con [data-add-to-cart] agrega
 * el producto correspondiente al carrito.
 */
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-add-to-cart]");
  if (!boton) return;

  const { slug, nombre, precio, imagen } = boton.dataset;
  agregarAlCarrito(slug, nombre, Number(precio), imagen);
  mostrarToast(`"${nombre}" se añadió al carrito`);
});

document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();

  // Menú móvil (hamburguesa)
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const abierto = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  }

  // Abrir carrito al hacer clic en .cart-link
  const cartLink = document.querySelector(".cart-link");
  if (cartLink) {
    cartLink.addEventListener("click", (e) => {
      e.preventDefault();
      toggleCarrito();
    });
  }

  // Cerrar carrito con el botón X
  const closeBtn = document.getElementById("cart-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", cerrarCarrito);
  }

  // Cerrar carrito al hacer clic en el overlay
  const overlay = document.getElementById("cart-overlay");
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) cerrarCarrito();
    });
  }

  // Cerrar carrito con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarCarrito();
  });
});