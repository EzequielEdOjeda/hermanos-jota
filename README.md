# Hermanos Jota — E-commerce de Muebles (Full Stack)

Proyecto integrador para el programa **Full Stack Developer** del **ITBA**. Reconstrucción completa del sitio como una aplicación **cliente-servidor real**, con un backend propio en **Node.js + Express + MongoDB** y un frontend en **React** que consume esa API vía `fetch`. Incluye **autenticación con JWT y roles** (administrador / cliente).

![Web](image.png)

---

## 🔗 Links del Proyecto

| Servicio                           | URL                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------ |
| 🚙 **Frontend (Mueblería Jota)**   | [https://hermanosjota.vercel.app/](https://hermanosjota.vercel.app/)                       |
| ⚙️ **Backend API (Hermanos Jota)** | [https://hermanos-jota-6p4o.onrender.com/api](https://hermanos-jota-6p4o.onrender.com/api) |

> **Nota:** Con la API desplegada, puede tardar unos segundos en "despertar" tras un periodo de inactividad en Render.

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

- **`/backend`** — API REST construida con Node.js, Express y Mongoose (MongoDB). Expone el catálogo de productos (con CRUD solo para administradores), la autenticación con JWT y un endpoint de contacto.
- **`/client`** — Aplicación de React (SPA) con React Router que consume esa API y renderiza toda la interfaz de forma dinámica.

### Funcionalidades principales

- **Inicio**: Hero + piezas destacadas, obtenidas desde la API.
- **Catálogo**: Grilla completa de productos con buscador y filtro por categoría (living, comedor, dormitorio, oficina).
- **Detalle de producto**: Imagen, descripción, especificaciones técnicas y selector de cantidad, mostrado con renderizado condicional (sin recargar la página).
- **Carrito de compras**: Panel flotante con contador en la barra de navegación, controles de cantidad y total, manejado 100% con estado de React.
- **Contacto**: Formulario controlado con validación en el cliente y envío real al backend (`POST /api/contacto`).
- **Registro e inicio de sesión**: formularios con validación, token JWT persistido y sesión restaurada al recargar la página (`GET /api/auth/me`).
- **Roles**: el Navbar muestra _Ingresar / Registrarse_ o un menú de usuario (con badge **Admin** si corresponde). Las rutas `/admin/*` solo se abren con rol `admin`.
- **Panel de administración**: los administradores pueden crear, editar y eliminar productos desde la interfaz (botones visibles solo para ellos).

---

## 📐 Arquitectura del proyecto

```
hermanos-jota/
├── backend/                  # API REST (Node.js + Express + MongoDB)
│   ├── server.js             # Punto de entrada: valida el .env, conecta a Mongo y levanta el servidor
│   └── src/
│       ├── app.js            # Configuración de Express (middlewares y rutas)
│       ├── config/
│       │   └── db.js         # Conexión a MongoDB con Mongoose (connectDB)
│       ├── models/           # Usuario.js y Producto.js (schemas de Mongoose)
│       ├── data/
│       │   └── productos.js  # Datos iniciales: los usa el seed (ya no es la "base de datos")
│       ├── controllers/      # Lógica de cada recurso (auth, productos, contacto)
│       ├── routes/           # Rutas organizadas con express.Router
│       ├── middlewares/      # auth (verificarToken / soloAdmin), validarObjectId,
│       │                     # logger, notFound (404) y errorHandler
│       ├── scripts/          # seed.js (productos) y seedUsuarios.js (usuarios de prueba)
│       └── utils/            # httpError.js (errores con status HTTP)
│
├── client/                   # Frontend (React + Vite + React Router)
│   ├── index.html
│   └── src/
│       ├── main.jsx          # Punto de entrada: BrowserRouter + ToastProvider + AuthProvider
│       ├── App.jsx           # Rutas + estado compartido (productos, carrito) + acciones de admin
│       ├── context/          # AuthContext (sesión JWT) y ToastContext (avisos)
│       ├── components/       # Navbar, Login, Register, RutaPrivada, ProductForm (admin),
│       │                     # ProductCard, ProductList, ProductDetail, CartPanel, Toast...
│       ├── services/
│       │   └── api.js        # Cliente fetch centralizado hacia el backend
│       ├── utils/
│       │   └── format.js     # Formateo de precios, categorías, roles
│       └── styles/
│           └── style.css
│
├── docs/
│   └── RENDER-MONGODB.txt    # Guía paso a paso: conectar Render con MongoDB Atlas
├── eslint.config.js          # ESLint (Flat Config) para backend y client
├── .prettierrc / .prettierignore
├── commitlint.config.cjs     # Reglas de Conventional Commits
├── .husky/                   # Git hooks (pre-commit y commit-msg)
└── package.json              # Tooling de calidad de código (raíz)
```

### 🔌 API REST — Endpoints disponibles

| Método   | Endpoint             | Acceso    | Descripción                                                                                          |
| -------- | -------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| `GET`    | `/api`               | Público   | Ruta de salud, útil para confirmar que el servidor está arriba.                                      |
| `GET`    | `/api/productos`     | Público   | Listado completo de productos.                                                                       |
| `GET`    | `/api/productos/:id` | Público   | Un producto por `id`. `400` si el id no es válido, `404` si no existe.                               |
| `POST`   | `/api/productos`     | **Admin** | Crea un producto (`201`). Guarda en `creadoPor` al admin que lo creó.                                |
| `PUT`    | `/api/productos/:id` | **Admin** | Actualiza los campos enviados; el resto queda igual.                                                 |
| `DELETE` | `/api/productos/:id` | **Admin** | Elimina el producto.                                                                                 |
| `POST`   | `/api/auth/register` | Público   | Crea una cuenta (rol `cliente`).                                                                     |
| `POST`   | `/api/auth/login`    | Público   | Inicia sesión y devuelve el token.                                                                   |
| `GET`    | `/api/auth/me`       | Token     | Devuelve el usuario dueño del token.                                                                 |
| `POST`   | `/api/contacto`      | Público   | Recibe `{ nombre, email, mensaje }`, valida en el servidor y responde `201` o `400` con los errores. |

**Formato de las respuestas:** los productos responden `{ ok: true, data }`; la autenticación, `{ ok: true, usuario, token }`; y cualquier error, siempre `{ ok: false, error: "..." }` (lo arma el `errorHandler` centralizado). Cualquier ruta inexistente devuelve un `404` uniforme gracias al middleware `notFound`.

**Códigos de error más comunes:** `400` datos inválidos (incluye un id mal formado) · `401` falta el token, es inválido o venció / credenciales incorrectas · `403` el usuario no es admin · `404` no existe · `409` el correo (o el slug) ya está registrado.

### 🔐 Autenticación y roles

La API usa **JWT**: tras iniciar sesión, el cliente envía el token en cada petición protegida con el header `Authorization: Bearer <token>`.

| Rol       | Qué puede hacer                                                                        |
| --------- | -------------------------------------------------------------------------------------- |
| `cliente` | Ver el catálogo, armar el carrito y contactarse. Es el rol de **todo** registro nuevo. |
| `admin`   | Todo lo anterior + **crear, editar y eliminar productos** (CRUD).                      |

| Endpoint                  | Body                          | Respuesta                                                                                      |
| ------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------- |
| `POST /api/auth/register` | `{ nombre, email, password }` | `201` `{ ok, usuario, token }`. El rol siempre es `cliente`: si el body trae `rol`, se ignora. |
| `POST /api/auth/login`    | `{ email, password }`         | `200` `{ ok, usuario, token }` · `401` `"Credenciales inválidas"`.                             |
| `GET /api/auth/me`        | — (header `Authorization`)    | `200` `{ ok, usuario }` · `401` si el token falta, es inválido o venció.                       |

- Las contraseñas se guardan hasheadas con **bcrypt (10 rounds)**; nunca se devuelven en ningún JSON.
- El token se firma con `{ id, rol }` y `JWT_SECRET`, y vence a los `7d` (configurable con `JWT_EXPIRES`).
- El rol se **vuelve a leer de la base** en cada petición protegida: si un admin es degradado o eliminado, pierde el acceso de inmediato.

### 👤 Usuarios de prueba

Se crean con `npm run seed:users` (ver más abajo):

| Rol       | Email                      | Contraseña   |
| --------- | -------------------------- | ------------ |
| `admin`   | `admin@hermanosjota.com`   | `admin123`   |
| `cliente` | `cliente@hermanosjota.com` | `cliente123` |

> ⚠️ **Son credenciales públicas** (están en este README). Si la base de datos está en internet, definí `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en `backend/.env` **antes** de correr `npm run seed:users` para crear un admin con datos propios.

### 🔧 Variables de entorno

| Variable                                   | Dónde   | Descripción                                                                                |
| ------------------------------------------ | ------- | ------------------------------------------------------------------------------------------ |
| `PORT`                                     | backend | Puerto de la API (por defecto `4000`; Render lo define solo).                              |
| `MONGODB_URI`                              | backend | Cadena de conexión a MongoDB (local o Atlas). **Obligatoria.**                             |
| `JWT_SECRET`                               | backend | Secreto con el que se firman los tokens. **Obligatorio**; usá un string largo y aleatorio. |
| `JWT_EXPIRES`                              | backend | Vigencia del token (por defecto `7d`).                                                     |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | backend | _Opcionales_: admin propio para `npm run seed:users`.                                      |
| `VITE_API_URL`                             | client  | URL base de la API (ej. `http://localhost:4000/api`).                                      |

Si falta `MONGODB_URI` o `JWT_SECRET`, el backend se detiene al arrancar con un mensaje claro.

### 🌱 Seeds (carga de datos)

```bash
cd backend
npm run seed             # carga los productos de src/data/productos.js (no duplica si ya existen)
npm run seed -- --reset  # BORRA todos los productos y los vuelve a cargar
npm run seed:users       # crea el admin y el cliente de prueba (omite los que ya existen)
```

---

## 📝 Decisiones tomadas

- **Vite en lugar de Create React App.** La consigna original sugería `create-react-app`, pero esa herramienta está **deprecada y sin mantenimiento activo** por parte de Meta. Elegimos **Vite** porque cumple exactamente los mismos objetivos pedagógicos (componentes, `useState`, props, eventos, `.map`/`keys`, renderizado condicional y `fetch`), con arranque y build considerablemente más rápidos y sin warnings de dependencias desactualizadas.
- **React Router (`react-router-dom`).** En las etapas anteriores la navegación se resolvía con un estado (`vista`) y renderizado condicional, sin librería de ruteo. Para el sprint de login y roles hacían falta **URLs reales** (`/login`, `/register`, `/admin/*`) y **rutas protegidas** (`RutaPrivada`), así que se migró a React Router. Las rutas están declaradas en `App.jsx`, que sigue concentrando el estado compartido (productos y carrito). `vercel.json` ya redirige todas las rutas a `index.html`, así que los links directos funcionan en producción.
- **Carrito 100% en estado de React (sin `localStorage`).** La versión anterior (sin backend) persistía el carrito en `localStorage`. En esta etapa el objetivo explícito es practicar `useState`/props, así que el carrito vive únicamente en `App.js` y se reinicia al recargar la página. Es un trade-off consciente: menos "persistencia real", más foco en el objetivo de aprendizaje de la consigna.
- **`cors` en el backend.** Como el cliente (`http://localhost:5173`) y la API (`http://localhost:4000`) corren en orígenes distintos durante el desarrollo, se agregó el middleware `cors` para habilitar las peticiones entre ambos. Sin esto, el navegador bloquea el `fetch` por la política de mismo origen.
- **Endpoint `POST /api/contacto`.** No estaba explícitamente pedido, pero se agregó para que el formulario de contacto también hable con el backend real (usando `express.json()` para parsear el body), en línea con el espíritu del proyecto: "una verdadera aplicación cliente-servidor". Valida los mismos campos tanto en el cliente como en el servidor.
- **MongoDB (Mongoose) en lugar de datos en memoria.** El catálogo y los usuarios viven en MongoDB (Atlas en producción). `backend/src/data/productos.js` se conserva solo como fuente de datos iniciales para `npm run seed`. El modelo `Producto` incluye los campos del sprint (`nombre`, `descripcion`, `precio`, `stock`, `imagenUrl`, `creadoPor`) más los que el catálogo ya usaba (`slug`, `categoria`, `descripcionCorta`, `medidas`, `materiales`, `acabado`, `peso`, `detalleExtra`, `destacado`). Al sembrar, `imagen` pasa a `imagenUrl` y `descripcionLarga` a `descripcion`.
- **JWT guardado en `localStorage`.** Es la opción más simple para una SPA con backend en otro dominio (Vercel + Render) y permite restaurar la sesión al recargar. El trade-off conocido es que un XSS podría leer el token; por eso el rol y los permisos se verifican **siempre en el backend** (`verificarToken` + `soloAdmin`) y `RutaPrivada` en el cliente es solo una ayuda de UX.
- **Respuestas con formato `{ ok, data | error }`.** Los endpoints de productos devuelven `{ ok: true, data }` en lugar del array/objeto "pelado" de las etapas anteriores, para que éxitos y errores tengan la misma forma.
- **ESLint Flat Config + Prettier.** Se usó el nuevo formato de configuración de ESLint (`eslint.config.js`), con reglas separadas para el backend (entorno Node) y el cliente (entorno browser + JSX + hooks de React), y `eslint-plugin-prettier` / `eslint-config-prettier` para que Prettier sea la única fuente de verdad sobre el estilo del código.

---

## ⚙️ Instalación y ejecución

Se necesitan **dos terminales** abiertas: una para el backend y otra para el cliente. También hace falta **Node.js 20.19 o superior** y una base **MongoDB** (local o gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas)).

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd hermanos-jota
```

### 2. Levantar el backend (API)

```bash
cd backend
npm install
cp .env.example .env      # completá MONGODB_URI y JWT_SECRET (ver "Variables de entorno")
npm run seed:users         # crea el admin y el cliente de prueba
npm run seed               # carga los productos en MongoDB
npm run dev                # o "npm start" para modo producción
```

El servidor queda disponible en **http://localhost:4000**. Podés probarlo directamente en el navegador o con `curl`:

```bash
curl http://localhost:4000/api/productos

# Login y llamada protegida (el POST sin token o con un cliente responde 401/403)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hermanosjota.com","password":"admin123"}'
```

> ¿Todavía no tenés base de datos o querés desplegar en Render? Seguí la guía [`docs/RENDER-MONGODB.txt`](docs/RENDER-MONGODB.txt).

### 3. Levantar el cliente (React)

En otra terminal:

```bash
cd client
npm install
cp .env.example .env      # define VITE_API_URL=http://localhost:4000/api
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**. Con el backend corriendo en paralelo, el catálogo, el detalle de producto, el formulario de contacto, el registro/inicio de sesión y el panel de administración van a funcionar de punta a punta.

> Si cambiás el puerto del backend, actualizá `VITE_API_URL` en `client/.env` para que apunte al puerto correcto.

### 4. Build de producción del cliente (opcional)

```bash
cd client
npm run build      # genera client/dist
npm run preview    # sirve ese build localmente para probarlo
```

### ☁️ Despliegue (Render + MongoDB Atlas)

Después de este sprint el backend necesita tres variables en Render: `MONGODB_URI`, `JWT_SECRET` y `JWT_EXPIRES`. La guía completa (crear el cluster en Atlas, habilitar la red, variables en Render, correr los seeds y verificar) está en [`docs/RENDER-MONGODB.txt`](docs/RENDER-MONGODB.txt). Desplegá **backend y frontend juntos**: el formato de las respuestas de `/api/productos` cambió y el cliente nuevo ya lo contempla.

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
| **MongoDB + Mongoose**              | Base de datos de productos y usuarios (modelos y validaciones) |
| **jsonwebtoken + bcryptjs**         | Sesiones con JWT y hash de contraseñas                         |
| **cors**                            | Habilita las peticiones del cliente (otro origen) hacia la API |
| **React 19 + Vite**                 | Interfaz de usuario, componentes y estado                      |
| **React Router**                    | Rutas del cliente y rutas protegidas por rol                   |
| **ESLint (Flat Config) + Prettier** | Calidad y formato de código                                    |
| **Husky + lint-staged**             | Automatización de controles de calidad antes de cada commit    |
| **Commitlint**                      | Estandarización de los mensajes de commit                      |
| **Git & GitHub**                    | Control de versiones y trabajo colaborativo                    |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para el ITBA — Full Stack Developer.

---

**Hermanos Jota** — _Redescubriendo el arte de vivir desde 2025._
