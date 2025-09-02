import { Component } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  template: `<div
    class="d-flex justify-content-center align-items-center h-100"
  >
    <div
      class="spinner-border"
      style="width: 12rem; height: 12rem"
      role="status"
    >
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`,
})
export class Loader {}
