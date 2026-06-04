import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, PageHeaderComponent],
  template: `
    <app-page-header title="Departments" subtitle="Manage medical departments" />
    <div class="two-col">
      <div>
        <div class="table-wrap">
          <table mat-table [dataSource]="departments()" class="mat-elevation-z1">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let d">{{ d.name }}</td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let d">{{ d.description }}</td>
            </ng-container>
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let d">
                <button mat-icon-button (click)="editDept(d)" aria-label="Edit department">
                  <i class="ti ti-edit" aria-hidden="true"></i>
                </button>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="cols"></tr>
            <tr mat-row *matRowDef="let row; columns: cols;"></tr>
          </table>
        </div>
      </div>
      <div class="form-panel">
        <h3>{{ editingId() ? 'Edit Department' : 'Add Department' }}</h3>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Name</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <textarea matInput rows="3" formControlName="description"></textarea>
          </mat-form-field>
          <div class="form-actions">
            <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid">
              {{ editingId() ? 'Update' : 'Create' }}
            </button>
            @if (editingId()) {
              <button mat-button type="button" (click)="resetForm()">Cancel</button>
            }
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .two-col { display: grid; grid-template-columns: 1fr 320px; gap: 2rem; align-items: start; }
    .table-wrap { overflow-x: auto; border-radius: 8px; }
    table { width: 100%; }
    .form-panel { padding: 1.25rem; border-radius: 12px;
      border: 1px solid var(--mat-app-outline-variant); }
    .form-panel h3 { margin: 0 0 1rem; font-size: 1rem; font-weight: 600; }
    form { display: flex; flex-direction: column; gap: 0.1rem; }
    mat-form-field { width: 100%; }
    .form-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
    @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; } }
  `]
})
export class DepartmentsComponent implements OnInit {
  private deptService = inject(DepartmentService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  departments = signal<Department[]>([]);
  editingId = signal<string | null>(null);
  cols = ['name', 'description', 'actions'];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', Validators.maxLength(500)]
  });

  ngOnInit(): void { this.load(); }

  load(): void { this.deptService.getAll().subscribe(d => this.departments.set(d)); }

  editDept(d: Department): void {
    this.editingId.set(d.id);
    this.form.patchValue({ name: d.name, description: d.description });
  }

  resetForm(): void { this.editingId.set(null); this.form.reset(); }

    onSubmit(): void {
        if (this.form.invalid) return;

        const body = this.form.value as any;

        if (this.editingId()) {

            this.deptService
                .update(this.editingId()!, body)
                .subscribe({
                    next: () => {
                        this.snack.open('Updated', 'OK', { duration: 3000 });
                        this.resetForm();
                        this.load();
                    }
                });

        } else {

            this.deptService
                .create(body)
                .subscribe({
                    next: () => {
                        this.snack.open('Created', 'OK', { duration: 3000 });
                        this.resetForm();
                        this.load();
                    }
                });

        }
    }
}
