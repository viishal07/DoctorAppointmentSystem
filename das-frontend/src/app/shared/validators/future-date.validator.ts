import { AbstractControl, ValidationErrors } from '@angular/forms';

export function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return new Date(control.value) > new Date() ? null : { pastDate: true };
}
