import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as api from "../services/api";

const CLAVE_TOKEN = "hj_token";
const CLAVE_USUARIO = "hj_usuario";

const AuthContext = createContext(null);

// localStorage puede lanzar (modo privado, almacenamiento bloqueado): se envuelve
// para que un fallo de almacenamiento nunca rompa la app.
function leer(clave) {
  try {
    return window.localStorage.getItem(clave);
  } catch {
    return null;
  }
}

function guardarSesion(token, usuario) {
  try {
    window.localStorage.setItem(CLAVE_TOKEN, token);
    window.localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  } catch {
    /* sin almacenamiento: la sesión dura hasta recargar la página */
  }
}

function borrarSesion() {
  try {
    window.localStorage.removeItem(CLAVE_TOKEN);
    window.localStorage.removeItem(CLAVE_USUARIO);
  } catch {
    /* nada que borrar */
  }
}

function leerUsuarioGuardado() {
  try {
    return JSON.parse(leer(CLAVE_USUARIO)) ?? null;
  } catch {
    return null;
  }
}

/**
 * Estado global de autenticación.
 *
 * - `token` y `usuario` se restauran de localStorage para que la sesión
 *   sobreviva a una recarga y el Navbar no parpadee.
 * - Al montar, si hay token, se valida con GET /api/auth/me. Mientras tanto
 *   `cargando` es true (RutaPrivada espera a que termine para decidir).
 * - Si el servidor responde 401 (token inválido, vencido o usuario borrado)
 *   la sesión se limpia. Ante otros fallos (servidor dormido o sin red) NO se
 *   cierra la sesión: el token puede ser perfectamente válido y la próxima
 *   petición protegida dirá la verdad.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => leer(CLAVE_TOKEN));
  const [usuario, setUsuario] = useState(() => (leer(CLAVE_TOKEN) ? leerUsuarioGuardado() : null));
  const [cargando, setCargando] = useState(() => Boolean(leer(CLAVE_TOKEN)));

  useEffect(() => {
    const tokenGuardado = leer(CLAVE_TOKEN);
    if (!tokenGuardado) return undefined;

    let activo = true;
    // Si mientras tanto la persona inició/cerró sesión, el token guardado ya
    // es otro y esta respuesta (vieja) no debe pisar la sesión nueva.
    const sigueVigente = () => activo && leer(CLAVE_TOKEN) === tokenGuardado;

    api
      .obtenerPerfil(tokenGuardado)
      .then(({ usuario: perfil }) => {
        if (!sigueVigente()) return;
        setUsuario(perfil);
        guardarSesion(tokenGuardado, perfil);
      })
      .catch((error) => {
        if (!sigueVigente() || error.status !== 401) return;
        borrarSesion();
        setToken(null);
        setUsuario(null);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const abrirSesion = useCallback((respuesta) => {
    guardarSesion(respuesta.token, respuesta.usuario);
    setToken(respuesta.token);
    setUsuario(respuesta.usuario);
    return respuesta.usuario;
  }, []);

  /** Inicia sesión. Devuelve el usuario o lanza el error del backend ("Credenciales inválidas"). */
  const login = useCallback(
    async (credenciales) => abrirSesion(await api.login(credenciales)),
    [abrirSesion],
  );

  /** Crea la cuenta (rol cliente) y deja la sesión iniciada. */
  const register = useCallback(
    async (datos) => abrirSesion(await api.registrar(datos)),
    [abrirSesion],
  );

  const logout = useCallback(() => {
    borrarSesion();
    setToken(null);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({
      usuario,
      token,
      cargando,
      login,
      register,
      logout,
      esAdmin: usuario?.rol === "admin",
    }),
    [usuario, token, cargando, login, register, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return contexto;
}
