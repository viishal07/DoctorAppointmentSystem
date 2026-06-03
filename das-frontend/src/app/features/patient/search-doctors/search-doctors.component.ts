import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DoctorService } from '../../../core/services/doctor.service';
import { DepartmentService } from '../../../core/services/department.service';
import { DoctorSummary } from '../../../core/models/doctor.model';
import { Department } from '../../../core/models/department.model';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-search-doctors',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule,
    DoctorCardComponent, PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header title="Search Doctors" subtitle="Find and book appointments with specialists" />
    <form [formGroup]="form" (ngSubmit)="search()" class="search-bar">
      <mat-form-field appearance="outline" class="search-input">
        <mat-label>Doctor name</mat-label>
        <input matInput formControlName="name" placeholder="Search by name...">
        <i class="ti ti-search" matSuffix aria-hidden="true"></i>
      </mat-form-field>
      <mat-form-field appearance="outline" class="dept-select">
        <mat-label>Department</mat-label>
        <mat-select formControlName="departmentId">
          <mat-option value="">All departments</mat-option>
          @for (d of departments(); track d.id) {
            <mat-option [value]="d.id">{{ d.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <button mat-flat-button color="primary" type="submit">Search</button>
    </form>
    @if (doctors().length > 0) {
      <div class="doctor-grid">
        @for (doc of doctors(); track doc.id) {
          <app-doctor-card [doctor]="doc" (bookClicked)="onBook($event)" />
        }
      </div>
    } @else if (searched()) {
      <app-empty-state message="No doctors found. Try different search terms." icon="ti-stethoscope" />
    }
  `,
  styles: [`
    .search-bar { display: flex; gap: 0.75rem; align-items: flex-start; margin-bottom: 1.5rem;
      flex-wrap: wrap; }
    .search-input { flex: 1; min-width: 200px; }
    .dept-select { width: 220px; }
    .doctor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px,1fr));
      gap: 1rem; }
    @media (max-width: 600px) { .dept-select { width: 100%; } }
  `]
})
export class SearchDoctorsComponent implements OnInit {
  private doctorService = inject(DoctorService);
  private deptService = inject(DepartmentService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  doctors = signal<DoctorSummary[]>([]);
  departments = signal<Department[]>([]);
  searched = signal(false);

  form = this.fb.group({ name: [''], departmentId: [''] });

  ngOnInit(): void {
    this.deptService.getAll().subscribe(d => this.departments.set(d));
    this.search();
  }

  search(): void {
    const v = this.form.value;
    this.doctorService.search({
      name: v.name || undefined,
      departmentId: v.departmentId || undefined
    }).subscribe(docs => { this.doctors.set(docs); this.searched.set(true); });
  }

  onBook(doc: DoctorSummary): void {
    this.router.navigate(['/patient/book-appointment'], { queryParams: { doctorId: doc.id } });
  }
}
