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
    return this.http.get<any>(`${this.apiUrl}/${id}`);
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
  searchAndFilter(query: string, category: string): Observable<Product[]> {
    let params = new HttpParams();
    if (query) params = params.set('query', query);
    if (category) params = params.set('category', category);

    // Asumiendo que tu controlador expone el filtro en '/search' o en la raíz con params
    return this.http.get<Product[]>(`${this.apiUrl}/search`, { params });
  }
  // Si pinchan directamente en el menú, usamos tu ruta directa paginada @GetMapping("/category/{category}")
  getProductsByCategory(category: string, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(`${this.apiUrl}/category/${category}`, { params });
  }
  //Mapea directo a tu @GetMapping("/offers")
  getOffers(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/offers`);
  }

}
