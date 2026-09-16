import { formatearPrecio } from "../utils/format";

/**
 * Tarjeta individual de producto. Recibe el producto y dos callbacks
 * (ver detalle / agregar al carrito) vía props; no maneja estado propio.
 */
function ProductCard({ producto, onVerDetalle, onAgregar }) {
  return (
    <article className="product-card">
      <a
        href={`#producto-${producto.id}`}
        className="product-card__media"
        onClick={(e) => {
          e.preventDefault();
          onVerDetalle(producto.id);
        }}
      >
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
      </a>
      <div className="product-card__body">
        <span className="product-card__category">{producto.categoria}</span>
        <h3 className="product-card__name">
          <a
            href={`#producto-${producto.id}`}
            onClick={(e) => {
              e.preventDefault();
              onVerDetalle(producto.id);
            }}
          >
            {producto.nombre}
          </a>
        </h3>
        <p className="product-card__desc">{producto.descripcionCorta}</p>
        <div className="product-card__footer">
          <span className="product-card__price">{formatearPrecio(producto.precio)}</span>
          <button className="card-btn-add" onClick={() => onAgregar(producto, 1)}>
            Añadir
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
