import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { obtenerMisPedidos } from "../services/api";
import { formatearPrecio } from "../utils/format";

const ETIQUETAS_ESTADO = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

function formatearFecha(iso) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Historial de compras del usuario logueado (se muestra dentro de <RutaPrivada>). */
function MisPedidos() {
  const { token, logout } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    obtenerMisPedidos(token)
      .then((datos) => {
        if (activo) setPedidos(datos);
      })
      .catch((err) => {
        if (!activo) return;
        if (err.status === 401) {
          logout(); // token vencido: RutaPrivada manda a /login
          return;
        }
        setError(err.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [token, logout]);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Mis pedidos</h1>

        {cargando && (
          <p className="state-message" role="status">
            Cargando tus pedidos…
          </p>
        )}

        {error && <p className="state-message">{error}</p>}

        {!cargando && !error && pedidos.length === 0 && (
          <p className="state-message">
            Todavía no hiciste ningún pedido. <Link to="/catalogo">Ir al catálogo</Link>
          </p>
        )}

        {pedidos.map((pedido) => (
          <article key={pedido.id} className="pedido-card" style={{ marginBottom: "1.25rem" }}>
            <header
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              <strong>{formatearFecha(pedido.createdAt)}</strong>
              <span>{ETIQUETAS_ESTADO[pedido.estado] ?? pedido.estado}</span>
            </header>

            <ul style={{ listStyle: "none", padding: 0, margin: "0.75rem 0" }}>
              {pedido.items.map((item) => (
                <li
                  key={item.producto}
                  style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}
                >
                  <span>
                    {item.nombre} x{item.cantidad}
                  </span>
                  <span>{formatearPrecio(item.precio * item.cantidad)}</span>
                </li>
              ))}
            </ul>

            <footer style={{ textAlign: "right" }}>
              <strong>Total: {formatearPrecio(pedido.total)}</strong>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}

export default MisPedidos;