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
  isSubmitting = signal<boolean>(false);

  loading = signal<boolean>(false);
  showSlowServerMessage = signal<boolean>(false);
  error = signal<boolean>(false);
  private serverTimer: any;
  form: any;
  authService: any;

   constructor() { 
    this.loginForm = this.fb.group({ 
       email: ['', [Validators.required, Validators.email]],
       password: ['', Validators.required], 
      }); 
    }
  
  onSubmit() { 
   if (this.loginForm.invalid || this.isSubmitting()) {
    this.ui.warning('Por favor, revisa los campos del formulario.');
    return;
  }
    
    this.isSubmitting.set(true); 
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe({ 
      next: () => {
        this.ui.success('¡Bienvenido de nuevo! Iniciando sesión...');
        this.isSubmitting.set(false);
        
        // Redirección inmediata a la raíz
        this.router.navigate(['/products']);
      },
      error: (error: any) => { 
        this.isSubmitting.set(false); 
        const msg = error.error?.message || 'Email o contraseña incorrectos.';
        this.ui.error(msg);
      } 
    }); 

    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(false);
    this.showSlowServerMessage.set(false);

    //Si a los 4 segundos Render no ha respondido, activamos el mensaje de aviso
    this.serverTimer = setTimeout(() => {
        if (this.loading()) {
            this.showSlowServerMessage.set(true);
        }
    }, 4000);

    this.authService.loginOrRegister(this.form.value).subscribe({
        next: () => {
            clearTimeout(this.serverTimer); // Limpiamos el timer si responde rápido
            this.loading.set(false);
            // Redirigir al home o guardar sesión...
        },
        error: (err: any) => {
            clearTimeout(this.serverTimer);
            this.loading.set(false);
            this.error.set(true);
            console.error(err);
        }
    });
  }
  
}
