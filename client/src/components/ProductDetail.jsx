import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatearPrecio, imagenDe } from "../utils/format";

function ProductDetail({ producto, cargando, error, onAgregar, onEliminar }) {
  const { esAdmin } = useAuth();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);

  function restar() {
    setCantidad((valor) => Math.max(1, valor - 1));
  }

  function sumar() {
    setCantidad((valor) => Math.min(10, valor + 1));
  }

  function agregarAlCarrito() {
    onAgregar(producto, cantidad);
    setCantidad(1);
  }

  async function eliminar() {
    const eliminado = await onEliminar(producto);
    if (eliminado) navigate("/catalogo");
  }

  // Un producto creado desde el panel admin puede no tener todos los datos
  // técnicos: solo se muestran las filas que tienen contenido.
  const ficha = producto
    ? [
        ["Medidas", producto.medidas],
        ["Materiales", producto.materiales],
        ["Acabado", producto.acabado],
        ["Detalle", producto.detalleExtra],
      ].filter(([, valor]) => valor)
    : [];

  return (
    <>
      <div className="container">
        <p className="breadcrumb">
          <Link to="/">Inicio</Link> / <Link to="/catalogo">Catálogo</Link> /{" "}
          <span>{producto ? producto.nombre : "Producto"}</span>
        </p>
      </div>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* Estado de carga */}
          {cargando && (
            <div
              className="skeleton-grid"
              style={{ gridTemplateColumns: "1fr 1fr" }}
              aria-hidden="true"
            >
              <div className="skeleton-card"></div>
              <div className="skeleton-card" style={{ aspectRatio: "auto" }}></div>
            </div>
          )}

          {/* Estado de error: id inválido o producto inexistente */}
          {!cargando && (error || !producto) && (
            <p className="state-message">
              No encontramos ese producto. <Link to="/catalogo">Volvé al catálogo</Link>.
            </p>
          )}

          {/* Contenido real */}
          {!cargando && !error && producto && (
            <article className="product-detail">
              <div className="product-detail__media">
                <img
                  className={producto.imagenUrl ? undefined : "is-placeholder"}
                  src={imagenDe(producto)}
                  alt={producto.nombre}
                />
              </div>

              <div className="product-detail__info">
                {esAdmin && (
                  <div className="admin-bar" role="group" aria-label="Acciones de administrador">
                    <span className="badge-admin">Admin</span>
                    <Link
                      to={`/admin/editar-producto/${producto.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Editar
                    </Link>
                    <button type="button" className="btn btn-danger btn-sm" onClick={eliminar}>
                      Eliminar
                    </button>
                  </div>
                )}

                <span className="product-detail__category">{producto.categoria}</span>
                <h1 className="product-detail__title">{producto.nombre}</h1>
                <p className="product-detail__price">{formatearPrecio(producto.precio)}</p>
                <p className="product-detail__desc">
                  {producto.descripcion || producto.descripcionCorta}
                </p>

                {ficha.length > 0 && (
                  <table className="spec-table">
                    <tbody>
                      {ficha.map(([titulo, valor]) => (
                        <tr key={titulo}>
                          <th scope="row">{titulo}</th>
                          <td>{valor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="quantity-row">
                  <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Cantidad</span>
                  <div className="quantity-stepper">
                    <button type="button" aria-label="Restar unidad" onClick={restar}>
                      −
                    </button>
                    <input type="number" value={cantidad} min="1" max="10" readOnly />
                    <button type="button" aria-label="Sumar unidad" onClick={sumar}>
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-full"
                  type="button"
                  onClick={agregarAlCarrito}
                >
                  Añadir al carrito
                </button>

                <div className="badge-row">
                  <span className="badge-pill">🌳 Madera certificada FSC®</span>
                  <span className="badge-pill">📦 Garantía extendida</span>
                  <span className="badge-pill">♻️ Materiales sostenibles</span>
                </div>
              </div>
            </article>
          )}
        </div>
      </section>
    </>
  );
}

export default ProductDetail;
