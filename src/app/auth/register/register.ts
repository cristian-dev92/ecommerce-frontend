import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UiService } from '../../services/ui.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private ui = inject(UiService);

  registerForm: FormGroup;
  loading = signal<boolean>(false);
  showSlowServerMessage = signal<boolean>(false);
  error = signal<boolean>(false);
  private serverTimer: any;

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid || this.loading()) {
      this.ui.warning('Por favor, rellena todos los campos correctamente.');
      return;
    }

    this.loading.set(true);
    this.error.set(false);
    this.showSlowServerMessage.set(false);

    // CONTROL SERVIDOR DE RENDER: Si a los 4 segundos no ha respondido, salta el aviso
    this.serverTimer = setTimeout(() => {
        if (this.loading()) {
            this.showSlowServerMessage.set(true);
        }
    }, 4000);

    const formValues = this.registerForm.value;

    this.auth.register(formValues.name, formValues.email, formValues.password).subscribe({
      next: () => {
        clearTimeout(this.serverTimer);
        this.ui.success('¡Registro exitoso! Redirigiendo al login...');
        this.loading.set(false);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (error: any) => {
        clearTimeout(this.serverTimer);
        this.loading.set(false);
        const errorMsg = error.error?.message || 'Hubo un problema al registrar la cuenta.';
        this.ui.error(errorMsg);
      }
    });
  }

}
