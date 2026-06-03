import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentStatus } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="badge" [class]="'badge--' + status().toLowerCase()">{{ status() }}</span>`,
  styles: [`
    .badge { padding: 0.2rem 0.7rem; border-radius: 999px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; }
    .badge--pending  { background: #fef3c7; color: #92400e; }
    .badge--approved { background: #d1fae5; color: #065f46; }
    .badge--rejected { background: #fee2e2; color: #991b1b; }
    .badge--completed{ background: #dbeafe; color: #1e40af; }
    .badge--cancelled{ background: #f3f4f6; color: #374151; }
    :host-context(.dark) .badge--pending  { background: #78350f; color: #fde68a; }
    :host-context(.dark) .badge--approved { background: #064e3b; color: #a7f3d0; }
    :host-context(.dark) .badge--rejected { background: #7f1d1d; color: #fecaca; }
    :host-context(.dark) .badge--completed{ background: #1e3a5f; color: #bfdbfe; }
    :host-context(.dark) .badge--cancelled{ background: #374151; color: #d1d5db; }
  `]
})
export class StatusBadgeComponent {
  status = input.required<AppointmentStatus | string>();
}
