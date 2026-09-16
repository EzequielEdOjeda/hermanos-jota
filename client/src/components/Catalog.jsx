import { useState } from "react";
import ProductList from "./ProductList";
import { CATEGORIAS } from "../utils/format";

function Catalog({ productos, cargando, error, onVerDetalle, onAgregar }) {
  const [categoriaActiva, setCategoriaActiva] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  let resultado = productos;

  if (categoriaActiva !== "todas") {
    resultado = resultado.filter((p) => p.categoria === categoriaActiva);
  }

  if (busqueda.trim() !== "") {
    const termino = busqueda.trim().toLowerCase();
    resultado = resultado.filter(
      (p) =>
        p.nombre.toLowerCase().includes(termino) ||
        p.descripcionCorta.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino),
    );
  }

  return (
    <>
      <section className="section" style={{ paddingBottom: "1rem" }}>
        <div className="container">
          <p className="eyebrow">Catálogo completo</p>
          <h1 className="section-title">Nuestros muebles</h1>
          <p className="section-intro" style={{ color: "var(--color-ink-soft)" }}>
            Once piezas, cada una con su propia historia de artesanía y materiales nobles. Filtrá
            por ambiente o buscá por nombre.
          </p>

          <div className="catalog-toolbar">
            <div className="search-field">
              <label htmlFor="buscador" className="visually-hidden">
                Buscar producto
              </label>
              <input
                type="search"
                id="buscador"
                placeholder="Buscar por nombre… (ej: mesa, sofá, silla)"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="filter-chips" role="group" aria-label="Filtrar por categoría">
              {CATEGORIAS.map((cat) => (
                <button
                  key={cat.valor}
                  type="button"
                  className={`filter-chip${cat.valor === categoriaActiva ? " is-active" : ""}`}
                  onClick={() => setCategoriaActiva(cat.valor)}
                >
                  {cat.etiqueta}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {cargando && (
            <div className="skeleton-grid" aria-hidden="true">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          )}

          {!cargando && error && (
            <p className="state-message">
              No pudimos cargar el catálogo. Intentá recargar la página.
            </p>
          )}

          {!cargando && !error && resultado.length === 0 && (
            <p className="state-message">
              No encontramos productos que coincidan con tu búsqueda. Probá con otro término.
            </p>
          )}

          {!cargando && !error && resultado.length > 0 && (
            <ProductList productos={resultado} onVerDetalle={onVerDetalle} onAgregar={onAgregar} />
          )}
        </div>
      </section>
    </>
  );
}

export default Catalog;
