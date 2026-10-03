import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pantalla de registro. Mismo placeholder que Login (ver nota ahí):
 * valida en el cliente y simula el envío, lista para conectarse a un
 * endpoint real de registro más adelante.
 */
function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!name.trim()) {
      next.name = "Ingresá tu nombre.";
    }
    if (!email.trim()) {
      next.email = "Ingresá tu correo electrónico.";
    } else if (!EMAIL_RE.test(email)) {
      next.email = "Ese correo no parece válido.";
    }
    if (!password) {
      next.password = "Creá una contraseña.";
    } else if (password.length < 8) {
      next.password = "Usá al menos 8 caracteres.";
    }
    if (confirmPassword !== password) {
      next.confirmPassword = "Las contraseñas no coinciden.";
    }
    if (!acceptsTerms) {
      next.acceptsTerms = "Tenés que aceptar los términos para continuar.";
    }
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // TODO: reemplazar por la llamada real al backend de registro.
      await new Promise((resolve) => setTimeout(resolve, 600));
      navigate("/login");
    } catch {
      setFormError("No pudimos crear tu cuenta. Probá de nuevo en un momento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="container auth-wrap">
        <div className="auth-card">
          <div className="auth-card__brand">
            <span className="auth-card__brand-mark">H</span>
            Hermanos Jota
          </div>

          <p className="eyebrow">Sumate a la casa</p>
          <h1 className="section-title auth-card__title">Creá tu cuenta</h1>
          <p className="auth-card__subtitle">
            Guardá tus piezas favoritas y seguí el estado de tus pedidos desde un solo lugar.
          </p>

          {formError && <div className="form-alert form-alert--error">{formError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`form-field ${errors.name ? "has-error" : ""}`}>
              <label htmlFor="name">Nombre completo</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                autoComplete="name"
              />
              <span className="field-error">{errors.name}</span>
            </div>

            <div className={`form-field ${errors.email ? "has-error" : ""}`}>
              <label htmlFor="reg-email">Correo electrónico</label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              <span className="field-error">{errors.email}</span>
            </div>

            <div className={`form-field ${errors.password ? "has-error" : ""}`}>
              <label htmlFor="reg-password">Contraseña</label>
              <div className="field-control">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="field-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4l16 16" />
                      <path d="M10.6 10.7a2.5 2.5 0 0 0 3.5 3.5" />
                      <path d="M7.4 7.5C4.9 9 3 12 3 12s3.5 6.5 9 6.5c1.6 0 3-.4 4.2-1.1M12 5.5c5.5 0 9 6.5 9 6.5a14.6 14.6 0 0 1-2.1 2.9" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>
              <span className="field-error">{errors.password}</span>
            </div>

            <div className={`form-field ${errors.confirmPassword ? "has-error" : ""}`}>
              <label htmlFor="confirm-password">Confirmar contraseña</label>

              <div className="field-control">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetí tu contraseña"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="field-toggle"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4l16 16" />
                      <path d="M10.6 10.7a2.5 2.5 0 0 0 3.5 3.5" />
                      <path d="M7.4 7.5C4.9 9 3 12 3 12s3.5 6.5 9 6.5c1.6 0 3-.4 4.2-1.1M12 5.5c5.5 0 9 6.5 9 6.5a14.6 14.6 0 0 1-2.1 2.9" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>

              <span className="field-error">{errors.confirmPassword}</span>
            </div>

            <div
              className={`form-field form-field--checkbox ${errors.acceptsTerms ? "has-error" : ""}`}
            >
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={acceptsTerms}
                  onChange={(e) => setAcceptsTerms(e.target.checked)}
                />
                Acepto los términos y condiciones
              </label>
              <span className="field-error">{errors.acceptsTerms}</span>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-card__footer">
            ¿Ya tenés una cuenta?{" "}
            <Link className="auth-link" to="/login">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
