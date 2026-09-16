# Hermanos Jota — E-commerce de Muebles (Full Stack)

Proyecto integrador para el programa **Full Stack Developer** del **ITBA**. Reconstrucción completa del sitio como una aplicación **cliente-servidor real**, con un backend propio en **Node.js + Express** y un frontend en **React** que consume esa API vía `fetch`.

---

## 🔗 Links del Proyecto

| Servicio | URL |
|----------|-----|
| 🚙 **Frontend (Mueblería Jota)** | [https://muebleria-jota-89nl.onrender.com](https://muebleria-jota-89nl.onrender.com) |
| ⚙️ **Backend API (Hermanos Jota)** | [https://hermanos-jota-6p4o.onrender.com/api](https://hermanos-jota-6p4o.onrender.com/api) |

> **Nota:** Ambos servicios están desplegados en [Render](https://render.com) (plan gratuito). Pueden tardar unos segundos en "despertar" tras un periodo de inactividad.

---

## 👥 Integrantes

| Integrantes               |
| ------------------------- |
| Ojeda Ezequiel Edgardo    |
| Tobías Alí Torres Ochoa   |
| Olea Dana Liz             |
| Bustos Peña Juliana Belen |

---

## 📖 Descripción

**Hermanos Jota** es un e-commerce de muebles de diseño. La aplicación quedó dividida en dos proyectos independientes que se ejecutan y se despliegan por separado, pero que conversan entre sí por HTTP:

- **`/backend`** — API REST construida con Node.js y Express, que expone el catálogo de productos y un endpoint de contacto.
- **`/client`** — Aplicación de React (SPA) que consume esa API y renderiza toda la interfaz de forma dinámica.

### Funcionalidades principales

- **Inicio**: Hero + piezas destacadas, obtenidas desde la API.
- **Catálogo**: Grilla completa de productos con buscador y filtro por categoría (living, comedor, dormitorio, oficina).
- **Detalle de producto**: Imagen, descripción, especificaciones técnicas y selector de cantidad, mostrado con renderizado condicional (sin recargar la página).
- **Carrito de compras**: Panel flotante con contador en la barra de navegación, controles de cantidad y total, manejado 100% con estado de React.
- **Contacto**: Formulario controlado con validación en el cliente y envío real al backend (`POST /api/contacto`).

---

## 📐 Arquitectura del proyecto

```
hermanos-jota/
├── backend/                  # API REST (Node.js + Express)
│   ├── server.js             # Punto de entrada: levanta el servidor HTTP
│   └── src/
│       ├── app.js            # Configuración de Express (middlewares y rutas)
│       ├── data/
│       │   └── productos.js  # "Base de datos" en memoria (array de objetos)
│       ├── controllers/      # Lógica de cada recurso
│       ├── routes/           # Rutas organizadas con express.Router
│       └── middlewares/      # logger, notFound (404) y errorHandler
│
├── client/                   # Frontend (React + Vite)
│   ├── index.html
│   └── src/
│       ├── main.jsx          # Punto de entrada de React
│       ├── App.jsx           # Estado global: productos, carrito, navegación
│       ├── components/       # Navbar, Footer, ProductCard, ProductList,
│       │                     # ProductDetail, ContactForm, CartPanel, Toast...
│       ├── services/
│       │   └── api.js        # Cliente fetch centralizado hacia el backend
│       ├── utils/
│       │   └── format.js     # Formateo de precios y categorías
│       └── styles/
│           └── style.css
│
├── eslint.config.js          # ESLint (Flat Config) para backend y client
├── .prettierrc / .prettierignore
├── commitlint.config.cjs     # Reglas de Conventional Commits
├── .husky/                   # Git hooks (pre-commit y commit-msg)
└── package.json              # Tooling de calidad de código (raíz)
```

### 🔌 API REST — Endpoints disponibles

| Método | Endpoint             | Descripción                                                                                          |
| ------ | -------------------- | ---------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/productos`     | Devuelve el listado completo de productos.                                                           |
| `GET`  | `/api/productos/:id` | Devuelve un producto por `id`. Responde `404` si no existe.                                          |
| `POST` | `/api/contacto`      | Recibe `{ nombre, email, mensaje }`, valida en el servidor y responde `201` o `400` con los errores. |
| `GET`  | `/api`               | Ruta de salud, útil para confirmar que el servidor está arriba.                                      |

Cualquier otra ruta devuelve un `404` uniforme gracias al middleware `notFound`, y cualquier error no controlado es capturado por el `errorHandler` centralizado, siempre en formato `{ ok: false, error: "..." }`.

---

## 📝 Decisiones tomadas

- **Vite en lugar de Create React App.** La consigna original sugería `create-react-app`, pero esa herramienta está **deprecada y sin mantenimiento activo** por parte de Meta. Elegimos **Vite** porque cumple exactamente los mismos objetivos pedagógicos (componentes, `useState`, props, eventos, `.map`/`keys`, renderizado condicional y `fetch`), con arranque y build considerablemente más rápidos y sin warnings de dependencias desactualizadas.
- **Sin librería de ruteo.** La navegación entre "Inicio", "Catálogo", "Detalle" y "Contacto" se resuelve con un estado (`vista`) en `App.jsx` y renderizado condicional, tal como pide la consigna, en vez de sumar `react-router` (que hubiera sido una herramienta más, no un objetivo de este integrador).
- **Carrito 100% en estado de React (sin `localStorage`).** La versión anterior (sin backend) persistía el carrito en `localStorage`. En esta etapa el objetivo explícito es practicar `useState`/props, así que el carrito vive únicamente en `App.js` y se reinicia al recargar la página. Es un trade-off consciente: menos "persistencia real", más foco en el objetivo de aprendizaje de la consigna.
- **`cors` en el backend.** Como el cliente (`http://localhost:5173`) y la API (`http://localhost:4000`) corren en orígenes distintos durante el desarrollo, se agregó el middleware `cors` para habilitar las peticiones entre ambos. Sin esto, el navegador bloquea el `fetch` por la política de mismo origen.
- **Endpoint `POST /api/contacto`.** No estaba explícitamente pedido, pero se agregó para que el formulario de contacto también hable con el backend real (usando `express.json()` para parsear el body), en línea con el espíritu del proyecto: "una verdadera aplicación cliente-servidor". Valida los mismos campos tanto en el cliente como en el servidor.
- **Datos en memoria, no en una base de datos.** Tal como pide la consigna, el catálogo vive en un array de objetos en `backend/src/data/productos.js`. No se sumó ninguna base de datos porque no forma parte de los objetivos de este integrador.
- **ESLint Flat Config + Prettier.** Se usó el nuevo formato de configuración de ESLint (`eslint.config.js`), con reglas separadas para el backend (entorno Node) y el cliente (entorno browser + JSX + hooks de React), y `eslint-plugin-prettier` / `eslint-config-prettier` para que Prettier sea la única fuente de verdad sobre el estilo del código.

---

## ⚙️ Instalación y ejecución

Se necesitan **dos terminales** abiertas: una para el backend y otra para el cliente. También hace falta **Node.js 18 o superior**.

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd hermanos-jota
```

### 2. Levantar el backend (API)

```bash
cd backend
npm install
cp .env.example .env      # define PORT=4000 (podés cambiarlo)
npm run dev                # o "npm start" para modo producción
```

El servidor queda disponible en **http://localhost:4000**. Podés probarlo directamente en el navegador o con `curl`:

```bash
curl http://localhost:4000/api/productos
```

### 3. Levantar el cliente (React)

En otra terminal:

```bash
cd client
npm install
cp .env.example .env      # define VITE_API_URL=http://localhost:4000/api
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**. Con el backend corriendo en paralelo, el catálogo, el detalle de producto y el formulario de contacto van a funcionar de punta a punta.

> Si cambiás el puerto del backend, actualizá `VITE_API_URL` en `client/.env` para que apunte al puerto correcto.

### 4. Build de producción del cliente (opcional)

```bash
cd client
npm run build      # genera client/dist
npm run preview    # sirve ese build localmente para probarlo
```

---

## 🚀 Calidad de código y buenas prácticas

Todo el tooling de calidad vive en la **raíz** del repositorio y aplica tanto a `/backend` como a `/client`.

### Instalación (ya incluida en el repo, solo hace falta `npm install` en la raíz)

```bash
npm install
```

Esto instala **ESLint**, **Prettier**, **Husky**, **lint-staged** y **Commitlint** como dependencias de desarrollo, y deja los Git hooks configurados automáticamente (`npm run prepare`).

### ESLint + Prettier ✨

- `npm run lint` — analiza todo el proyecto en busca de errores y malas prácticas.
- `npm run lint:fix` — corrige automáticamente lo que se pueda.
- `npm run format` — aplica el formato de Prettier a todo el repositorio.
- `npm run format:check` — verifica el formato sin modificar archivos (útil en CI).

La configuración vive en `eslint.config.js` (formato **Flat Config**) y usa `eslint-config-prettier` + `eslint-plugin-prettier` para que ESLint delegue todo el formato a Prettier y no haya reglas en conflicto.

### Husky 🐶 + lint-staged

Antes de cada commit, el hook `pre-commit` ejecuta `lint-staged`, que corre ESLint (con `--fix`) y Prettier **solo sobre los archivos que están en stage**. Si algo no se puede corregir automáticamente, el commit se cancela y hay que resolver el problema a mano antes de volver a intentarlo.

### Commitlint 📏 — Conventional Commits

El hook `commit-msg` valida que cada mensaje de commit siga el formato `tipo: descripción`, usando alguno de estos tipos:

| Tipo       | Emoji | Cuándo usarlo                                    | Ejemplo                                              |
| ---------- | ----- | ------------------------------------------------ | ---------------------------------------------------- |
| `feat`     | ✨    | Nueva característica o funcionalidad             | `feat: agregar endpoint para eliminar productos`     |
| `fix`      | 🐛    | Corrección de un error o bug                     | `fix: corregir validación de email en el formulario` |
| `chore`    | 🔧    | Mantenimiento, dependencias o configuración      | `chore: actualizar dependencias del backend`         |
| `docs`     | 📝    | Cambios exclusivos de documentación              | `docs: actualizar instrucciones de instalación`      |
| `style`    | 🎨    | Formato (espacios, indentación, etc.)            | `style: formatear archivos con prettier`             |
| `refactor` | ♻️    | Cambios de código sin nueva funcionalidad ni fix | `refactor: extraer lógica del carrito a funciones`   |
| `test`     | 📈    | Agregar o modificar pruebas automáticas          | `test: agregar caso para producto inexistente`       |

Un commit que no respete este formato es **rechazado automáticamente** por el hook.

### Recomendación de flujo de trabajo para el equipo

1. Cada integrante trabaja en una rama propia (`feature/nombre-de-la-tarea`).
2. Antes de hacer push, correr `npm run lint` y `npm run format` en la raíz.
3. Commitear en español, siguiendo la tabla de tipos de arriba.
4. Abrir un Pull Request hacia `main` para que el resto del equipo revise los cambios.

---

## 💻️ Tecnologías utilizadas

| Tecnología                          | Uso                                                            |
| ----------------------------------- | -------------------------------------------------------------- |
| **Node.js + Express**               | API REST del backend                                           |
| **cors**                            | Habilita las peticiones del cliente (otro origen) hacia la API |
| **React 19 + Vite**                 | Interfaz de usuario, componentes y estado                      |
| **ESLint (Flat Config) + Prettier** | Calidad y formato de código                                    |
| **Husky + lint-staged**             | Automatización de controles de calidad antes de cada commit    |
| **Commitlint**                      | Estandarización de los mensajes de commit                      |
| **Git & GitHub**                    | Control de versiones y trabajo colaborativo                    |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para el ITBA — Full Stack Developer.

---

**Hermanos Jota** — _Redescubriendo el arte de vivir desde 2025._
