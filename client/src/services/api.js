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
    const error = new Error(mensaje);
    // Si el backend mandó errores de validación por campo (ver errorHandler
    // para ValidationError de Mongoose), los adjuntamos para que los
    // formularios de administración puedan resaltar el campo puntual.
    error.campos = data?.errores || null;
    throw error;
  }

  return data;
}

export function obtenerProductos() {
  return request("/productos");
}

export function obtenerProductoPorId(id) {
  return request(`/productos/${id}`);
}

/**
 * Crea un producto nuevo. Responde con el documento creado (incluido su
 * `_id` de MongoDB), útil para redirigir a su página de detalle.
 */
export function crearProducto(payload) {
  return request("/productos", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Actualiza un producto existente por su id.
 */
export function actualizarProducto(id, payload) {
  return request(`/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Elimina un producto por su id.
 */
export function eliminarProducto(id) {
  return request(`/productos/${id}`, {
    method: "DELETE",
  });
}

export function enviarMensajeContacto(payload) {
  return request("/contacto", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
