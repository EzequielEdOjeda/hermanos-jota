/**
 * Hermanos Jota — contacto.html
 * Validación 100% del lado del cliente. No hay backend: al validar
 * correctamente, se muestra un mensaje de éxito manipulando el DOM.
 */

function validarCampo(campoId, condicionValida) {
  const campo = document.getElementById(campoId);
  const esValido = condicionValida();
  campo.classList.toggle("has-error", !esValido);
  return esValido;
}

function validarFormularioContacto() {
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nombreValido = validarCampo("campo-nombre", () => nombre.length >= 3);
  const emailValido = validarCampo("campo-email", () => regexEmail.test(email));
  const mensajeValido = validarCampo("campo-mensaje", () => mensaje.length >= 10);

  return nombreValido && emailValido && mensajeValido;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-contacto");
  const exito = document.getElementById("form-exito");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const esValido = validarFormularioContacto();

    if (esValido) {
      exito.classList.add("is-visible");
      form.reset();

      // Quita los estados de error remanentes tras el reset
      document
        .querySelectorAll(".form-field.has-error")
        .forEach((campo) => campo.classList.remove("has-error"));

      // Oculta el mensaje de éxito después de unos segundos
      clearTimeout(exito._timeoutId);
      exito._timeoutId = setTimeout(() => {
        exito.classList.remove("is-visible");
      }, 5000);
    } else {
      exito.classList.remove("is-visible");
    }
  });

  // Revalida un campo apenas el usuario corrige el error (mejor feedback)
  ["nombre", "email", "mensaje"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      const campo = document.getElementById(`campo-${id}`);
      if (campo.classList.contains("has-error")) {
        validarFormularioContacto();
      }
    });
  });
});
