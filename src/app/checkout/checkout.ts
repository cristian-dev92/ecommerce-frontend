import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { CartService } from "../services/cart.service";
import { OrdersService } from "../services/orders.service";
import { Router, RouterModule } from "@angular/router";
import { UiService } from "../services/ui.service"; // 💡 Inyectamos tus Toasts

@Component({
    standalone: true,
    selector: 'app-checkout',
    templateUrl: './checkout.html',
    styleUrl: './checkout.scss', 
    imports: [CommonModule, RouterModule],
})
export class CheckoutComponent {
    cart = inject(CartService);
    ordersService = inject(OrdersService); 
    router = inject(Router);
    ui = inject(UiService);

    // 💡 Signal para controlar el estado de la petición al backend de Render
    isProcessing = signal<boolean>(false);

    confirmOrder() {
        if (this.cart.items().length === 0 || this.isProcessing()) return;

        this.isProcessing.set(true);

        const payload = { 
            items: this.cart.items().map((item: { product: any; quantity: number }) => ({
                productId: item.product.id, 
                productName: item.product.name,
                price: item.product.price, 
                quantity: item.quantity 
            })) 
        };
            
        this.ordersService.createOrder(payload).subscribe({
            next: (order) => { 
                console.log('Pedido creado con éxito:', order); 
                this.cart.clearCart();
                
                // 🚀 Toast premium de éxito
                this.ui.success('¡Gracias por tu compra! Tu orden ha sido confirmada.');
                this.isProcessing.set(false);

                // Redirección directa al historial de pedidos del perfil
                this.router.navigate(['/profile/orders']);
            },
            error: (err) => {
                console.error('Error al crear el pedido:', err);
                this.ui.error('Hubo un error al procesar tu pedido. Por favor, inténtelo de nuevo.');
                this.isProcessing.set(false);
            }
        });
    }
}