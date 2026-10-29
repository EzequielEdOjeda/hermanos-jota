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
import RelatedProducts from "./components/RelatedProducts";

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
    const stock = producto.stock ?? Infinity;
    const enCarrito = carrito.find((item) => item._id === producto._id)?.cantidad ?? 0;
    const disponible = stock - enCarrito;

    if (disponible <= 0) {
      mostrarToast(`No hay más unidades de "${producto.nombre}" disponibles`);
      return;
    }

    const cantidadFinal = Math.min(cantidad, disponible);

    setCarrito((prev) => {
      const existente = prev.find((item) => item._id === producto._id);

      if (existente) {
        return prev.map((item) =>
          item._id === producto._id
            ? { ...item, cantidad: item.cantidad + cantidadFinal, stock }
            : item,
        );
      }

      return [
        ...prev,
        {
          _id: producto._id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagenUrl: producto.imagenUrl,
          stock,
          cantidad: cantidadFinal,
        },
      ];
    });

    mostrarToast(
      cantidadFinal < cantidad
        ? `Agregamos ${cantidadFinal} de "${producto.nombre}" (máximo según stock)`
        : `"${producto.nombre}" se añadió al carrito`,
    );
  }

  function quitarDelCarrito(id) {
    setCarrito((prev) => prev.filter((item) => item._id !== id));
  }

  function cambiarCantidadCarrito(id, delta) {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item._id !== id) return item;
          const nueva = Math.min(item.cantidad + delta, item.stock ?? Infinity);
          return { ...item, cantidad: nueva };
        })
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

          <Route path="/productos/:id" element={<ProductDetail productos={productos} onAgregar={agregarAlCarrito} />} />

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
