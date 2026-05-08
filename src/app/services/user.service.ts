import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
    
  private apiUrl = 'http://localhost:8080/api/';
  
  updateAvatarUrl(url: string): Observable<any> {
      const token = localStorage.getItem('token'); // O donde guardes tu JWT
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
     return this.http.post(
    `${this.apiUrl}users/upload-avatar`, 
    { avatarUrl: url }, 
    { headers } // <--- ¡AQUÍ ESTÁ LA LLAVE!
   );
  }

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  
   login(credentials: any): Observable<any> { 
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
    return this.http.get(`${this.apiUrl}users/profile`, { headers }); 
  }

  updateAddress(addressData: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
  // Enviamos el objeto del formulario directamente
  return this.http.put(`${this.apiUrl}users/update-address`, addressData, { headers });
}
  
}
