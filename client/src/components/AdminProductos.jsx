import { Link } from 'react-router-dom'
import { imagenDe, formatearPrecio } from '../utils/format'

export default function AdminProductos({ productos, cargando, error, onEliminar }) {
  if (cargando) {
	  return (
		<section className="container admin-page">
		  <p className="admin-breadcrumb">Panel admin / Productos</p>
		  <h1 className="admin-title">GESTIONAR PRODUCTOS</h1>
		  <div className="admin-loading">
			<div className="spinner" aria-hidden="true"></div>
			<p>Cargando productos…</p>
		  </div>
		</section>
	  )
	}
  if (error) return <p className="admin-msg admin-msg--error">{error}</p>

  return (
    <section className="container admin-page">
      <p className="admin-breadcrumb">Panel admin / Productos</p>
      <h1 className="admin-title">GESTIONAR PRODUCTOS</h1>

      <div className="admin-actions">
        <Link to="/admin/crear-producto" className="btn btn-primary btn-sm">
          + Nuevo producto
        </Link>
      </div>
      <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
		    <th></th>   
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
			  <td className="admin-table__thumb">
				  <img src={imagenDe(p)} alt={p.nombre} loading="lazy" />
				</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>{formatearPrecio(p.precio)}</td>
              <td>{p.stock}</td>
              <td className="admin-table__actions">
                <Link to={`/admin/editar-producto/${p.id}`} className="btn btn-outline btn-sm">
                  Editar
                </Link>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onEliminar(p)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
	  </div>
    </section>
  )
}