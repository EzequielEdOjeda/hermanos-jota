import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CATEGORIAS } from "../utils/format";

const CATEGORIAS_FORM = CATEGORIAS.filter((categoria) => categoria.valor !== "todas");

const VALORES_VACIOS = {
  nombre: "",
  categoria: "living",
  precio: "",
  stock: "0",
  imagenUrl: "",
  descripcionCorta: "",
  descripcion: "",
  medidas: "",
  materiales: "",
  acabado: "",
  detalleExtra: "",
  destacado: false,
};

/** Producto de la API → valores (strings) de los inputs del formulario. */
function aValores(producto) {
  if (!producto) return VALORES_VACIOS;

  return {
    nombre: producto.nombre ?? "",
    categoria: producto.categoria ?? "living",
    precio: String(producto.precio ?? ""),
    stock: String(producto.stock ?? 0),
    imagenUrl: producto.imagenUrl ?? "",
    descripcionCorta: producto.descripcionCorta ?? "",
    descripcion: producto.descripcion ?? "",
    medidas: producto.medidas ?? "",
    materiales: producto.materiales ?? "",
    acabado: producto.acabado ?? "",
    detalleExtra: producto.detalleExtra ?? "",
    destacado: Boolean(producto.destacado),
  };
}

/** Valores del formulario → body que espera la API (números ya convertidos). */
function aPayload(valores) {
  return {
    nombre: valores.nombre.trim(),
    categoria: valores.categoria,
    precio: Number(valores.precio),
    stock: valores.stock.trim() === "" ? 0 : Number(valores.stock),
    imagenUrl: valores.imagenUrl.trim(),
    descripcionCorta: valores.descripcionCorta.trim(),
    descripcion: valores.descripcion.trim(),
    medidas: valores.medidas.trim(),
    materiales: valores.materiales.trim(),
    acabado: valores.acabado.trim(),
    detalleExtra: valores.detalleExtra.trim(),
    destacado: valores.destacado,
  };
}

function validar(valores) {
  const errores = {};

  if (valores.nombre.trim().length < 3) {
    errores.nombre = "El nombre debe tener al menos 3 caracteres";
  }

  const precio = Number(valores.precio);
  if (valores.precio.trim() === "" || !Number.isFinite(precio) || precio < 0) {
    errores.precio = "Ingresá un precio válido (0 o más)";
  }

  const stock = Number(valores.stock);
  if (valores.stock.trim() !== "" && (!Number.isInteger(stock) || stock < 0)) {
    errores.stock = "El stock debe ser un número entero (0 o más)";
  }

  const imagen = valores.imagenUrl.trim();
  if (imagen && !/^(https?:\/\/|\/)/i.test(imagen)) {
    errores.imagenUrl = "Usá una URL completa (https://…) o una ruta del sitio (/img/mesa.png)";
  }

  return errores;
}

/**
 * Formulario de alta y edición de productos (solo administradores).
 * Rutas: /admin/crear-producto  y  /admin/editar-producto/:id
 *
 * `onGuardar(payload, id)` lo implementa App: llama a la API con el token del
 * admin, actualiza la lista de productos y devuelve el producto guardado.
 */
function FormularioProducto({ producto, onGuardar }) {
  const navigate = useNavigate();
  const esEdicion = Boolean(producto);

  const [valores, setValores] = useState(() => aValores(producto));
  const [errores, setErrores] = useState({});
  const [errorServidor, setErrorServidor] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [imagenRota, setImagenRota] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value;
    const nuevosValores = { ...valores, [name]: nuevoValor };

    setValores(nuevosValores);
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: validar(nuevosValores)[name] }));
    }
    if (name === "imagenUrl") setImagenRota(false);
    if (errorServidor) setErrorServidor("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (enviando) return;

    setErrorServidor("");
    const nuevosErrores = validar(valores);
    setErrores(nuevosErrores);

    const primerInvalido = Object.keys(nuevosErrores)[0];
    if (primerInvalido) {
      document.getElementById(`producto-${primerInvalido}`)?.focus();
      return;
    }

    setEnviando(true);
    try {
      const guardado = await onGuardar(aPayload(valores), producto?.id);
      navigate(`/producto/${guardado.id}`);
    } catch (error) {
      setErrorServidor(error.message);
      setEnviando(false);
    }
  }

  const imagen = valores.imagenUrl.trim();
  const hayVistaPrevia = imagen && !errores.imagenUrl && !imagenRota;

  // Props comunes de los inputs controlados.
  function campo(nombre) {
    return {
      id: `producto-${nombre}`,
      name: nombre,
      value: valores[nombre],
      onChange: handleChange,
      "aria-invalid": errores[nombre] ? "true" : undefined,
      "aria-describedby": errores[nombre] ? `producto-${nombre}-error` : undefined,
    };
  }

  function mensajeError(nombre) {
    return (
      <p className="field-error" id={`producto-${nombre}-error`}>
        {errores[nombre]}
      </p>
    );
  }

  return (
    <section className="section admin-page">
      <div className="container admin-page__inner">
        <p className="breadcrumb">
          <Link to="/catalogo">Catálogo</Link> /{" "}
          <span>{esEdicion ? "Editar" : "Nuevo producto"}</span>
        </p>

        <header className="admin-page__header">
          <p className="eyebrow">Panel admin</p>
          <h1 className="section-title">{esEdicion ? "Editar producto" : "Nuevo producto"}</h1>
          <p className="admin-page__lead">
            {esEdicion
              ? `Estás modificando “${producto.nombre}”. Los cambios se ven al instante en el catálogo.`
              : "Completá los datos de la pieza. Solo el nombre y el precio son obligatorios."}
          </p>
        </header>

        <form className="admin-form" onSubmit={handleSubmit} noValidate>
          <fieldset className="admin-form__group">
            <legend>Datos principales</legend>
            <div className="admin-form__grid">
              <div className={`form-field admin-form__wide${errores.nombre ? " has-error" : ""}`}>
                <label htmlFor="producto-nombre">Nombre *</label>
                <input type="text" autoComplete="off" {...campo("nombre")} />
                {mensajeError("nombre")}
              </div>

              <div className="form-field">
                <label htmlFor="producto-categoria">Categoría</label>
                <select {...campo("categoria")}>
                  {CATEGORIAS_FORM.map((categoria) => (
                    <option key={categoria.valor} value={categoria.valor}>
                      {categoria.etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`form-field${errores.precio ? " has-error" : ""}`}>
                <label htmlFor="producto-precio">Precio (ARS) *</label>
                <input type="number" min="0" step="any" inputMode="decimal" {...campo("precio")} />
                {mensajeError("precio")}
              </div>

              <div className={`form-field${errores.stock ? " has-error" : ""}`}>
                <label htmlFor="producto-stock">Stock</label>
                <input type="number" min="0" step="1" inputMode="numeric" {...campo("stock")} />
                {mensajeError("stock")}
              </div>
            </div>
          </fieldset>

          <fieldset className="admin-form__group">
            <legend>Imagen</legend>
            <div className="admin-form__image">
              <div className={`form-field${errores.imagenUrl ? " has-error" : ""}`}>
                <label htmlFor="producto-imagenUrl">URL de la imagen</label>
                <input
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="https://… o /img/mi-mueble.png"
                  {...campo("imagenUrl")}
                />
                {mensajeError("imagenUrl")}
                <span className="admin-form__hint">
                  Opcional. Podés pegar un link completo o usar una imagen de la carpeta /public/img
                  del sitio.
                </span>
              </div>

              <div className="admin-form__preview" aria-label="Vista previa de la imagen">
                {hayVistaPrevia ? (
                  <img src={imagen} alt="" onError={() => setImagenRota(true)} />
                ) : (
                  <span>{imagenRota ? "No se pudo cargar" : "Sin imagen"}</span>
                )}
              </div>
            </div>
          </fieldset>

          <fieldset className="admin-form__group">
            <legend>Descripción</legend>
            <div className="form-field">
              <label htmlFor="producto-descripcionCorta">Descripción corta</label>
              <input type="text" autoComplete="off" {...campo("descripcionCorta")} />
              <span className="admin-form__hint">
                Se muestra en las tarjetas y en el buscador. Si la dejás vacía se arma con el
                comienzo de la descripción completa.
              </span>
            </div>
            <div className="form-field">
              <label htmlFor="producto-descripcion">Descripción completa</label>
              <textarea rows="4" {...campo("descripcion")}></textarea>
            </div>
          </fieldset>

          <fieldset className="admin-form__group">
            <legend>Ficha técnica (opcional)</legend>
            <div className="admin-form__grid admin-form__grid--two">
              <div className="form-field">
                <label htmlFor="producto-medidas">Medidas</label>
                <input type="text" autoComplete="off" {...campo("medidas")} />
              </div>
              <div className="form-field">
                <label htmlFor="producto-materiales">Materiales</label>
                <input type="text" autoComplete="off" {...campo("materiales")} />
              </div>
              <div className="form-field">
                <label htmlFor="producto-acabado">Acabado</label>
                <input type="text" autoComplete="off" {...campo("acabado")} />
              </div>
              <div className="form-field">
                <label htmlFor="producto-detalleExtra">Detalle</label>
                <input type="text" autoComplete="off" {...campo("detalleExtra")} />
              </div>
            </div>
          </fieldset>

          <label className="admin-form__check">
            <input
              type="checkbox"
              name="destacado"
              checked={valores.destacado}
              onChange={handleChange}
            />
            Mostrar entre las piezas destacadas del inicio
          </label>

          {errorServidor && (
            <div className="form-alert form-alert--error" role="alert">
              <span>{errorServidor}</span>
            </div>
          )}

          <div className="admin-form__actions">
            <Link
              to={esEdicion ? `/producto/${producto.id}` : "/catalogo"}
              className="btn btn-outline"
            >
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {enviando ? "Guardando…" : esEdicion ? "Guardar cambios" : "Crear producto"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function ProductForm({ productos, cargando, error, onGuardar }) {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const producto = esEdicion ? productos.find((p) => p.id === id) : undefined;

  // Editando: hay que esperar a que lleguen los productos para precargar el formulario.
  if (esEdicion && cargando) {
    return (
      <section className="section">
        <div className="container">
          <p className="state-message" role="status">
            Cargando producto…
          </p>
        </div>
      </section>
    );
  }

  if (esEdicion && (error || !producto)) {
    return (
      <section className="section">
        <div className="container">
          <p className="state-message">
            No encontramos ese producto. <Link to="/catalogo">Volvé al catálogo</Link>.
          </p>
        </div>
      </section>
    );
  }

  // `key` reinicia el formulario si se pasa de "nuevo" a "editar" (o entre productos).
  return <FormularioProducto key={id ?? "nuevo"} producto={producto} onGuardar={onGuardar} />;
}

export default ProductForm;
