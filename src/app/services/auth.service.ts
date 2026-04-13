import { Injectable, signal,inject } from '@angular/core'; 
import { Router } from '@angular/router'; 
import { CartService } from './cart.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable
({ providedIn: 'root' }) 
export class AuthService { 

  private http = inject(HttpClient);
  private router = inject(Router);
  private cartService = inject(CartService);

  // Cambia esto por la URL real de tu backend en Render
  private readonly API_URL = 'https://ecommerce-backend-z7r5.onrender.com/api/auth';
  
  // Signals reactivas 
    loggedIn = signal(false); 
    userName = signal<string | null>(null); 
    
    constructor() {
      this.loadFromStorage(); 
    } 
    
    // Cargar estado inicial desde localStorage 
    private loadFromStorage() { 
      const token = localStorage.getItem('authToken'); 
      const name = localStorage.getItem('userName'); 
      this.loggedIn.set(!!token); 
      this.userName.set(name); } 
      
    // Login: guardar datos y actualizar signals 
    login(email: string, password: string): Observable<any> { 
      // AQUÍ SÍ USAMOS EL HTTP POST
      return this.http.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('userName', res.name);
        this.loggedIn.set(true);
        this.userName.set(res.name);
       })
     );
   }

     logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      this.loggedIn.set(false);
      this.userName.set(null);
      this.cartService.clearCart();
      this.router.navigate(['/login']);
   }
}