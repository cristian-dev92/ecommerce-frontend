import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { CartService } from './services/cart.service';


@Component({
   selector: 'app-root',
    standalone: true,
     imports: [RouterOutlet, CommonModule, NavbarComponent, RouterModule],
      templateUrl: './app.html',
       styles: [],
}) 
export class App {
  protected readonly title = signal('Mi tienda online'); 

  cart = inject(CartService); // Inyección del servicio de carrito

}