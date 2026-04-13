import { Component, inject, ChangeDetectorRef } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth.service'; 
import { CommonModule} from '@angular/common'; 

@Component({ 
  selector: 'app-login', 
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
}) 
export class LoginComponent { 

  private fb = inject(FormBuilder);
  private auth = inject(AuthService); 
  private router = inject(Router); 
  private cd = inject(ChangeDetectorRef);
  
   loginForm: FormGroup; 
   isSubmitting = false; 
   errorMessage: string | null = null;

   constructor() { 
    this.loginForm = this.fb.group({ 
       username: ['', [Validators.required, Validators.email]],
       password: ['', Validators.required], 
      }); 
    }
  
  onSubmit() { 
    if (this.loginForm.invalid) return; 
    
    this.isSubmitting = true; 
    this.errorMessage = null;
    this.cd.markForCheck();
    
    const credentials = { 
      email: this.loginForm.value.username, 
      password: this.loginForm.value.password 
    };

    this.auth.login(credentials.email, credentials.password).subscribe({ 
      next: (res: any) => {
        console.log('Login exitoso');
        this.isSubmitting = false;
        this.cd.markForCheck();
        this.router.navigate(['/']);
      },
      error: (error) => { 
        console.error('Error en login:', error); 
        this.isSubmitting = false; 
        
        this.errorMessage = 
        error.error?.error ||
        error.error?.message || 
        error.error?.errorMessage || 
        'Email o contraseña incorrectos.';

        this.cd.detectChanges();
      } 
    }); 
  } 
}
