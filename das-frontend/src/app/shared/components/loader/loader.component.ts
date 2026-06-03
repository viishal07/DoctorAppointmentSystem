import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderStore } from '../../../core/stores/loader.store';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    @if (loader.isLoading()) {
      <div class="loader-overlay">
        <mat-spinner diameter="48"></mat-spinner>
      </div>
    }
  `,
  styles: [`
    .loader-overlay {
      position: fixed; inset: 0; z-index: 9999;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.25); backdrop-filter: blur(2px);
    }
  `]
})
export class LoaderComponent {
  loader = inject(LoaderStore);
}
