# 🛍️ Ecommerce Frontend (Angular 21)

Frontend moderno desarrollado en **Angular 21** para una aplicación de comercio en general.  
Incluye autenticación JWT, guards, servicios centralizados, componentes standalone y una arquitectura limpia y escalable.

## 🚀 Tecnologías principales

- **Angular 21**
- **TypeScript**
- **Standalone Components**
- **Signals (estado reactivo)**
- **Angular Router**
- **Reactive Forms**
- **HTTPClient**
- **CSS modular**

🌐 Demo pública

Frontend desplegado en Vercel. 

🔗 Demo: https://ecommerce-frontend-seven-psi.vercel.app/

El backend está en Render y puede tardar 20–60 segundos en despertar en la primera carga.

## 📦 Instalación

Clona el repositorio:

``bash
git clone https://github.com/cristianalhambra/ecommerce-frontend.git
cd ecommerce-frontend

Instala dependencias:
bash

npm install

▶️ Ejecutar en desarrollo
bash

ng serve

La aplicación estará disponible en:
Código

http://localhost:4200/

🔐 Autenticación

El frontend se conecta al backend Spring Boot mediante JWT.
Flujo implementado:

  Login con email y contraseña

  Guardado del token en localStorage

  Signals para estado global:

  loggedIn

  userName

  Logout con limpieza de estado

  Interceptor (pendiente de implementar)

   Guards:

  AuthGuard → protege rutas privadas

  AuthRedirectGuard → evita acceder a login/register si ya estás autenticado

🧭 Navbar dinámico

El navbar se actualiza automáticamente según el estado de autenticación:

  Si el usuario no está logueado → muestra Login / Register

  Si el usuario está logueado → muestra nombre + Logout

Implementado como Standalone Component.
🗂️ Estructura del proyecto
Código

src/app/

│

├── auth/

│   ├── login/

│   └──  login.ts

│   └── login.html

│   └──  login.css

│   ├── register/

│   └──  register.ts

│   └── register.html

│   └──  register.css

├── cart/

│   └──  cart.ts

│   └── cart.html

│   └──  cart.css

├── chekout/

│   ├── chekout.ts

│   └── chekout.html

├── guards/

│   ├── auth-guard.ts

│   └── auth-redirect-guard.ts

├── interceptors/

│   ├── auth.interceptor.ts

├── legal/

│   ├── privacy/

│   ├── privacy.ts

│   └── privacy.html

│   └──  privacy.css

│   ├── terms/

│   ├── terms.ts

│   └── terms.html

│   └──  terms.css

├──  models/

│   ├── order.ts

│   ├── product.ts

│   └── user.ts

├──  navbar/

│   ├── navbar.ts

│   ├── navbar.html

│   └── unavbar.css

├──  product-create/

│   ├── product-create.ts

│   ├── product-create.html

│   └── product-create.css

├──  product-edit/

│   ├── product-edit.ts

│   ├── product-edit.html

│   └── product-edit.css

├──  product-list/

│   ├── nproduct-list.ts

│   ├── product-list.html

│   └── product-list.css

├──  profile/

│   ├── orders-history/

│   ├── orders-history.ts

│   ├── orders-history.html

│   └── orders-history.css

│   ├── profile.ts

│   ├── profile.html

│   └── pprofile.css

├── services/

│   ├── auth.service.ts

│   └── cart.service.ts

│   └── orders.service.ts

│   └── product.service.ts

│   └── user.service.ts

└── api-constants.ts

└── app.config.server.ts

└── app.config.ts

└── app.css

└── app.html

└── app.routes.server.ts

└── app.routes.ts

└── app.ts

🔗 Conexión con el backend

El backend debe estar corriendo en:
Código

http://localhost:8080

Endpoints usados:

  POST /api/v1/auth/login

  POST /api/v1/auth/register

  GET /api/v1/products (protegido)

Configurable desde user.service.ts.
🧪 Testing

Incluye archivos .spec.ts generados por Angular para pruebas unitarias.

Ejecutar tests:
bash

ng test

📄 Scripts útiles

ng serve	Ejecuta el servidor de desarrollo

ng build	Compila para producción

ng test	Ejecuta pruebas unitarias

ng generate component	Crea un componente

ng generate service	Crea un servicio

👨‍💻 Autor

Cristian Alhambra  
Desarrollador Full‑Stack (Angular + Spring Boot)

📜 Licencia
Proyecto de uso personal y educativo.
