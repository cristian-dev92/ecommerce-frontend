import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order';

@Component({
  standalone: true,
  selector: 'app-orders-history',
  templateUrl: './orders-history.html',
  styleUrl: './orders-history.scss',
  imports: [CommonModule]
})
export class OrdersHistory implements OnInit {

  private ordersService = inject(OrdersService);
  
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
}