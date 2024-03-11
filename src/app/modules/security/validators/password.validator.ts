import { ValidatorFn, AbstractControl } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const hasLowerCase = /(?=.*[a-z])/;
    const hasUpperCase = /(?=.*[A-Z])/;
    const hasNumber = /(?=.*[0-9])/;
    const hasSpecialChar = /(?=.*[\'"!@#$%^&*()_/+{}.:<>?-])/;
    const isLengthValid = /.{8,20}/;

    if (!hasLowerCase.test(control.value)) {
      return {
        message: 'La contraseña debe contener al menos una letra minúscula.',
      };
    }
    if (!hasUpperCase.test(control.value)) {
      return {
        message: 'La contraseña debe contener al menos una letra mayúscula.',
      };
    }
    if (!hasNumber.test(control.value)) {
      return {
        message: 'La contraseña debe contener al menos un número.',
      };
    }
    if (!hasSpecialChar.test(control.value)) {
      return {
        message:
          'La contraseña debe contener al menos un caracter especial. (!@#$%^&*()_/+{}.:<>?-)',
      };
    }
    if (!isLengthValid.test(control.value)) {
      return {
        message: 'La contraseña debe tener entre 8 y 20 caracteres.',
      };
    }
    return null;
  };
}
