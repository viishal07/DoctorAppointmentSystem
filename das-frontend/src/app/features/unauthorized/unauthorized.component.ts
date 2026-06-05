import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  template: `
    <main class="unauthorized">
      <section class="unauthorized__panel" aria-labelledby="unauthorized-title">
        <div class="unauthorized__code">403</div>
        <h1 id="unauthorized-title">Access denied</h1>
        <p>You do not have permission to view this page.</p>
        <a mat-flat-button color="primary" routerLink="/auth/login">Go to login</a>
      </section>
    </main>
  `,
  styles: [`
    .unauthorized {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem;
      background: #f6f8fb;
    }

    .unauthorized__panel {
      width: min(100%, 420px);
      padding: 2rem;
      border: 1px solid #d9e1ec;
      border-radius: 8px;
      background: #fff;
      text-align: center;
      box-shadow: 0 12px 28px rgba(22, 34, 51, 0.08);
    }

    .unauthorized__code {
      font-size: 3rem;
      font-weight: 700;
      line-height: 1;
      color: #b42318;
      margin-bottom: 0.75rem;
    }

    h1 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      color: #1f2937;
    }

    p {
      margin: 0 0 1.5rem;
      color: #5b6472;
    }
  `]
})
export class UnauthorizedComponent {}
