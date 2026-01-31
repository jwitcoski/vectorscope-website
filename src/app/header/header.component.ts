import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header id="header" class="alt">
      <h1>
        <img src="assets/images/logo.png" alt="VectorScope AI Logo" class="logo-small" />
        <a routerLink="/">Vector Scope AI</a>
      </h1>
      <nav>
        <a href="#" (click)="toggleMenu($event)">Menu</a>
      </nav>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  constructor(private menuService: MenuService) {}

  toggleMenu(event: Event): void {
    event.preventDefault();
    this.menuService.toggle();
  }
}
