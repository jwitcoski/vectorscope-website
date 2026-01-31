import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    // Header scroll effect - add/remove 'alt' class based on banner visibility
    const header = document.querySelector('#header');
    const banner = document.querySelector('#banner');
    if (header && banner) {
      const observer = new IntersectionObserver(
        ([entry]) => header.classList.toggle('alt', entry.isIntersecting),
        { rootMargin: `-${(header as HTMLElement).offsetHeight}px 0px 0px 0px`, threshold: 0 }
      );
      observer.observe(banner);
      window.addEventListener('resize', () => observer.disconnect());
    }
  }
}
