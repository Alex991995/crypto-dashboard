import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ManagerThemeService } from '@core/services/manager-theme.service';

@Component({
  selector: 'app-toggle-theme',
  imports: [FormsModule],
  templateUrl: './toggle-theme.component.html',
  styleUrl: './toggle-theme.component.scss',
})
export class ToggleThemeComponent {
  private managerThemeService = inject(ManagerThemeService);
  protected isChecked = this.managerThemeService.currentTheme();
  protected checkbox = this.isChecked;

  changeEventCheckbox() {
    console.log(this.checkbox);
    this.managerThemeService.switchTheme(this.checkbox);
  }
}
