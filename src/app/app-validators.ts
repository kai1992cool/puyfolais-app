import { AbstractControl, ValidatorFn } from '@angular/forms';

export function numericValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = !isNaN(Number(control.value));
    return isValid ? null : { 'notNumeric': { value: control.value } };
  };
}
