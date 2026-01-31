import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav id="menu" (click)="onMenuClick($event)">
      <div class="inner" (click)="$event.stopPropagation()">
        <h2>Menu</h2>
        <ul class="links">
          <li><a routerLink="/" (click)="menuService.hide()">Home</a></li>
          <li><a href="#four" (click)="onAnchorClick($event, '#four')">AI Services</a></li>
          <li><a href="#case-studies" (click)="onAnchorClick($event, '#case-studies')">Case Studies</a></li>
          <li><a href="#five" (click)="onAnchorClick($event, '#five')">About</a></li>
          <li><a href="#contact" (click)="onAnchorClick($event, '#contact')">Contact</a></li>
          <li><a href="https://vectorscopeai.com" target="_blank" rel="noopener" (click)="menuService.hide()">Main Site</a></li>
        </ul>
        <a href="#" class="close" (click)="onCloseClick($event)">Close</a>
      </div>
    </nav>
  `,
  styles: []
})
export class MenuComponent implements OnInit {
  constructor(public menuService: MenuService) {}

  ngOnInit(): void {
    const removePreload = () => {
      setTimeout(() => document.body.classList.remove('is-preload'), 100);
    };
    if (document.readyState === 'complete') {
      removePreload();
    } else {
      window.addEventListener('load', removePreload);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuService.hide();
  }

  onMenuClick(event: Event): void {
    event.stopPropagation();
    this.menuService.hide();
  }

  onCloseClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.menuService.hide();
  }

  onAnchorClick(event: Event, href: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.menuService.hide();
    setTimeout(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  }
}
