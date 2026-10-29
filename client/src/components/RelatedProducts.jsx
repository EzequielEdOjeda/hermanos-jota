import { Link } from "react-router-dom";

import { formatearPrecio } from "../utils/format";
import { getImagenProducto, onImagenError } from "../utils/imagen";

const MAX_RELACIONADOS = 4;

/**
 * Productos de la misma categoría que el que se está viendo.
 * Recibe el listado global (ya cargado en App) para no hacer otra
 * petición a la API. Si no hay otros productos de la categoría,
 * no renderiza nada.
 */
function RelatedProducts({ producto, productos, onAgregar }) {
  const relacionados = productos
    .filter((p) => p.categoria === producto.categoria && p._id !== producto._id)
    .slice(0, MAX_RELACIONADOS);

  if (relacionados.length === 0) return null;

  return (
    <section className="related" aria-labelledby="relacionados-titulo">
      <p className="eyebrow">También te puede gustar</p>
      <h2 id="relacionados-titulo" className="section-title">
        Más de {producto.categoria}
      </h2>

      <div className="product-grid">
        {relacionados.map((p) => (
          <article key={p._id} className="product-card">
            <div className="product-card__media">
              <Link to={`/productos/${p._id}`} aria-label={`Ver ${p.nombre}`}>
                <img
                  src={getImagenProducto(p)}
                  alt={p.nombre}
                  loading="lazy"
                  onError={onImagenError}
                />
              </Link>
            </div>

            <div className="product-card__body">
              <span className="product-card__category">{p.categoria}</span>
              <h3 className="product-card__name">
                <Link to={`/productos/${p._id}`}>{p.nombre}</Link>
              </h3>

              <div className="product-card__footer">
                <span className="product-card__price">{formatearPrecio(p.precio)}</span>
                <button
                  type="button"
                  className="card-btn-add"
                  onClick={() => onAgregar(p)}
                  disabled={p.stock === 0}
                >
                  {p.stock === 0 ? "Sin stock" : "Añadir"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;