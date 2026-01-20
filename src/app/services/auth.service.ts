import { Injectable, signal } from '@angular/core'; 
import { Router } from '@angular/router'; 

@Injectable({ 
  providedIn: 'root' 
}) 
export class AuthService { 
  
  // Signals reactivas 
    loggedIn = signal(false); 
    userName = signal<string | null>(null); 
    
    constructor(private router: Router) {
      this.loadFromStorage(); 
    } 
    
    // Cargar estado inicial desde localStorage 
    private loadFromStorage() { 
      const token = localStorage.getItem('authToken'); 
      const name = localStorage.getItem('userName'); 
      
      this.loggedIn.set(!!token); 
      this.userName.set(name); } 
      
    // Login: guardar datos y actualizar signals 
    login(token: string, name: string) { 
      localStorage.setItem('authToken', token); 
      localStorage.setItem('userName', name); 
      
      this.loggedIn.set(true); 
      this.userName.set(name); } 
      
      // Logout: limpiar datos y signals 
      logout() { 
        localStorage.removeItem('authToken'); 
        localStorage.removeItem('userName'); 
        
        this.loggedIn.set(false); 
        this.userName.set(null); 
        
        this.router.navigate(['/login']); 
      } 
      // Obtener token si lo necesitas para interceptores 
      getToken() { 
        return localStorage.getItem('authToken'); 
      } 
    }