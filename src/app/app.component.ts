import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MenuComponent, FooterComponent, RouterOutlet],
  template: `
    <div id="page-wrapper">
      <app-header />
      <app-menu />
      <router-outlet />
      <app-footer />
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'Vector Scope AI';
}
