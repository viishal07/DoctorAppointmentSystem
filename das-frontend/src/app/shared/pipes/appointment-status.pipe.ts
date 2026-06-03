import { Pipe, PipeTransform } from '@angular/core';
import { AppointmentStatus } from '../../core/models/appointment.model';

@Pipe({ name: 'appointmentStatus', standalone: true })
export class AppointmentStatusPipe implements PipeTransform {
  transform(status: AppointmentStatus): string {
    const labels: Record<AppointmentStatus, string> = {
      Pending: 'Pending Review',
      Approved: 'Approved',
      Rejected: 'Rejected',
      Completed: 'Completed',
      Cancelled: 'Cancelled'
    };
    return labels[status] ?? status;
  }
}
