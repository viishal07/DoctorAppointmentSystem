import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-layout">
      <div class="auth-layout__brand">
        <i class="ti ti-stethoscope" aria-hidden="true"></i>
        <h1>Doctor Appointment System</h1>
        <p>Quality healthcare, one appointment at a time.</p>
      </div>
      <div class="auth-layout__card">
        <router-outlet />
      </div>
    </div>
  `,
  styles: [`
    .auth-layout { min-height: 100vh; display: flex; align-items: center;
      justify-content: center; padding: 2rem; gap: 4rem;
      background: linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%); }
    .auth-layout__brand { color: #fff; max-width: 360px; flex-shrink: 0; }
    .auth-layout__brand .ti { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .auth-layout__brand h1 { font-size: 1.75rem; font-weight: 700; margin: 0 0 0.5rem; }
    .auth-layout__brand p { opacity: 0.75; font-size: 1rem; margin: 0; }
    .auth-layout__card { background: #fff; border-radius: 16px; padding: 2.5rem;
      width: 100%; max-width: 460px; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }
    @media (max-width: 768px) {
      .auth-layout { flex-direction: column; gap: 2rem; padding: 1.5rem; }
      .auth-layout__brand { text-align: center; }
      .auth-layout__card { padding: 1.75rem; }
    }
  `]
})
export class AuthLayoutComponent {}
