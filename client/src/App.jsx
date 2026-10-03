import { useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import ProductForm from "./components/ProductForm";
import AdminDashboard from "./components/AdminDashboard";
import CartPanel from "./components/CartPanel";
import Toast from "./components/Toast";
import NotFound from "./components/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./components/Login";
import Register from "./components/Register";

import { obtenerProductos } from "./services/api";

/**
 * App.jsx — componente raíz de la aplicación.
 *
 * Concentra:
 *  - El fetch a la API (GET /api/productos) y sus tres estados
 *    (carga, éxito, error), expuesto como `cargarProductos` para que
 *    las páginas de administración puedan refrescar el listado global
 *    después de crear/editar/eliminar un producto.
 *  - El ruteo real de la aplicación con React Router DOM (<Routes>),
 *    con rutas dinámicas (`/productos/:id`, `/admin/editar-producto/:id`).
 *  - El estado del carrito de compras (carrito vive acá, contador en
 *    Navbar vía props).
 */
function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [toast, setToast] = useState("");

  // Ciclo de vida de la petición a la API: carga -> éxito | error.
  // Se expone como función (no solo dentro de un useEffect) para poder
  // volver a dispararla después de crear/editar/eliminar un producto.
  const cargarProductos = useCallback(async () => {
    setCargando(true);
    setError(null);

    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  function mostrarToast(mensaje) {
    setToast(mensaje);
    setTimeout(() => setToast(""), 2200);
  }

  function agregarAlCarrito(producto, cantidad = 1) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item._id === producto._id);

      if (existente) {
        return prev.map((item) =>
          item._id === producto._id ? { ...item, cantidad: item.cantidad + cantidad } : item,
        );
      }

      return [
        ...prev,
        {
          _id: producto._id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagenUrl: producto.imagenUrl,
          cantidad,
        },
      ];
    });

    mostrarToast(`"${producto.nombre}" se añadió al carrito`);
  }

  function quitarDelCarrito(id) {
    setCarrito((prev) => prev.filter((item) => item._id !== id));
  }

  function cambiarCantidadCarrito(id, delta) {
    setCarrito((prev) =>
      prev
        .map((item) => (item._id === id ? { ...item, cantidad: item.cantidad + delta } : item))
        .filter((item) => item.cantidad > 0),
    );
  }

  const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalCarrito = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

  return (
    <>
      <ScrollToTop />

      <Navbar cantidadCarrito={cantidadCarrito} onAbrirCarrito={() => setCarritoAbierto(true)} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                productos={productos}
                cargando={cargando}
                error={error}
                onAgregar={agregarAlCarrito}
              />
            }
          />

          <Route
            path="/productos"
            element={
              <Catalog
                productos={productos}
                cargando={cargando}
                error={error}
                onAgregar={agregarAlCarrito}
              />
            }
          />

          <Route path="/productos/:id" element={<ProductDetail onAgregar={agregarAlCarrito} />} />

          <Route path="/contacto" element={<ContactForm />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/admin"
            element={
              <AdminDashboard
                productos={productos}
                cargando={cargando}
                error={error}
                onRecargar={cargarProductos}
                onToast={mostrarToast}
              />
            }
          />

          <Route
            path="/admin/crear-producto"
            element={
              <ProductForm modo="crear" onGuardado={cargarProductos} onToast={mostrarToast} />
            }
          />

          <Route
            path="/admin/editar-producto/:id"
            element={
              <ProductForm modo="editar" onGuardado={cargarProductos} onToast={mostrarToast} />
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

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
