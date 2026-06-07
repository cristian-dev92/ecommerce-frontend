import { Injectable, signal, computed, inject } from '@angular/core'; 
import { Product } from '../models/product'; 
import { UiService } from './ui.service';

@Injectable({ 
    providedIn: 'root'
 }) 
 export class CartService { 

    private ui = inject(UiService);

    // Signal interno que gestiona el array de productos y cantidades
    private itemsSignal = signal<{ product: Product; quantity: number }[]>([]);

    //Restaurar carrito desde el almacenamiento local al iniciar el servicio
    constructor() { 
    const saved = localStorage.getItem('cart'); 
    if (saved) { 
      try {
        this.itemsSignal.set(JSON.parse(saved)); 
      } catch {
        this.itemsSignal.set([]);
      }
    }
  }

    // Suscribirse a los cambios en los ítems del carrito para guardar en el almacenamiento local
    private saveCart() { 
        localStorage.setItem('cart', JSON.stringify(this.itemsSignal())); 
    }

    
    // 💡 Exponemos los ítems con el nombre estandarizado
    items = computed(() => this.itemsSignal());

    // Computed para obtener el total económico (redondeado a 2 decimales para evitar bugs de JS)
    total = computed(() => {
        const rawTotal = this.itemsSignal().reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        return Math.round((rawTotal + Number.EPSILON) * 100) / 100;
    });

    // 💡 Sincronizado con la Navbar: cambiamos itemCount por totalItems
    totalItems = computed(() => 
        this.itemsSignal().reduce((count, item) => count + item.quantity, 0)
    );
    
    addToCart(product: Product) { 
    const current = this.itemsSignal(); 
    const existing = current.find(i => i.product.id === product.id); 
    
    if (existing) {
      // 💡 Validación de stock de seguridad
      if (existing.quantity >= product.stock) {
        this.ui.warning(`Lo sentimos, no hay más stock disponible de ${product.name}.`);
        return;
      }
      existing.quantity++; 
      this.itemsSignal.set([...current]); 
    } else { 
      if (product.stock <= 0) {
        this.ui.error(`El producto ${product.name} no tiene stock disponible.`);
        return;
      }
      this.itemsSignal.set([...current, { product, quantity: 1 }]); 
    } 

    this.saveCart();
    this.ui.success(`${product.name} añadido al carrito.`);
  } 

    removeFromCart(productId: number) { 
        this.itemsSignal.set(this.itemsSignal().filter(i => i.product.id !== productId)); 
        this.saveCart();
    } 

    clearCart() { 
        this.itemsSignal.set([]); 
        this.saveCart();
    } 

    increaseQuantity(productId: number) { 
        const current = this.itemsSignal(); 
        const item = current.find(i => i.product.id === productId); 
    
        if (item) { 
        // 💡 Volvemos a validar contra el stock real del producto antes de incrementar
        if (item.quantity >= item.product.stock) {
            this.ui.warning(`No puedes añadir más unidades. Límite de stock alcanzado.`);
            return;
        }
        item.quantity++; 
        this.itemsSignal.set([...current]);
        this.saveCart(); 
        } 
    } 

    decreaseQuantity(productId: number) { 
        const current = this.itemsSignal(); 
        const item = current.find(i => i.product.id === productId); 
    
        if (item) { 
            if (item.quantity > 1) { 
                item.quantity--; 
                this.itemsSignal.set([...current]); 
                this.saveCart();
             } else { 
                // Si reduce a 0, se elimina automáticamente
                this.removeFromCart(productId);
        } 
      } 
    } 

}