import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [class]="'stat-card--' + color()">
      <div class="stat-card__icon">
        <i [class]="'ti ' + icon()"></i>
      </div>
      <div class="stat-card__body">
        <span class="stat-card__value">{{ value() }}</span>
        <span class="stat-card__label">{{ label() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.25rem 1.5rem; border-radius: 12px;
      background: var(--mat-app-surface); border: 1px solid var(--mat-app-outline-variant);
    }
    .stat-card__icon { font-size: 2rem; opacity: 0.85; }
    .stat-card__value { display: block; font-size: 1.75rem; font-weight: 600; line-height: 1; }
    .stat-card__label { font-size: 0.8rem; opacity: 0.65; text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-card--teal .stat-card__icon { color: #0f9b72; }
    .stat-card--purple .stat-card__icon { color: #7c6fe0; }
    .stat-card--amber .stat-card__icon { color: #d97706; }
    .stat-card--blue .stat-card__icon { color: #2563eb; }
    .stat-card--coral .stat-card__icon { color: #e05a3a; }
    .stat-card--green .stat-card__icon { color: #16a34a; }
  `]
})
export class StatCardComponent {
  label = input.required<string>();
  value = input.required<number | string>();
  icon = input.required<string>();
  color = input<string>('teal');
}
