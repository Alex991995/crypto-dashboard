import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorServiceService } from '@core/services/error-service.service';
import { ErrorModalComponent } from '@components/modal/error-modal/error-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ErrorModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private errorServiceService = inject(ErrorServiceService);
  private modalService = inject(NgbModal);
  protected error = computed(() => this.errorServiceService.error());

  ngAfterViewInit(): void {
    if (this.error()) {
      this.modalService.open(ErrorModalComponent);
    }
  }
}
