function Toast({ mensaje }) {
  return (
    <div className={`toast${mensaje ? " is-visible" : ""}`} role="status" aria-live="polite">
      {mensaje}
    </div>
  );
}

export default Toast;
