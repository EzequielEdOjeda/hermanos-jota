/**
 * Cliente HTTP muy simple para hablar con la API de Hermanos Jota.
 * Centraliza la URL base y el manejo de errores de `fetch`, así los
 * componentes solo necesitan llamar a estas funciones y manejar
 * los estados de carga/éxito/error a nivel de UI.
 */

const API_URL = import.meta.env.VITE_API_URL || "https://hermanos-jota-6p4o.onrender.com/api";

/**
 * Wrapper sobre fetch que:
 *  - arma la URL completa a partir de API_URL
 *  - serializa `body` a JSON y agrega `Authorization: Bearer <token>`
 *    cuando se pasa `token`
 *  - convierte respuestas no exitosas (status >= 400) en errores de JS que
 *    llevan el `status` HTTP (el AuthContext lo usa para detectar un 401)
 *  - parsea automáticamente el JSON de la respuesta
 */
async function request(path, { token, body, headers, ...options } = {}) {
  let respuesta;

  try {
    respuesta = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    // fetch solo rechaza ante fallas de red (sin conexión, servidor dormido, CORS...).
    const error = new Error(
      "No pudimos conectar con el servidor. Revisá tu conexión e intentá de nuevo.",
    );
    error.status = 0;
    throw error;
  }

  const data = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const error = new Error(data?.error || data?.mensaje || "Ocurrió un error inesperado");
    error.status = respuesta.status;
    throw error;
  }

  return data;
}

// ---------------------------------------------------------------------------
// Productos. La API responde { ok: true, data }; acá se devuelve solo `data`.
// Las tres últimas son solo para administradores y requieren el token.
// ---------------------------------------------------------------------------

export async function obtenerProductos() {
  const { data } = await request("/productos");
  return data;
}

export async function obtenerProductoPorId(id) {
  const { data } = await request(`/productos/${id}`);
  return data;
}

export async function crearProducto(payload, token) {
  const { data } = await request("/productos", { method: "POST", body: payload, token });
  return data;
}

export async function actualizarProducto(id, payload, token) {
  const { data } = await request(`/productos/${id}`, { method: "PUT", body: payload, token });
  return data;
}

export async function eliminarProducto(id, token) {
  const { data } = await request(`/productos/${id}`, { method: "DELETE", token });
  return data;
}

// ---------------------------------------------------------------------------
// Autenticación. Devuelven { ok, usuario, token } (obtenerPerfil: { ok, usuario }).
// ---------------------------------------------------------------------------

export function registrar({ nombre, email, password }) {
  return request("/auth/register", { method: "POST", body: { nombre, email, password } });
}

export function login({ email, password }) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

export function obtenerPerfil(token) {
  return request("/auth/me", { token });
}

// ---------------------------------------------------------------------------
// Contacto
// ---------------------------------------------------------------------------

export function enviarMensajeContacto(payload) {
  return request("/contacto", { method: "POST", body: payload });
}
