import { Component, inject, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { CartService } from '../services/cart.service'; 
import { Router, RouterModule } from '@angular/router';
import { UiService } from '../services/ui.service';

@Component({ 
  standalone: true, 
  selector: 'app-cart', 
  templateUrl: './cart.html', 
  styleUrl: './cart.scss', 
  imports: [CommonModule, RouterModule] 
}) 
export class CartComponent implements OnInit { 
  public cart = inject(CartService); 
  private router = inject(Router);
  private ui = inject(UiService);

  ngOnInit() { 
    // Comprobación limpia usando el nuevo nombre del computed signal
    if (this.cart.items().length > 0) {
      console.log('🛒 Carrito cargado optimizadamente con Signals');
    }
  }

  checkout() { 
    if (this.cart.items().length === 0) {
      this.ui.warning('El carrito está vacío.');
      return;
    }
    this.router.navigate(['/checkout']); 
  }

  confirmClearCart() { 
    // Adiós definitivos al confirm() arcaico.
    this.cart.clearCart(); 
    this.ui.success('Carrito vaciado correctamente.');
  }
}
