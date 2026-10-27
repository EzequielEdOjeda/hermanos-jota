import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { cambiarRolUsuario, obtenerUsuarios, eliminarUsuario } from "../services/api";
import ConfirmDialog from "./ConfirmDialog";

export default function AdminUsuarios() {
  const { usuario: usuarioActual, token } = useAuth();
  const { mostrarToast } = useToast();

  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const data = await obtenerUsuarios(token);
        if (activo) setUsuarios(data || []);
      } catch (err) {
        if (activo) setError(err.message);
      }
    })();
    return () => { activo = false; };
  }, [token]);

  async function handleCambiarRol(id, nuevoRol) {
    try {
      const actualizado = await cambiarRolUsuario(id, nuevoRol, token);
      setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, rol: actualizado.rol } : u)));
      mostrarToast(`Rol actualizado a ${nuevoRol}`);
    } catch (err) {
      mostrarToast(err.message || "Error al cambiar el rol");
    }
  }

  async function confirmarEliminarUsuario() {
    if (!usuarioAEliminar) return;
    try {
      await eliminarUsuario(usuarioAEliminar.id, token);
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar.id));
      mostrarToast(`Usuario "${usuarioAEliminar.nombre}" eliminado`);
    } catch (err) {
      mostrarToast(err.message || "Error al eliminar el usuario");
    } finally {
      setUsuarioAEliminar(null);
    }
  }

  if (error) return <p className="state-message text-error">{error}</p>;

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginBottom: '2rem' }}>
        <p className="eyebrow">PANEL DE ADMINISTRACIÓN</p>
        <h1 className="admin-page__title" style={{ margin: 0 }}>Gestionar Usuarios</h1>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>EMAIL</th>
              <th>ROL ACTUAL</th>
              <th>CAMBIAR ROL</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const esMismoUsuario = u.id === usuarioActual?.id;
              return (
                <tr key={u.id}>
                  <td>{u.nombre} {esMismoUsuario && "(vos)"}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge-role ${u.rol.toLowerCase()}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td>
                    <select
                      className="select-rol"
                      value={u.rol}
                      onChange={(e) => handleCambiarRol(u.id, e.target.value)}
                      disabled={esMismoUsuario}
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="cliente">Cliente</option>
                    </select>
                  </td>
                  <td>
                    <button
					  className="btn btn-outline btn-sm"
					  style={{ color: "var(--color-error)", borderColor: "var(--color-error)", background: '#fff' }}
					  onClick={() => setUsuarioAEliminar(u)}
					  disabled={esMismoUsuario}
					  onMouseEnter={(e) => { if(!esMismoUsuario) e.currentTarget.style.background = 'var(--color-error)'; e.currentTarget.style.color = '#fff'; }}
					  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-error)'; }}
					>
					  Eliminar
					</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        abierto={!!usuarioAEliminar}
        titulo="Eliminar usuario"
        mensaje={usuarioAEliminar ? `¿Seguro que querés eliminar a "${usuarioAEliminar.nombre}"? Esta acción no se puede deshacer.` : ""}
        textoConfirmar="Sí, eliminar"
        onConfirmar={confirmarEliminarUsuario}
        onCancelar={() => setUsuarioAEliminar(null)}
      />
    </div>
  );
}