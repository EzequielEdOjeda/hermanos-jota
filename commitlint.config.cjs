/**
 * Configuración de Commitlint — Hermanos Jota
 *
 * Extiende la configuración convencional estándar y restringe los
 * tipos de commit permitidos a los definidos por la cátedra:
 *
 *   feat     ✨  Nueva característica o funcionalidad
 *   fix      🐛  Corrección de un error o bug
 *   chore    🔧  Mantenimiento, dependencias o configuración
 *   docs     📝  Cambios exclusivos de documentación
 *   style    🎨  Formato (espacios, punto y coma, indentación)
 *   refactor ♻️  Cambios de código sin nueva funcionalidad ni fix
 *   test     🧪  Agregar o modificar pruebas automáticas
 *
 * Ejemplo válido: "feat: agregar endpoint para eliminar autores"
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "chore", "docs", "style", "refactor", "test"]],
    "subject-case": [0],
  },
};
