import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { crearPedido, obtenerConfiguracionPublica } from "../services/api";
import { formatearPrecio } from "../utils/format";

function CartPanel({
  abierto,
  carrito,
  total,
  onCerrar,
  onCambiarCantidad,
  onQuitar,
  onVaciar,
  onProcesarPago,
}) {
  const { token, usuario, logout } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();

  // Pedido recién guardado: mientras exista se muestra la confirmación.
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  function cerrar() {
    setPedidoConfirmado(null);
    onCerrar();
  }

  async function handleFinalizarCompra() {
    if (carrito.length === 0) return;

    // Sin sesión no se puede comprar: se manda a iniciar sesión.
    if (!token) {
      mostrarToast("Iniciá sesión para finalizar tu compra");
      cerrar();
      navigate("/login");
      return;
    }

    // Las cuentas de administración no compran (y no tienen "Mis pedidos").
    if (usuario?.rol === "admin" || usuario?.rol === "editor") {
      mostrarToast("Cambia a una cuenta cliente para comprar");
      return;
    }

    onProcesarPago?.(); // overlay global en App

    try {
      const items = carrito.map((item) => ({ producto: item.id, cantidad: item.cantidad }));
      const pedido = await crearPedido(items, token);

      setPedidoConfirmado({ ...pedido, lineas: carrito });
      onVaciar();
    } catch (error) {
      if (error.status === 401) {
        logout();
        mostrarToast("Tu sesión venció. Volvé a ingresar.");
        cerrar();
        navigate("/login");
      } else {
        mostrarToast(error.message);
      }
    } finally {
      onProcesarPago?.("fin");
    }
  }

  // Opcional: avisar el pedido ya guardado por WhatsApp.
  async function enviarPorWhatsApp() {
    if (!pedidoConfirmado) return;

    try {
      const cfg = await obtenerConfiguracionPublica();
      const numero = cfg.whatsappNumero || "5493624031997";
      const mensajeBase = cfg.whatsappMensajeBase || "Hola Hermanos Jota, hice un pedido:";

      const lineas = pedidoConfirmado.lineas
        .map(
          (item) =>
            `• ${item.nombre} x${item.cantidad} — ${formatearPrecio(item.precio * item.cantidad)}`,
        )
        .join("\n");

      const mensaje = `${mensajeBase}\n\n${lineas}\n\nTotal: ${formatearPrecio(pedidoConfirmado.total)}`;
      window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } catch (error) {
      mostrarToast(error.message);
    }
  }

  return (
    <div
      className={`cart-overlay${abierto ? " is-open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) cerrar();
      }}
    >
      <div className="cart-panel" role="dialog" aria-label="Carrito de compras">
        <div className="cart-panel__header">
          <h2>{pedidoConfirmado ? "¡Pedido realizado!" : "Mi Carrito"}</h2>
          <button className="cart-panel__close" aria-label="Cerrar carrito" onClick={cerrar}>
            ✕
          </button>
        </div>

        {pedidoConfirmado ? (
          <>
            <div className="cart-panel__body">
              <div className="cart-empty">
                <p>Tu pedido se guardó correctamente.</p>
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  Total: <strong>{formatearPrecio(pedidoConfirmado.total)}</strong>
                </p>
                <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  Podés ver su estado en{" "}
                  <Link to="/mis-pedidos" onClick={cerrar}>
                    Mis pedidos
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="cart-panel__footer">
              <button className="btn btn-outline" onClick={enviarPorWhatsApp}>
                Seguir por WhatsApp
              </button>
              <button className="btn btn-primary" onClick={cerrar}>
                Seguir comprando
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cart-panel__body">
              {carrito.length === 0 ? (
                <div className="cart-empty">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p>Tu carrito está vacío</p>
                  <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                    Agregá productos para comenzar
                  </p>
                </div>
              ) : (
                carrito.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item__image">
                      <img src={item.imagen} alt={item.nombre} loading="lazy" />
                    </div>
                    <div className="cart-item__info">
                      <p className="cart-item__name">{item.nombre}</p>
                      <span className="cart-item__price">
                        {formatearPrecio(item.precio * item.cantidad)}
                      </span>
                      <div className="cart-item__controls">
                        <button
                          className="cart-qty-btn"
                          aria-label="Restar"
                          onClick={() => onCambiarCantidad(item.id, -1)}
                        >
                          −
                        </button>
                        <span className="qty">{item.cantidad}</span>
                        <button
                          className="cart-qty-btn"
                          aria-label="Sumar"
                          disabled={item.cantidad >= item.stock}
                          onClick={() => onCambiarCantidad(item.id, 1)}
                        >
                          +
                        </button>
                        <button className="cart-item__remove" onClick={() => onQuitar(item.id)}>
                          ✖️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-panel__footer">
              <div className="cart-total">
                <span>Total</span>
                <span className="total-price">{formatearPrecio(total)}</span>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleFinalizarCompra}
                disabled={carrito.length === 0}
              >
                Finalizar compra
              </button>
              {!token && carrito.length > 0 && (
                <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                  Necesitás iniciar sesión para finalizar la compra.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPanel;