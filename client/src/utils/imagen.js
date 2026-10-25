// client/src/utils/imagen.js

/** Ruta de la imagen placeholder (vive en /public). */
export const PLACEHOLDER_IMG = "/img/logo.svg";

/**
 * Devuelve la URL de imagen del producto, o el placeholder si no hay.
 * Útil para poner en el atributo `src` directamente.
 */
export function getImagenProducto(producto) {
  // Usamos 'imagen' porque así se llama el campo en MongoDB
  const url = producto?.imagen?.trim() || producto?.imagenUrl?.trim();

  if (!url) return PLACEHOLDER_IMG;

  // Si la URL empieza con "/", le agregamos la base (para que funcione en Vercel)
  if (url.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${url.replace(/^\//, "")}`;
  }

  return url;
}

/**
 * Handler para el evento `onError` de <img>.
 */
export function onImagenError(e) {
  if (e.currentTarget.src.endsWith(PLACEHOLDER_IMG)) return;
  e.currentTarget.src = PLACEHOLDER_IMG;
  e.currentTarget.classList.add("is-placeholder");
}
