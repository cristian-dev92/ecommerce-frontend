import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient } from '@angular/common/http';
import { API_CONSTANTS } from '../../api-constants';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let router: Router;
  // NOTE: For stability under Vitest we avoid using TestBed.createComponent() in this spec because
  // of DI factory issues (NG0202). The component is instantiated manually and HttpClient is provided
  // as a spy to TestBed providers so we can assert behavior without relying on createComponent.

  beforeEach(async () => {
    // Inline template/styles for Vitest
    TestBed.overrideComponent(RegisterComponent, {
      set: {
        template: `<form (ngSubmit)="onSubmit()"><input [(ngModel)]="name" placeholder="Name"><input [(ngModel)]="email" placeholder="Email"><input type="password" [(ngModel)]="password" placeholder="Password"><button type="submit">Register</button></form><p>{{ message() }}</p>`,
        styles: [],
      },
    });

    // Resolver recursos externos (Vitest no ejecuta resolveComponentResources por defecto)
    await (TestBed as any).resolveComponentResources?.();

    const routerSpy = { navigate: vi.fn(() => Promise.resolve(true)) };
    const httpSpy = { post: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, RegisterComponent],
      providers: [
        { provide: HttpClient, useValue: { post: httpSpy.post } },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    const httpInst = TestBed.inject(HttpClient) as any;
    router = TestBed.inject(Router);
    component = new RegisterComponent(httpInst, router);
    // No usamos fixture; verificamos comportamiento desde la instancia directamente
    (router as any).navigate = routerSpy.navigate;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show validation error when fields are empty', () => {
    component.name.set('');
    component.email.set('');
    component.password.set('');

    component.onSubmit();

    expect(component.message()).toBe('Por favor completa todos los campos');
    expect(component.isError()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('should register and navigate on success', () => {
    component.name.set('Test User');
    component.email.set('test@example.com');
    component.password.set('password123');

    // Forzar setTimeout a ejecutarse inmediatamente durante la prueba
    const origSetTimeout = (window as any).setTimeout;
    (window as any).setTimeout = (fn: Function, _t?: number) => {
      fn();
      return 0 as any;
    };

    try {
      // Simular respuesta exitosa
      (TestBed.inject(HttpClient) as any).post = vi.fn(() => of({}));

      component.onSubmit();

      expect((TestBed.inject(HttpClient) as any).post).toHaveBeenCalledWith(
        `${API_CONSTANTS.BASE_URL}/auth/register`,
        {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      );

      expect(component.isLoading()).toBe(false);
      expect(component.message()).toBe('¡Registro exitoso! Redirigiendo...');
      expect(component.isError()).toBe(false);
      expect((router as any).navigate).toHaveBeenCalledWith(['/login']);
    } finally {
      (window as any).setTimeout = origSetTimeout;
    }
  });

  it('should show error message on failed registration', () => {
    component.name.set('Test User');
    component.email.set('test@example.com');
    component.password.set('password123');

    // Simular error en la petición HTTP usando observable de error
    (TestBed.inject(HttpClient) as any).post = vi.fn(() =>
      throwError(() => ({ error: { message: 'Email ya existe' } })),
    );

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.message()).toBe('Email ya existe');
    expect(component.isError()).toBe(true);
  });

  it('should set validation error in component state when fields are empty', () => {
    component.name.set('');
    component.email.set('');
    component.password.set('');

    component.onSubmit();

    expect(component.message()).toBe('Por favor completa todos los campos');
    expect(component.isError()).toBe(true);
    expect(component.isLoading()).toBe(false);
  });

  it('should set success state on successful register', () => {
    component.name.set('Test User');
    component.email.set('test@example.com');
    component.password.set('password123');

    const origSetTimeout = (window as any).setTimeout;
    (window as any).setTimeout = (fn: Function, _t?: number) => {
      fn();
      return 0 as any;
    };

    try {
      (TestBed.inject(HttpClient) as any).post = vi.fn(() => of({}));

      component.onSubmit();

      expect(component.message()).toContain('¡Registro exitoso! Redirigiendo...');
      expect(component.isError()).toBe(false);
    } finally {
      (window as any).setTimeout = origSetTimeout;
    }
  });
});
