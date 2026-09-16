import { useState } from "react";
import { enviarMensajeContacto } from "../services/api";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALORES_INICIALES = { nombre: "", email: "", mensaje: "" };

function validar(valores) {
  const errores = {};

  if (valores.nombre.trim().length < 3) {
    errores.nombre = "Ingresá tu nombre completo (mínimo 3 caracteres).";
  }
  if (!REGEX_EMAIL.test(valores.email.trim())) {
    errores.email = "Ingresá un correo electrónico válido.";
  }
  if (valores.mensaje.trim().length < 10) {
    errores.mensaje = "Escribí un mensaje de al menos 10 caracteres.";
  }

  return errores;
}

function ContactForm() {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [estado, setEstado] = useState("idle"); // idle | enviando | exito | error
  const [errorServidor, setErrorServidor] = useState("");

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((prev) => ({ ...prev, [name]: value }));

    // Revalida en vivo únicamente el campo que ya tenía un error, para
    // dar feedback apenas el usuario lo corrige.
    setErrores((prev) => {
      if (!prev[name]) return prev;
      const erroresActualizados = validar({ ...valores, [name]: value });
      return { ...prev, [name]: erroresActualizados[name] };
    });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const erroresValidacion = validar(valores);
    setErrores(erroresValidacion);

    if (Object.keys(erroresValidacion).length > 0) {
      setEstado("idle");
      return;
    }

    setEstado("enviando");
    setErrorServidor("");

    try {
      await enviarMensajeContacto(valores);
      setEstado("exito");
      setValores(VALORES_INICIALES);
      setErrores({});

      setTimeout(() => setEstado("idle"), 5000);
    } catch (error) {
      setEstado("error");
      setErrorServidor(error.message);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <p className="eyebrow">Hablemos</p>
        <h1 className="section-title">Contacto</h1>
        <p
          className="section-intro"
          style={{ color: "var(--color-ink-soft)", marginBottom: "2rem" }}
        >
          Consultas sobre pedidos especiales, restauración de piezas o visitas al showroom. Te
          respondemos en menos de 48 horas hábiles.
        </p>

        <div className="contact-layout">
          <form className="contact-form" onSubmit={manejarEnvio} noValidate>
            {estado === "exito" && (
              <div className="form-success is-visible">
                ✅ ¡Gracias! Tu mensaje fue enviado. Te vamos a responder a la brevedad.
              </div>
            )}

            {estado === "error" && (
              <p className="state-message">
                No pudimos enviar tu mensaje ({errorServidor}). Probá nuevamente en unos minutos.
              </p>
            )}

            <div className={`form-field${errores.nombre ? " has-error" : ""}`}>
              <label htmlFor="nombre">Nombre completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Tu nombre y apellido"
                value={valores.nombre}
                onChange={manejarCambio}
              />
              <span className="field-error">
                {errores.nombre || "Ingresá tu nombre completo (mínimo 3 caracteres)."}
              </span>
            </div>

            <div className={`form-field${errores.email ? " has-error" : ""}`}>
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                value={valores.email}
                onChange={manejarCambio}
              />
              <span className="field-error">
                {errores.email || "Ingresá un correo electrónico válido."}
              </span>
            </div>

            <div className={`form-field${errores.mensaje ? " has-error" : ""}`}>
              <label htmlFor="mensaje">Mensaje</label>
              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                placeholder="Contanos en qué podemos ayudarte…"
                value={valores.mensaje}
                onChange={manejarCambio}
              ></textarea>
              <span className="field-error">
                {errores.mensaje || "Escribí un mensaje de al menos 10 caracteres."}
              </span>
            </div>

            <button type="submit" className="btn btn-primary" disabled={estado === "enviando"}>
              {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
            </button>
          </form>

          <div className="contact-info">
            <div className="contact-info__card">
              <h3>Showroom y taller</h3>
              <p>Av. San Juan 2847, Barrio de San Cristóbal, CABA, Argentina.</p>
            </div>
            <div className="contact-info__card">
              <h3>Horarios</h3>
              <p>
                Lunes a viernes: 10:00 – 19:00
                <br />
                Sábados: 10:00 – 14:00
              </p>
            </div>
            <div className="contact-info__card">
              <h3>Contacto directo</h3>
              <p>
                info@hermanosjota.com.ar
                <br />
                ventas@hermanosjota.com.ar
                <br />
                WhatsApp: +54 11 4567-8900
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
