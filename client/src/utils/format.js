export function formatearPrecio(valor) {
  return valor.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export const CATEGORIAS = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "living", etiqueta: "Living" },
  { valor: "comedor", etiqueta: "Comedor" },
  { valor: "dormitorio", etiqueta: "Dormitorio" },
  { valor: "oficina", etiqueta: "Oficina" },
];

// Imagen que se muestra si un producto no tiene `imagenUrl` (por ejemplo, uno
// creado desde el panel admin sin foto).
export const IMAGEN_POR_DEFECTO = "/img/logo.svg";

export function imagenDe(producto) {
  return producto?.imagenUrl || IMAGEN_POR_DEFECTO;
}

// Etiquetas legibles para los roles que devuelve la API.
export const ETIQUETAS_ROL = {
  admin: "Administrador",
  cliente: "Cliente",
};

export function primerNombre(nombre = "") {
  return nombre.trim().split(/\s+/)[0] || "";
}

export function inicialDe(nombre = "") {
  return (nombre.trim()[0] || "?").toUpperCase();
}
