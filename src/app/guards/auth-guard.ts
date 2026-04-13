import { inject } from '@angular/core'; 
import { CanActivateFn, Router } from '@angular/router'; 

export const authGuard: CanActivateFn = () => { 
  const router = inject(Router); 
  
  // Evitar error en SSR 
  if (typeof window === 'undefined') { 
    return true; 
  } 

  const token = localStorage.getItem('authToken'); 

  if (token) { 
    return true; 
  } 
  
  router.navigate(['/login']); 
  return false; 
};