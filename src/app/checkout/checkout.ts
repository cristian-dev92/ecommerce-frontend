import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { CartService } from "../services/cart.service";
import { OrdersService } from "../services/orders.service";
import { Router } from "@angular/router";


@Component({
    standalone: true,
    selector: 'app-checkout',
    templateUrl: './checkout.html',
    imports: [CommonModule],
})
export class CheckoutComponent {
    cart = inject(CartService);
    ordersService = inject(OrdersService); 
    router = inject(Router);

    confirmOrder() {

        const payload = { 
            items: this.cart.cartItems().map(item => ({ 
                productId: item.product.id, 
                productName: item.product.name,
                price: item.product.price, 
                quantity: item.quantity 
            })) 
        };
            
        this.ordersService.createOrder(payload).subscribe({
                next: (order) => { 
                console.log('Pedido creado:', order); 

                this.cart.clearCart();

                alert('¡Gracias por su compra! Su orden ha sido confirmada.');

                 this.router.navigate(['/profile/orders']);
            },
            error: (err) => {
                console.error('Error al crear el pedido:', err);
                alert('Hubo un error al procesar su pedido. Por favor, inténtelo de nuevo.');
            }
        });
    }
}
