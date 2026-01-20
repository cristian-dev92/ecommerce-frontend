import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../services/product.service';
import { of, throwError } from 'rxjs';

// NOTE: ProductList is instantiated manually in tests to avoid createComponent() DI problems under Vitest.
// We inline its template/styles to allow TestBed configuration to work reliably in the Vitest environment.
// Additional tests below target server-side (prerender) and error handling paths which are important for coverage.

// Creamos un mock (simulación) del ProductService para aislar las pruebas
class MockProductService {
  getProducts = () =>
    of([
      { id: 1, name: 'Test Product 1', description: 'Test Desc', price: 100 },
      { id: 2, name: 'Test Product 2', description: 'Test Desc', price: 200 },
    ]);
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let mockProductService: MockProductService;

  beforeEach(async () => {
    mockProductService = new MockProductService();

    // Mock template/styles for Vitest
    TestBed.overrideComponent(ProductListComponent, {
      set: {
        template: '<div class="product-list"><div *ngFor="let product of products()">{{ product.name }}</div></div>',
        styles: [''],
      },
    });

    // Configuración para Vitest: importar el componente standalone y proveer el mock
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService }, // Usar el mock del servicio
      ],
    }).compileComponents();

    // Evitamos crear el componente con TestBed (problemas DI en Vitest) y lo instanciamos manualmente
    component = new ProductListComponent(mockProductService as any);
    // Ejecutar lifecycle manualmente
    component.ngOnInit();
    // No hay template a verificar aquí; verificamos el estado interno
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products from service on init', () => {
    // Verificamos que el array de productos se haya llenado con los datos del mock
    expect(component.products().length).toBe(2);
    expect(component.products()[0].name).toBe('Test Product 1');
  });

  it('should not call productService during prerender (window undefined)', () => {
    // Simular entorno de prerender / servidor
    const origWindow = (globalThis as any).window;
    try {
      delete (globalThis as any).window;

      const mockService = { getProducts: vi.fn(() => of([])) };
      const comp = new ProductListComponent(mockService as any);

      comp.ngOnInit();

      expect(mockService.getProducts).not.toHaveBeenCalled();
    } finally {
      (globalThis as any).window = origWindow;
    }
  });

  it('should handle error from productService.getProducts and keep products empty', () => {
    const mockService = { getProducts: vi.fn(() => throwError(() => new Error('fail'))) };
    const comp = new ProductListComponent(mockService as any);

    // Ejecutar getProducts directamente y comprobar el manejador de error
    comp.getProducts();

    // Al haber pasado un observable de error, la señal debe permanecer vacía
    expect(comp.products().length).toBe(0);
  });
});
