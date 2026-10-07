import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatearPrecio, imagenDe } from "../utils/format";

/**
 * Tarjeta individual de producto. Recibe el producto y los callbacks de
 * agregar al carrito / eliminar vía props. Los botones Editar y Eliminar
 * solo se muestran si la sesión es de un administrador.
 */
function ProductCard({ producto, onAgregar, onEliminar }) {
  const { esAdmin } = useAuth();
  const rutaDetalle = `/producto/${producto.id}`;

  return (
    <article className="product-card">
      <Link to={rutaDetalle} className="product-card__media">
        <img
          className={producto.imagenUrl ? undefined : "is-placeholder"}
          src={imagenDe(producto)}
          alt={producto.nombre}
          loading="lazy"
        />
      </Link>
      <div className="product-card__body">
        <span className="product-card__category">{producto.categoria}</span>
        <h3 className="product-card__name">
          <Link to={rutaDetalle}>{producto.nombre}</Link>
        </h3>
        <p className="product-card__desc">{producto.descripcionCorta}</p>
        <div className="product-card__footer">
          <span className="product-card__price">{formatearPrecio(producto.precio)}</span>
          <button className="card-btn-add" onClick={() => onAgregar(producto, 1)}>
            Añadir
          </button>
        </div>

        {esAdmin && (
          <div className="product-card__admin" role="group" aria-label="Acciones de administrador">
            <Link to={`/admin/editar-producto/${producto.id}`} className="card-btn-admin">
              <i className="bi bi-pencil" aria-hidden="true"></i>
              Editar
            </Link>
            <button
              type="button"
              className="card-btn-admin card-btn-admin--danger"
              onClick={() => onEliminar(producto)}
            >
              <i className="bi bi-trash3" aria-hidden="true"></i>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
