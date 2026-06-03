import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../core/stores/auth.store';

interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  template: `
    <nav class="sidebar" [class.sidebar--open]="open()">
      <ul class="sidebar__nav">
        @for (item of navItems(); track item.route) {
          <li>
            <a [routerLink]="item.route" routerLinkActive="active"
               class="sidebar__link" (click)="closeSidebar()">
              <i [class]="'ti ' + item.icon" aria-hidden="true"></i>
              <span>{{ item.label }}</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: [`
    .sidebar { width: 230px; height: 100%; padding: 1rem 0.5rem;
      border-right: 1px solid var(--mat-app-outline-variant); overflow-y: auto; }
    .sidebar__nav { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.2rem; }
    .sidebar__link { display: flex; align-items: center; gap: 0.75rem; padding: 0.65rem 0.85rem;
      border-radius: 8px; text-decoration: none; font-size: 0.9rem; color: inherit;
      transition: background 0.15s; }
    .sidebar__link:hover { background: var(--mat-app-surface-variant); }
    .sidebar__link.active { background: #e0f2fe; color: #0284c7; font-weight: 500; }
    .ti { font-size: 1.1rem; width: 1.25rem; flex-shrink: 0; }
    @media (max-width: 768px) {
      .sidebar { position: fixed; left: 0; top: 64px; bottom: 0; z-index: 50;
        background: var(--mat-app-background); transform: translateX(-100%); transition: transform 0.25s; }
      .sidebar--open { transform: translateX(0); }
    }
  `]
})
export class SidebarComponent {
  open = input<boolean>(false);
  closeSidebar = () => {};
  auth = inject(AuthStore);

  get navItems(): () => NavItem[] {
    const role = this.auth.userRole();
    const items: Record<string, NavItem[]> = {
      Admin: [
        { label: 'Dashboard', icon: 'ti-dashboard', route: '/admin/dashboard' },
        { label: 'Users', icon: 'ti-users', route: '/admin/users' },
        { label: 'Approve Doctors', icon: 'ti-user-check', route: '/admin/pending-doctors' },
        { label: 'Appointments', icon: 'ti-calendar', route: '/admin/all-appointments' },
        { label: 'Departments', icon: 'ti-building-hospital', route: '/admin/departments' }
      ],
      Doctor: [
        { label: 'Dashboard', icon: 'ti-dashboard', route: '/doctor/dashboard' },
        { label: 'My Profile', icon: 'ti-user', route: '/doctor/profile' },
        { label: 'Availability', icon: 'ti-clock', route: '/doctor/availability' },
        { label: 'Appointments', icon: 'ti-calendar', route: '/doctor/appointments' },
        { label: 'Prescriptions', icon: 'ti-prescription', route: '/doctor/issue-prescription' }
      ],
      Patient: [
        { label: 'Dashboard', icon: 'ti-dashboard', route: '/patient/dashboard' },
        { label: 'Search Doctors', icon: 'ti-search', route: '/patient/search-doctors' },
        { label: 'Book Appointment', icon: 'ti-calendar-plus', route: '/patient/book-appointment' },
        { label: 'My Appointments', icon: 'ti-calendar', route: '/patient/appointments' },
        { label: 'Prescriptions', icon: 'ti-prescription', route: '/patient/prescriptions' }
      ]
    };
    const result = items[role ?? ''] ?? [];
    return () => result;
  }
}
