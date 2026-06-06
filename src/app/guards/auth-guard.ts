import { inject } from '@angular/core'; 
import { CanActivateFn, Router } from '@angular/router'; 
import { UiService } from '../services/ui.service';

// 🕵️ Funcionalidad interna para decodificar el payload del JWT en plano
function getJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export const authGuard: CanActivateFn = (route) => { 
  const router = inject(Router); 
  const ui = inject(UiService);
  
  if (typeof window === 'undefined') { 
    return true; 
  } 

  const token = localStorage.getItem('authToken'); 

  // 1. Bloqueo básico: Si no hay token, fuera
  if (!token) { 
    router.navigate(['/login']); 
    return false; 
  } 

  // 2. Bloqueo Avanzado por Roles (Leemos la metadata de la ruta activa)
  const expectedRoles = route.data?.['roles'] as Array<string>;
  
  if (expectedRoles && expectedRoles.length > 0) {
    const payload = getJwtPayload(token);
    const userRoles: string[] = payload?.roles || [];

    // Verificamos si el usuario tiene al menos uno de los roles exigidos en la ruta
    const hasRole = userRoles.some(role => expectedRoles.includes(role));

    if (!hasRole) {
      ui.error('Acceso denegado: No dispones de privilegios de Administrador.');
      router.navigate(['/products']); // Redirección segura al catálogo
      return false;
    }
  }
  
  return true; 
};