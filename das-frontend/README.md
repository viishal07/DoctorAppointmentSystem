# Doctor Appointment System — Angular 20 Frontend

Angular 20 frontend for the DoctorAppointmentSystem ASP.NET Core 8 backend.

## Stack
- Angular 20 (standalone components, signals)
- Angular Material
- Tailwind CSS (utility classes in component styles)
- RxJS

## Quick start

```bash
npm install
ng serve
# Opens at http://localhost:4200
```

## Default admin credentials (from backend seed)
- Email: admin@das.com
- Password: Admin@123

## Environment config
Edit `src/environments/environment.ts` and set `apiUrl` to your backend URL:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  tokenKey: 'das_token',
  userKey: 'das_user'
};
```

## Architecture
```
src/app/
├── core/           # Models, services, guards, interceptors, stores (signals)
├── features/       # Auth, Admin, Doctor, Patient — each lazy-loaded
├── shared/         # Reusable components, pipes, validators
├── layouts/        # AuthLayout (centered card), DashboardLayout (sidebar)
└── app.routes.ts   # Root route tree
```

## Auth flow
1. POST /api/auth/login → receives { token, role, expiresAt }
2. AuthStore saves to localStorage, sets signals
3. roleGuard reads role signal → routes Admin/Doctor/Patient to their dashboard
4. jwtInterceptor attaches Bearer token to every protected request
5. errorInterceptor handles 401 (logout) and 403 (redirect)
