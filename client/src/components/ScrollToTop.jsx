import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Con una SPA de varias páginas, el navegador ya no hace un "page load"
 * completo al cambiar de ruta, así que el scroll queda donde estaba.
 * Este componente no renderiza nada: solo escucha los cambios de
 * `pathname` (vía React Router) y lleva la ventana al tope.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
