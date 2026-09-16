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
