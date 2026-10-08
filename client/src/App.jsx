import { useEffect, useState } from "react";
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
import Perfil from "./components/Perfil";
import ConfirmDialog from "./components/ConfirmDialog";

import { useAuth } from "./context/AuthContext";
import { useToast } from "./context/ToastContext";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductos,
} from "./services/api";
import { imagenDe } from "./utils/format";

/**
 * Ruta /producto/:id. Busca el producto en la lista que ya tiene cargada App
 * y se lo pasa a ProductDetail. El `key` reinicia la cantidad elegida al
 * pasar de un producto a otro.
 */
function RutaDetalle({ productos, ...resto }) {
  const { id } = useParams();
  const producto = productos.find((p) => p.id === id);

  return <ProductDetail key={id} producto={producto} {...resto} />;
}

/**
 * App.jsx — componente raíz de la aplicación.
 *
 * Concentra:
 *  - El fetch a la API (GET /api/productos) y sus tres estados
 *    (carga, éxito, error), objetivo #10 de la consigna.
 *  - Las rutas (React Router): públicas (/, /catalogo, /producto/:id,
 *    /contacto, /login, /register) y /admin/*, que solo puede abrir un admin.
 *  - El estado del carrito de compras (objetivo: "Carrito de compras
 *    como estado en App.js, contador en Navbar vía props").
 *  - Las acciones de administrador sobre el catálogo (crear, editar, eliminar),
 *    que llaman a la API con el token de la sesión.
 */
function App() {
  const { token, logout } = useAuth();
  const { mostrarToast } = useToast();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);  

  const [carrito, setCarrito] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  // Ciclo de vida de la petición a la API: carga -> éxito | error.
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

  // Al cambiar de página se vuelve al principio.
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

  const cantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
  const totalCarrito = carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);

  // ---------------------------------------------------------------------------
  // Acciones de administrador
  // ---------------------------------------------------------------------------

  // Un 401 en medio de una acción protegida significa que el token venció o ya
  // no vale (por ejemplo, cambió el JWT_SECRET): se cierra la sesión y se pide
  // ingresar de nuevo.
  function manejarSesionVencida(err) {
    if (err.status !== 401) return false;

    logout();
    mostrarToast("Tu sesión venció. Volvé a ingresar.");
    navigate("/login");
    return true;
  }

  /** Crea (sin id) o actualiza (con id) un producto. Devuelve el producto guardado. */
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
      throw err; // el formulario muestra el mensaje del backend
    }
  }

  // Se llama al hacer clic en "Eliminar": abre el modal
	function pedirEliminarProducto(producto) {
	  setConfirmacion({ producto });
	}

	// Se llama cuando el usuario confirma en el modal
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

  return (
    <>
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

          {/* Todo lo que cuelga de /admin exige sesión iniciada con rol admin. */}
          <Route path="/admin" element={<RutaPrivada soloAdmin />}>
            <Route index element={<Navigate to="productos" replace />} />
            <Route
              path="productos"
              element={
                <AdminProductos
                  productos={productos}
                  cargando={cargando}
                  error={error}
                  onEliminar={pedirEliminarProducto}
                />
              }
            />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route
              path="crear-producto"
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
              path="editar-producto/:id"
              element={
                <ProductForm
                  productos={productos}
                  cargando={cargando}
                  error={error}
                  onGuardar={guardarProducto}
                />
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
    </>
  );
}

export default App;