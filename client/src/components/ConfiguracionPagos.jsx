import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { obtenerConfiguracion, actualizarConfiguracion } from "../services/api";

export default function ConfiguracionPagos() {
  const { token } = useAuth();
  const [numero, setNumero] = useState("");
  const [mensajeBase, setMensajeBase] = useState("");
  const [guardando, setGuardando] = useState(false);
  const { mostrarToast } = useToast();

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const data = await obtenerConfiguracion(token);
        if (!activo) return;
        setNumero(data.whatsappNumero ?? "");
        setMensajeBase(data.whatsappMensajeBase ?? "");
      } catch (err) {
        mostrarToast(err.message || "No se pudo cargar la configuración");
      }
    })();
    return () => { activo = false; };
  }, [token, mostrarToast]);

  async function handleSubmit(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await actualizarConfiguracion({ whatsappNumero: numero, whatsappMensajeBase: mensajeBase }, token);
      mostrarToast("Configuración guardada");
    } catch (err) {
      mostrarToast(err.message || "No se pudo guardar");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginBottom: '2rem' }}>
        <p className="eyebrow">PANEL DE ADMINISTRACIÓN</p>
        <h1 className="admin-page__title" style={{ margin: 0 }}>Configuración de Pagos</h1>
        <p className="admin-page__subtitle" style={{ marginTop: '0.5rem' }}>
          El número se usa para armar el link de WhatsApp cuando un cliente toca "Procesar Pago" en el carrito.
        </p>
      </div>

      <div className="admin-card" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
        <form onSubmit={handleSubmit} className="perfil-form" style={{ boxShadow: 'none', padding: 0, border: 'none', background: 'transparent' }}>
          <div className="form-field">
            <label>Número de WhatsApp (solo dígitos, con código de país)</label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value.replace(/\D/g, ""))}
              placeholder="5493624031997"
              required
            />
          </div>

          <div className="form-field">
            <label>Mensaje base</label>
            <textarea
              value={mensajeBase}
              onChange={(e) => setMensajeBase(e.target.value)}
              rows={3}
            />
          </div>

          <div className="perfil-form__actions" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
             <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? "Guardando…" : "GUARDAR CAMBIOS"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}