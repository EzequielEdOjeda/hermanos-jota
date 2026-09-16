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
 *  - convierte respuestas no exitosas (status >= 400) en errores de JS
 *  - parsea automáticamente el JSON de la respuesta
 */
async function request(path, options = {}) {
  const respuesta = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const mensaje = data?.error || data?.mensaje || "Ocurrió un error inesperado";
    throw new Error(mensaje);
  }

  return data;
}

export function obtenerProductos() {
  return request("/productos");
}

export function obtenerProductoPorId(id) {
  return request(`/productos/${id}`);
}

export function enviarMensajeContacto(payload) {
  return request("/contacto", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
