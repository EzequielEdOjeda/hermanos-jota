import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { ETIQUETAS_ROL, inicialDe, primerNombre } from "../utils/format";

const ENLACES = [
  { to: "/", etiqueta: "Inicio", icono: "bi-house", end: true },
  { to: "/catalogo", etiqueta: "Catálogo", icono: "bi-grid" },
  { to: "/contacto", etiqueta: "Contacto", icono: "bi-envelope" },
];

/** logout() + aviso + vuelta al inicio. Lo usan el desplegable y el menú mobile. */
function useCerrarSesion() {
  const { logout } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();

  return function cerrarSesion() {
    logout();
    mostrarToast("Cerraste sesión");
    navigate("/");
  };
}

/** Botones que se ven cuando NO hay sesión. */
function BotonesInvitado() {
  return (
    <>
      <Link to="/login" className="btn btn-outline btn-sm">
        Ingresar
      </Link>
      <Link to="/register" className="btn btn-primary btn-sm">
        Registrarse
      </Link>
    </>
  );
}

/**
 * Desplegable de usuario (desktop). Patrón "disclosure": un botón con
 * aria-expanded que muestra/oculta el panel. Se cierra con click afuera,
 * con Escape (devolviendo el foco al botón) y al cambiar de ruta.
 */
function MenuUsuario() {
  const { usuario, esAdmin } = useAuth();
  const cerrarSesion = useCerrarSesion();
  const { pathname } = useLocation();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);
  const botonRef = useRef(null);

  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!abierto) return undefined;

    function alTocarFuera(e) {
      if (!contenedorRef.current?.contains(e.target)) setAbierto(false);
    }

    function alPresionarTecla(e) {
      if (e.key === "Escape") {
        setAbierto(false);
        botonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", alTocarFuera);
    document.addEventListener("keydown", alPresionarTecla);
    return () => {
      document.removeEventListener("pointerdown", alTocarFuera);
      document.removeEventListener("keydown", alPresionarTecla);
    };
  }, [abierto]);

  return (
    <div className="navbar-user" ref={contenedorRef}>
      <button
        ref={botonRef}
        type="button"
        className="navbar-user__trigger"
        aria-expanded={abierto}
        aria-controls="menu-usuario"
        onClick={() => setAbierto((valor) => !valor)}
      >
        <span className="navbar-user__avatar" aria-hidden="true">
          {inicialDe(usuario.nombre)}
        </span>
        <span className="navbar-user__name">{primerNombre(usuario.nombre)}</span>
        {esAdmin && <span className="badge-admin">Admin</span>}
        <svg
          className="navbar-user__chevron"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {abierto && (
        <div className="dropdown-menu" id="menu-usuario">
          <div className="dropdown-menu__header">
            <span className="dropdown-menu__name">{usuario.nombre}</span>
            <span className="dropdown-menu__email">{usuario.email}</span>
            <span className="dropdown-menu__role">{ETIQUETAS_ROL[usuario.rol] ?? usuario.rol}</span>
          </div>

          {esAdmin && (
            <>
              <Link to="/admin/productos" className="dropdown-menu__item">
                <i className="bi bi-box-seam" aria-hidden="true"></i>
                Gestionar productos
              </Link>
              <Link to="/admin/usuarios" className="dropdown-menu__item">
                <i className="bi bi-people" aria-hidden="true"></i>
                Gestionar usuarios
              </Link>
            </>
          )}

          <Link to="/perfil" className="dropdown-menu__item">
            <i className="bi bi-person-gear" aria-hidden="true"></i>
            Editar perfil
          </Link>

          <button type="button" className="btn-logout" onClick={cerrarSesion}>
            <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

/** Bloque de sesión dentro del menú hamburguesa (mobile). */
function SesionMovil() {
  const { usuario, esAdmin } = useAuth();
  const cerrarSesion = useCerrarSesion();

  if (!usuario) {
    return (
      <div className="nav-session">
        <BotonesInvitado />
      </div>
    );
  }

  return (
    <div className="nav-session">
      <div className="nav-session__user">
        <span className="navbar-user__avatar" aria-hidden="true">
          {inicialDe(usuario.nombre)}
        </span>
        <div className="nav-session__who">
          <span className="nav-session__name">
            {usuario.nombre}
            {esAdmin && <span className="badge-admin">Admin</span>}
          </span>
          <span className="nav-session__role">{ETIQUETAS_ROL[usuario.rol] ?? usuario.rol}</span>
        </div>
      </div>

      {esAdmin && (
        <>
          <Link to="/admin/productos" className="btn btn-outline btn-sm">
            Gestionar productos
          </Link>
          <Link to="/admin/usuarios" className="btn btn-outline btn-sm">
            Gestionar usuarios
          </Link>
        </>
      )}

      <Link to="/perfil" className="btn btn-outline btn-sm">
        Editar perfil
      </Link>

      <button type="button" className="btn-logout btn-logout--block" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </div>
  );
}

/**
 * Barra de navegación principal.
 * Recibe el contador del carrito y la acción de abrirlo vía props desde App.
 * Los links usan React Router (NavLink marca solo cuál está activo) y la
 * parte de sesión sale de AuthContext: invitado → Ingresar / Registrarse;
 * con sesión → desplegable con nombre, rol y cierre de sesión.
 */
function Navbar({ cantidadCarrito, onAbrirCarrito }) {
  const { usuario, cargando } = useAuth();
  const { pathname } = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Al navegar, el menú hamburguesa se cierra solo.
  useEffect(() => {
    setMenuAbierto(false);
  }, [pathname]);

  // Mientras se valida el token guardado y todavía no hay datos del usuario no
  // se muestra ni "Ingresar" ni el menú, para que no parpadee.
  const verificandoSesion = cargando && !usuario;

  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link to="/" className="logo">
          <img src="/img/logo.svg" alt="Logo Hermanos Jota" />
          Hermanos Jota
        </Link>

        <div className="header-actions">
          {!verificandoSesion && (
            <div className="header-session">{usuario ? <MenuUsuario /> : <BotonesInvitado />}</div>
          )}

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
            <span className="cart-text">Carrito</span>
            <span className={`cart-badge${cantidadCarrito > 0 ? " is-visible" : ""}`}>
              {cantidadCarrito}
            </span>
          </a>
        </div>

        <button
          className="nav-toggle"
          aria-label="Abrir menú"
          aria-expanded={menuAbierto}
          aria-controls="menu-principal"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="menu-principal"
          className={`site-nav${menuAbierto ? " is-open" : ""}`}
          aria-label="Navegación principal"
        >
          <ul className="site-nav__list">
            {ENLACES.map(({ to, etiqueta, icono, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) => `bi ${icono}${isActive ? " is-active" : ""}`}
                >
                  {etiqueta}
                </NavLink>
              </li>
            ))}
          </ul>

          {!verificandoSesion && <SesionMovil />}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;