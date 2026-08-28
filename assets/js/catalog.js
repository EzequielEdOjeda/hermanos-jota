/**
 * Hermanos Jota — productos.html
 * Carga asíncrona del catálogo completo + filtros por categoría + buscador.
 */

let TODOS_LOS_PRODUCTOS = [];
let categoriaActiva = "todas";
let terminoBusqueda = "";

function crearTarjetaProductoCatalogo(producto, esPrioritaria) {
  const article = document.createElement("article");
  article.className = "product-card";

  // Las primeras tarjetas quedan arriba del fold apenas carga la grilla:
  // se cargan de forma eager/alta prioridad. El resto sigue en "lazy"
  // para no gastar ancho de banda en imágenes que el usuario todavía
  // no ve.
  const atributosImg = esPrioritaria
    ? `loading="eager" fetchpriority="high"`
    : `loading="lazy"`;

  article.innerHTML = `
    <a href="producto.html?slug=${producto.slug}" class="product-card__media">
      <img src="${producto.imagen}" alt="${producto.nombre}" ${atributosImg} decoding="async">
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

function renderizarFiltros() {
  const contenedor = document.getElementById("filtros");
  contenedor.innerHTML = "";

  CATEGORIAS.forEach((cat) => {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "filter-chip" + (cat.valor === categoriaActiva ? " is-active" : "");
    boton.textContent = cat.etiqueta;
    boton.dataset.categoria = cat.valor;
    contenedor.appendChild(boton);
  });
}

function aplicarFiltros() {
  const grid = document.getElementById("catalogo-grid");
  const vacio = document.getElementById("catalogo-vacio");

  let resultado = TODOS_LOS_PRODUCTOS;

  if (categoriaActiva !== "todas") {
    resultado = resultado.filter((p) => p.categoria === categoriaActiva);
  }

  if (terminoBusqueda.trim() !== "") {
    const termino = terminoBusqueda.trim().toLowerCase();
    resultado = resultado.filter(
      (p) =>
        p.nombre.toLowerCase().includes(termino) ||
        p.descripcionCorta.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino)
    );
  }

  grid.innerHTML = "";

  if (resultado.length === 0) {
    vacio.hidden = false;
    grid.hidden = true;
    return;
  }

  vacio.hidden = true;
  grid.hidden = false;
  const CANTIDAD_PRIORITARIA = 4; // tarjetas visibles sin scroll (aprox.)
  resultado.forEach((producto, indice) => {
    grid.appendChild(
      crearTarjetaProductoCatalogo(producto, indice < CANTIDAD_PRIORITARIA)
    );
  });
}

async function inicializarCatalogo() {
  const loading = document.getElementById("catalogo-loading");
  const grid = document.getElementById("catalogo-grid");

  try {
    TODOS_LOS_PRODUCTOS = await obtenerProductos();

    renderizarFiltros();
    aplicarFiltros();

    loading.hidden = true;
    grid.hidden = false;
  } catch (error) {
    loading.innerHTML = `<p class="state-message">No pudimos cargar el catálogo. Intentá recargar la página.</p>`;
    console.error(error);
  }
}

// Delegación de eventos para los chips de categoría (se generan dinámicamente)
document.addEventListener("click", (evento) => {
  const chip = evento.target.closest(".filter-chip");
  if (!chip) return;

  categoriaActiva = chip.dataset.categoria;
  document
    .querySelectorAll(".filter-chip")
    .forEach((el) => el.classList.toggle("is-active", el === chip));
  aplicarFiltros();
});

document.addEventListener("DOMContentLoaded", () => {
  inicializarCatalogo();

  const buscador = document.getElementById("buscador");
  buscador.addEventListener("input", (evento) => {
    terminoBusqueda = evento.target.value;
    aplicarFiltros();
  });
});
