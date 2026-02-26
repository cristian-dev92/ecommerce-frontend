import { Component, inject } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; 
import { AuthService } from '../../services/auth.service'; 
import { UserService } from '../../services/user.service'; 
import { CommonModule} from '@angular/common'; 

@Component({ 
  selector: 'app-login', 
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule, RouterModule], 
  templateUrl: './login.html',
}) 
export class LoginComponent { 

  private fb = inject(FormBuilder);
  private auth = inject(AuthService); 
  private userService = inject(UserService); 
  private router = inject(Router); 
  
   loginForm: FormGroup; 
   isSubmitting = false; 
   
   constructor() { 
    this.loginForm = this.fb.group({ 
      username: ['', Validators.required], 
      password: ['', Validators.required], 
    }); 
  } 
  
  onSubmit() { 
    if (this.loginForm.invalid) return; 
    
    this.isSubmitting = true; 
    
    const credentials = { 
      email: this.loginForm.value.username, 
      password: this.loginForm.value.password 
    }; 
    
    this.userService.login(credentials).subscribe({ 
      next: (response) => { 
        // Guardamos token y nombre en AuthService 
        this.auth.login(response.token, response.name); 
        this.isSubmitting = false; 
        
        // Redirigimos a productos 
        this.router.navigate(['/products']); 
      }, 
      error: (error) => { 
        console.error('Error en login:', error); 
        this.isSubmitting = false; 
      } 
    }); 
  } 
}
