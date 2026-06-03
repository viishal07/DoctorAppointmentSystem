import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthStore } from '../../../core/stores/auth.store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar class="navbar">
      <button mat-icon-button (click)="sidebarToggle.emit()" aria-label="Toggle sidebar">
        <i class="ti ti-menu-2" aria-hidden="true"></i>
      </button>
      <span class="navbar__brand">
        <i class="ti ti-stethoscope" aria-hidden="true"></i>
        DoctorApp
      </span>
      <span class="spacer"></span>
      <div class="navbar__user" [matMenuTriggerFor]="userMenu">
        <div class="navbar__avatar">
          {{ auth.fullName().charAt(0).toUpperCase() }}
        </div>
        <div class="navbar__info">
          <span class="navbar__name">{{ auth.fullName() }}</span>
          <span class="navbar__role">{{ auth.userRole() }}</span>
        </div>
        <i class="ti ti-chevron-down" aria-hidden="true"></i>
      </div>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="auth.logout()">
          <i class="ti ti-logout" aria-hidden="true"></i>
          Sign out
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar { position: sticky; top: 0; z-index: 100;
      border-bottom: 1px solid var(--mat-app-outline-variant); gap: 0.5rem; }
    .navbar__brand { display: flex; align-items: center; gap: 0.4rem; font-weight: 600;
      font-size: 1.1rem; color: #0284c7; }
    .spacer { flex: 1; }
    .navbar__user { display: flex; align-items: center; gap: 0.5rem; cursor: pointer;
      padding: 0.25rem 0.5rem; border-radius: 8px; }
    .navbar__user:hover { background: var(--mat-app-surface-variant); }
    .navbar__avatar { width: 32px; height: 32px; border-radius: 50%;
      background: #0284c7; color: #fff; display: flex; align-items: center;
      justify-content: center; font-weight: 600; font-size: 0.85rem; flex-shrink: 0; }
    .navbar__info { display: flex; flex-direction: column; }
    .navbar__name { font-size: 0.85rem; font-weight: 500; line-height: 1.2; }
    .navbar__role { font-size: 0.7rem; opacity: 0.55; }
    @media (max-width: 600px) { .navbar__info { display: none; } }
  `]
})
export class NavbarComponent {
  auth = inject(AuthStore);
  sidebarToggle = output<void>();
}
