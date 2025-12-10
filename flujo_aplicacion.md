# Documentación del Flujo de la Aplicación

## Introducción

Este documento describe el flujo de la aplicación del Editor HTML Drag & Drop, desde la página de destino hasta el editor principal. También se detallan los roles de los archivos clave en este flujo.

## Flujo del Usuario

1.  **Página de destino (`landing.html`):** Los nuevos usuarios llegan a la página de destino, que sirve como introducción a la aplicación. Esta página contiene:
    *   Una descripción de las características de la aplicación.
    *   Información sobre los precios.
    *   Un enlace para abrir el editor (`index.html`).

2.  **Editor principal (`index.html`):** Este es el corazón de la aplicación. Aquí, los usuarios pueden:
    *   Crear nuevos proyectos desde cero.
    *   Cargar plantillas predefinidas.
    *   Arrastrar y soltar componentes para construir páginas web.
    *   Editar las propiedades de los elementos.
    *   Exportar su trabajo como HTML.

3.  **Importación de prueba (`test-import.html`):** Este archivo parece ser una página de prueba para la función de importación de HTML. No forma parte del flujo principal del usuario.

## Archivos Clave

*   **`landing.html`:** La página de marketing y punto de entrada a la aplicación.
*   **`index.html`:** La aplicación principal del editor.
*   **`script.js`:** Contiene la lógica principal del editor, incluyendo:
    *   La gestión de los componentes de arrastrar y soltar.
    *   La carga y el guardado de proyectos.
    *   La edición de las propiedades de los elementos.
    *   La exportación de HTML.
*   **`service-worker.js`:** Proporciona la funcionalidad sin conexión mediante el almacenamiento en caché de los activos de la aplicación. Esto permite que la aplicación funcione sin una conexión a Internet.

## Registro e Inicio de Sesión

La aplicación actual no tiene un flujo de registro o inicio de sesión explícito. La funcionalidad se centra en la creación y edición de páginas web en el navegador, con la opción de guardar y cargar proyectos como archivos.

La migración al backend de Node.js con "Better Auth" introducirá un sistema de autenticación completo, que permitirá a los usuarios registrarse, iniciar sesión y guardar sus proyectos en la nube.
