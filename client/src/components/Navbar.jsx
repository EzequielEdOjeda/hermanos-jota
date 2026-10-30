import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * Barra de navegación principal.
 * El contador del carrito llega vía props desde App.jsx; la navegación
 * entre páginas la maneja React Router (NavLink ya marca el link activo
 * solo, sin necesidad de comparar manualmente la ruta actual).
 */
function Navbar({ cantidadCarrito, onAbrirCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function claseLink({ isActive }) {
    return isActive ? "is-active" : "";
  }

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link to="/" className="logo" onClick={cerrarMenu}>
          <img src="/img/logo.svg" alt="Logo Hermanos Jota" />
          Hermanos Jota
        </Link>

        <div className="header-actions">
          <NavLink
            to="/login"
            className={({ isActive }) => `auth-btn${isActive ? " is-active" : ""}`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="auth-btn__text">Ingresar</span>
          </NavLink>

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
              <NavLink
                to="/"
                end
                className={({ isActive }) => `bi bi-house ${claseLink({ isActive })}`}
                onClick={cerrarMenu}
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/productos"
                className={({ isActive }) => `bi bi-grid ${claseLink({ isActive })}`}
                onClick={cerrarMenu}
              >
                Catálogo
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contacto"
                className={({ isActive }) => `bi bi-envelope ${claseLink({ isActive })}`}
                onClick={cerrarMenu}
              >
                Contacto
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) => `bi bi-gear ${claseLink({ isActive })}`}
                onClick={cerrarMenu}
              >
                Admin
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
