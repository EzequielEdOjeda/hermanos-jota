import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { formatearPrecio } from "../utils/format";
import { obtenerProductoPorId } from "../services/api";

/**
 * Página de detalle de un producto.
 * Lee el id desde la URL con useParams y hace su propio GET
 * /api/productos/:id (en vez de buscar en el listado global ya
 * cargado), para que la página funcione también si se llega a ella
 * directamente por URL (compartida, recargada, etc.) sin depender de
 * que /productos ya se haya cargado antes.
 */
function ProductDetail({ onAgregar }) {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    let activo = true;

    async function cargarProducto() {
      setCargando(true);
      setError(null);
      setProducto(null);
      setCantidad(1);

      try {
        const data = await obtenerProductoPorId(id);
        if (activo) setProducto(data);
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarProducto();

    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <section className="section">
        <div className="container">
          <div className="skeleton-detail" aria-hidden="true">
            <div className="skeleton-detail__media"></div>
            <div className="skeleton-detail__info">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !producto) {
    return (
      <section className="section">
        <div className="container">
          <p className="state-message">
            {error ? "No pudimos cargar este producto." : "No encontramos ese producto."}{" "}
            <Link to="/productos">Volver al catálogo</Link>.
          </p>
        </div>
      </section>
    );
  }

  const stockMaximo = producto.stock > 0 ? producto.stock : 10;
  const sinStock = producto.stock === 0;

  return (
    <section className="section">
      <div className="container">
        <nav className="breadcrumb" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link> / <Link to="/productos">Catálogo</Link> / {producto.nombre}
        </nav>

        <div className="product-detail">
          <div className="product-detail__media">
            <img src={producto.imagenUrl} alt={producto.nombre} />
          </div>

          <div className="product-detail__info">
            <span className="product-card__category">{producto.categoria}</span>
            <h1>{producto.nombre}</h1>
            <p className="product-detail__price">{formatearPrecio(producto.precio)}</p>
            <p className="product-detail__description">{producto.descripcion}</p>

            <table className="spec-table">
              <tbody>
                <tr>
                  <th>Categoría</th>
                  <td>{producto.categoria}</td>
                </tr>
                <tr>
                  <th>Stock disponible</th>
                  <td>{sinStock ? "Sin stock" : `${producto.stock} unidades`}</td>
                </tr>
              </tbody>
            </table>

            <div className="qty-stepper">
              <label htmlFor="cantidad">Cantidad</label>
              <div className="qty-stepper__controls">
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                  disabled={sinStock}
                  aria-label="Restar"
                >
                  −
                </button>
                <input id="cantidad" type="text" value={cantidad} readOnly />
                <button
                  type="button"
                  onClick={() => setCantidad((c) => Math.min(stockMaximo, c + 1))}
                  disabled={sinStock}
                  aria-label="Sumar"
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={() => onAgregar(producto, cantidad)}
              disabled={sinStock}
            >
              {sinStock ? "Sin stock disponible" : "Añadir al carrito"}
            </button>

            <div className="trust-badges">
              <span>🌳 Madera certificada FSC®</span>
              <span>📦 Garantía extendida</span>
              <span>♻️ Materiales sostenibles</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
