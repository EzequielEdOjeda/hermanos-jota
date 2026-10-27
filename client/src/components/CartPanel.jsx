import { formatearPrecio } from "../utils/format";
import { obtenerConfiguracionPublica } from "../services/api";

function CartPanel({
  abierto,
  carrito,
  total,
  onCerrar,
  onCambiarCantidad,
  onQuitar,
  onProcesarPago,
}) {
  async function handleProcesarPago() {
    if (carrito.length === 0) return;

    onProcesarPago?.(); // dispara el overlay global en App

    try {
      const cfg = await obtenerConfiguracionPublica();
      const numero = cfg.whatsappNumero || "5493624031997";
      const mensajeBase = cfg.whatsappMensajeBase || "Hola Hermanos Jota, quiero pagar:";

      const lineas = carrito
        .map(
          (item) =>
            `• ${item.nombre} x${item.cantidad} — ${formatearPrecio(item.precio * item.cantidad)}`,
        )
        .join("\n");

      const mensaje = `${mensajeBase}\n\n${lineas}\n\nTotal: ${formatearPrecio(total)}`;
      const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

      // Pequeña pausa para que se vea la animación aunque la red sea rápida.
      await new Promise((r) => setTimeout(r, 900));

      window.open(url, "_blank", "noopener,noreferrer");
      onCerrar?.();
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    } finally {
      onProcesarPago?.("fin");
    }
  }

  return (
    <div
      className={`cart-overlay${abierto ? " is-open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="cart-panel" role="dialog" aria-label="Carrito de compras">
        <div className="cart-panel__header">
          <h2>Mi Carrito</h2>
          <button className="cart-panel__close" aria-label="Cerrar carrito" onClick={onCerrar}>
            ✕
          </button>
        </div>

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
            onClick={handleProcesarPago}
            disabled={carrito.length === 0}
          >
            Proceder al Pago
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPanel;