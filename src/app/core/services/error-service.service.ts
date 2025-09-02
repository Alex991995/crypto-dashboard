import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorServiceService {
  private _error = signal('');

  public error = this._error.asReadonly();

  setError(message: string) {
    console.log(message);
    this._error.set(message);
  }

  clearError() {
    this._error.set('');
  }
}
