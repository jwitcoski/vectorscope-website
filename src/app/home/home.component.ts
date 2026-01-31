import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

/** Formspree form ID - https://formspree.io/f/mykjvjwb */
const FORMSPREE_FORM_ID = 'mykjvjwb';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  submitting = false;
  submitted = false;
  submitError: string | null = null;

  constructor(private http: HttpClient) {}

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

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const fd = new FormData(form);
    const name = (fd.get('name') as string)?.trim() ?? '';
    const email = (fd.get('email') as string)?.trim() ?? '';
    const message = (fd.get('message') as string)?.trim() ?? '';
    if (this.submitting || !name || !email || !message) return;
    if (!FORMSPREE_FORM_ID) {
      this.submitError = 'Form is not configured. Set your Formspree form ID in home.component.ts.';
      return;
    }
    this.submitting = true;
    this.submitError = null;
    this.http
      .post(
        `https://formspree.io/f/${FORMSPREE_FORM_ID}`,
        { name, _replyto: email, message },
        { headers: { Accept: 'application/json' }, responseType: 'json' }
      )
      .subscribe({
        next: () => {
          this.submitted = true;
          this.submitting = false;
          form.reset();
        },
        error: (err) => {
          this.submitError = err?.error?.error || 'Something went wrong. Please try again or email us directly.';
          this.submitting = false;
        }
      });
  }
}
