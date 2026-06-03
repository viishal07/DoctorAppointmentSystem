import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(controlName: string, matchName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const pw = group.get(controlName)?.value;
    const confirm = group.get(matchName)?.value;
    if (pw && confirm && pw !== confirm) {
      group.get(matchName)?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  };
}
