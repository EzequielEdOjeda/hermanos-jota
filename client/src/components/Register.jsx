import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import AuthField from "./AuthField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { primerNombre } from "../utils/format";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validar({ nombre, email, password, confirmar }) {
  const errores = {};

  if (nombre.trim().length < 2) {
    errores.nombre = "Ingresá tu nombre (al menos 2 caracteres)";
  }

  if (!email.trim()) {
    errores.email = "Ingresá tu correo electrónico";
  } else if (!REGEX_EMAIL.test(email.trim())) {
    errores.email = "El correo electrónico no es válido";
  }

  if (!password) {
    errores.password = "Elegí una contraseña";
  } else if (password.length < 6) {
    errores.password = "La contraseña debe tener al menos 6 caracteres";
  }

  if (!confirmar) {
    errores.confirmar = "Repetí la contraseña";
  } else if (confirmar !== password) {
    errores.confirmar = "Las contraseñas no coinciden";
  }

  return errores;
}

/**
 * Pantalla de registro (ruta /register).
 * Crea la cuenta con AuthContext.register() (POST /api/auth/register). El rol
 * lo decide siempre el backend ("cliente"): este formulario no lo envía.
 */
function Register() {
  const { usuario, register } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();

  const [valores, setValores] = useState({ nombre: "", email: "", password: "", confirmar: "" });
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [yaTeniaSesion] = useState(Boolean(usuario));

  const refs = {
    nombre: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirmar: useRef(null),
  };

  if (yaTeniaSesion) {
    return <Navigate to="/" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const nuevosValores = { ...valores, [name]: value };

    setValores(nuevosValores);

    // Se revalidan los campos que ya estaban en error. Al cambiar la contraseña
    // también se revisa "confirmar", porque su error depende de ella.
    const afectados = name === "password" ? ["password", "confirmar"] : [name];
    const revalidados = validar(nuevosValores);
    setErrores((prev) => {
      const siguiente = { ...prev };
      for (const campo of afectados) {
        if (prev[campo]) siguiente[campo] = revalidados[campo];
      }
      return siguiente;
    });
    if (errorServidor) setErrorServidor("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (enviando) return;

    setErrorServidor("");
    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);

    const primerInvalido = ["nombre", "email", "password", "confirmar"].find(
      (campo) => nuevosErrores[campo],
    );
    if (primerInvalido) return refs[primerInvalido].current?.focus();

    setEnviando(true);
    try {
      const sesion = await register({
        nombre: valores.nombre.trim(),
        email: valores.email.trim(),
        password: valores.password,
      });
      mostrarToast(`¡Cuenta creada! Te damos la bienvenida, ${primerNombre(sesion.nombre)}`);
      navigate("/", { replace: true });
    } catch (error) {
      if (error.status === 409) {
        // Correo ya registrado: el error se marca en el campo que lo causó.
        setErrores({ email: "Ya existe una cuenta con este correo electrónico" });
        refs.email.current?.focus();
      } else {
        setErrorServidor(error.message);
      }
      setEnviando(false);
    }
  }

  return (
    <AuthCard
      titulo="Creá tu cuenta"
      subtitulo="Registrate en Hermanos Jota en menos de un minuto."
      pie={
        <>
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="login-link">
            Ingresá
          </Link>
        </>
      }
    >
      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <AuthField
          id="register-nombre"
          name="nombre"
          label="Nombre"
          autoComplete="name"
          value={valores.nombre}
          onChange={handleChange}
          error={errores.nombre}
          inputRef={refs.nombre}
        />

        <AuthField
          id="register-email"
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
          inputRef={refs.email}
        />

        <AuthField
          id="register-password"
          name="password"
          type="password"
          label="Contraseña (mínimo 6 caracteres)"
          autoComplete="new-password"
          value={valores.password}
          onChange={handleChange}
          error={errores.password}
          inputRef={refs.password}
        />

        <AuthField
          id="register-confirmar"
          name="confirmar"
          type="password"
          label="Repetir contraseña"
          autoComplete="new-password"
          value={valores.confirmar}
          onChange={handleChange}
          error={errores.confirmar}
          inputRef={refs.confirmar}
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
          {enviando ? "Creando cuenta…" : "Crear cuenta"}
        </button>
      </form>
    </AuthCard>
  );
}

export default Register;
