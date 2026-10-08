export default function ConfirmDialog({
  abierto,
  titulo,
  mensaje,
  textoConfirmar = "Eliminar",
  textoCancelar = "Cancelar",
  onConfirmar,
  onCancelar,
}) {
  if (!abierto) return null;

  return (
    <div
      className="confirm-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancelar();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-titulo"
    >
      <div className="confirm-dialog">
        <h3 id="confirm-titulo" className="confirm-dialog__title">
          {titulo}
        </h3>
        <p className="confirm-dialog__message">{mensaje}</p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onCancelar}
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}