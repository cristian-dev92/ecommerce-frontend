# 🛍️ Ecommerce Frontend (Angular 21)

Frontend moderno desarrollado en **Angular 21** para una aplicación de comercio en general.  
Incluye autenticación JWT, guards, servicios centralizados, componentes standalone y una arquitectura limpia y escalable.

> ⚠️ **Nota sobre la Demo:** El backend está desplegado en el plan gratuito de Render. Si es la primera vez que entras en unos minutos, la base de datos y el servidor pueden tardar entre **30 y 60 segundos en despertar**. ¡Gracias por tu paciencia!

## 🌐 Demo pública

Frontend desplegado en Vercel.

🔗 Demo: <https://ecommerce-frontend-seven-psi.vercel.app/>

## 🚀 Tecnologías principales

- **Angular 21**
- **TypeScript**
- **Standalone Components**
- **Signals (estado reactivo)**
- **Angular Router & Guards**
- **Reactive Forms**
- **HTTPClient**
- **SCSS modular**

## 🚀 Características Destacadas (v3.0)

Esta versión incluye características avanzadas de integración Full-Stack:

**⚡ Arquitectura 100% Reactiva:** Gestión del estado de la UI (carritos, stock, filtros, sesión) mediante **Angular Signals** y `computed()`, minimizando las repeticiones de renderizado.

**🔍 Motor de Búsqueda y Filtros Combinados:** Integración con un sistema de consultas dinámicas en Spring Boot (`CriteriaBuilder`). Permite filtrar por marcas múltiples exactas, rangos de precio en tiempo real, control de stock y categorías manteniendo la sincronización con los `queryParams` de la URL.

**📄 Paginación Sincronizada:** Consumo nativo de interfaces `Pageable` de Spring para una navegación fluida (corte de páginas asíncrono) desde el frontend.

**☁️ Gestión Multimedia:** Panel de administración con subida e integración directa de imágenes a la

## 🗂️ Estructura y Organización (src/app)

    🔑 auth/: Componentes de Login y Register. Gestionan el acceso del usuario.

    🛒 cart/: Lógica del carrito de compras. Visualiza y gestiona los productos seleccionados.

    💳 checkout/: Proceso final de compra y pasarela de pago simulada.

    🧩 components/: Elementos visuales reutilizables en múltiples pantallas (botones dinámicos, spinners de carga, tarjetas).

    🔻 footer/: El pie de página global de la aplicación con enlaces rápidos, redes y créditos.

    🛡️ guards/: Protectores de rutas. Controlan quién puede entrar a qué página (ej. AuthGuard).

    🔌 interceptors/: Modifican las peticiones HTTP automáticamente (ej. añadir el token JWT).

    ⚖️ legal/: Páginas de términos de servicio y políticas de privacidad.

    📝 models/: Interfaces de TypeScript que definen la forma de los datos (Product, User, Order).

    🧭 navbar/: Componente global dinámico que cambia según si estás logueado o no.

    🏗️ product-create/detail/edit/list/: Módulos para la gestión completa del inventario (CRUD).

    👤 profile/: Gestión de datos del usuario y visualización del Historial de Pedidos.

    ⚙️ services/: La lógica de comunicación con la API (Auth, Cart, Products, Users).

    🌐 environments/: Configuración de variables según el entorno (Local vs Producción).

    🌐 api-constants.ts: Archivo centralizado para gestionar las URLs del backend.

## 🔐 Autenticación

    El frontend gestiona la seguridad mediante JWT (JSON Web Tokens):

    Login: Envía credenciales y recibe un token.

    Persistencia: El token se guarda en localStorage.

    Estado Reactivo: Usamos Signals (loggedIn, userName) para que toda la web se entere al instante cuando inicias o cierras sesión.

    Protección: Los Guards evitan que usuarios no registrados entren al perfil o al carrito.

## 📦 Instalación

Clona el repositorio:

    git clone <https://github.com/cristianalhambra/ecommerce-frontend.git>
    cd ecommerce-frontend

Instala dependencias:

    npm install

▶️ Ejecutar en desarrollo

    ng serve

Nota: Accede a <http://localhost:4200/> (Asegúrate de tener el Backend en el puerto 8080).

## 🧪 Scripts Útiles

    ng serve: Inicia el servidor de desarrollo.

    ng build: Compila la aplicación para producción (listo para Vercel).

    ng test: Ejecuta las pruebas unitarias con Karma/Jasmine.

## 🔗 Conexión con el backend

La aplicación está preparada para trabajar en dos escenarios:

    Local: El backend debe estar corriendo en <http://localhost:8080>

    Producción: Se conecta automáticamente a la API alojada en Render.

    Nota: Los endpoints principales consumidos son /auth, /products, /users y /orders.
    Endpoint de imagenes y buscador /users, /orders y endpoints avanzados de filtrado/multimedia (/products/search, /products/upload-image).

## 👨‍💻 Autor

Cristian Alhambra - Desarrollador Full‑Stack (Angular + Spring Boot)
