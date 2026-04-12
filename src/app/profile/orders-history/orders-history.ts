import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';

@Component({
  standalone: true,
  selector: 'app-orders-history',
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.css',
  imports: [CommonModule]
})
export class OrdersHistory {

  orders = signal<Order[]>([]);
  ordersService = inject(OrdersService);
item: any;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getMyOrders().subscribe({
      next: (res) => this.orders.set(res),
        error: (err) => console.error('Error cargando pedidos:', err)
    });
  }
}
