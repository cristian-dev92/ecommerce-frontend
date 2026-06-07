import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, RouterModule, FormsModule],
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
  currentPage = signal<number>(0); 
  totalPages = signal<number>(0);
  isLastPage = signal<boolean>(false);

  // Estado de los filtros
  filters = signal({
    searchBrand: '',
    selectedBrands: new Set<string>(),
    minPrice: 0,
    maxPrice: 2000,
    onlyStock: false,
    sortBy: 'default' // 'default', 'priceAsc', 'priceDesc', 'newest'
  });

  availableBrands = computed(() => {
    const brands = this.products().map(p => p.brand).filter(Boolean);
    return [...new Set(brands)];
  });

  // EL MOTOR DEL FILTRADO: Filtra y ordena en tiempo real sin peticiones extra
  filteredProducts = computed(() => {
    let result = [...this.products()];
    const f = this.filters();

    // Filtro por Marcas (si hay alguna seleccionada)
    if (f.selectedBrands.size > 0) {
      result = result.filter(p => f.selectedBrands.has(p.brand));
    }

    // Filtro por Rango de Precio (usa finalPrice o price si no existe)
    result = result.filter(p => {
      const price = p.finalPrice ?? p.price;
      return price >= f.minPrice && price <= f.maxPrice;
    });

    // Filtro por Stock
    if (f.onlyStock) {
      result = result.filter(p => p.stock > 0);
    }

    // Ordenación
    if (f.sortBy === 'priceAsc') {
      result.sort((a, b) => (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price));
    } else if (f.sortBy === 'priceDesc') {
      result.sort((a, b) => (b.finalPrice ?? b.price) - (a.finalPrice ?? a.price));
    } else if (f.sortBy === 'newest') {
    }

    return result;
  });

  ngOnInit(): void {
    // Escuchamos de forma reactiva los parámetros de la URL (?search o ?category o ?offers)
    this.route.queryParams.subscribe(params => {
      this.loading.set(true);
      this.error.set(false);
      
      const search = params['search'] || '';
      const category = params['category'] || '';
      const offers = params['offers'] === 'true';
      // Si no viene página en la URL, por defecto la 0
      const page = Number(params['page']) || 0;
      // Si a los 5 segundos Render sigue dormido, avisamos con elegancia
    setTimeout(() => {
      if (this.loading() && this.products().length === 0) {
        this.showSlowServerMessage.set(true);
      }
    }, 5000);
    
    this.fetchFilteredProducts(search, category, offers, page, false);
   });
  }

  public fetchFilteredProducts(
    search: string,
    category: string, 
    offers: boolean, 
    page: number = 0, 
    updateUrl: boolean = true
   ): void {
    this.loading.set(true);
    this.error.set(false);

    // Si venimos del click de un botón/píldora, actualizamos los queryParams de la URL
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: search || null, // Si está vacío, elimina el parámetro de la URL
          category: category || null,
          offers: offers ? 'true' : null,
          page: page > 0 ? page : null
        },
        queryParamsHandling: 'merge' // Mantiene otros parámetros si los hubiera
      });
      return;
    }
    // Nota: Aquí mapeas a los métodos de tu ProductService en Angular. 
    // Si tu Service tiene un método unificado para filtros úsalo, si no, llamamos por separado:
    let request$;
    const pageSize = 10;

    if (offers) {
      // Si va a por las ofertas, llamamos a tu @GetMapping("/offers")
      request$ = this.productService.getOffers(page, pageSize);
    } 
    else if (category && !search) {
      //Si solo clican en una categoría de la sub-navbar sin buscar texto, llamamos a tu @GetMapping("/category/{category}")
      request$ = this.productService.getProductsByCategory(category, page, pageSize);
    } 
    else if (search) {
      // Si hay texto en el buscador (vaya solo o con categoría), usamos el súper-filtro dinámico @GetMapping("/search")
      request$ = this.productService.searchAndFilter(search, category, page, pageSize); 
    } 
    else {
      // Catálogo por defecto sin filtros (@GetMapping en la raíz)
      request$ = this.productService.getProducts(page, pageSize); 
    }

    // El bloque del subscribe se queda exactamente igual abajo:
    request$.subscribe({
      next: (data: any) => {
        this.products.set(data.content || data);
        // Seteamos los metadatos de control de las páginas
        this.totalPages.set(data.totalPages || 1);
        this.isLastPage.set(data.last ?? true);
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

  // 🏁 Métodos de acción para las flechas del HTML
  nextPage() {
    if (!this.isLastPage()) {
      const nextPageNum = this.currentPage() + 1;
      const currentParams = this.route.snapshot.queryParams;
      
      this.fetchFilteredProducts(
        currentParams['search'] || '', 
        currentParams['category'] || '', 
        currentParams['offers'] === 'true',
        nextPageNum,
        true // Forza el cambio en la URL
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      const prevPageNum = this.currentPage() - 1;
      const currentParams = this.route.snapshot.queryParams;
      
      this.fetchFilteredProducts(
        currentParams['search'] || '', 
        currentParams['category'] || '', 
        currentParams['offers'] === 'true',
        prevPageNum,
        true
      );
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        this.fetchFilteredProducts(
          currentParams['search'] || '', 
          currentParams['category'] || '', 
          currentParams['offers'] === 'true',
          this.currentPage(),
          false
        );
      },
      error: () => {
        this.ui.error('No tienes permisos o hubo un error al eliminar el producto.');
      }
    });
  }
  
  // Helper para controlar los Checkboxes de marcas de forma reactiva
  toggleBrand(brand: string) {
    const current = this.filters();
    const newBrands = new Set(current.selectedBrands);
    
    if (newBrands.has(brand)) {
      newBrands.delete(brand);
    } else {
      newBrands.add(brand);
    }

    this.filters.set({ ...current, selectedBrands: newBrands });
  }
  
  updateStockFilter(value: boolean) {
  this.filters.set({
    ...this.filters(),
    onlyStock: value
  });
 }

  updateSort(value: string): void {
    this.filters.update(f => ({ ...f, sortBy: value }));
  }

  updateMinPrice(value: number): void {
    this.filters.update(f => ({ ...f, minPrice: Number(value) || 0 }));
  }

  updateMaxPrice(value: number): void {
   this.filters.update(f => ({ ...f, maxPrice: Number(value) || 2000 }));
  }

  updateOnlyStock(value: boolean): void {
    this.filters.update(f => ({ ...f, onlyStock: value }));
  }

}