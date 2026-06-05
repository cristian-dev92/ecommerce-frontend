import { Component, OnInit, signal, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrl: './product-list.scss',
  templateUrl: './product-list.html'
})

export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  public cartService = inject(CartService);
  public auth = inject(AuthService);
  private ui = inject(UiService);

  // States con Signals
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);
  showSlowServerMessage = signal<boolean>(false);

  ngOnInit(): void {
    // Si a los 5 segundos Render sigue dormido, avisamos con elegancia
    setTimeout(() => {
      if (this.loading() && this.products().length === 0) {
        this.showSlowServerMessage.set(true);
      }
    }, 5000);
    
    this.getProducts();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
        this.showSlowServerMessage.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.error.set(true);
        this.loading.set(false);
        this.showSlowServerMessage.set(false);
        this.ui.error('No se pudo conectar con el servidor. Inténtalo más tarde.');
      }
    });
  }

  addToCart(product: Product) {
    // Aquí puedes llamar a tu servicio de carrito cuando lo tengamos listo
    this.ui.success(`¡${product.name} añadido al carrito!`);
  }

  deleteProduct(id: number, name: string) {
    // Para no bloquear con confirms nativos, disparamos la acción con aviso previo.
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.ui.success(`Producto "${name}" eliminado correctamente.`);
        this.getProducts();
      },
      error: (err) => {
        console.error('Error eliminando producto:', err);
        this.ui.error('No tienes permisos o hubo un error al eliminar el producto.');
      }
    });
  }
}