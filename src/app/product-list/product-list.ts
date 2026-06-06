import { Component, OnInit, signal, inject } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';

interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

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
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // States con Signals
  products = signal<Product[]>([]);
  loading = signal<boolean>(true);
  error = signal<boolean>(false);
  showSlowServerMessage = signal<boolean>(false);

  ngOnInit(): void {
    // Escuchamos de forma reactiva los parámetros de la URL (?search o ?category o ?offers)
    this.route.queryParams.subscribe(params => {
      this.loading.set(true);
      this.error.set(false);
      
      const search = params['search'] || '';
      const category = params['category'] || '';
      const offers = params['offers'] === 'true';
    // Si a los 5 segundos Render sigue dormido, avisamos con elegancia
    setTimeout(() => {
      if (this.loading() && this.products().length === 0) {
        this.showSlowServerMessage.set(true);
      }
    }, 5000);
    
    this.fetchFilteredProducts(search, category, offers);
   });
  }

  public fetchFilteredProducts(search: string, category: string, offers: boolean, updateUrl = true): void {
    this.loading.set(true);
    this.error.set(false);

    // Si venimos del click de un botón/píldora, actualizamos los queryParams de la URL
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: search || null, // Si está vacío, elimina el parámetro de la URL
          category: category || null,
          offers: offers ? 'true' : null
        },
        queryParamsHandling: 'merge' // Mantiene otros parámetros si los hubiera
      });
    }
    // Nota: Aquí mapeas a los métodos de tu ProductService en Angular. 
    // Si tu Service tiene un método unificado para filtros úsalo, si no, llamamos por separado:
    let request$;

    if (offers) {
      // Si va a por las ofertas, llamamos a tu @GetMapping("/offers")
      request$ = this.productService.getOffers();
    } 
    else if (category && !search) {
      //Si solo clican en una categoría de la sub-navbar sin buscar texto, llamamos a tu @GetMapping("/category/{category}")
      request$ = this.productService.getProductsByCategory(category);
    } 
    else if (search) {
      // Si hay texto en el buscador (vaya solo o con categoría), usamos el súper-filtro dinámico @GetMapping("/search")
      request$ = this.productService.searchAndFilter(search, category); 
    } 
    else {
      // Catálogo por defecto sin filtros (@GetMapping en la raíz)
      request$ = this.productService.getProducts(); 
    }

    // El bloque del subscribe se queda exactamente igual abajo:
    request$.subscribe({
      next: (data: any) => {
        this.products.set(data.content || data);
        this.loading.set(false);
        this.showSlowServerMessage.set(false);
      },
      error: (err: any) => {
        console.error('Error cargando catálogo filtrado:', err);
        this.error.set(true);
        this.loading.set(false);
        this.showSlowServerMessage.set(false);
      }
    });
  }

  addToCart(product: Product) {
    // Aquí puedes llamar a tu servicio de carrito cuando lo tengamos listo
    this.cartService.addToCart(product);
    this.ui.success(`¡${product.name} añadido al carrito!`);
  }

  deleteProduct(id: number, name: string) {
    // Para no bloquear con confirms nativos, disparamos la acción con aviso previo.
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.ui.success(`Producto "${name}" eliminado correctamente.`);
        const currentParams = this.route.snapshot.queryParams;
        this.fetchFilteredProducts(currentParams['search'] || '', currentParams['category'] || '', currentParams['offers'] === 'true');
      },
      error: (err) => {
        this.ui.error('No tienes permisos o hubo un error al eliminar el producto.');
      }
    });
  }
  
}