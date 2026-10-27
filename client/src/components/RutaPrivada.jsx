import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * Protege una ruta (o un grupo de rutas anidadas).
 *
 *   <RutaPrivada>                    → exige sesión iniciada
 *   <RutaPrivada roles={["admin"]}>  → exige sesión + alguno de esos roles
 *   <RutaPrivada soloAdmin>          → compat: equivale a roles={["admin"]}
 *
 * Si el usuario no tiene permiso, redirige a / y muestra el toast "Sin permisos".
 * Esto es solo UX: la protección real está en el backend (401/403).
 */
function RutaPrivada({ children, soloAdmin = false, roles }) {
  const { usuario, cargando } = useAuth();
  const { mostrarToast } = useToast();
  const location = useLocation();

  const rolesPermitidos = roles ?? (soloAdmin ? ["admin"] : null);

  const sinPermisos = Boolean(
    rolesPermitidos && usuario && !rolesPermitidos.includes(usuario.rol),
  );

  useEffect(() => {
    if (sinPermisos) mostrarToast("Sin permisos");
  }, [sinPermisos, mostrarToast]);

  if (cargando) {
    return (
      <p className="state-message" role="status">
        Verificando tu sesión…
      </p>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location }} />;
  }

  if (sinPermisos) {
    return <Navigate to="/" replace />;
  }

  return children ?? <Outlet />;
}

export default RutaPrivada;