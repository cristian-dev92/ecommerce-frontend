import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CommonModule, CurrencyPipe} from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { inject } from '@angular/core';

@Component({
   selector: 'app-product-list',
   standalone: true, // Importante para proyectos modernos (Standalone)
   imports: [CommonModule, CurrencyPipe, RouterModule], // Necesario para *ngIf, *ngFor y el pipe de moneda
   template: `
   <h2 class="text-xl font-bold mb-4">Catálogo de Productos</h2> 

   <button 
    [routerLink]="['/products/create']" 
    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4" 
    > 
    + Crear Producto 
   </button>
   
   <div 
   *ngIf="loading()" class="text-gray-500 p-4"> 
   Cargando productos... 
 </div> 

 <div *ngIf="error()" class="text-red-500 p-4"> 
   Error al cargar productos. Verifique el backend. 
  </div> 
  <table *ngIf="!loading() && !error() && products().length > 0" 
   class="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden"> 
   
   <thead class="bg-gray-50"> 
    <tr> 
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th> 
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th> 
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th> 
      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th> 
    </tr> 
  </thead> 
  <tbody class="bg-white divide-y divide-gray-200"> 
    <tr *ngFor="let product of products(); trackBy: trackById"> 
      <td class="px-6 py-4">{{ product.name }}</td> <td class="px-6 py-4">{{ product.description }}</td> 
      <td class="px-6 py-4">{{ product.price | currency:'EUR':'symbol' }}</td> 

      <td class="px-6 py-4 flex gap-3"> 

         <!-- Comprar --> 
         <button
         (click)="cartService.addToCart(product)"
         class="text-indigo-600 hover:text-indigo-900 bg-indigo-100 px-3 py-1 rounded-full text-xs"> 
         Comprar 
        </button> 

          <!-- Editar -->
          <button 
           [routerLink]="['/products/edit', product.id]" 
           class="text-blue-600 hover:text-blue-900 text-xs px-3 py-1 rounded-full bg-blue-100"> 
           Editar 
         </button> 
          
           <!-- Eliminar --> 
           <button 
           (click)="deleteProduct(product.id)" 
           class="text-red-600 hover:text-red-900 text-xs px-3 py-1 rounded-full bg-red-100"> 
           Eliminar 
          </button>  
        </td> 
      </tr> 
    </tbody> 
  </table> 
            `, 
        }) 
        export class ProductListComponent implements OnInit { 
          products: WritableSignal<Product[]> = signal([]); 
          loading = signal(true); 
          error = signal(false); 

          cartService = inject(CartService); // <-- AÑADIMOS EL CARTSERVICE
                
          constructor(private productService: ProductService) {} 
                
           ngOnInit(): void { 
            this.getProducts(); 
        } 
                
          getProducts(): void { 
            this.productService.getProducts().subscribe({ 
              next: (data) => { 
                this.products.set(data); 
                this.loading.set(false); 
              }, 
              error: () => { 
                this.error.set(true); 
                this.loading.set(false); 
                } 
            }); 
          } 
                
          trackById(index: number, item: Product) { 
            return item.id; 
          } 

          deleteProduct(id: number) { 
            if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
             
            this.productService.deleteProduct(id).subscribe({ 
              next: () => { 
                this.getProducts(); // Recarga la lista 
            }, 
            error: (err) => { 
              console.error('Error eliminando producto:', err); 
           } 
         });
      }
    }