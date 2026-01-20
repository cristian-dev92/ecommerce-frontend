import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar';


@Component({
   selector: 'app-root',
    standalone: true,
     imports: [RouterOutlet, CommonModule, NavbarComponent],
      templateUrl: './app.html',
       styles: [],
}) 
export class App {
  protected readonly title = signal('Mi tienda online'); 

}