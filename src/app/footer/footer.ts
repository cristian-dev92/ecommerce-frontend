import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  private ui = inject(UiService);
  
  newsletterSubscribed = signal<boolean>(false);

  subscribeNewsletter(event: Event) {
    event.preventDefault();
    const input = (event.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
    
    if (input && input.value.trim() !== '') {
      this.newsletterSubscribed.set(true);
      this.ui.success('¡Te has suscrito correctamente al boletín técnico!');
    }
  }
}