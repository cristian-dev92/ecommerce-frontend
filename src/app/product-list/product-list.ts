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
    maxPrice: 9999,
    onlyStock: false,
    sortBy: 'default' // 'default', 'priceAsc', 'priceDesc', 'newest'
  });

  availableBrands = signal<string[]>([]);

  // EL MOTOR DEL FILTRADO: Filtra y ordena en tiempo real sin peticiones extra
  filteredProducts = computed(() => {
    // 1. Extraemos los valores de las señales primero para que Angular registre la dependencia reactiva
    const currentProducts = this.products();
    const f = this.filters();

    if (!currentProducts || currentProducts.length === 0) {
      return [];
    }

    // 2. Filtramos el rango de precios y stock creando un nuevo array
    let result = currentProducts.filter(p => {
      const price = p.finalPrice ?? p.price;
      const matchesPrice = price >= f.minPrice && price <= f.maxPrice;
      const matchesStock = !f.onlyStock || p.stock > 0;
      
      return matchesPrice && matchesStock;
    });
    // 3. Ordenamos de forma segura
    if (f.sortBy === 'priceAsc') {
      result.sort((a, b) => (a.finalPrice ?? a.price) - (b.finalPrice ?? b.price));
    } else if (f.sortBy === 'priceDesc') {
      result.sort((a, b) => (b.finalPrice ?? b.price) - (a.finalPrice ?? a.price));
    } else if (f.sortBy === 'newest') {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  });

  ngOnInit(): void {
    this.productService.getBrands().subscribe({
      next: (brands) => this.availableBrands.set(brands),
      error: (err) => console.error('Error cargando marcas globales:', err)
    });
    // Escuchamos de forma reactiva los parámetros de la URL (?search o ?category o ?offers)
    this.route.queryParams.subscribe(params => {
      this.loading.set(true);
      this.error.set(false);
      
      const search = params['search'] || '';
      // Sincroniza la señal de filtros con la URL
      this.filters.update(f => ({ ...f, searchBrand: search }));
      const category = params['category'] || '';
      const offers = params['offers'] === 'true';
      // Si no viene página en la URL, por defecto la 0
      const page = Number(params['page']) || 0;
      const isBrand = this.availableBrands().includes(search);
      this.filters.update(f => ({ 
        ...f, 
        searchBrand: isBrand ? search : '' 
      }));

      this.currentPage.set(page);
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
   if (!updateUrl) {
      this.currentPage.set(page);
    }
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
    const pageSize = 8;

    const activeBrand = this.filters().searchBrand;

    if (offers) {
      // Si va a por las ofertas, llamamos a tu @GetMapping("/offers")
      request$ = this.productService.getOffers(page, pageSize);
    } 
    else {
      // Catálogo por defecto sin filtros (@GetMapping en la raíz)
      request$ = this.productService.searchAndFilter(search, category, activeBrand, page, pageSize);
    }

    // El bloque del subscribe se queda exactamente igual abajo:
    request$.subscribe({
      next: (data: any) => {
        if (offers) {
          // Si son ofertas (List), mostramos todo en una página simulada
          this.products.set(data);
          this.totalPages.set(1);
          this.isLastPage.set(true);
        } else {
          // Si viene de endpoints paginados (Page), extraemos el contenido real de Spring
          this.products.set(data.content || []);
          this.totalPages.set(data.totalPages || 1);
          this.isLastPage.set(data.last ?? true);
        }
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
    const currentParams = this.route.snapshot.queryParams;
    const busquedaActual = currentParams['search'] || '';
    
    // Si el usuario clica en la marca que ya estaba buscando, la limpiamos (desmarcar)
    if (busquedaActual === brand) {
    // Si desmarca
    this.filters.update(f => ({ ...f, searchBrand: '' }));
    this.fetchFilteredProducts('', currentParams['category'] || '', currentParams['offers'] === 'true', 0, true);
  } else {
    // Si marca una nueva
    this.filters.update(f => ({ ...f, searchBrand: brand }));
    this.fetchFilteredProducts(brand, currentParams['category'] || '', currentParams['offers'] === 'true', 0, true);
  }
}

  updateSort(value: string): void {
    this.filters.update(f => ({ ...f, sortBy: value }));
    this.resetPaginationUrl();
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

  // Método privado para limpiar la página actual de la URL al filtrar
  private resetPaginationUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: null },
      queryParamsHandling: 'merge'
    });
  }

}