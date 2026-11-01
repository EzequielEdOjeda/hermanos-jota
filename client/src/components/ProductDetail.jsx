import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatearPrecio, imagenDe } from "../utils/format";
import ProductCard from "./ProductCard"; 

function ProductDetail({ producto, productos, cargando, error, onAgregar, onEliminar }) {
  const { usuario } = useAuth();
  const puedeGestionar = usuario?.rol === "admin" || usuario?.rol === "editor";
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

  const ficha = producto
    ? [
        ["Medidas", producto.medidas],
        ["Materiales", producto.materiales],
        ["Acabado", producto.acabado],
        ["Detalle", producto.detalleExtra],
      ].filter(([, valor]) => valor)
    : [];

  // Filtramos productos de la misma categoría, excluyendo el actual, y tomamos hasta 4
  const productosRelacionados = productos
    ? productos.filter((p) => p.categoria === producto?.categoria && p.id !== producto?.id).slice(0, 4)
    : [];
	
  const sinStock = producto?.stock <= 0;
	
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
            <div className="skeleton-grid" style={{ gridTemplateColumns: "1fr 1fr" }} aria-hidden="true">
              <div className="skeleton-card"></div>
              <div className="skeleton-card" style={{ aspectRatio: "auto" }}></div>
            </div>
          )}

          {/* Estado de error */}
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
                {puedeGestionar && (
                  <div className="admin-bar" role="group" aria-label="Acciones de administrador">
                    <span className="badge-admin">
                      {usuario.rol === "admin" ? "Admin" : "Editor"}
                    </span>
                    <Link to={`/admin/editar-producto/${producto.id}`} className="btn btn-sm btn-editar">
                      Editar
                    </Link>
                    <button type="button" className="btn btn-sm btn-eliminar" onClick={eliminar}>
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
					  <tr>
						<th>Categoría</th>
						<td>{producto.categoria}</td>
					  </tr>
					  <tr>
						<th>Stock disponible</th>
						<td>
						  <span style={{ color: sinStock ? "var(--color-error)" : "var(--color-verde)", fontWeight: "600" }}>
							{sinStock ? "Sin stock" : `${producto.stock} unidades`}
						  </span>
						</td>
					  </tr>
					</tbody>
				  </table>
				)}

                <div className="qty-stepper">
				  <label>Cantidad</label>
				  <div className="qty-stepper__controls">
					<button type="button" aria-label="Restar unidad" onClick={restar}>−</button>
					<input type="number" value={cantidad} min="1" max="10" readOnly />
					<button type="button" aria-label="Sumar unidad" onClick={sumar}>+</button>
				  </div>
				</div>

                <button className="btn btn-primary btn-full" type="button" onClick={agregarAlCarrito}>
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

      {/* SECCIÓN DE PRODUCTOS RELACIONADOS (NUEVA) */}
      {!cargando && producto && productosRelacionados.length > 0 && (
        <section className="section section--related" style={{ borderTop: "1px solid var(--color-border)", paddingTop: "3rem", paddingBottom: "3rem" }}>
          <div className="container">
            <p className="eyebrow">También te puede gustar</p>
            <h2 className="section-title" style={{ textTransform: "uppercase", marginBottom: "2rem" }}>
              Más de {producto.categoria}
            </h2>
            
            <div className="product-grid">
              {productosRelacionados.map((p) => (
                <ProductCard
                  key={p.id}
                  producto={p}
                  onAgregar={onAgregar}
                  onEliminar={onEliminar}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default ProductDetail;