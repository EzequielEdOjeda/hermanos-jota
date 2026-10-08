import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { actualizarPerfil } from '../services/api'

export default function Perfil() {
  const { usuario, token, actualizarUsuarioEnSesion } = useAuth()
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState(usuario?.nombre ?? '')
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordRepetir, setPasswordRepetir] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // Validaciones rápidas en el cliente
    if (nombre.trim().length < 3) {
      return setError('El nombre debe tener al menos 3 caracteres')
    }
    if (passwordNueva) {
      if (!passwordActual) return setError('Ingresá tu contraseña actual para cambiarla')
      if (passwordNueva.length < 6) return setError('La nueva contraseña debe tener al menos 6 caracteres')
      if (passwordNueva !== passwordRepetir) return setError('Las contraseñas nuevas no coinciden')
    }

    setGuardando(true)
    try {
      const payload = { nombre: nombre.trim() }
      if (passwordNueva) {
        payload.passwordActual = passwordActual
        payload.passwordNueva = passwordNueva
      }

      const actualizado = await actualizarPerfil(payload, token)
      actualizarUsuarioEnSesion(actualizado)
      mostrarToast('Perfil actualizado correctamente')

      // Limpiar campos de contraseña
      setPasswordActual('')
      setPasswordNueva('')
      setPasswordRepetir('')

      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  if (!usuario) return null   // RutaPrivada ya redirige, pero por las dudas

  return (
    <section className="container perfil-page">
      <p className="admin-breadcrumb">Mi cuenta / Editar perfil</p>
      <h1 className="admin-title">EDITAR PERFIL</h1>

      <form className="perfil-form" onSubmit={handleSubmit}>
        <h2 className="perfil-form__section">Datos personales</h2>

        <label className="form-field">
          <span>Nombre</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label className="form-field">
          <span>Email</span>
          <input type="email" value={usuario.email} disabled />
          <small className="form-hint">El email no se puede modificar.</small>
        </label>

        <h2 className="perfil-form__section">Cambiar contraseña (opcional)</h2>

        <label className="form-field">
          <span>Contraseña actual</span>
          <input
            type="password"
            value={passwordActual}
            onChange={(e) => setPasswordActual(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <label className="form-field">
          <span>Nueva contraseña</span>
          <input
            type="password"
            value={passwordNueva}
            onChange={(e) => setPasswordNueva(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        <label className="form-field">
          <span>Repetir nueva contraseña</span>
          <input
            type="password"
            value={passwordRepetir}
            onChange={(e) => setPasswordRepetir(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="perfil-form__actions">
          <button type="submit" className="btn btn-primary" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </section>
  )
}