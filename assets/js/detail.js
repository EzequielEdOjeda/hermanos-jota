/**
 * Hermanos Jota — producto.html
 * Lee el slug desde la URL (?slug=...), busca el producto en el
 * "catálogo asíncrono" y completa el detalle. Maneja el selector
 * de cantidad y el botón "Añadir al carrito".
 */

function obtenerSlugDeUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("slug");
}

function pintarProducto(producto) {
  document.title = `${producto.nombre} — Hermanos Jota`;
  document.getElementById("page-title").textContent = `${producto.nombre} — Hermanos Jota`;
  document.getElementById("breadcrumb-nombre").textContent = producto.nombre;

  document.getElementById("detalle-imagen").src = producto.imagen;
  document.getElementById("detalle-imagen").alt = producto.nombre;
  document.getElementById("detalle-categoria").textContent = producto.categoria;
  document.getElementById("detalle-nombre").textContent = producto.nombre;
  document.getElementById("detalle-precio").textContent = formatearPrecio(producto.precio);
  document.getElementById("detalle-descripcion").textContent = producto.descripcionLarga;

  document.getElementById("detalle-medidas").textContent = producto.medidas;
  document.getElementById("detalle-materiales").textContent = producto.materiales;
  document.getElementById("detalle-acabado").textContent = producto.acabado;
  document.getElementById("detalle-extra").textContent = producto.detalleExtra;

  const boton = document.getElementById("btn-agregar-detalle");
  boton.dataset.slug = producto.slug;
  boton.dataset.nombre = producto.nombre;
  boton.dataset.precio = producto.precio;
  boton.dataset.imagen = producto.imagen;
}

function inicializarStepperCantidad() {
  const input = document.getElementById("cantidad");
  const restar = document.getElementById("restar-cantidad");
  const sumar = document.getElementById("sumar-cantidad");

  restar.addEventListener("click", () => {
    const valor = Math.max(1, Number(input.value) - 1);
    input.value = valor;
  });

  sumar.addEventListener("click", () => {
    const valor = Math.min(10, Number(input.value) + 1);
    input.value = valor;
  });
}

function inicializarBotonAgregar() {
  const boton = document.getElementById("btn-agregar-detalle");

  // Este botón no usa [data-add-to-cart] porque necesita respetar la
  // cantidad seleccionada, así que maneja su propio evento en vez de
  // depender de la delegación genérica de cart.js.
  boton.addEventListener("click", () => {
    const cantidad = Number(document.getElementById("cantidad").value) || 1;
    const { slug, nombre, precio, imagen } = boton.dataset;

    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(slug, nombre, Number(precio), imagen);
    }

    mostrarToast(`${cantidad} × "${nombre}" añadido al carrito`);
  });
}

async function inicializarDetalle() {
  const slug = obtenerSlugDeUrl();
  const loading = document.getElementById("detalle-loading");
  const contenido = document.getElementById("detalle-contenido");
  const errorMsg = document.getElementById("detalle-error");

  if (!slug) {
    loading.hidden = true;
    errorMsg.hidden = false;
    return;
  }

  try {
    const producto = await obtenerProductoPorSlug(slug);
    pintarProducto(producto);
    inicializarStepperCantidad();
    inicializarBotonAgregar();

    loading.hidden = true;
    contenido.hidden = false;
  } catch (error) {
    loading.hidden = true;
    errorMsg.hidden = false;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", inicializarDetalle);
