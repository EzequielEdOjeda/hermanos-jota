import { useEffect, useState, useCallback } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Catalog from "./components/Catalog";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import CartPanel from "./components/CartPanel";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";
import RutaPrivada from "./components/RutaPrivada";
import ProductForm from "./components/ProductForm";
import AdminProductos from "./components/AdminProductos";
import AdminUsuarios from "./components/AdminUsuarios";
import ConfiguracionPagos from "./components/ConfiguracionPagos";
import Perfil from "./components/Perfil";
import ConfirmDialog from "./components/ConfirmDialog";
import ProcessingOverlay from "./components/ProcessingOverlay";
import SplashLoader from "./components/SplashLoader";

import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
} from "./services/api";
import { imagenDe } from "./utils/format";

function RutaDetalle({ productos, cargando, error, ...resto }) {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === id);
  
  // Si todavía está cargando la API, mostramos el skeleton
  if (cargando) return <ProductDetail cargando={true} />;
  
  return <ProductDetail key={id} producto={producto} error={error} {...resto} />;
}

function App() {
  const { token, logout } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [cargandoSplash, setCargandoSplash] = useState(true);
  const terminarSplash = useCallback(() => {
    sessionStorage.setItem("splashVisto", "1");
    setCargandoSplash(false);
  }, []);

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [procesandoPago, setProcesandoPago] = useState(false);

  useEffect(() => {
    let activo = true;
    async function cargarProductos() {
      setCargando(true);
      setError(null);
      try {
        const data = await obtenerProductos();
        if (activo) setProductos(data ?? []);
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

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
          imagen: imagenDe(producto),
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

  const cantidadCarrito = carrito.reduce((t, i) => t + i.cantidad, 0);
  const totalCarrito = carrito.reduce((t, i) => t + i.precio * i.cantidad, 0);

  function manejarSesionVencida(err) {
    if (err.status !== 401) return false;
    logout();
    mostrarToast("Tu sesión venció. Volvé a ingresar.");
    navigate("/login");
    return true;
  }

  async function guardarProducto(payload, id) {
    try {
      const guardado = id
        ? await actualizarProducto(id, payload, token)
        : await crearProducto(payload, token);
      setProductos((prev) =>
        id ? prev.map((p) => (p.id === id ? guardado : p)) : [...prev, guardado],
      );
      mostrarToast(id ? "Producto actualizado" : "Producto creado");
      return guardado;
    } catch (err) {
      manejarSesionVencida(err);
      throw err;
    }
  }

  function pedirEliminarProducto(producto) {
    setConfirmacion({ producto });
  }

  async function eliminarProductoDelCatalogo(producto) {
    try {
      await eliminarProducto(producto.id, token);
      setProductos((prev) => prev.filter((p) => p.id !== producto.id));
      setCarrito((prev) => prev.filter((item) => item.id !== producto.id));
      mostrarToast(`"${producto.nombre}" se eliminó del catálogo`);
      return true;
    } catch (err) {
      if (!manejarSesionVencida(err)) mostrarToast(err.message);
      return false;
    } finally {
      setConfirmacion(null);
    }
  }

  // El CartPanel llama onProcesarPago() al iniciar y onProcesarPago("fin") al terminar.
  function handleProcesarPago(accion) {
    if (accion === "fin") setProcesandoPago(false);
    else setProcesandoPago(true);
  }

  return (
    <>
      {cargandoSplash && <SplashLoader onFinish={terminarSplash} />}

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
                onEliminar={pedirEliminarProducto}
              />
            }
          />
          <Route
            path="/catalogo"
            element={
              <Catalog
                productos={productos}
                cargando={cargando}
                error={error}
                onAgregar={agregarAlCarrito}
                onEliminar={pedirEliminarProducto}
              />
            }
          />
          <Route
            path="/producto/:id"
            element={
              <RutaDetalle
                productos={productos}
                cargando={cargando}
                error={error}
                onAgregar={agregarAlCarrito}
                onEliminar={pedirEliminarProducto}
              />
            }
          />
          <Route path="/contacto" element={<ContactForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/perfil"
            element={
              <RutaPrivada>
                <Perfil />
              </RutaPrivada>
            }
          />

                    {/* /admin: admin y editor pueden entrar a productos. */}
          <Route path="/admin" element={<RutaPrivada roles={["admin", "editor"]} />}>
            <Route index element={<Navigate to="/admin/productos" replace />} />

            <Route
              path="/admin/productos"
              element={
                <AdminProductos
                  productos={productos}
                  cargando={cargando}
                  error={error}
                  onEliminar={pedirEliminarProducto}
                />
              }
            />

            <Route
              path="/admin/crear-producto"
              element={
                <ProductForm
                  productos={productos}
                  cargando={cargando}
                  error={error}
                  onGuardar={guardarProducto}
                />
              }
            />
            <Route
              path="/admin/editar-producto/:id"
              element={
                <ProductForm
                  productos={productos}
                  cargando={cargando}
                  error={error}
                  onGuardar={guardarProducto}
                />
              }
            />

            {/* Solo admin: usuarios y configuración de pagos. */}
            <Route
              path="/admin/usuarios"
              element={
                <RutaPrivada roles={["admin"]}>
                  <AdminUsuarios />
                </RutaPrivada>
              }
            />
            <Route
              path="/admin/pagos"
              element={
                <RutaPrivada roles={["admin"]}>
                  <ConfiguracionPagos />
                </RutaPrivada>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>

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
        onProcesarPago={handleProcesarPago}
      />

      <ConfirmDialog
        abierto={!!confirmacion}
        titulo="Eliminar producto"
        mensaje={
          confirmacion
            ? `¿Seguro que querés eliminar "${confirmacion.producto.nombre}"? Esta acción no se puede deshacer.`
            : ""
        }
        textoConfirmar="Sí, eliminar"
        onConfirmar={() => eliminarProductoDelCatalogo(confirmacion.producto)}
        onCancelar={() => setConfirmacion(null)}
      />

      <ProcessingOverlay visible={procesandoPago} />
    </>
  );
}

export default App;