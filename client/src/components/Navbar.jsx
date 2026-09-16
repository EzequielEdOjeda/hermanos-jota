import { useState } from "react";

/**
 * Barra de navegación principal.
 * Recibe la vista activa y el contador del carrito vía props desde App.js,
 * y notifica los cambios de navegación mediante callbacks (props también).
 */
function Navbar({ vista, onNavigate, cantidadCarrito, onAbrirCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function navegar(destino) {
    onNavigate(destino);
    setMenuAbierto(false);
  }

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <a
          href="#inicio"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            navegar("inicio");
          }}
        >
          <img src="/img/logo.svg" alt="Logo Hermanos Jota" />
          Hermanos Jota
        </a>

        <div className="header-actions">
          <a
            href="#carrito"
            className="cart-link"
            aria-label="Ver carrito"
            onClick={(e) => {
              e.preventDefault();
              onAbrirCarrito();
            }}
          >
            <svg
              className="icon-cart"
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
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Carrito
            <span className={`cart-badge${cantidadCarrito > 0 ? " is-visible" : ""}`}>
              {cantidadCarrito}
            </span>
          </a>
        </div>

        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={`site-nav${menuAbierto ? " is-open" : ""}`}
          aria-label="Navegación principal"
        >
          <ul className="site-nav__list">
            <li>
              <a
                href="#inicio"
                className={`bi bi-house${vista === "inicio" ? " is-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navegar("inicio");
                }}
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="#catalogo"
                className={`bi bi-grid${vista === "catalogo" ? " is-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navegar("catalogo");
                }}
              >
                Catálogo
              </a>
            </li>
            <li>
              <a
                href="#contacto"
                className={`bi bi-envelope${vista === "contacto" ? " is-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  navegar("contacto");
                }}
              >
                Contacto
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
