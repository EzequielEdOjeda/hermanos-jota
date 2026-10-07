import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

/**
 * Protege una ruta (o un grupo de rutas anidadas).
 *
 *   <RutaPrivada>             → exige sesión iniciada
 *   <RutaPrivada soloAdmin>   → exige sesión + rol admin
 *
 * - Sin sesión → redirige a /login (recordando a dónde quería ir, para volver
 *   después de ingresar).
 * - Con sesión pero sin rol admin → redirige a / y muestra el toast "Sin permisos".
 *
 * Se usa con `children` o como ruta "padre" de otras rutas (usa <Outlet />).
 * Esto es solo UX: la protección real está en el backend (401/403).
 */
function RutaPrivada({ children, soloAdmin = false }) {
  const { usuario, cargando } = useAuth();
  const { mostrarToast } = useToast();
  const location = useLocation();

  const sinPermisos = Boolean(soloAdmin && usuario && usuario.rol !== "admin");

  // El toast es un efecto secundario: no puede dispararse durante el render.
  useEffect(() => {
    if (sinPermisos) mostrarToast("Sin permisos");
  }, [sinPermisos, mostrarToast]);

  // Se está validando el token guardado con /api/auth/me: todavía no se sabe.
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
