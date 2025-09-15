import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToggleThemeComponent } from '@components/toggle-theme/toggle-theme.component';

@Component({
  selector: 'app-header',
  imports: [ToggleThemeComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
