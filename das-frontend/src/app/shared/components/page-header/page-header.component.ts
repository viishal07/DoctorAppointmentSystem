import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h1>{{ title() }}</h1>
      @if (subtitle()) { <p class="subtitle">{{ subtitle() }}</p> }
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.5rem; }
    h1 { font-size: 1.5rem; font-weight: 600; margin: 0; }
    .subtitle { margin: 0.25rem 0 0; opacity: 0.6; font-size: 0.9rem; }
  `]
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
}
