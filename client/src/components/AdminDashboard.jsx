import { useState } from "react";
import { Link } from "react-router-dom";

import { eliminarProducto } from "../services/api";
import { formatearPrecio } from "../utils/format";

/**
 * Panel de administración: lista todos los productos en una tabla con
 * acciones de editar/eliminar, y un acceso directo para crear uno nuevo.
 * No es una ruta pedida explícitamente por la consigna, pero es el lugar
 * natural para disparar las acciones de Update y Delete del CRUD desde
 * la interfaz (ver README → Decisiones tomadas).
 */
function AdminDashboard({ productos, cargando, error, onRecargar, onToast }) {
  const [eliminandoId, setEliminandoId] = useState(null);

  async function manejarEliminar(producto) {
    const confirmado = window.confirm(
      `¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmado) return;

    setEliminandoId(producto._id);

    try {
      await eliminarProducto(producto._id);
      await onRecargar?.();
      onToast?.(`"${producto.nombre}" fue eliminado`);
    } catch (err) {
      onToast?.(err.message || "No se pudo eliminar el producto");
    } finally {
      setEliminandoId(null);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-header section-header--split">
          <div className="section-intro">
            <p className="eyebrow">Panel de administración</p>
            <h1 className="section-title">Gestión de productos</h1>
          </div>
          <Link to="/admin/crear-producto" className="btn btn-primary">
            + Nuevo producto
          </Link>
        </div>

        {cargando && <p className="state-message">Cargando productos…</p>}

        {!cargando && error && (
          <p className="state-message">
            No pudimos cargar los productos. Intentá recargar la página.
          </p>
        )}

        {!cargando && !error && productos.length === 0 && (
          <p className="state-message">
            Todavía no hay productos cargados.{" "}
            <Link to="/admin/crear-producto">Creá el primero</Link>.
          </p>
        )}

        {!cargando && !error && productos.length > 0 && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Categoría</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto._id}>
                    <td>
                      <img
                        className="admin-table__thumb"
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        loading="lazy"
                      />
                    </td>
                    <td>
                      <Link to={`/productos/${producto._id}`}>{producto.nombre}</Link>
                    </td>
                    <td>{producto.categoria}</td>
                    <td>{formatearPrecio(producto.precio)}</td>
                    <td>
                      <span
                        className={`stock-pill${producto.stock === 0 ? " stock-pill--vacio" : ""}`}
                      >
                        {producto.stock}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <Link
                          to={`/admin/editar-producto/${producto._id}`}
                          className="btn-sm btn-sm--outline"
                        >
                          Editar
                        </Link>
                        <button
                          type="button"
                          className="btn-sm btn-sm--danger"
                          onClick={() => manejarEliminar(producto)}
                          disabled={eliminandoId === producto._id}
                        >
                          {eliminandoId === producto._id ? "Eliminando…" : "Eliminar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminDashboard;
