import { Component, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { CartService } from '../services/cart.service'; 
import { Router } from '@angular/router';

@Component({ 
  standalone: true, 
  selector: 'app-cart', 
  templateUrl: './cart.html', 
  imports: [CommonModule] 
}) 

export class CartComponent { 
  cart = inject(CartService); 
  router = inject(Router);

  checkout() { 
    this.router.navigate(['/checkout']); 
  }

   ngOnInit() { 
    console.log('Componente de carrito inicializado');
    console.log('Carrito:', this.cart.cartItems()); 
  }

  confirmClearCart() { 
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) { 
      this.cart.clearCart(); 
      console.log('Carrito vaciado'); 
    }
  }
}
