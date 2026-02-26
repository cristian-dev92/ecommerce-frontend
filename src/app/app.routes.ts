import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { RegisterComponent } from './auth/register/register';
import { authGuard } from './guards/auth-guard';
import { authRedirectGuard } from './guards/auth-redirect-guard';
import { LoginComponent } from './auth/login/login';


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
    title: 'Crear Producto' 
  }, 

  // Edición de productos con parámetro dinámico :id(PRIVADOS - REQUIERE AUTENTICACIÓN )
  { 
    path: 'products/edit/:id',
     loadComponent: () => 
      import('./product-edit/product-edit').then(m => m.ProductEditComponent), 
     canActivate: [authGuard], 
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

  //Ruta para crear el perfil de usuario(PRIVADOS - requiere autenticación)
  { path: 'profile',
    loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Mi Perfil'
  },

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
  { path: 'profile', loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent), children: [ { 
    path: 'orders', loadComponent: () => import('./profile/orders-history/orders-history') .then(m => m.OrdersHistory) } ]

  },

  //Ruta para cualquier otra URL no definida(404 - Not Found)
  { 
    path: '**', 
    redirectTo: '', 
    pathMatch: 'full' 
  },

];
