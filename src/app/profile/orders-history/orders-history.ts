import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';
import { UiService } from '../../services/ui.service';

@Component({
  standalone: true,
  selector: 'app-orders-history',
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.scss',
  imports: [CommonModule]
})
export class OrdersHistory implements OnInit {

  private ordersService = inject(OrdersService);
  private ui = inject(UiService);
  
  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.ordersService.getMyOrders().subscribe({
      next: (res) => {
        this.orders.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.isLoading.set(false);
      }
    });
  }

  downloadInvoice(orderId: number) {
    this.ui.success('Generando tu factura PDF...');

    this.ordersService.ownloadOrderInvoice(orderId).subscribe({
      next: (blob: Blob) => {
        // 💡 Truco JS estándar para forzar la descarga de un archivo en el navegador
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `factura-devshop-${orderId}.pdf`;
        link.click();
        
        // Limpieza de memoria del navegador
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.ui.error('No se pudo generar la factura en este momento.');
      }
    });
  }
  
}