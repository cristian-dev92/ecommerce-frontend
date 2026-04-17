# 🛍️ Ecommerce Frontend (Angular 21)

Frontend moderno desarrollado en **Angular 21** para una aplicación de comercio en general.  
Incluye autenticación JWT, guards, servicios centralizados, componentes standalone y una arquitectura limpia y escalable.

## 🌐 Demo pública

Frontend desplegado en Vercel.

🔗 Demo: <https://ecommerce-frontend-seven-psi.vercel.app/>

El backend está en Render y puede tardar 20–60 segundos en despertar en la primera carga.

## 🚀 Tecnologías principales

- **Angular 21**
- **TypeScript**
- **Standalone Components**
- **Signals (estado reactivo)**
- **Angular Router & Guards**
- **Reactive Forms**
- **HTTPClient**
- **CSS modular**

## 🗂️ Estructura y Organización (src/app)

    🔑 auth/: Componentes de Login y Register. Gestionan el acceso del usuario.

    🛒 cart/: Lógica del carrito de compras. Visualiza y gestiona los productos seleccionados.

    💳 checkout/: Proceso final de compra y pasarela de pago simulada.

    🛡️ guards/: Protectores de rutas. Controlan quién puede entrar a qué página (ej. AuthGuard).

    🔌 interceptors/: Modifican las peticiones HTTP automáticamente (ej. añadir el token JWT).

    ⚖️ legal/: Páginas de términos de servicio y políticas de privacidad.

    📝 models/: Interfaces de TypeScript que definen la forma de los datos (Product, User, Order).

    🧭 navbar/: Componente global dinámico que cambia según si estás logueado o no.

    🏗️ product-create/edit/list/: Módulos para la gestión completa del inventario (CRUD).

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

## 👨‍💻 Autor

Cristian Alhambra - Desarrollador Full‑Stack (Angular + Spring Boot)
