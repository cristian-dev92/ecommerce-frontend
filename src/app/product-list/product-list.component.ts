import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true, // Importante para proyectos modernos (Standalone)
  imports: [CommonModule, CurrencyPipe], // Necesario para *ngIf, *ngFor y el pipe de moneda
  template: `
    <h2>Catálogo de Productos de la Tienda</h2>

    <!-- La directiva *ngIf asegura que la tabla solo se muestre si hay datos -->
    <table
      *ngIf="products().length > 0"
      class="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden"
    >
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Nombre
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Descripción
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Precio
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Acciones
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- *ngFor itera sobre el array 'products' cargado desde Spring Boot -->
        <tr *ngFor="let product of products()">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ product.name }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ product.description }}
          </td>
          <!-- 'currency' pipe formatea el número a un formato de moneda -->
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ product.price | currency: 'EUR' : 'symbol' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button
              class="text-indigo-600 hover:text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full text-xs transition duration-150"
            >
              Comprar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Mensaje de carga si el array está vacío -->
    <div
      *ngIf="products().length === 0"
      class="text-center text-gray-500 p-8 border border-dashed rounded-lg mt-4"
    >
      Cargando productos... (Verifique que Spring Boot esté activo en :8080)
    </div>
  `,
  styles: [],
})
export class ProductListComponent implements OnInit {
  products: WritableSignal<Product[]> = signal([]);

  // Inyectamos el servicio en el constructor
  constructor(private productService: ProductService) {}

  // Se ejecuta al iniciar el componente
  ngOnInit(): void {
    // Evitar llamadas HTTP durante prerender/servidor (backend local puede no estar disponible)
    if (typeof window === 'undefined') {
      return;
    }

    this.getProducts();
  }

  getProducts(): void {
    // Llamada al servicio y suscripción a la respuesta
    this.productService.getProducts().subscribe(
      (data) => {
        this.products.set(data);
      },
      (error) => {
        console.error('Error al cargar productos desde Spring Boot:', error);
        // Opcional: Mostrar un mensaje al usuario en el HTML si falla
      },
    );
  }
}
