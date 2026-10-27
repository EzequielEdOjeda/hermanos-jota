export default function ProcessingOverlay({ visible, texto = "Procesando pago..." }) {
  if (!visible) return null;
  return (
    <div className="processing-overlay" role="alert" aria-busy="true">
      <div className="processing-box">
        <div className="processing-spinner" />
        <p>{texto}</p>
      </div>
    </div>
  );
}