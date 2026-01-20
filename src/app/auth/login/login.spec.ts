import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { API_CONSTANTS } from '../../api-constants';
import { of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// NOTE: Vitest + Angular TestBed compatibility
// - Vitest does not resolve external resources (templateUrl/styleUrls) by default in the TestBed environment.
// - We inline templates/styles using TestBed.overrideComponent and call resolveComponentResources where needed.
// - Some components are instantiated manually in tests to avoid NG0202 DI factory errors when using TestBed.createComponent.
// These workarounds are intentional and documented; remove when upstream compatibility improves.
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let router: Router;

  beforeEach(async () => {
    // Inline template/styles for Vitest
    TestBed.overrideComponent(Login, {
      set: {
        template: '<div>Login Component</div>',
        styles: [],
      },
    });

    // Resolver recursos externos (Vitest no ejecuta resolveComponentResources por defecto)
    await (TestBed as any).resolveComponentResources?.();

    // Mock para HttpClient
    const httpSpy = { post: vi.fn() };
    const routerSpy = { navigate: vi.fn(() => Promise.resolve(true)) };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, Login],
      providers: [
        { provide: HttpClient, useValue: { post: httpSpy.post } },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    // Inyectamos manualmente las dependencias y creamos la instancia
    const httpInst = TestBed.inject(HttpClient) as any;
    router = TestBed.inject(Router);
    component = new Login(httpInst, router);
    // No usamos fixture; verificamos comportamiento desde la instancia directamente
    (router as any).navigate = routerSpy.navigate;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation error when fields are empty', () => {
    component.email.set('');
    component.password.set('');

    component.onSubmit();

    expect(component.message()).toBe('Por favor, ingresa tu correo y contraseña.');
    expect(component.isError()).toBe(true);
  });

  it('should login and navigate on success', async () => {
    component.email.set('user@example.com');
    component.password.set('password123');

    // Simular respuesta exitosa y forzar setTimeout a ejecutarse de inmediato
    const origSetTimeout = (window as any).setTimeout;
    (window as any).setTimeout = (fn: Function, _t?: number) => {
      fn();
      return 0 as any;
    };

    try {
      ((TestBed.inject(HttpClient) as any).post as any) = vi.fn(() => of({ token: 'abc.def.ghi' }));

      component.onSubmit();

      expect((TestBed.inject(HttpClient) as any).post).toHaveBeenCalledWith(
        `${API_CONSTANTS.BASE_URL}/api/auth/login`,
        {
          email: 'user@example.com',
          password: 'password123',
        },
      );

      expect(component.isLoading()).toBe(false);
      expect(component.isError()).toBe(false);
      expect(component.message()).toContain('¡Acceso exitoso!');
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    } finally {
      (window as any).setTimeout = origSetTimeout;
    }
  });

  it('should show error message on failed login', () => {
    component.email.set('user@example.com');
    component.password.set('wrongpass');

    // Simular error de HTTP usando un observable que emite error
    ((TestBed.inject(HttpClient) as any).post as any) = vi.fn(() => {
      return throwError(() => ({ error: { message: 'Credenciales incorrectas' } }));
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.isError()).toBe(true);
    expect(component.message()).toContain('Credenciales incorrectas');
  });

  it('should render validation error in component state when fields are empty', () => {
    component.email.set('');
    component.password.set('');

    component.onSubmit();

    expect(component.message()).toBe('Por favor, ingresa tu correo y contraseña.');
  });

  it('should set error message in component state on failed login', async () => {
    component.email.set('user@example.com');
    component.password.set('wrongpass');

    // Simular error en la petición como observable
    (TestBed.inject(HttpClient) as any).post = vi.fn(() =>
      throwError(() => ({ error: { message: 'Credenciales incorrectas' } })),
    );

    component.onSubmit();

    // Esperamos los microtasks para que el error llegue al handler
    await Promise.resolve();

    expect(component.isLoading()).toBe(false);
    expect(component.isError()).toBe(true);
    expect(component.message()).toContain('Credenciales incorrectas');
  });
});
