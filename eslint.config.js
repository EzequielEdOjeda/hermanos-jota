import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  // --- Archivos y carpetas que ESLint nunca debe analizar ---
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/build/**", "client/public/**", "**/*.min.js"],
  },

  // --- Reglas base de JavaScript recomendadas por ESLint ---
  js.configs.recommended,

  // --- Backend: Node.js + Express (ES Modules) ---
  {
    files: ["backend/**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^next$|^_" }],
      "no-console": "off",
    },
  },

  // --- Frontend: React (JSX, navegador) ---
  {
    files: ["client/src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      prettier: prettierPlugin,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off", // No hace falta con el JSX runtime automático (Vite)
      "react/prop-types": "off", // El proyecto no usa prop-types
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
    settings: {
      react: { version: "detect" },
    },
  },

  // --- Configuración de los propios archivos de configuración (raíz) ---
  {
    files: ["*.config.js", "*.config.mjs"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
];
