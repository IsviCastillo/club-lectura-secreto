#  Club de Lectura Secreto

Proyecto desarrollado para el **Laboratorio #3 POE**, noviembre de 2026.

##  Descripción

**Club de Lectura Secreto** es una aplicación web que permite registrar libros y compartir reseñas anónimas con valoraciones de 1 a 5 estrellas.

Los usuarios pueden agregar libros, consultar sus datos, modificar la información y eliminarlos. También pueden publicar reseñas anónimas y consultar el promedio de estrellas de cada libro.

La aplicación utiliza **SQLite mediante SQL.js**, ejecutándose directamente en el navegador y almacenando los datos en localStorage.

##  Funcionalidades

- Registrar libros con título, autor, género y descripción.
- Consultar todos los libros registrados.
- Editar la información de los libros.
- Eliminar libros y sus reseñas asociadas.
- Publicar reseñas anónimas.
- Editar y eliminar reseñas.
- Valorar libros de 1 a 5 estrellas.
- Calcular automáticamente el promedio de valoraciones.
- Conservar los datos después de recargar la página.
- Validar los campos de los formularios.
- Mostrar mensajes de confirmación y error.
- Interfaz responsive para computadoras y dispositivos móviles.

##  Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| HTML5 | Estructura de la aplicación |
| CSS3 | Diseño y adaptación a dispositivos móviles |
| TypeScript | Lógica y validaciones |
| Vite | Desarrollo y compilación |
| SQL.js | Ejecución de SQLite mediante WebAssembly |
| SQLite | Almacenamiento estructurado de libros y reseñas |
| localStorage | Persistencia de la base de datos en el navegador |
| Git y GitHub | Control de versiones |
| Vercel | Despliegue de la aplicación |

## 📁 Arquitectura del proyecto

El proyecto utiliza el patrón **MVC (Modelo-Vista-Controlador)** para organizar el código y separar responsabilidades.

```text
club-lectura-secreto/
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
├── .gitignore
└── src/
    ├── main.ts
    ├── db/
    │   └── database.ts
    ├── models/
    │   ├── libro.ts
    │   └── resena.ts
    ├── views/
    │   └── bibliotecaView.ts
    ├── controllers/
    │   └── bibliotecaController.ts
    └── styles/
        └── styles.css
```

### Responsabilidades

- **db/:** inicializa SQLite y gestiona la persistencia mediante localStorage.
- **models/:** contiene las operaciones CRUD de libros y reseñas.
- **views/:** construye la interfaz y gestiona los eventos del usuario.
- **controllers/:** realiza validaciones y coordina los modelos y las vistas.
- **styles/:** contiene los estilos visuales y responsive.
- **main.ts:** inicializa la base de datos y la aplicación.

##  Base de datos SQLite

La aplicación utiliza dos tablas relacionadas:

### Tabla `libros`

| Campo | Descripción |
|---|---|
| id | Identificador único |
| titulo | Título del libro |
| autor | Nombre del autor |
| genero | Género literario |
| descripcion | Descripción del libro |

### Tabla `resenas`

| Campo | Descripción |
|---|---|
| id | Identificador único |
| libro_id | Identificador del libro relacionado |
| comentario | Opinión anónima |
| estrellas | Valoración entre 1 y 5 |

La aplicación utiliza consultas SQL parametrizadas para realizar las operaciones sobre la base de datos.

##  Persistencia de datos

La base de datos SQLite se ejecuta directamente en el navegador utilizando SQL.js.

Después de modificar los registros, la base de datos se exporta, se convierte a Base64 y se almacena en localStorage.

Al volver a abrir la aplicación, los datos guardados se recuperan automáticamente.

**Nota:** Los datos permanecen en el navegador donde fueron registrados. No se comparten entre diferentes usuarios o dispositivos.

##  Validaciones y seguridad

La aplicación implementa:

- Consultas SQL parametrizadas para prevenir inyección SQL.
- Validaciones de campos obligatorios.
- Límites de longitud en los formularios.
- Validación de las estrellas entre 1 y 5.
- Uso de `textContent` para mostrar información de forma segura.
- Manejo de errores mediante `try/catch`.
- Mensajes de validación y confirmación.

##  Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone https://github.com/IsviCastillo/club-lectura-secreto.git
```

### 2. Entrar al proyecto

```bash
cd club-lectura-secreto
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir en el navegador la dirección que muestre Vite, normalmente:

`http://localhost:5173/`

## 📦 Compilación para producción

Para generar la versión de producción:

```bash
npm run build
```

Para probar localmente la versión compilada:

```bash
npm run preview
```

##  Despliegue en Vercel

La aplicación está desplegada en Vercel y conectada al repositorio de GitHub.

**Aplicación pública:**

https://club-lectura-secreto.vercel.app/

**Repositorio de GitHub:**

https://github.com/IsviCastillo/club-lectura-secreto



