import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class RegisterComponent {
  name: WritableSignal<string> = signal('');
  email: WritableSignal<string> = signal('');
  password: WritableSignal<string> = signal('');
  message: WritableSignal<string | null> = signal(null);
  isError: WritableSignal<boolean> = signal(false);
  isLoading: WritableSignal<boolean> = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit() {
    if (!this.name() || !this.email() || !this.password()) {
      this.message.set('Por favor completa todos los campos');
      this.isError.set(true);
      return;
    }

    this.isLoading.set(true);
    const payload = {
      name: this.name(),
      email: this.email(),
      password: this.password(),
    };

    this.http.post(`${environment.apiUrl}/auth/register`, payload).subscribe({
      next: (response: any) => {
        this.message.set('¡Registro exitoso! Redirigiendo...');
        this.isError.set(false);
        this.isLoading.set(false);
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (error: any) => {
        this.message.set(error.error?.message || 'Email ya registrado');
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
