# Hermanos Jota — E-commerce de Muebles (Full Stack)

Proyecto integrador para el programa **Full Stack Developer** del **ITBA**. La aplicación es una app **cliente-servidor real y persistente**: backend propio en **Node.js + Express** con **MongoDB (Atlas)** como base de datos vía **Mongoose**, CRUD completo de productos, y un frontend en **React** con **React Router** (rutas reales, incluida una mini sección de administración) que consume esa API vía `fetch`.

---

## 🔗 Links del Proyecto

| Servicio                           | URL                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 🚙 **Frontend (Mueblería Jota)**   | [https://hermanosjota.vercel.app/](https://hermanosjota.vercel.app/)                                   |
| ⚙️ **Backend API (Hermanos Jota)** | [https://hermanos-jota-6p4o.onrender.com/api](https://hermanos-jota-6p4o.onrender.com/api)             |
| 🍃 **MongoDB Atlas**               | _Pendiente de conectar — ver [Conectar MongoDB Atlas](#-conectar-mongodb-atlas-paso-a-paso) más abajo_ |

> **Nota:** API desplegada en [Render](https://render.com) (plan gratuito). Puede tardar unos segundos en "despertar" tras un periodo de inactividad. Hasta que `MONGODB_URI` esté configurada en Render, el backend desplegado no va a poder levantar (ver la guía de conexión).

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

- **`/backend`** — API REST construida con Node.js y Express, con CRUD completo de productos persistido en MongoDB (Mongoose) y un endpoint de contacto.
- **`/client`** — Aplicación de React con React Router (rutas reales, incluida una sección de administración) que consume esa API y renderiza toda la interfaz de forma dinámica.

### Funcionalidades principales

- **Inicio** (`/`): Hero + piezas destacadas, obtenidas desde la API.
- **Catálogo** (`/productos`): Grilla completa de productos con buscador y filtro por categoría (living, comedor, dormitorio, oficina).
- **Detalle de producto** (`/productos/:id`): ruta dinámica con `useParams`, que hace su propio `GET /api/productos/:id` (funciona también entrando directo por URL). Imagen, descripción, especificaciones y selector de cantidad.
- **Carrito de compras**: Panel flotante con contador en la barra de navegación, controles de cantidad y total, manejado 100% con estado de React en `App.jsx`.
- **Contacto** (`/contacto`): Formulario controlado con validación en el cliente y envío real al backend (`POST /api/contacto`).
- **Iniciar sesión / Registrarse** (`/login`, `/register`): pantallas de autenticación con validación completa en el cliente. **Todavía no están conectadas a un backend de auth real** (es un placeholder a propósito, fuera del alcance de este sprint, que se centró en el CRUD de productos) — quedan listas para conectar a un endpoint de autenticación más adelante.
- **Panel de administración** (`/admin`, `/admin/crear-producto`, `/admin/editar-producto/:id`): CRUD completo de productos desde la UI — listar, crear, editar y eliminar, con navegación programática (`useNavigate`) al guardar.

---

## 📐 Arquitectura del proyecto

```
hermanos-jota/
├── backend/                     # API REST (Node.js + Express + MongoDB)
│   ├── server.js                # Punto de entrada: conecta a Mongo y levanta el servidor HTTP
│   └── src/
│       ├── app.js               # Configuración de Express (middlewares y rutas)
│       ├── config/
│       │   └── db.js            # Conexión a MongoDB Atlas con Mongoose
│       ├── models/
│       │   └── Product.js       # Esquema/modelo de Mongoose
│       ├── controllers/         # Lógica de cada recurso (CRUD de productos, contacto)
│       ├── routes/               # Rutas organizadas con express.Router
│       ├── middlewares/          # logger, notFound (404) y errorHandler
│       └── seed.js               # Carga el catálogo inicial en MongoDB (npm run seed)
│
├── client/                      # Frontend (React + Vite + React Router)
│   ├── index.html
│   └── src/
│       ├── main.jsx             # Punto de entrada de React (envuelto en BrowserRouter)
│       ├── App.jsx              # Estado global (productos, carrito) + <Routes>
│       ├── components/
│       │   ├── Navbar.jsx / Footer.jsx
│       │   ├── Home.jsx / Catalog.jsx / ProductDetail.jsx / ContactForm.jsx
│       │   ├── ProductCard.jsx / ProductList.jsx / CartPanel.jsx / Toast.jsx
│       │   ├── Login.jsx / Register.jsx        # Pantallas de autenticación (UI, sin backend aún)
│       │   ├── AdminDashboard.jsx / ProductForm.jsx  # CRUD de productos desde la UI
│       │   ├── ScrollToTop.jsx                 # Vuelve al tope en cada cambio de ruta
│       │   └── NotFound.jsx                    # Ruta catch-all ("*")
│       ├── services/
│       │   └── api.js           # Cliente fetch centralizado hacia el backend (CRUD incluido)
│       ├── utils/
│       │   └── format.js        # Formateo de precios y categorías
│       └── styles/
│           └── style.css
│
├── eslint.config.js             # ESLint (Flat Config) para backend y client
├── .prettierrc / .prettierignore
├── commitlint.config.cjs        # Reglas de Conventional Commits
├── .husky/                      # Git hooks (pre-commit y commit-msg)
└── package.json                 # Tooling de calidad de código (raíz)
```

### 🔌 API REST — Endpoints disponibles

| Método   | Endpoint             | Descripción                                                                                          |
| -------- | -------------------- | ---------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/productos`     | Devuelve el listado completo de productos (desde MongoDB).                                           |
| `GET`    | `/api/productos/:id` | Devuelve un producto por `_id`. Responde `404` si no existe o el id tiene un formato inválido.       |
| `POST`   | `/api/productos`     | Crea un producto nuevo. Responde `201` con el documento creado, o `400` con errores por campo.       |
| `PUT`    | `/api/productos/:id` | Actualiza un producto existente. Responde `200` con el documento actualizado, `404` si no existe.    |
| `DELETE` | `/api/productos/:id` | Elimina un producto. Responde `200` con el documento eliminado, `404` si no existe.                  |
| `POST`   | `/api/contacto`      | Recibe `{ nombre, email, mensaje }`, valida en el servidor y responde `201` o `400` con los errores. |
| `GET`    | `/api`               | Ruta de salud, útil para confirmar que el servidor está arriba.                                      |

Cualquier otra ruta devuelve un `404` uniforme gracias al middleware `notFound`, y cualquier error no controlado —incluidos los `ValidationError` y `CastError` que tira Mongoose— es capturado por el `errorHandler` centralizado y traducido a una respuesta prolija en formato `{ ok: false, error: "...", errores?: {...} }`.

**Modelo `Product`** (`backend/src/models/Product.js`):

| Campo         | Tipo      | Detalle                                                              |
| ------------- | --------- | -------------------------------------------------------------------- |
| `nombre`      | `String`  | **Requerido**, mínimo 2 caracteres.                                  |
| `descripcion` | `String`  | Opcional.                                                            |
| `precio`      | `Number`  | **Requerido**, no puede ser negativo.                                |
| `stock`       | `Number`  | Opcional, default `0`, no puede ser negativo.                        |
| `imagenUrl`   | `String`  | Opcional.                                                            |
| `categoria`   | `String`  | Opcional, default `"living"` — agregado para el filtro del catálogo. |
| `destacado`   | `Boolean` | Opcional, default `false` — agregado para la sección de destacados.  |

---

## 📝 Decisiones tomadas

- **Vite en lugar de Create React App.** La consigna original sugería `create-react-app`, pero esa herramienta está **deprecada y sin mantenimiento activo** por parte de Meta. Elegimos **Vite** porque cumple exactamente los mismos objetivos pedagógicos (componentes, `useState`, props, eventos, `.map`/`keys`, renderizado condicional y `fetch`), con arranque y build considerablemente más rápidos y sin warnings de dependencias desactualizadas.
- **`cors` en el backend.** Como el cliente (`http://localhost:5173`) y la API (`http://localhost:4000`) corren en orígenes distintos durante el desarrollo, se agregó el middleware `cors` para habilitar las peticiones entre ambos. Sin esto, el navegador bloquea el `fetch` por la política de mismo origen.
- **Endpoint `POST /api/contacto`.** No estaba explícitamente pedido, pero se agregó para que el formulario de contacto también hable con el backend real (usando `express.json()` para parsear el body), en línea con el espíritu del proyecto: "una verdadera aplicación cliente-servidor". Valida los mismos campos tanto en el cliente como en el servidor.
- **ESLint Flat Config + Prettier.** Se usó el nuevo formato de configuración de ESLint (`eslint.config.js`), con reglas separadas para el backend (entorno Node) y el cliente (entorno browser + JSX + hooks de React), y `eslint-plugin-prettier` / `eslint-config-prettier` para que Prettier sea la única fuente de verdad sobre el estilo del código.

**De este sprint (MongoDB + CRUD + React Router):**

- **Dos campos extra en el esquema (`categoria`, `destacado`).** La consigna pedía `nombre`, `descripcion`, `precio`, `stock` e `imagenUrl`. Se agregaron `categoria` y `destacado` —ambos opcionales, con default— para no perder el filtro por ambiente del catálogo ni la sección de destacados de la home que ya existían. Ninguno reemplaza ni condiciona a los campos pedidos.
- **`backend/src/data/productos.js` pasa a ser `backend/src/seed.js`.** Ya no tiene sentido simular la base de datos en un array: ahora la base real es MongoDB. El viejo archivo se reemplazó por un script de seed (`npm run seed`) que carga ese mismo catálogo inicial en la colección.
- **El servidor falla rápido si no hay `MONGODB_URI`.** `server.js` espera a que `connectDB()` resuelva antes de hacer `app.listen`. Si la variable de entorno falta o la conexión falla, el proceso corta con un mensaje claro en vez de levantar una API que de todas formas no podría responder nada.
- **React Router DOM, ahora sí.** El sprint pide explícitamente rutas dinámicas con `useParams` y navegación programática con `useNavigate`, así que se sumó `react-router-dom` (reemplazando el estado `vista` + renderizado condicional del sprint anterior). El detalle de producto (`/productos/:id`) hace su propio fetch por id en vez de buscar en el listado ya cargado, para que funcione también entrando directo por URL.
- **`/admin` no estaba en la lista de rutas pedidas, pero es donde viven las acciones de Update y Delete.** La consigna solo nombra `/admin/crear-producto`. Para poder editar y eliminar productos desde la UI (parte del CRUD completo) se agregó `/admin` como panel con la tabla de productos y accesos a `/admin/editar-producto/:id`, en vez de mezclar esas acciones en la página pública de detalle.
- **Login y Register son solo de interfaz, por ahora.** Se integraron las pantallas que ya había armado el equipo, con su validación del lado del cliente, pero no hay backend de autenticación en este sprint (no es uno de los objetivos de aprendizaje pedidos). El botón "Ingresar" se movió del listado de navegación principal a un botón propio junto al carrito, para que se lea como una acción y no como una sección más del sitio.

---

## ⚙️ Instalación y ejecución

Se necesitan **dos terminales** abiertas: una para el backend y otra para el cliente. También hace falta **Node.js 18 o superior**.

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd hermanos-jota
```

### 2. Conseguir una base de MongoDB

Hace falta una cadena de conexión de **MongoDB Atlas** (gratis) antes de levantar el backend. Si todavía no tenés una, seguí la guía **[Conectar MongoDB Atlas paso a paso](#-conectar-mongodb-atlas-paso-a-paso)** más abajo y volvé acá con tu `MONGODB_URI` en mano.

### 3. Levantar el backend (API)

```bash
cd backend
npm install
cp .env.example .env      # pegá tu MONGODB_URI y definí PORT=4000 (podés cambiarlo)
npm run seed                # carga el catálogo inicial en tu base (una sola vez)
npm run dev                 # o "npm start" para modo producción
```

El servidor queda disponible en **http://localhost:4000**. Podés probarlo directamente en el navegador o con `curl`:

```bash
curl http://localhost:4000/api/productos
```

Si ves un error de conexión en la consola en vez del mensaje `🍃 MongoDB conectado`, revisá la sección de troubleshooting de la guía de Atlas más abajo.

### 4. Levantar el cliente (React)

En otra terminal:

```bash
cd client
npm install
cp .env.example .env      # define VITE_API_URL=http://localhost:4000/api
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**. Con el backend corriendo en paralelo, el catálogo, el detalle de producto y el formulario de contacto van a funcionar de punta a punta.

> Si cambiás el puerto del backend, actualizá `VITE_API_URL` en `client/.env` para que apunte al puerto correcto.

### 5. Build de producción del cliente (opcional)

```bash
cd client
npm run build      # genera client/dist
npm run preview    # sirve ese build localmente para probarlo
```

---

## 🍃 Conectar MongoDB Atlas (paso a paso)

Esta guía es para dejar funcionando **tanto el backend local como el ya desplegado en Render** con la misma base de datos en la nube. Como Atlas vive en internet (no en tu máquina ni en Render), es la **misma base** para los dos — no hay que configurar nada por separado para "producción".

### 1. Crear la cuenta y el cluster gratuito

1. Entrá a [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register) y creá una cuenta (podés usar tu cuenta de Google/GitHub).
2. Cuando te pregunte por un proyecto, creá uno nuevo (ej: `hermanos-jota`).
3. Elegí **"Deploy a database"** → tipo **M0 (Free)** → cualquier proveedor/región (elegí una cercana, ej. AWS `sa-east-1` São Paulo) → **Create**.

### 2. Crear un usuario de base de datos

Atlas te va a pedir esto automáticamente al crear el cluster (sección **"Security Quickstart"**); si no, lo encontrás en **Database Access** del menú izquierdo:

1. **Add New Database User**.
2. Método de autenticación: **Password**.
3. Elegí un `usuario` y una `contraseña` (o generá una con **Autogenerate Secure Password** — copiala, la vas a necesitar).
4. Rol: **Read and write to any database** alcanza para este proyecto.
5. **Add User**.

### 3. Permitir el acceso por red

En **Network Access** (menú izquierdo):

1. **Add IP Address**.
2. Elegí **Allow Access from Anywhere** (`0.0.0.0/0`).

> Esto es necesario porque Render no tiene una IP fija en el plan gratuito. Para un proyecto real de producción se restringiría a IPs específicas, pero para este integrador "permitir desde cualquier lado" es la práctica estándar (la seguridad la sigue dando el usuario/contraseña).

### 4. Copiar la cadena de conexión

1. Volvé a **Database** (menú izquierdo) → botón **Connect** en tu cluster.
2. Elegí **Drivers** → **Node.js** (cualquier versión reciente).
3. Copiá la cadena que te muestra, algo como:
   ```
   mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Reemplazá `<usuario>` y `<password>` por los que creaste en el paso 2, y agregale el nombre de la base antes del `?` (por ejemplo `hermanos-jota`):
   ```
   mongodb+srv://miusuario:[email protected]/hermanos-jota?retryWrites=true&w=majority
   ```
   Esa base (`hermanos-jota`) no tiene que existir de antemano: Mongo la crea sola en cuanto se guarda el primer documento (por ejemplo, al correr `npm run seed`).

### 5. Probarlo en local

```bash
cd backend
cp .env.example .env
```

Pegá tu cadena de conexión completa en `backend/.env`:

```
MONGODB_URI=mongodb+srv://miusuario:[email protected]/hermanos-jota?retryWrites=true&w=majority
```

Y después:

```bash
npm run seed    # carga los 11 productos iniciales en tu cluster de Atlas
npm run dev     # si conecta bien, vas a ver: 🍃 MongoDB conectado → host: ...
```

Confirmá con `curl http://localhost:4000/api/productos` que devuelve los productos.

### 6. Configurar la misma variable en Render

Esto es lo que te falta para que el backend ya desplegado funcione:

1. Entrá a tu servicio en [Render](https://dashboard.render.com).
2. Pestaña **Environment** (menú izquierdo).
3. **Add Environment Variable**:
   - **Key**: `MONGODB_URI`
   - **Value**: la misma cadena de conexión completa del paso 4 (con usuario, password y nombre de base ya reemplazados).
4. Guardá. Render va a **redeployar automáticamente** el servicio al detectar el cambio de variables de entorno (si no, usá **Manual Deploy → Deploy latest commit**).
5. Mirá los **Logs** del servicio en Render: deberías ver `🍃 MongoDB conectado → host: ...` seguido de `🚀 Servidor de Hermanos Jota corriendo en...`. Si en cambio el servicio se reinicia en loop, revisá la sección de problemas comunes debajo.

### 7. Verificar todo el circuito

```bash
curl https://hermanos-jota-6p4o.onrender.com/api/productos
```

Debería devolver el mismo listado que ya cargaste con `npm run seed` (porque es la misma base de Atlas). Si da `[]` (vacío), es porque corriste el seed apuntando a una base distinta, o todavía no lo corriste — repetí el paso 5 con la URI correcta.

Una vez que esto responde bien, el frontend en Vercel (que ya apunta a esa URL de Render vía `VITE_API_URL`) va a mostrar los productos reales sin que haga falta tocar nada del lado del cliente.

### Problemas comunes

| Síntoma                                                      | Causa probable                                                                                           |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `❌ No se pudo conectar a MongoDB: bad auth`                 | Usuario o contraseña mal copiados en la URI (ojo con caracteres especiales en la contraseña, ver abajo). |
| `❌ No se pudo conectar a MongoDB: connection timed out`     | Falta el paso 3 (Network Access → `0.0.0.0/0`), o se agregó después de que Render ya intentó conectar.   |
| El backend en Render queda en loop reiniciándose             | `MONGODB_URI` no está seteada, está mal escrita, o le falta el nombre de la base antes del `?`.          |
| `GET /api/productos` devuelve `[]` en Render pero local anda | Corriste `npm run seed` con una `MONGODB_URI` distinta a la que tiene Render (bases diferentes).         |

> Si tu contraseña de MongoDB tiene caracteres como `@`, `:`, `/` o `#`, hay que codificarlos (ej. `@` → `%40`) o Mongo va a interpretar mal la URI. Más simple: generá la contraseña con **Autogenerate Secure Password** en el paso 2, que ya evita esos caracteres.

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

| Tecnología                          | Uso                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| **Node.js + Express**               | API REST del backend                                                           |
| **MongoDB Atlas + Mongoose**        | Base de datos en la nube, esquemas y validaciones                              |
| **cors**                            | Habilita las peticiones del cliente (otro origen) hacia la API                 |
| **React 19 + Vite**                 | Interfaz de usuario, componentes y estado                                      |
| **React Router DOM**                | Rutas reales/dinámicas (`useParams`) y navegación programática (`useNavigate`) |
| **ESLint (Flat Config) + Prettier** | Calidad y formato de código                                                    |
| **Husky + lint-staged**             | Automatización de controles de calidad antes de cada commit                    |
| **Commitlint**                      | Estandarización de los mensajes de commit                                      |
| **Vercel / Render**                 | Despliegue del frontend y del backend, respectivamente                         |
| **Git & GitHub**                    | Control de versiones y trabajo colaborativo                                    |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines educativos para el ITBA — Full Stack Developer.

---

**Hermanos Jota** — _Redescubriendo el arte de vivir desde 2025._
