import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';
import { CartService } from './services/cart.service';
import { UiService } from './services/ui.service';
import { FooterComponent } from './footer/footer'; 


@Component({
   selector: 'app-root',
    standalone: true,
     imports: [RouterOutlet, CommonModule, NavbarComponent, RouterModule, FooterComponent],
      templateUrl: './app.html',
       styleUrl: './app.scss'
}) 
export class App {
  protected readonly title = signal('DevShop'); 

  cart = inject(CartService); // Inyección del servicio de carrito
  public ui = inject(UiService); // Inyección del servicio de UI

}