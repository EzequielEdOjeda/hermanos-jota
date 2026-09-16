import { useState } from "react";
import { formatearPrecio } from "../utils/format";

function ProductDetail({ producto, cargando, error, onAgregar, onNavigate }) {
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

  return (
    <>
      <div className="container">
        <p className="breadcrumb">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("inicio");
            }}
          >
            Inicio
          </a>{" "}
          /{" "}
          <a
            href="#catalogo"
            onClick={(e) => {
              e.preventDefault();
              onNavigate("catalogo");
            }}
          >
            Catálogo
          </a>{" "}
          / <span>{producto ? producto.nombre : "Producto"}</span>
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
              No encontramos ese producto.{" "}
              <a
                href="#catalogo"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate("catalogo");
                }}
              >
                Volvé al catálogo
              </a>
              .
            </p>
          )}

          {/* Contenido real */}
          {!cargando && !error && producto && (
            <article className="product-detail">
              <div className="product-detail__media">
                <img src={producto.imagen} alt={producto.nombre} />
              </div>

              <div className="product-detail__info">
                <span className="product-detail__category">{producto.categoria}</span>
                <h1 className="product-detail__title">{producto.nombre}</h1>
                <p className="product-detail__price">{formatearPrecio(producto.precio)}</p>
                <p className="product-detail__desc">{producto.descripcionLarga}</p>

                <table className="spec-table">
                  <tbody>
                    <tr>
                      <th scope="row">Medidas</th>
                      <td>{producto.medidas}</td>
                    </tr>
                    <tr>
                      <th scope="row">Materiales</th>
                      <td>{producto.materiales}</td>
                    </tr>
                    <tr>
                      <th scope="row">Acabado</th>
                      <td>{producto.acabado}</td>
                    </tr>
                    <tr>
                      <th scope="row">Detalle</th>
                      <td>{producto.detalleExtra}</td>
                    </tr>
                  </tbody>
                </table>

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
