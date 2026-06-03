import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionResponse } from '../../../core/models/prescription.model';

@Component({
  selector: 'app-prescription-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rx-card">
      <div class="rx-card__header">
        <i class="ti ti-prescription" aria-hidden="true"></i>
        <span class="rx-card__date">{{ prescription().issuedAt | date:'mediumDate' }}</span>
      </div>
      <div class="rx-card__body">
        <div class="rx-row"><strong>Doctor:</strong> {{ prescription().doctorName }}</div>
        <div class="rx-row"><strong>Patient:</strong> {{ prescription().patientName }}</div>
        <div class="rx-row"><strong>Diagnosis:</strong> {{ prescription().diagnosis }}</div>
        <div class="rx-row"><strong>Medications:</strong> {{ prescription().medications }}</div>
        @if (prescription().instructions) {
          <div class="rx-row"><strong>Instructions:</strong> {{ prescription().instructions }}</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .rx-card { padding: 1.25rem; border-radius: 12px; border-left: 4px solid #0284c7;
      background: var(--mat-app-surface); border-top: 1px solid var(--mat-app-outline-variant);
      border-right: 1px solid var(--mat-app-outline-variant); border-bottom: 1px solid var(--mat-app-outline-variant); }
    .rx-card__header { display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 0.75rem; color: #0284c7; font-size: 1.1rem; }
    .rx-card__date { font-size: 0.8rem; opacity: 0.6; }
    .rx-row { font-size: 0.87rem; margin-bottom: 0.35rem; line-height: 1.5; }
  `]
})
export class PrescriptionCardComponent {
  prescription = input.required<PrescriptionResponse>();
}
