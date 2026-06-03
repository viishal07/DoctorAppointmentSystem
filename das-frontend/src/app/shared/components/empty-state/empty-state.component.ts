import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <i [class]="'ti ' + icon()" aria-hidden="true"></i>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty-state { display: flex; flex-direction: column; align-items: center;
      gap: 0.75rem; padding: 3rem; opacity: 0.5; text-align: center; }
    .ti { font-size: 3rem; }
    p { font-size: 0.95rem; margin: 0; }
  `]
})
export class EmptyStateComponent {
  message = input.required<string>();
  icon = input<string>('ti-inbox');
}
