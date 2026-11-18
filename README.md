
# 📚 Club de Lectura Secreto

Proyecto desarrollado para el Laboratorio #3 de la asignatura
Persistencia de Datos.

## Descripción

Club de Lectura Secreto es una aplicación web que permite
registrar libros y compartir reseñas anónimas con valoraciones
de 1 a 5 estrellas.

Cada libro muestra el promedio de sus valoraciones.

## Funcionalidades

- Registrar, consultar, editar y eliminar libros.
- Crear, consultar, editar y eliminar reseñas anónimas.
- Calcular el promedio de estrellas por libro.
- Guardar los datos utilizando SQLite y localStorage.
- Interfaz adaptable a dispositivos móviles.

## Tecnologías

- HTML5
- CSS3
- TypeScript
- Vite
- SQL.js (SQLite WebAssembly)
- localStorage

## Arquitectura

El proyecto utiliza MVC:

- Models: operaciones de base de datos.
- Views: interfaz y eventos.
- Controllers: validaciones y coordinación.
- DB: inicialización y persistencia SQLite.

## Instalación

Clonar el repositorio:

git clone URL_DEL_REPOSITORIO

Entrar al proyecto:

cd club-lectura-secreto

Instalar dependencias:

npm install

Iniciar servidor:

npm run dev

## Compilación

npm run build

## Despliegue

Vercel: URL_PENDIENTE

## Nota

Los datos se almacenan localmente en el navegador.
No se comparten entre usuarios o dispositivos.
