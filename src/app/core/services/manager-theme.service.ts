import { Inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ManagerThemeService {
  currentTheme = signal(false);
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.document.body.setAttribute('data-bs-theme', 'light');
  }

  switchTheme(newTheme: boolean) {
    this.document.body.setAttribute(
      'data-bs-theme',
      newTheme ? 'dark' : 'light'
    );
    this.currentTheme.set(newTheme);
  }
}
