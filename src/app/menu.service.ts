import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private visible = false;
  private locked = false;

  toggle(): void {
    if (this.lock()) {
      this.visible = !this.visible;
      this.updateBodyClass();
    }
  }

  hide(): void {
    if (this.lock()) {
      this.visible = false;
      this.updateBodyClass();
    }
  }

  show(): void {
    if (this.lock()) {
      this.visible = true;
      this.updateBodyClass();
    }
  }

  private lock(): boolean {
    if (this.locked) return false;
    this.locked = true;
    setTimeout(() => (this.locked = false), 350);
    return true;
  }

  private updateBodyClass(): void {
    document.body.classList.toggle('is-menu-visible', this.visible);
  }
}
