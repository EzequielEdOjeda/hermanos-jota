import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { imagenDe } from "../utils/format";

const CartContext = createContext(null);

const clave = (idUsuario) => `hj_carrito_${idUsuario}`;

// localStorage puede lanzar (modo privado, bloqueado): nunca debe romper la app.
function leerCarrito(idUsuario) {
  if (!idUsuario) return [];
  try {
    const datos = JSON.parse(window.localStorage.getItem(clave(idUsuario)));
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardarCarrito(idUsuario, carrito) {
  try {
    window.localStorage.setItem(clave(idUsuario), JSON.stringify(carrito));
  } catch {
    /* sin almacenamiento: el carrito dura hasta recargar */
  }
}

/**
 * Estado global del carrito.
 * Debe ir DENTRO de <ToastProvider> (usa los toasts).
 * Cada ítem guarda `stock` para poder limitar la cantidad en el carrito.
 */
export function CartProvider({ children }) {
  const { mostrarToast } = useToast();
  const { usuario } = useAuth();
  const [carrito, setCarrito] = useState(() => leerCarrito(usuario?.id ?? null));

  // Cada usuario tiene su propio carrito guardado (localStorage, por id):
  //  - al cerrar sesión se vacía la pantalla, pero el carrito queda guardado;
  //  - al iniciar sesión se recupera el de esa persona (nadie ve el de otro);
  //  - un invitado que ya agregó productos y luego inicia sesión los conserva.
  const idUsuario = usuario?.id ?? null;
  const [idPrevio, setIdPrevio] = useState(idUsuario);
  if (idUsuario !== idPrevio) {
    setIdPrevio(idUsuario);
    if (idUsuario === null) {
      setCarrito([]);
    } else if (!(idPrevio === null && carrito.length > 0)) {
      setCarrito(leerCarrito(idUsuario));
    }
  }

  useEffect(() => {
    if (idUsuario) guardarCarrito(idUsuario, carrito);
  }, [idUsuario, carrito]);

  const agregarAlCarrito = useCallback(
    (producto, cantidad = 1) => {
      const stock = typeof producto.stock === "number" ? producto.stock : Infinity;
      const existente = carrito.find((item) => item.id === producto.id);
      const actual = existente ? existente.cantidad : 0;
      const nueva = Math.min(actual + cantidad, stock);

      // Ya está todo el stock en el carrito: no se suma y se avisa.
      if (nueva <= actual) {
        mostrarToast(
          stock === 0
            ? `"${producto.nombre}" no tiene stock disponible`
            : `Ya tenés en el carrito todo el stock de "${producto.nombre}" (${stock})`,
        );
        return;
      }

      setCarrito((prev) => {
        if (prev.some((item) => item.id === producto.id)) {
          return prev.map((item) =>
            item.id === producto.id ? { ...item, cantidad: nueva, stock } : item,
          );
        }
        return [
          ...prev,
          {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: imagenDe(producto),
            cantidad: nueva,
            stock,
          },
        ];
      });

      // Se agregó menos de lo pedido: se llegó al tope de stock.
      mostrarToast(
        nueva < actual + cantidad
          ? `Solo había stock para sumar ${nueva - actual} de "${producto.nombre}" (máximo ${stock})`
          : `"${producto.nombre}" se añadió al carrito`,
      );
    },
    [carrito, mostrarToast],
  );

  const quitarDelCarrito = useCallback((id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const cambiarCantidadCarrito = useCallback((id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.min(item.cantidad + delta, item.stock ?? Infinity) }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  }, []);

  const vaciarCarrito = useCallback(() => setCarrito([]), []);

  const valor = useMemo(
    () => ({
      carrito,
      cantidadCarrito: carrito.reduce((t, i) => t + i.cantidad, 0),
      totalCarrito: carrito.reduce((t, i) => t + i.precio * i.cantidad, 0),
      agregarAlCarrito,
      quitarDelCarrito,
      cambiarCantidadCarrito,
      vaciarCarrito,
    }),
    [carrito, agregarAlCarrito, quitarDelCarrito, cambiarCantidadCarrito, vaciarCarrito],
  );

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return contexto;
}