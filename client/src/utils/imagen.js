// client/src/utils/imagen.js

/** Ruta de la imagen placeholder (vive en /public). */
export const PLACEHOLDER_IMG = "/img/logo.svg";

/**
 * Devuelve la URL de imagen del producto, o el placeholder si no hay.
 * Útil para poner en el atributo `src` directamente.
 */
export function getImagenProducto(producto) {
  const url = producto?.imagenUrl?.trim();
  return url ? url : PLACEHOLDER_IMG;
}

/**
 * Handler para el evento `onError` de <img>.
 * Si la imagen original falla al cargar (URL rota, 404, etc.),
 * la reemplaza por el placeholder sin entrar en loop.
 */
export function onImagenError(e) {
  if (e.currentTarget.src.endsWith(PLACEHOLDER_IMG)) return;
  e.currentTarget.src = PLACEHOLDER_IMG;
  e.currentTarget.classList.add("is-placeholder");
}
