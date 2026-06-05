import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { CartService } from './services/cart.service';
import { UiService } from './services/ui.service';


@Component({
   selector: 'app-root',
    standalone: true,
     imports: [RouterOutlet, CommonModule, NavbarComponent, RouterModule],
      templateUrl: './app.html',
       styleUrl: './app.scss'
}) 
export class App {
  protected readonly title = signal('Mi tienda online'); 

  cart = inject(CartService); // Inyección del servicio de carrito
  public ui = inject(UiService); // Inyección del servicio de UI

}