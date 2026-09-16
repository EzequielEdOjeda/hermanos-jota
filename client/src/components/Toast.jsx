function Toast({ mensaje }) {
  return <div className={`toast${mensaje ? " is-visible" : ""}`}>{mensaje}</div>;
}

export default Toast;
