import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import CartPanel from "./components/CartPanel";
import Toast from "./components/Toast";
import NotFound from "./components/NotFound";

import { obtenerProductos } from "./services/api";

/**
 * App.jsx — componente raíz de la aplicación.
 *
 * Concentra:
 *  - El fetch a la API (GET /api/productos) y sus tres estados
 *    (carga, éxito, error), objetivo #10 de la consigna.
 *  - El estado de navegación entre vistas ("inicio", "catalogo",
 *    "detalle", "contacto"), resuelto con renderizado condicional
 *    en vez de una librería de ruteo.
 *  - El estado del carrito de compras (objetivo: "Carrito de compras
 *    como estado en App.js, contador en Navbar vía props").
 */
function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const rutaEnNavegador = window.location.pathname.replace("/", "");
  const [vista, setVista] = useState(rutaEnNavegador || "inicio");

  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState(null);

  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [toast, setToast] = useState("");

  // Ciclo de vida de la petición a la API: carga -> éxito | error.
  useEffect(() => {
    let activo = true;

    async function cargarProductos() {
      setCargando(true);
      setError(null);

      try {
        const data = await obtenerProductos();
        if (activo) setProductos(data);
      } catch (err) {
        if (activo) setError(err.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargarProductos();

    return () => {
      activo = false;
    };
  }, []);

  function navegarA(destino) {
    setVista(destino);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function verDetalle(id) {
    setProductoSeleccionadoId(id);
    navegarA("detalle");
  }

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(""), 2200);
  }

  function agregarAlCarrito(producto, cantidad = 1) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);

      if (existente) {
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item,
        );
      }

      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          cantidad,
        },
      ];
    });

    mostrarToast(`"${producto.nombre}" se añadió al carrito`);
  }

  function quitarDelCarrito(id) {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  }

  function cambiarCantidadCarrito(id, delta) {
    setCarrito((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad + delta } : item))
        .filter((item) => item.cantidad > 0),
    );
  }

  const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalCarrito = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

  const vistasValidas = ["inicio", "catalogo", "detalle", "contacto"];
  const esVistaValida = vistasValidas.includes(vista);
  
  return (
    <>
      <Navbar
        vista={vista}
        onNavigate={navegarA}
        cantidadCarrito={cantidadCarrito}
        onAbrirCarrito={() => setCarritoAbierto(true)}
      />

      <main>
        {vista === "inicio" && (
          <Home
            productos={productos}
            cargando={cargando}
            error={error}
            onVerDetalle={verDetalle}
            onAgregar={agregarAlCarrito}
            onNavigate={navegarA}
          />
        )}

        {vista === "catalogo" && (
          <Catalog
            productos={productos}
            cargando={cargando}
            error={error}
            onVerDetalle={verDetalle}
            onAgregar={agregarAlCarrito}
          />
        )}

        {vista === "detalle" && (
          <ProductDetail
            producto={productoSeleccionado}
            cargando={cargando}
            error={error}
            onAgregar={agregarAlCarrito}
            onNavigate={navegarA}
          />
        )}

        {vista === "contacto" && <ContactForm />}

        {!esVistaValida && <NotFound onNavigate={navegarA} />}

      </main>

      <Footer onNavigate={navegarA} />

      <CartPanel
        abierto={carritoAbierto}
        carrito={carrito}
        total={totalCarrito}
        onCerrar={() => setCarritoAbierto(false)}
        onCambiarCantidad={cambiarCantidadCarrito}
        onQuitar={quitarDelCarrito}
      />

      <Toast mensaje={toast} />
    </>
  );
}

export default App;
