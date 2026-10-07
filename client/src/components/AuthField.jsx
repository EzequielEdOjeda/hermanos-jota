import { useState } from "react";

/**
 * Campo de formulario con label flotante.
 *
 * El <label> va DESPUÉS del <input> y el input tiene placeholder=" ": así el
 * CSS puede subir el label con `:focus + label` y `:not(:placeholder-shown) + label`
 * sin una línea de JavaScript. Si type="password" suma el botón de mostrar/ocultar.
 */
function AuthField({ id, label, type = "text", error, inputRef, ...resto }) {
  const [visible, setVisible] = useState(false);
  const esPassword = type === "password";
  const idError = `${id}-error`;

  return (
    <div
      className={`login-field${esPassword ? " login-field--password" : ""}${error ? " has-error" : ""}`}
    >
      <input
        id={id}
        ref={inputRef}
        className="login-input"
        type={esPassword && visible ? "text" : type}
        placeholder=" "
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? idError : undefined}
        {...resto}
      />
      <label htmlFor={id}>{label}</label>

      {esPassword && (
        <button
          type="button"
          className="login-toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          aria-pressed={visible}
        >
          {visible ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
              <path d="m1 1 22 22" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      )}

      {error && (
        <p className="login-field__error" id={idError}>
          {error}
        </p>
      )}
    </div>
  );
}

export default AuthField;
