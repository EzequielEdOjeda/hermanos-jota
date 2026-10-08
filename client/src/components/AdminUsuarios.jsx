import { useEffect, useState } from 'react'
import { obtenerUsuarios, cambiarRolUsuario } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AdminUsuarios() {
  const { token, usuario: yo } = useAuth()
  const { mostrarToast } = useToast()
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let activo = true
    obtenerUsuarios(token)
      .then((data) => activo && setUsuarios(data))
      .catch((err) => activo && setError(err.message))
      .finally(() => activo && setCargando(false))
    return () => { activo = false }
  }, [token])

  async function toggleRol(u) {
	  const id = String(u._id ?? u.id)
	  const nuevoRol = u.rol === 'admin' ? 'cliente' : 'admin'
	  try {
		const actualizado = await cambiarRolUsuario(id, nuevoRol, token)
		setUsuarios((prev) =>
		  prev.map((x) => (String(x._id ?? x.id) === id ? { ...x, rol: actualizado.rol ?? nuevoRol } : x))
		)
		mostrarToast(`Rol de ${u.nombre} cambiado a ${nuevoRol}`)
	  } catch (err) {
		mostrarToast(err.message)
	  }
	}

  if (cargando) {
	  return (
		<section className="container admin-page">
		  <p className="admin-breadcrumb">Panel admin / Usuarios</p>
		  <h1 className="admin-title">GESTIONAR USUARIOS</h1>
		  <div className="admin-loading">
			<div className="spinner" aria-hidden="true"></div>
			<p>Cargando usuarios…</p>
		  </div>
		</section>
	  )
	}

	if (error) {
	  return (
		<section className="container admin-page">
		  <p className="admin-breadcrumb">Panel admin / Usuarios</p>
		  <h1 className="admin-title">GESTIONAR USUARIOS</h1>
		  <p className="admin-msg admin-msg--error">{error}</p>
		</section>
	  )
	}
  if (error) return <p className="admin-msg admin-msg--error">{error}</p>

  return (
    <section className="container admin-page">
      <p className="admin-breadcrumb">Panel admin / Usuarios</p>
      <h1 className="admin-title">GESTIONAR USUARIOS</h1>
      <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => {
            const id = u._id ?? u.id
            const esYo = String(id) === String(yo?._id ?? yo?.id)
            return (
              <tr key={id}>
                <td>{u.nombre}{esYo && ' (vos)'}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge-rol badge-rol--${u.rol}`}>{u.rol}</span>
                </td>
                <td>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => toggleRol(u)}
                    disabled={esYo && u.rol === 'admin'}
                    title={esYo && u.rol === 'admin' ? 'No podés quitarte tu propio admin' : ''}
                  >
                    {u.rol === 'admin' ? 'Quitar admin' : 'Hacer admin'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
	  </div>
    </section>
  )
}