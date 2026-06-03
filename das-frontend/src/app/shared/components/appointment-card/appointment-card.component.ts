import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentSummary } from '../../../core/models/appointment.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule, StatusBadgeComponent],
  template: `
    <div class="appt-card">
      <div class="appt-card__meta">
        <span class="appt-card__date">
          <i class="ti ti-calendar" aria-hidden="true"></i>
          {{ appointment().scheduledAt | date:'MMM d, y · h:mm a' }}
        </span>
        <app-status-badge [status]="appointment().status" />
      </div>
      <div class="appt-card__names">
        <span>{{ appointment().doctorName }}</span>
        <span class="sep">·</span>
        <span>{{ appointment().patientName }}</span>
      </div>
      @if (showActions()) {
        <div class="appt-card__actions">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .appt-card { padding: 1rem 1.25rem; border-radius: 10px;
      border: 1px solid var(--mat-app-outline-variant); background: var(--mat-app-surface); }
    .appt-card__meta { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
    .appt-card__date { font-size: 0.82rem; opacity: 0.65; display: flex; align-items: center; gap: 0.3rem; }
    .appt-card__names { font-size: 0.9rem; font-weight: 500; }
    .sep { opacity: 0.4; margin: 0 0.3rem; }
    .appt-card__actions { margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
  `]
})
export class AppointmentCardComponent {
  appointment = input.required<AppointmentSummary>();
  showActions = input<boolean>(false);
}
