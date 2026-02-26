import { Injectable } from '@angular/core'; 
import { CanActivate, Router } from '@angular/router'; 

@Injectable({ 
  providedIn: 'root',
 }) 
export class AuthGuard implements CanActivate { 
  constructor(private router: Router) {} 
  
  canActivate(): boolean { 
     // Evitar error en SSR (no existe window ni localStorage) 
     if (typeof window === 'undefined') { 
      return true; 
    }

      const token = localStorage.getItem('authToken');
    
    if (token) { 
      return true; // Usuario autenticado 
      }
       
      // Si no hay token → redirigir al login 
       
      this.router.navigate(['/login']); 
      return false; 
    } 
  }