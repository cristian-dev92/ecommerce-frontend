import { Component, inject, computed } from '@angular/core'; 
import { RouterLink, Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';

@Component({ 
  selector: 'app-navbar', 
  standalone: true, 
  imports: [CommonModule, RouterLink, RouterModule], 
  templateUrl: './navbar.html', 
  styleUrl: './navbar.scss',
}) 
export class NavbarComponent { 
  // Inyecciones modernas
  public cart = inject(CartService);
  public auth = inject(AuthService);
  private router = inject(Router);
  private ui = inject(UiService);

  // 💡 USAMOS COMPUTED SIGNALS (Reaccionan solos si tu AuthService usa signals)
  // Si tu AuthService guarda el usuario en un signal, la Navbar se redibuja sola al instante
  public isLoggedIn = computed(() => this.auth.isLoggedIn());
  public currentUser = computed(() => this.auth.currentUser());

  // Si tu AuthService aún no usa Signals, puedes usar este fallback temporal leyendo de localStorage:
  // (Aunque lo ideal es que migremos el AuthService a Signals más adelante)
  get userNameFallback(): string {
    return localStorage.getItem('userName') ?? '';
  }

  get isLoggedInFallback(): boolean {
    return !!localStorage.getItem('authToken');
  }

  goToCart() { 
    this.router.navigate(['/cart']); 
  }
  
  logout() { 
    // Limpieza total y feedback premium con tu UiService
    this.auth.logout(); 
    this.ui.success('Sesión cerrada correctamente. ¡Hasta pronto!');
    this.router.navigate(['/login']);
  } 
}