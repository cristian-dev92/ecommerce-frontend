import { Component, inject, signal } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth.service'; 
import { CommonModule} from '@angular/common'; 
import { UiService } from '../../services/ui.service';

@Component({ 
  selector: 'app-login', 
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
}) 
export class LoginComponent { 

  private fb = inject(FormBuilder);
  private auth = inject(AuthService); 
  private router = inject(Router); 
  private ui = inject(UiService);
  
  loginForm: FormGroup; 

  loading = signal<boolean>(false);
  showSlowServerMessage = signal<boolean>(false);
  error = signal<boolean>(false);
  private serverTimer: any;

   constructor() { 
    this.loginForm = this.fb.group({ 
       email: ['', [Validators.required, Validators.email]],
       password: ['', Validators.required], 
      }); 
    }
  
  // Login mediante el formulario estándar
  onSubmit(): void { 
    if (this.loginForm.invalid || this.loading()) {
      this.ui.warning('Por favor, revisa los campos del formulario.');
      return;
    }

    const { email, password } = this.loginForm.value;
    this.executeLogin(email, password);
  }

  // Acceso Rápido Demo (Admin o Cliente)
  quickLogin(role: 'admin' | 'user'): void {
    if (this.loading()) return;

    // Tipamos explícitamente el mapa de credenciales para evitar el error ts(7053)
    const credentials: Record<'admin' | 'user', { email: string; password: string }> = {
      admin: { email: 'admin@demo.com', password: 'admin123' },
      user: { email: 'user@demo.com', password: 'user123' }
    };

    const { email, password } = credentials[role];
    
    // Rellenamos el formulario visualmente
    this.loginForm.patchValue({ email, password });
    
    this.executeLogin(email, password);
  }

  // Método centralizado para manejar la petición HTTP y el aviso de Render
  private executeLogin(email: string, password: string): void {
    this.loading.set(true);
    this.error.set(false);
    this.showSlowServerMessage.set(false);

    // Limpiamos un temporizador previo si existiera
    if (this.serverTimer) {
      clearTimeout(this.serverTimer);
    }

    // Si a los 4 segundos Render sigue procesando, mostramos el aviso
    this.serverTimer = setTimeout(() => {
      if (this.loading()) {
        this.showSlowServerMessage.set(true);
      }
    }, 4000);

    this.auth.login(email, password).subscribe({ 
      next: () => {
        if (this.serverTimer) clearTimeout(this.serverTimer);
        this.ui.success('¡Bienvenido de nuevo! Iniciando sesión...');
        this.loading.set(false);
        this.router.navigate(['/products']);
      },
      error: (error: any) => { 
        if (this.serverTimer) clearTimeout(this.serverTimer);
        this.loading.set(false);
        const msg = error.error?.message || 'Email o contraseña incorrectos.';
        this.ui.error(msg);
      } 
    });
  }
  
}
