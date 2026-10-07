import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Toast from "../components/Toast";

const ToastContext = createContext(null);

/**
 * Provee `mostrarToast(mensaje)` a toda la app y renderiza el <Toast>.
 * Antes el toast vivía en App.jsx y se pasaba por props; ahora lo necesitan
 * también Login, Register, Navbar y RutaPrivada, así que se comparte por
 * contexto en lugar de bajarlo por props a todos.
 */
export function ToastProvider({ children }) {
  const [mensaje, setMensaje] = useState("");
  const temporizador = useRef(null);

  const mostrarToast = useCallback((texto, duracion = 2200) => {
    clearTimeout(temporizador.current); // un toast nuevo reemplaza al anterior
    setMensaje(texto);
    temporizador.current = setTimeout(() => setMensaje(""), duracion);
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const valor = useMemo(() => ({ mostrarToast }), [mostrarToast]);

  return (
    <ToastContext.Provider value={valor}>
      {children}
      <Toast mensaje={mensaje} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const contexto = useContext(ToastContext);
  if (!contexto) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return contexto;
}
