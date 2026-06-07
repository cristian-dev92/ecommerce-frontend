import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help.html',
  styleUrl: './help.scss'
})
export class HelpComponent {
  // Manejamos la pestaña activa con un Signal
  activeTab = signal<string>('faqs'); 

  setTab(tab: string) {
    this.activeTab.set(tab);
  }
}