import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root',})

export class UserService {

  private http = inject(HttpClient);
    
  private apiUrl = 'https://ecommerce-backend-z7r5.onrender.com/api';
  
 register(user: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  
  login(credentials: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  getUserProfile(): Observable<any> {
    // 💡 Limpio: Tu HTTP Interceptor meterá el token automáticamente
    return this.http.get(`${this.apiUrl}/users/profile`); 
  }

  updateAddress(addressData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/update-address`, addressData);
  }

  updateAvatarUrl(url: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/upload-avatar`, { avatarUrl: url });
  }

}
  
