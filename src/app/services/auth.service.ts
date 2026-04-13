import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CartService } from '../services/cart.service';
import { tap, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;

  // Signals
  loggedIn = signal(false);
  userName = signal<string | null>(null);
  user = signal<any | null>(null);

  private cartService = inject(CartService);

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.loadFromStorage();
    this.startTokenExpirationWatcher();
  }

  startTokenExpirationWatcher() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const timeout = exp - Date.now();

      if (timeout > 0) {
        setTimeout(() => {
          this.logout();
          alert("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
        }, timeout);
      }
    } catch {
      this.logout();
    }
  }

  private loadFromStorage() {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    const userData = localStorage.getItem('currentUser');

    if (token && this.isTokenValid(token)) {
      this.loggedIn.set(true);
      this.userName.set(name);
      if (userData) this.user.set(JSON.parse(userData));
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      localStorage.removeItem('currentUser');
      this.loggedIn.set(false);
      this.userName.set(null);
      this.user.set(null);
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() < payload.exp * 1000;
    } catch {
      return false;
    }
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload.roles || payload.authorities || payload.role || payload.authority || [];

    if (Array.isArray(roles)) return roles.includes('ROLE_ADMIN');
    return roles === 'ROLE_ADMIN';
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  register(name: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register`, { name, email, password });
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('authToken', res.token);
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        localStorage.setItem('userName', res.user.name);

        this.loggedIn.set(true);
        this.userName.set(res.user.name);
        this.user.set(res.user);
      })
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('currentUser');

    this.loggedIn.set(false);
    this.userName.set(null);
    this.user.set(null);

    this.cartService.clearCart();
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  updateName(name: string) {
    return this.http.put(`${this.apiUrl}/users/update-name`, { name }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        const updated = { ...this.user(), name };
        this.saveUser(updated);
        this.userName.set(name);
      })
    );
  }

  updateEmail(email: string) {
    return this.http.put(`${this.apiUrl}/users/update-email`, { email }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        const updated = { ...this.user(), email };
        this.saveUser(updated);
      })
    );
  }

  updatePassword(currentPassword: string, newPassword: string) {
    return this.http.put(`${this.apiUrl}/users/update-password`, {
      currentPassword,
      newPassword
    }, {
      headers: this.getAuthHeaders()
    });
  }

  updateAddress(address: any) {
    return this.http.put(`${this.apiUrl}/users/update-address`, address, {
      headers: this.getAuthHeaders()
    }).pipe(
      switchMap(() => this.refreshUser())
    );
  }

  deleteAccount() {
    return this.http.delete(`${this.apiUrl}/users/delete-account`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => this.logout())
    );
  }

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post(`${this.apiUrl}/users/upload-avatar`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      switchMap(() => this.refreshUser())
    );
  }

  refreshUser() {
    return this.http.get(`${this.apiUrl}/users/me`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((user: any) => this.saveUser(user))
    );
  }

  private saveUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.user.set(user);
  }
}