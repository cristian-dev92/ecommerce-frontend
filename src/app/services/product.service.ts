// src/app/services/product.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({providedIn: 'root',})

export class ProductService {
  private apiUrl = 'https://ecommerce-backend-z7r5.onrender.com/api/products';
  private http = inject(HttpClient);

  // Trae los productos visibles (Paginados por defecto en tu Back)
  getProducts(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }
  // Detalle de un producto por ID (Mapea a tu @GetMapping("/{id}"))
  getProduct(id: number): Observable<any> {
  //Recuperamos el token (ajústalo según cómo lo guardéis: localStorage, sessionStorage, etc.)
  const token = localStorage.getItem('token') || ''; 
  // Limpiamos de forma agresiva cualquier espacio, tabulación o salto de línea invisible
  const cleanToken = token.replace(/\s+/g, '').trim();
  // Si usáis interceptor esto no haría falta, pero al meterlo aquí directo y te aseguras de que para la edición pase el filtro sí o sí:
  const headers = {
    'Authorization': `Bearer ${cleanToken}`
  };
  return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }
  // Crear producto (Mapea a tu @PostMapping público/admin)
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }
  // Modificar producto (Mapea a tu @PutMapping("/{id}"))
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }
  // Eliminar producto (Mapea a tu @DeleteMapping("/{id}"))
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Mapea a tu @PostMapping("/upload-image") con la clave de parámetro "file"
  uploadImage(p0: number, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload-image`, formData);
  }
  // Tu motor dinámico mapea exactamente a @GetMapping("/search")
  searchAndFilter(query: string, category: string, activeBrand: string, page: number, pageSize: number): Observable<Product[]> {
    let params = new HttpParams()
    .set('page', page.toString())    
    .set('size', pageSize.toString());

    if (query) params = params.set('query', query);
    if (category) params = params.set('category', category);
    if (activeBrand) params = params.set('brand', activeBrand);
    // Asumiendo que tu controlador expone el filtro en '/search' o en la raíz con params
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }
  // Si pinchan directamente en el menú, usamos tu ruta directa paginada @GetMapping("/category/{category}")
  getProductsByCategory(category: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/category/${category}`, { params });
  }
  //Mapea directo a tu @GetMapping("/offers")
  getOffers(page: number, pageSize: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/offers`);
  }

  getProductsPaginated(page: number, size: number): Observable<any> {
    // Añadimos los parámetros ?page=X&size=Y a la URL de forma limpia
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  getBrands(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/brands`);
 }

}
