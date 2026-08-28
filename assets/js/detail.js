/**
 * Hermanos Jota — producto.html
 * Lee el slug desde la URL (?slug=...), busca el producto en el
 * "catálogo asíncrono" y completa el detalle. Maneja el selector
 * de cantidad y el botón "Añadir al carrito".
 * Incluye skeleton de carga y precarga de productos relacionados.
 */

function obtenerSlugDeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

function pintarProducto(producto) {
  document.title = `${producto.nombre} — Hermanos Jota`;
  const titleEl = document.getElementById("page-title");
  if (titleEl) titleEl.textContent = `${producto.nombre} — Hermanos Jota`;
  
  const breadcrumb = document.getElementById("breadcrumb-nombre");
  if (breadcrumb) breadcrumb.textContent = producto.nombre;

  const imagen = document.getElementById("detalle-imagen");
  if (imagen) {
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
    imagen.loading = "eager";
  }

  const categoria = document.getElementById("detalle-categoria");
  if (categoria) categoria.textContent = producto.categoria;

  const nombre = document.getElementById("detalle-nombre");
  if (nombre) nombre.textContent = producto.nombre;

  const precio = document.getElementById("detalle-precio");
  if (precio) precio.textContent = formatearPrecio(producto.precio);

  const descripcion = document.getElementById("detalle-descripcion");
  if (descripcion) descripcion.textContent = producto.descripcionLarga;

  const medidas = document.getElementById("detalle-medidas");
  if (medidas) medidas.textContent = producto.medidas;

  const materiales = document.getElementById("detalle-materiales");
  if (materiales) materiales.textContent = producto.materiales;

  const acabado = document.getElementById("detalle-acabado");
  if (acabado) acabado.textContent = producto.acabado;

  const extra = document.getElementById("detalle-extra");
  if (extra) extra.textContent = producto.detalleExtra;

  const boton = document.getElementById("btn-agregar-detalle");
  if (boton) {
    boton.dataset.slug = producto.slug;
    boton.dataset.nombre = producto.nombre;
    boton.dataset.precio = producto.precio;
    boton.dataset.imagen = producto.imagen;
  }

  // Precargar productos relacionados si existen
  if (producto.relacionados && typeof precargarProducto === 'function') {
    producto.relacionados.forEach((slug, index) => {
      setTimeout(() => {
        precargarProducto(slug);
      }, 300 + (index * 200));
    });
  }
}

function generarSkeletonDetalle() {
  return `
    <div class="skeleton-detail">
      <div class="skeleton-detail__media"></div>
      <div class="skeleton-detail__info">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    </div>
  `;
}

function inicializarStepperCantidad() {
  const input = document.getElementById("cantidad");
  const restar = document.getElementById("restar-cantidad");
  const sumar = document.getElementById("sumar-cantidad");

  if (!input || !restar || !sumar) return;

  restar.addEventListener("click", () => {
    const valor = Math.max(1, Number(input.value) - 1);
    input.value = valor;
  });

  sumar.addEventListener("click", () => {
    const valor = Math.min(10, Number(input.value) + 1);
    input.value = valor;
  });

  // Permitir entrada manual con validación
  input.addEventListener("change", () => {
    let valor = parseInt(input.value) || 1;
    valor = Math.max(1, Math.min(10, valor));
    input.value = valor;
  });
}

function inicializarBotonAgregar() {
  const boton = document.getElementById("btn-agregar-detalle");
  if (!boton) return;

  boton.addEventListener("click", () => {
    const cantidad = Number(document.getElementById("cantidad").value) || 1;
    const { slug, nombre, precio, imagen } = boton.dataset;

    // Estado de carga en el botón
    boton.classList.add("loading");
    const originalText = boton.innerHTML;
    boton.innerHTML = `<span class="loader-spinner"></span>`;

    // Simular un pequeño delay para feedback visual
    setTimeout(() => {
      for (let i = 0; i < cantidad; i++) {
        agregarAlCarrito(slug, nombre, Number(precio), imagen);
      }

      mostrarToast(`${cantidad} × "${nombre}" añadido al carrito`);
      
      boton.classList.remove("loading");
      boton.innerHTML = originalText;
    }, 300);
  });
}

async function inicializarDetalle() {
  const slug = obtenerSlugDeUrl();
  const loading = document.getElementById("detalle-loading");
  const contenido = document.getElementById("detalle-contenido");
  const errorMsg = document.getElementById("detalle-error");

  // Mostrar skeleton inmediatamente
  if (loading) {
    loading.innerHTML = generarSkeletonDetalle();
    loading.hidden = false;
  }

  if (!slug) {
    if (loading) loading.hidden = true;
    if (errorMsg) errorMsg.hidden = false;
    return;
  }

  try {
    // Intentar obtener de caché primero (si está disponible)
    let producto = null;
    
    // Si tenemos la función de products.js
    if (typeof obtenerProductosConCache === 'function') {
      const productos = await obtenerProductosConCache();
      producto = productos.find(p => p.slug === slug);
    }
    
    // Si no está en caché, obtener individualmente
    if (!producto) {
      producto = await obtenerProductoPorSlug(slug);
    }

    pintarProducto(producto);
    inicializarStepperCantidad();
    inicializarBotonAgregar();

    if (loading) loading.hidden = true;
    if (contenido) contenido.hidden = false;

  } catch (error) {
    if (loading) loading.hidden = true;
    if (errorMsg) errorMsg.hidden = false;
    console.error(error);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarDetalle);
