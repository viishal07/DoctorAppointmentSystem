# Doctor Appointment System

A full-stack Doctor Appointment System for managing doctor discovery, appointment booking, availability, prescription history, and role-based administration. The application supports three main user roles: Patient, Doctor, and Admin.

The system is built with an Angular frontend and an ASP.NET Core Web API backend using a layered architecture, JWT authentication, Entity Framework Core, PostgreSQL, OTP email verification, and Gmail SMTP email delivery.

## Project Overview

Doctor Appointment System helps patients find doctors, book appointments during valid availability windows, and view prescriptions issued by doctors. Doctors can manage availability, approve or reject appointment requests, and issue prescriptions. Admins can monitor platform activity, approve doctor accounts, manage users, and view system-wide appointment data.

The project is organized into two main applications:

- `das-frontend`: Angular application for Patient, Doctor, and Admin dashboards.
- `das-backend`: ASP.NET Core solution containing API, Application, Domain, and Infrastructure projects.

## Features

- Role-based authentication for Patient, Doctor, and Admin users.
- JWT-secured API access.
- Email verification using OTP.
- Password reset using OTP.
- Gmail SMTP email delivery.
- Doctor account approval by Admin.
- Doctor profile and availability management.
- Patient doctor search and appointment booking.
- Appointment availability validation.
- Duplicate active appointment slot prevention.
- Appointment ownership authorization.
- Prescription creation and authorization.
- Doctor prescription history with persisted refresh support.
- Admin dashboard statistics.
- Admin user management and activation toggling.
- Unauthorized access page for 403 navigation.

## Tech Stack

### Frontend

- Angular 20
- Angular Material
- TypeScript
- RxJS
- Standalone Angular components
- Angular Router
- Reactive Forms

### Backend

- ASP.NET Core Web API
- .NET 8
- Entity Framework Core
- ASP.NET Core Identity
- JWT Bearer Authentication
- AutoMapper
- FluentValidation
- MailKit / MimeKit
- PostgreSQL

### Database

- PostgreSQL
- Entity Framework Core migrations

## Architecture

The backend follows a layered architecture:

```text
das-backend/
  src/
    DoctorAppointmentSystem.API
      Controllers, middleware, API configuration

    DoctorAppointmentSystem.Application
      DTOs, service interfaces, business services, validators, repository contracts

    DoctorAppointmentSystem.Domain
      Entities, enums, shared domain models

    DoctorAppointmentSystem.Infrastructure
      EF Core DbContext, repositories, Identity, JWT, email, migrations
```

The frontend is organized by feature modules:

```text
das-frontend/src/app/
  core/
    services, guards, interceptors, models, auth store

  features/
    auth, admin, doctor, patient, unauthorized

  shared/
    reusable components, pipes, validators
```

## Database Design

Core database entities include:

- `AppUser`: Identity user with role, profile information, active status, and email confirmation.
- `Patient`: Patient profile linked to an `AppUser`.
- `Doctor`: Doctor profile linked to an `AppUser`, department, approval status, qualifications, license number, and consultation fee.
- `Department`: Medical departments used for doctor categorization.
- `DoctorAvailability`: Doctor availability by day of week with start and end time.
- `Appointment`: Patient-doctor appointment record with scheduled time, reason, notes, and status.
- `Prescription`: Prescription issued by a doctor for a completed appointment.
- `OtpVerification`: OTP records for email verification and password reset.
- `Insurance`: Patient insurance information.

Important relationships:

- One `AppUser` can be a Patient or Doctor profile.
- One Doctor belongs to one Department.
- One Doctor has many Availability records.
- One Patient has many Appointments.
- One Doctor has many Appointments.
- One Appointment can have one Prescription.
- OTP records belong to an AppUser.

Appointment statuses:

- `Pending`
- `Approved`
- `Rejected`
- `Completed`
- `Cancelled`

Availability days map directly to .NET `DayOfWeek` values:

- `Sunday = 0`
- `Monday = 1`
- `Tuesday = 2`
- `Wednesday = 3`
- `Thursday = 4`
- `Friday = 5`
- `Saturday = 6`

## Authentication Flow

1. User registers as Patient or Doctor.
2. Backend creates an Identity user and role-specific profile.
3. Backend generates an OTP and sends it through Gmail SMTP.
4. User verifies email with OTP.
5. Login is blocked until email verification is complete.
6. Doctor login is also blocked until Admin approval is complete.
7. On successful login, backend returns a JWT token and role information.
8. Angular stores authentication state and routes the user to the correct dashboard.
9. API requests include the JWT token through an HTTP interceptor.
10. Role guards and backend authorization protect restricted routes and endpoints.

## Doctor Workflow

1. Register as a Doctor.
2. Verify email using OTP.
3. Wait for Admin approval.
4. Log in after approval.
5. Complete or update doctor profile.
6. Set weekly availability.
7. View patient appointment requests.
8. Approve, reject, or cancel appointments.
9. Issue prescriptions for approved appointments.
10. View persisted prescription history.

## Patient Workflow

1. Register as a Patient.
2. Verify email using OTP.
3. Log in after verification.
4. Search for approved doctors.
5. View doctor profile and available hours.
6. Book appointments only within doctor availability.
7. View appointment history and statuses.
8. Cancel eligible appointments.
9. View prescriptions issued by doctors.

## Admin Workflow

1. Log in with Admin credentials.
2. View dashboard statistics.
3. Review pending doctor approvals.
4. Approve doctor accounts.
5. View and manage users.
6. Toggle user active status.
7. View all appointments in the system.

## API Modules

Main API areas:

- `Auth`: registration, login, OTP verification, forgot password, reset password.
- `Admin`: dashboard statistics, users, doctor approvals, all appointments.
- `Appointments`: booking, appointment lookup, doctor appointments, patient appointments, approval, rejection, cancellation.
- `Availability`: doctor availability creation/update and public doctor availability lookup.
- `Doctors`: doctor profiles and doctor search.
- `Patients`: patient profiles.
- `Departments`: department lookup and management.
- `Prescriptions`: create prescription, prescription lookup, patient prescriptions, doctor prescription history.

## Installation Guide

### Prerequisites

- .NET 8 SDK
- Node.js and npm
- Angular CLI
- PostgreSQL database
- Gmail account with an app password for SMTP

### Backend Setup

```bash
cd das-backend
dotnet restore
dotnet build DoctorAppointmentSystem.sln
```

Apply migrations:

```bash
dotnet ef database update --project src/DoctorAppointmentSystem.Infrastructure --startup-project src/DoctorAppointmentSystem.API
```

Run the API:

```bash
dotnet run --project src/DoctorAppointmentSystem.API
```

### Frontend Setup

```bash
cd das-frontend
npm install
npm run build
npm start
```

The frontend will run through Angular development server, usually at:

```text
http://localhost:4200
```

## Environment Variables

Configure these values in `appsettings.json`, user secrets, or environment-specific configuration.

### Connection Strings

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=<host>;Port=5432;Database=<database>;Username=<username>;Password=<password>;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

### JWT Settings

```json
{
  "JwtSettings": {
    "SecretKey": "<minimum-32-character-secret>",
    "Issuer": "DoctorAppointmentSystem",
    "Audience": "DoctorAppointmentSystem",
    "ExpiryInMinutes": "60"
  }
}
```

### Email Settings

```json
{
  "EmailSettings": {
    "Host": "smtp.gmail.com",
    "Port": "587",
    "SenderName": "DoctorAppointmentSystem",
    "SenderEmail": "<gmail-address>",
    "Username": "<gmail-address>",
    "Password": "<gmail-app-password>"
  }
}
```

### Default Admin

```json
{
  "DefaultAdmin": {
    "Email": "<admin-email>",
    "Password": "<admin-password>"
  }
}
```

## Future Enhancements

- Appointment rescheduling.
- Calendar view for doctors and patients.
- Real-time appointment notifications.
- Video consultation support.
- Payment gateway integration.
- Prescription PDF export.
- Doctor ratings and reviews.
- Patient medical history timeline.
- Multi-clinic or hospital support.
- Configurable clinic timezone per doctor or facility.
- Admin analytics with charts and trends.
- Automated appointment reminders through email or SMS.
- Audit logging for sensitive admin actions.
