import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

/**
 * Botón "Continuar con Google" para Login y Register.
 * Recibe el ID token de Google y se lo manda al backend (POST /api/auth/google),
 * que devuelve nuestra sesión (JWT). Si no hay VITE_GOOGLE_CLIENT_ID no se muestra.
 */
function BotonGoogle() {
  const { loginConGoogle } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  if (!CLIENT_ID) return null;

  async function alRecibirCredencial({ credential }) {
    try {
      const usuario = await loginConGoogle(credential);
      mostrarToast(`¡Hola, ${usuario.nombre}!`);
      // Si venía de una ruta protegida, vuelve ahí; si no, al inicio.
      navigate(location.state?.desde?.pathname ?? "/", { replace: true });
    } catch (error) {
      mostrarToast(error.message);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBlockEnd: "1rem" }}>
      <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>o</span>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <GoogleLogin
          onSuccess={alRecibirCredencial}
          onError={() => mostrarToast("No pudimos conectar con Google")}
          text="continue_with"
          shape="rectangular"
          theme="outline"
          locale="es"
        />
      </GoogleOAuthProvider>
    </div>
  );
}

export default BotonGoogle;