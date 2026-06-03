import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../../core/services/admin.service';
import { DoctorSummary } from '../../../core/models/doctor.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-pending-doctors',
  standalone: true,
  imports: [CommonModule, MatButtonModule, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header title="Pending Doctor Approvals" subtitle="Review and approve doctor registrations" />
    @if (doctors().length > 0) {
      <div class="doctor-list">
        @for (doc of doctors(); track doc.id) {
          <div class="doctor-item">
            <div class="doctor-item__info">
              <h3>{{ doc.fullName }}</h3>
              <p>{{ doc.departmentName }}</p>
              <p class="quals">{{ doc.qualifications }}</p>
              <p class="fee">₹{{ doc.consultationFee }} fee</p>
            </div>
            <button mat-flat-button color="primary" (click)="approve(doc)">Approve</button>
          </div>
        }
      </div>
    } @else {
      <app-empty-state message="No pending doctor approvals" icon="ti-user-check" />
    }
  `,
  styles: [`
    .doctor-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .doctor-item { display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.25rem; border-radius: 10px;
      border: 1px solid var(--mat-app-outline-variant); background: var(--mat-app-surface); }
    .doctor-item__info h3 { margin: 0 0 0.2rem; font-size: 1rem; font-weight: 600; }
    .doctor-item__info p { margin: 0 0 0.15rem; font-size: 0.82rem; opacity: 0.65; }
    .quals { font-style: italic; }
    .fee { color: #0284c7; }
  `]
})
export class PendingDoctorsComponent implements OnInit {
  private adminService = inject(AdminService);
  private snack = inject(MatSnackBar);

  doctors = signal<DoctorSummary[]>([]);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.adminService.getPendingDoctors().subscribe(d => this.doctors.set(d));
  }

  approve(doc: DoctorSummary): void {
    this.adminService.approveDoctor(doc.id).subscribe({
      next: (msg) => {
        this.snack.open(msg, 'OK', { duration: 3000 });
        this.doctors.update(list => list.filter(d => d.id !== doc.id));
      }
    });
  }
}
