import { AbstractControl, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const currentDate = new Date();
    const birthDate = new Date(control.value);

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
