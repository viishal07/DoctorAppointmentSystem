import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../../core/services/prescription.service';
import { PatientService } from '../../../core/services/patient.service';
import { PrescriptionResponse } from '../../../core/models/prescription.model';
import { PrescriptionCardComponent } from '../../../shared/components/prescription-card/prescription-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-patient-prescriptions',
  standalone: true,
  imports: [CommonModule, PrescriptionCardComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header title="My Prescriptions" subtitle="All prescriptions issued by your doctors" />
    @if (prescriptions().length > 0) {
      <div class="list">
        @for (rx of prescriptions(); track rx.id) {
          <app-prescription-card [prescription]="rx" />
        }
      </div>
    } @else {
      <app-empty-state message="No prescriptions found" icon="ti-prescription" />
    }
  `,
  styles: [`.list { display: flex; flex-direction: column; gap: 0.75rem; }`]
})
export class PatientPrescriptionsComponent implements OnInit {
  private prescriptionService = inject(PrescriptionService);
  private patientService = inject(PatientService);
  prescriptions = signal<PrescriptionResponse[]>([]);

  ngOnInit(): void {
    this.patientService.getProfile().subscribe(p => {
      this.prescriptionService.getByPatient(p.id).subscribe(rx => this.prescriptions.set(rx));
    });
  }
}
