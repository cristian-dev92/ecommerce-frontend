import { Routes } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { RegisterComponent } from './auth/register/register';
import { AuthGuard } from './guards/auth-guard';
import { authRedirectGuard } from './guards/auth-redirect-guard';
import { LoginComponent } from './auth/login/login';

export const routes: Routes = [
  //RUTA EXPLÍCITA para /products (Asegura que el enlace del Navbar funcione)
  { path: 'products', 
    component: ProductListComponent, 
    title: 'Lista de Productos',
    canActivate: [AuthGuard] 
  },

  // Ruta por defecto: REDIRIGE a /products.
  // Esto resuelve el conflicto, asegurando que al hacer clic en el logo ('/')
  // siempre se navegue a la ruta explícita '/products', inicializando el componente de forma limpia.
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

  //Ruta para cualquier otra URL no definida
  { path: '**', 
    redirectTo: '', 
    pathMatch: 'full' },
];
