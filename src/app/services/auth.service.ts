import { Injectable, signal,inject } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CartService } from './cart.service';

@Injectable({ 
  providedIn: 'root' 
}) 
export class AuthService { 
  
  // Signals reactivas 
    loggedIn = signal(false); 
    userName = signal<string | null>(null); 

    // Inyectar CartService para limpiar el carrito al cerrar sesión
    private cartService = inject(CartService); 
    
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

        //Limpiar carrito al cerrar sesión
        this.cartService.clearCart();
      } 
      // Obtenenemos el token de autenticación
      getToken() { 
        return localStorage.getItem('authToken'); 
      } 
    }