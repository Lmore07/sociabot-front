import { ValidatorFn, AbstractControl } from '@angular/forms';
import { UserType } from '../enums/user-type.enum';

export function roleUserValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    if (!Object.values(UserType).includes(control.value)) {
      return {
        userType: {
          valid: false,
        },
      };
    }
    return null;
  };
}
