/**
 * Hermanos Jota — index.html
 * Simula una petición asíncrona al "servidor" para traer el catálogo
 * y renderiza únicamente los productos marcados como destacados.
 */

function crearTarjetaProducto(producto) {
  const article = document.createElement("article");
  article.className = "product-card";

  article.innerHTML = `
    <a href="producto.html?slug=${producto.slug}" class="product-card__media">
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
    </a>
    <div class="product-card__body">
      <span class="product-card__category">${producto.categoria}</span>
      <h3 class="product-card__name">
        <a href="producto.html?slug=${producto.slug}">${producto.nombre}</a>
      </h3>
      <p class="product-card__desc">${producto.descripcionCorta}</p>
      <div class="product-card__footer">
        <span class="product-card__price">${formatearPrecio(producto.precio)}</span>
        <button
          class="card-btn-add"
          data-add-to-cart
          data-slug="${producto.slug}"
          data-nombre="${producto.nombre}"
          data-precio="${producto.precio}"
          data-imagen="${producto.imagen}"
        >
          Añadir
        </button>
      </div>
    </div>
  `;

  return article;
}

async function cargarDestacados() {
  const loading = document.getElementById("destacados-loading");
  const grid = document.getElementById("destacados-grid");

  try {
    const productos = await obtenerProductos();
    const destacados = productos.filter((p) => p.destacado);

    grid.innerHTML = "";
    destacados.forEach((producto) => {
      grid.appendChild(crearTarjetaProducto(producto));
    });

    loading.hidden = true;
    grid.hidden = false;
  } catch (error) {
    loading.innerHTML = `<p class="state-message">No pudimos cargar los productos destacados. Intentá recargar la página.</p>`;
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", cargarDestacados);
