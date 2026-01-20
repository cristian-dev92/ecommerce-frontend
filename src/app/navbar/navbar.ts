import { Component, inject, OnInit } from '@angular/core'; 
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { filter } from 'rxjs/operators';

@Component({ 
  selector: 'app-navbar', 
  standalone: true, 
  imports: [CommonModule, RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html', 
}) 
export class NavbarComponent implements OnInit { 
  private router = inject(Router); 
  
  loggedIn = false; 
  userName = ''; 
  
    
  ngOnInit() { 
    //se ejecuta después del renderizado
    this.syncAuthState();

   // 🔥 Cada vez que cambie la ruta, actualizamos el estado 
      this.router.events 
        .pipe(filter(event => event instanceof NavigationEnd)) 
        .subscribe(() => { 
          this.syncAuthState(); 
        }); 
      }
    
    //metodo central para sincronizar el estado de autenticación
    syncAuthState() {
    this.loggedIn = !!localStorage.getItem('authToken'); 
    this.userName = localStorage.getItem('userName') ?? ''; 
  }

  
  logout() { 
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('userName'); 

    this.syncAuthState();//Actuliza navbar

    this.router.navigate(['/login']); 
  } 
}