import { CanActivateFn, Router } from '@angular/router'; 
import { inject } from '@angular/core'; 

export const authRedirectGuard: CanActivateFn = () => { 
  const router = inject(Router); 
  
  const loggedIn = !!localStorage.getItem('authToken'); 
  
  if (loggedIn) { 
    router.navigate(['/products']); 
    return false; 
  } 

  return true; 
};