import { Component, OnInit, signal, WritableSignal, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrl: './product-list.css',
  templateUrl: './product-list.component.html'
})

export class ProductListComponent implements OnInit {

  products: WritableSignal<Product[]> = signal([]);
  loading = signal(true);
  error = signal(false);

  cartService = inject(CartService);
  auth = inject(AuthService);

  constructor(private productService: ProductService) {}

  showSlowServerMessage = signal(false);

  ngOnInit(): void {
    // Si a los 5 segundos no han llegado los productos, activamos el mensaje
  setTimeout(() => {
    if (this.products().length === 0 && !this.loading()) {
      this.showSlowServerMessage.set(true);
    }
  }, 5000);
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.showSlowServerMessage.set(false); // <-- Añade esto para ocultar el aviso si ya hay datos
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
        this.showSlowServerMessage.set(false); // <-- Añade esto para ocultar el aviso en caso de error
      }
    });
  }

  trackById(index: number, item: Product) {
    return item.id;
  }

  deleteProduct(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => this.getProducts(),
      error: (err) => console.error('Error eliminando producto:', err)
    });
  }
}