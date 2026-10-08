import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { crearProducto, actualizarProducto, obtenerProductoPorId } from "../services/api";
import { CATEGORIAS } from "../utils/format";

const CATEGORIAS_FORM = CATEGORIAS.filter((cat) => cat.valor !== "todas");

const VALORES_INICIALES = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagenUrl: "",
  categoria: "living",
  destacado: false,
};

function validar(valores) {
  const errores = {};

  if (valores.nombre.trim().length < 2) {
    errores.nombre = "El nombre debe tener al menos 2 caracteres.";
  }

  if (valores.precio === "" || Number.isNaN(Number(valores.precio))) {
    errores.precio = "Ingresá un precio.";
  } else if (Number(valores.precio) < 0) {
    errores.precio = "El precio no puede ser negativo.";
  }

  if (valores.stock !== "" && Number(valores.stock) < 0) {
    errores.stock = "El stock no puede ser negativo.";
  }

  return errores;
}

/**
 * Formulario controlado de alta y edición de productos — un único
 * componente para ambos casos de uso (prop `modo`), tal como pide el
 * objetivo #7: "Construir formularios controlados en React para enviar
 * datos de creación y edición a la API".
 *
 *  - modo="crear"  → POST /api/productos
 *  - modo="editar" → primero GET /api/productos/:id (useParams) para
 *    precargar el formulario, y después PUT /api/productos/:id
 *
 * Tras guardar con éxito, navega al detalle del producto de forma
 * programática con useNavigate (objetivo #6).
 */
function ProductForm({ modo, onGuardado, onToast }) {
  const esEdicion = modo === "editar";
  const { id } = useParams();
  const navigate = useNavigate();

  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [estado, setEstado] = useState(esEdicion ? "cargando" : "idle"); // cargando | idle | guardando | error-carga

  // En modo edición, precargamos los datos actuales del producto.
  useEffect(() => {
    if (!esEdicion) return;

    let activo = true;

    async function cargarProducto() {
      setEstado("cargando");
      try {
        const producto = await obtenerProductoPorId(id);
        if (!activo) return;

        setValores({
          nombre: producto.nombre ?? "",
          descripcion: producto.descripcion ?? "",
          precio: String(producto.precio ?? ""),
          stock: String(producto.stock ?? ""),
          imagenUrl: producto.imagenUrl ?? "",
          categoria: producto.categoria ?? "living",
          destacado: Boolean(producto.destacado),
        });
        setEstado("idle");
      } catch (err) {
        if (!activo) return;
        setErrorGeneral(err.message);
        setEstado("error-carga");
      }
    }

    cargarProducto();

    return () => {
      activo = false;
    };
  }, [esEdicion, id]);

  function manejarCambio(evento) {
    const { name, value, type, checked } = evento.target;
    const valorNuevo = type === "checkbox" ? checked : value;

    setValores((prev) => ({ ...prev, [name]: valorNuevo }));

    setErrores((prev) => {
      if (!prev[name]) return prev;
      const erroresActualizados = validar({ ...valores, [name]: valorNuevo });
      return { ...prev, [name]: erroresActualizados[name] };
    });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);
    setErrorGeneral("");

    if (Object.keys(erroresValidacion).length > 0) {
      return;
    }

    setEstado("guardando");

    const payload = {
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio),
      stock: valores.stock === "" ? 0 : Number(valores.stock),
      imagenUrl: valores.imagenUrl.trim(),
      categoria: valores.categoria,
      destacado: valores.destacado,
    };

    try {
      const producto = esEdicion
        ? await actualizarProducto(id, payload)
        : await crearProducto(payload);

      await onGuardado?.(); // refresca el listado global de productos en App.jsx
      onToast?.(
        esEdicion
          ? `"${producto.nombre}" se actualizó correctamente`
          : `"${producto.nombre}" se creó correctamente`,
      );
      navigate(`/productos/${producto._id}`);
    } catch (err) {
      setEstado("idle");
      setErrorGeneral(err.message);
      if (err.campos) {
        setErrores((prev) => ({ ...prev, ...err.campos }));
      }
    }
  }

  if (estado === "cargando") {
    return (
      <section className="section">
        <div className="container">
          <p className="state-message">Cargando producto…</p>
        </div>
      </section>
    );
  }

  if (estado === "error-carga") {
    return (
      <section className="section">
        <div className="container">
          <p className="state-message">
            {errorGeneral || "No encontramos ese producto."}{" "}
            <Link to="/admin">Volver al panel</Link>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="form-page">
          <div className="form-card">
            <p className="eyebrow">Panel de administración</p>
            <h1 className="section-title">{esEdicion ? "Editar producto" : "Nuevo producto"}</h1>
            <p className="section-intro" style={{ color: "var(--color-ink-soft)" }}>
              {esEdicion
                ? "Modificá los datos del producto y guardá los cambios."
                : "Completá los datos para agregar una pieza nueva al catálogo."}
            </p>

            <form
              className="contact-form"
              style={{ maxWidth: "640px" }}
              onSubmit={manejarEnvio}
              noValidate
            >
              {errorGeneral && (
                <p className="field-error" style={{ display: "block" }}>
                  {errorGeneral}
                </p>
              )}

              <div className={`form-field${errores.nombre ? " has-error" : ""}`}>
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={valores.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Sofá Patagonia"
                />
                <span className="field-error">{errores.nombre}</span>
              </div>

              <div className="form-field">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  rows="4"
                  value={valores.descripcion}
                  onChange={manejarCambio}
                  placeholder="Materiales, medidas, terminación…"
                />
              </div>

              <div className="form-row">
                <div className={`form-field${errores.precio ? " has-error" : ""}`}>
                  <label htmlFor="precio">Precio (ARS)</label>
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    min="0"
                    step="1"
                    value={valores.precio}
                    onChange={manejarCambio}
                    placeholder="950000"
                  />
                  <span className="field-error">{errores.precio}</span>
                </div>

                <div className={`form-field${errores.stock ? " has-error" : ""}`}>
                  <label htmlFor="stock">Stock</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    min="0"
                    step="1"
                    value={valores.stock}
                    onChange={manejarCambio}
                    placeholder="10"
                  />
                  <span className="field-error">{errores.stock}</span>
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="imagenUrl">URL de la imagen</label>
                <input
                  type="text"
                  id="imagenUrl"
                  name="imagenUrl"
                  value={valores.imagenUrl}
                  onChange={manejarCambio}
                  placeholder="/img/sofa-patagonia.png o https://…"
                />
              </div>

              {valores.imagenUrl && (
                <div className="image-preview">
                  <img
                    src={valores.imagenUrl}
                    alt="Vista previa"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="categoria">Categoría</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={valores.categoria}
                    onChange={manejarCambio}
                  >
                    {CATEGORIAS_FORM.map((cat) => (
                      <option key={cat.valor} value={cat.valor}>
                        {cat.etiqueta}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field checkbox-field">
                  <label htmlFor="destacado">
                    <input
                      type="checkbox"
                      id="destacado"
                      name="destacado"
                      checked={valores.destacado}
                      onChange={manejarCambio}
                    />
                    Mostrar en destacados (home)
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" type="submit" disabled={estado === "guardando"}>
                  {estado === "guardando"
                    ? "Guardando…"
                    : esEdicion
                      ? "Guardar cambios"
                      : "Crear producto"}
                </button>
                <Link to="/admin" className="btn btn-outline">
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductForm;
