import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <section id="footer">
      <div class="inner">
        <ul class="copyright">
          <li>© {{ year }} Vector Scope AI LLC. All rights reserved.</li>
          <li>Design: <a href="http://html5up.net" target="_blank" rel="noopener">HTML5 UP</a></li>
        </ul>
      </div>
    </section>
  `,
  styles: []
})
export class FooterComponent {
  year = new Date().getFullYear();
}
