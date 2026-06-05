import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastConfig {
  message: string;
  type: ToastType;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // Signal que almacena el estado del toast actual (null si no hay ninguno)
  toastState = signal<ToastConfig | null>(null);
  private timeoutId: any;

  show(message: string, type: ToastType = 'info', duration: number = 4000) {
    // Si ya había un temporizador corriendo, lo limpiamos
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Actualizamos el estado para mostrar el nuevo Toast
    this.toastState.set({ message, type, duration });

    // Programamos el cierre automático
    this.timeoutId = setTimeout(() => {
      this.dismiss();
    }, duration);
  }

  success(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }

  dismiss() {
    this.toastState.set(null);
  }
}