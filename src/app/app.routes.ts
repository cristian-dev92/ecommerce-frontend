import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list';
import { RegisterComponent } from './auth/register/register';
import { authGuard } from './guards/auth-guard';
import { authRedirectGuard } from './guards/auth-redirect-guard';
import { LoginComponent } from './auth/login/login';
import { Privacy } from './legal/privacy/privacy';
import { Terms } from './legal/terms/terms';
import { Cookies } from './legal/cookies/cookies';
import { HelpComponent } from './components/help';


export const routes: Routes = [

  //CATÁLOG PÚBLICO - RUTA EXPLÍCITA para /products (Asegura que el enlace del Navbar funcione)
  { path: 'products', 
    component: ProductListComponent, 
    title: 'Lista de Productos',
  },

  //Rutas de creación y edición de productos(PRIVADOS - REQUIERE AUTENTICACIÓN)
  { path: 'products/create', 
    loadComponent: () => 
      import('./product-create/product-create').then(m => m.ProductCreateComponent), 
    canActivate: [authGuard], 
    data: { roles: ['ROLE_ADMIN'] },
    title: 'Crear Producto' 
  }, 

  // 🌐 VISTA PÚBLICA: Ficha de producto para el cliente (Sin guardas de seguridad)
  { 
    path: 'products/:id', 
    loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetailComponent),
    title: 'Detalle del Producto'
  },

  // 🛡️ VISTA PRIVADA: Formulario de edición para el Admin (Con canActivate)
  { 
    path: 'products/edit/:id',
    loadComponent: () => import('./product-edit/product-edit').then(m => m.ProductEditComponent), 
    canActivate: [authGuard], 
    data: { roles: ['ROLE_ADMIN'] },
    title: 'Editar Producto' 
  },

  // Ruta por defecto: REDIRIGE a /products.
  { path: '', 
    redirectTo: 'products', 
    pathMatch: 'full' },

  //Ruta para registrar un nuevo usuario
  { path: 'register', 
    component: RegisterComponent,
    canActivate: [authRedirectGuard], 
    title: 'Registro de Usuario' },

  //Ruta para iniciar sesión
  { path: 'login', 
    component: LoginComponent, 
    canActivate: [authRedirectGuard],
    title: 'Iniciar Sesión' },

  //Ruta para el carrito de compras (Standalone Component)
  { path: 'cart', 
    loadComponent: () => import('./cart/cart').then(m => m.CartComponent), 
    title: 'Carrito de Compras' 
  },

  //Ruta para checkout (Standalone Component)
  { path: 'checkout',
     loadComponent: () => 
      import('./checkout/checkout').then(m => m.CheckoutComponent), 
     canActivate: [authGuard], 
     title: 'Finalizar Compra' 
  },

  //Ruta para la privacidad (Standalone Component)
  { path: 'privacy', loadComponent: () => import('./legal/privacy/privacy').then(m => m.Privacy) 

  },

  //Ruta para los términos y condiciones (Standalone Component)
  { path: 'terms', loadComponent: () => import('./legal/terms/terms').then(m => m.Terms)

  },

  //Ruta para la orden de compra (Standalone Component)
  { path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Mi Perfil',
    children: [
      { 
        path: 'orders', 
        loadComponent: () => import('./profile/orders-history/orders-history').then(m => m.OrdersHistory) 
      }
    ]
  },

  { 
    path: 'legal/privacy', 
    component: Privacy, 
    title: 'DevShop | Política de Privacidad' 
  },

  { 
    path: 'legal/terms', 
    component: Terms, 
    title: 'DevShop | Términos y Condiciones' 
  },
  
  { 
    path: 'legal/cookies', 
    component: Cookies, 
    title: 'DevShop | Política de Cookies' 
  },

  { 
    path: 'help', 
    component: HelpComponent, 
    title: 'DevShop | Centro de Ayuda' 
  },

  { path: 'shipping', 
    component: HelpComponent, 
    title: 'DevShop | Envíos' 
  },

  { path: 'returns', 
    component: HelpComponent, 
    title: 'DevShop | Devoluciones' 
  },
  
  // Ruta de contacto (puedes crear un formulario básico o mandarlo también a help temporalmente)
  { path: 'contact', 
    component: HelpComponent, 
    title: 'DevShop | Soporte' 
  },

  //Ruta para cualquier otra URL no definida(404 - Not Found)
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  },

];
