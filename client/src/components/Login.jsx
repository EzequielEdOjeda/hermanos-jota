import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Pantalla de inicio de sesión.
 *
 * Nota: todavía no hay un backend de autenticación en este sprint (el
 * foco acá fue el CRUD de productos con MongoDB), así que el envío es
 * un placeholder — valida y simula una espera, pero no crea una sesión
 * real todavía. Queda listo para conectar a un endpoint de auth más
 * adelante sin tener que tocar el resto de la UI.
 */
function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!email.trim()) {
      next.email = "Ingresá tu correo electrónico.";
    } else if (!EMAIL_RE.test(email)) {
      next.email = "Ese correo no parece válido.";
    }
    if (!password) {
      next.password = "Ingresá tu contraseña.";
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
      // TODO: reemplazar por la llamada real al backend de autenticación.
      await new Promise((resolve) => setTimeout(resolve, 600));
      navigate("/");
    } catch {
      setFormError("No pudimos iniciar sesión. Probá de nuevo en un momento.");
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

          <h1 className="section-title auth-card__title">Iniciar sesión</h1>
          <p className="auth-card__subtitle">Ingresá tus datos para ingresar a tu cuenta.</p>

          {formError && <div className="form-alert form-alert--error">{formError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className={`form-field ${errors.email ? "has-error" : ""}`}>
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              <span className="field-error">{errors.email}</span>
            </div>

            <div className={`form-field ${errors.password ? "has-error" : ""}`}>
              <label htmlFor="password">Contraseña</label>
              <div className="field-control">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                <button
                  className="field-toggle"
                  onClick={() => setShowPassword((v) => !v)}
<<<<<<< HEAD
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
=======
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
                  ) : (
<<<<<<< HEAD
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
=======
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
>>>>>>> 031134325e7286e725e22f3d9db1702d99955a96
                      <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </svg>
                  )}
                </button>
              </div>
              <span className="field-error">{errors.password}</span>
            </div>

            <div className="auth-row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Recordarme
              </label>
<<<<<<< HEAD
              <button
                type="button"
                className="auth-link auth-link--button"
                onClick={() => onNavigate?.("olvide-password")}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isSubmitting}
            >
=======
              {/* TODO: flujo de "olvidé mi contraseña" (fuera del alcance de este sprint) */}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
>>>>>>> 031134325e7286e725e22f3d9db1702d99955a96
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="auth-card__footer">
            ¿No tenés una cuenta?{" "}
<<<<<<< HEAD
            <button
              type="button"
              className="auth-link auth-link--button"
              onClick={() => onNavigate?.("register")}
            >
              Registrate aquí
            </button>
=======
            <Link className="auth-link" to="/register">
              Registrate aquí
            </Link>
>>>>>>> 031134325e7286e725e22f3d9db1702d99955a96
          </p>
        </div>
      </div>
    </section>
  );
}

<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> 031134325e7286e725e22f3d9db1702d99955a96
