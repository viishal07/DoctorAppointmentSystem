import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DoctorSummary } from '../../../core/models/doctor.model';

@Component({
  selector: 'app-doctor-card',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="doctor-card">
      <div class="doctor-card__avatar">
        <i class="ti ti-user-md" aria-hidden="true"></i>
      </div>
      <div class="doctor-card__info">
        <h3>{{ doctor().fullName }}</h3>
        <p class="dept">{{ doctor().departmentName }}</p>
        <p class="quals">{{ doctor().qualifications }}</p>
        <p class="fee">₹{{ doctor().consultationFee }} consultation fee</p>
      </div>
      <button mat-flat-button color="primary" (click)="bookClicked.emit(doctor())">
        Book Appointment
      </button>
    </div>
  `,
  styles: [`
    .doctor-card { display: flex; align-items: center; gap: 1rem; padding: 1.25rem;
      border-radius: 12px; border: 1px solid var(--mat-app-outline-variant);
      background: var(--mat-app-surface); }
    .doctor-card__avatar { width: 52px; height: 52px; border-radius: 50%;
      background: #e0f2fe; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; color: #0284c7; flex-shrink: 0; }
    .doctor-card__info { flex: 1; min-width: 0; }
    h3 { margin: 0 0 0.2rem; font-size: 1rem; font-weight: 600; }
    .dept { color: #0284c7; font-size: 0.8rem; margin: 0 0 0.2rem; }
    .quals, .fee { font-size: 0.8rem; margin: 0 0 0.15rem; opacity: 0.7;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  `]
})
export class DoctorCardComponent {
  doctor = input.required<DoctorSummary>();
  bookClicked = output<DoctorSummary>();
}
