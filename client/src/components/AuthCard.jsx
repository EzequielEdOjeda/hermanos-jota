/**
 * Estructura visual común de Login y Register: una card centrada con el motivo
 * de "anillos de madera" de la marca (el mismo del hero) asomando en la
 * esquina, un título, una bajada y un pie con el link a la otra pantalla.
 */
function AuthCard({ titulo, subtitulo, pie, children }) {
  return (
    <section className="login-page">
      <div className="login-card">
        <svg
          className="login-card__rings"
          viewBox="0 0 340 340"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="170" cy="170" r="160" fill="none" stroke="#A0522D" strokeWidth="1.5" />
          <circle cx="170" cy="170" r="128" fill="none" stroke="#A0522D" strokeWidth="1.5" />
          <circle cx="170" cy="170" r="96" fill="none" stroke="#D4A437" strokeWidth="1.5" />
          <circle cx="170" cy="170" r="64" fill="none" stroke="#A0522D" strokeWidth="1.5" />
          <circle cx="170" cy="170" r="32" fill="none" stroke="#87A96B" strokeWidth="1.5" />
        </svg>

        <header className="login-card__header">
          <h1 className="login-card__title">{titulo}</h1>
          <p className="login-card__lead">{subtitulo}</p>
        </header>

        {children}

        <p className="login-card__footer">{pie}</p>
      </div>
    </section>
  );
}

export default AuthCard;
