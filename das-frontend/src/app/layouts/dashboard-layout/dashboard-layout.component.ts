import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        NavbarComponent,
        SidebarComponent,
        LoaderComponent
    ],
    template: `
    <app-loader />

    <div class="layout">
      <app-navbar (sidebarToggle)="toggleSidebar()" />

      <div class="layout__body">
        <app-sidebar [open]="sidebarOpen()" />

        @if (sidebarOpen()) {
          <div
            class="layout__overlay"
            (click)="sidebarOpen.set(false)">
          </div>
        }

        <main class="layout__main">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
    styles: [`
    .layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    .layout__body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .layout__main {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 2rem;
    }

    .layout__overlay {
      display: none;
    }

    @media (max-width: 768px) {
      .layout__main {
        padding: 1rem;
      }

      .layout__overlay {
        display: block;
        position: fixed;
        inset: 0;
        z-index: 40;
        background: rgba(0,0,0,0.4);
      }
    }
  `]
})
export class DashboardLayoutComponent {

    sidebarOpen = signal(false);

    toggleSidebar(): void {
        this.sidebarOpen.set(!this.sidebarOpen());
    }
}