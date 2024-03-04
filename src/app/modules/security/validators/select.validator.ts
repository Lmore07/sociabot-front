import { AbstractControl, ValidatorFn } from '@angular/forms';

export function selectValidator(array: any[]): ValidatorFn {
  return (control: AbstractControl) => {
    if (array.includes(control.value)) {
      return null;
    } else {
      return {
        select: {
          message: 'Seleccione una opción válida de las indicadas',
        },
      };
    }
    return null;
  };
}
