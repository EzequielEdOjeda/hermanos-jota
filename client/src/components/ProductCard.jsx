import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/format";

/**
 * Tarjeta individual de producto. La navegación al detalle la resuelve
 * React Router (Link a /productos/:id); solo recibe por props el
 * producto y el callback para agregarlo al carrito.
 */
function ProductCard({ producto, onAgregar }) {
  const sinStock = producto.stock === 0;

  return (
    <article className="product-card">
      <Link to={`/productos/${producto._id}`} className="product-card__media">
        <img src={producto.imagenUrl} alt={producto.nombre} loading="lazy" />
      </Link>
      <div className="product-card__body">
        <span className="product-card__category">{producto.categoria}</span>
        <h3 className="product-card__name">
          <Link to={`/productos/${producto._id}`}>{producto.nombre}</Link>
        </h3>
        <p className="product-card__desc">{producto.descripcion}</p>
        <div className="product-card__footer">
          <span className="product-card__price">{formatearPrecio(producto.precio)}</span>
          <button
            className="card-btn-add"
            onClick={() => onAgregar(producto, 1)}
            disabled={sinStock}
            title={sinStock ? "Sin stock disponible" : "Añadir al carrito"}
          >
            {sinStock ? "Sin stock" : "Añadir"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
