import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { AdminService } from '../../../core/services/admin.service';
import { UserList } from '../../../core/models/admin.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatChipsModule,
    PageHeaderComponent, EmptyStateComponent],
  template: `
    <app-page-header title="Users" subtitle="All registered users in the system" />
    @if (users().length > 0) {
      <div class="table-wrap">
        <table mat-table [dataSource]="users()" class="mat-elevation-z1">
          <ng-container matColumnDef="fullName">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let u">{{ u.fullName }}</td>
          </ng-container>
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let u">{{ u.email }}</td>
          </ng-container>
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef>Role</th>
            <td mat-cell *matCellDef="let u">
              <mat-chip [class]="'chip--' + u.role.toLowerCase()">{{ u.role }}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let u">
              <span [class]="u.isActive ? 'badge badge--active' : 'badge badge--inactive'">
                {{ u.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let u">
              <button mat-stroked-button [color]="u.isActive ? 'warn' : 'primary'"
                      (click)="toggleStatus(u)">
                {{ u.isActive ? 'Deactivate' : 'Activate' }}
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
      </div>
    } @else {
      <app-empty-state message="No users found" icon="ti-users" />
    }
  `,
  styles: [`
    .table-wrap { overflow-x: auto; border-radius: 8px; }
    table { width: 100%; }
    .badge { padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 500; }
    .badge--active { background: #d1fae5; color: #065f46; }
    .badge--inactive { background: #fee2e2; color: #991b1b; }
  `]
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private snack = inject(MatSnackBar);

  users = signal<UserList[]>([]);
  cols = ['fullName', 'email', 'role', 'status', 'actions'];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminService.getUsers().subscribe(u => this.users.set(u));
  }

  toggleStatus(user: UserList): void {
    this.adminService.toggleUserStatus(user.id).subscribe({
      next: (msg) => { this.snack.open(msg, 'OK', { duration: 3000 }); this.load(); }
    });
  }
}
