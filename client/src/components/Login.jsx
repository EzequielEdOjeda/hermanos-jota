import { useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import AuthField from "./AuthField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { primerNombre } from "../utils/format";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar({ email, password }) {
  const errores = {};

  if (!email.trim()) {
    errores.email = "Ingresá tu correo electrónico";
  } else if (!REGEX_EMAIL.test(email.trim())) {
    errores.email = "El correo electrónico no es válido";
  }

  if (!password) {
    errores.password = "Ingresá tu contraseña";
  } else if (password.length < 6) {
    errores.password = "La contraseña debe tener al menos 6 caracteres";
  }

  return errores;
}

/**
 * Pantalla de inicio de sesión (ruta /login).
 * Formulario controlado → validación en el cliente → AuthContext.login()
 * (POST /api/auth/login). Si el backend rechaza las credenciales, se muestra
 * su mensaje ("Credenciales inválidas").
 */
function Login() {
  const { usuario, login } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [valores, setValores] = useState({ email: "", password: "" });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Se captura UNA vez al montar: si ya había sesión al entrar a /login se
  // redirige; pero al iniciar sesión acá no debe pisar el navigate() de abajo.
  const [yaTeniaSesion] = useState(Boolean(usuario));

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  if (yaTeniaSesion) {
    return <Navigate to="/" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const nuevosValores = { ...valores, [name]: value };

    setValores(nuevosValores);
    // Si el campo estaba en error, se revalida mientras se corrige.
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: validar(nuevosValores)[name] }));
    }
    if (errorServidor) setErrorServidor("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (enviando) return;

    setErrorServidor("");
    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);

    if (nuevosErrores.email) return emailRef.current?.focus();
    if (nuevosErrores.password) return passwordRef.current?.focus();

    setEnviando(true);
    try {
      const sesion = await login({ email: valores.email.trim(), password: valores.password });
      mostrarToast(`¡Hola, ${primerNombre(sesion.nombre)}! Iniciaste sesión`);
      // Si RutaPrivada nos mandó acá, volvemos a la página que se quería abrir.
      navigate(location.state?.desde?.pathname ?? "/", { replace: true });
    } catch (error) {
      setErrorServidor(error.message);
      setEnviando(false);
      passwordRef.current?.focus();
    }
  }

  return (
    <AuthCard
      titulo="Bienvenido de nuevo"
      subtitulo="Ingresá con tu cuenta de Hermanos Jota."
      pie={
        <>
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="login-link">
            Registrate
          </Link>
        </>
      }
    >
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="login-email"
          name="email"
          type="email"
          label="Correo electrónico"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          value={valores.email}
          onChange={handleChange}
          error={errores.email}
          inputRef={emailRef}
        />

        <AuthField
          id="login-password"
          name="password"
          type="password"
          label="Contraseña"
          autoComplete="current-password"
          value={valores.password}
          onChange={handleChange}
          error={errores.password}
          inputRef={passwordRef}
        />

        {errorServidor && (
          <div className="form-alert form-alert--error" role="alert">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <span>{errorServidor}</span>
          </div>
        )}

        <button
          type="submit"
          className={`btn btn-primary login-btn${enviando ? " is-loading" : ""}`}
          disabled={enviando}
          aria-busy={enviando}
        >
          {enviando ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </AuthCard>
  );
}

export default Login;
