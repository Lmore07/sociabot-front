import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const currentDate = new Date();
    const birthDate = new Date(control.value);
    const maxDate = new Date(
      currentDate.getFullYear() - 12,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const minDate = new Date(
      currentDate.getFullYear() - 80,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (birthDate > currentDate) {
      return {
        dateRange: {
          message: 'La fecha no puede ser mayor a la actual',
        },
      };
    }

    if (birthDate > maxDate) {
      return {
        dateRange: {
          message: 'Debes tener mínimo 12 años',
        },
      };
    }

    if (birthDate < minDate) {

      return {
        dateRange: {
          message: 'La fecha no puede ser anterior a 80 años',
        },
      };
    }

    return null;
  };
}
