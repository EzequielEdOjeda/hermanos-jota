import { Link } from "react-router-dom";
import { formatearPrecio, imagenDe } from "../utils/format";

export default function AdminProductos({ productos, cargando, error, onEliminar }) {
  return (
    <div className="admin-page">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="eyebrow">PANEL DE ADMINISTRACIÓN</p>
          <h1 className="admin-page__title" style={{ margin: 0 }}>Gestión de Productos</h1>
        </div>
        <Link to="/admin/crear-producto" className="btn btn-primary">
          + NUEVO PRODUCTO
        </Link>
      </div>

      {cargando && !productos.length ? (
        <p className="state-message">Cargando productos...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NOMBRE</th>
                <th>CATEGORÍA</th>
                <th>PRECIO</th>
                <th>STOCK</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="admin-table__thumb" style={{ padding: 0, width: '48px' }}>
                        <img src={imagenDe(p)} alt={p.nombre} />
                      </div>
                      <span>{p.nombre}</span>
                    </div>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{p.categoria}</td>
                  <td>{formatearPrecio(p.precio)}</td>
                  <td>
                    <span className="badge-stock">{p.stock}</span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
					  <Link 
						to={`/admin/editar-producto/${p.id}`} 
						className="btn btn-outline btn-sm btn-editar"
					  >
						Editar
					  </Link>
					  <button
						className="btn btn-outline btn-sm btn-eliminar"
						onClick={() => onEliminar(p)}
					  >
						Eliminar
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
  );
}