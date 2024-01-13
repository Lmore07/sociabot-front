import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TokenDecode } from '../../security/interfaces/login.interface';
import { UserType } from '../../security/enums/user-type.enum';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  const token = sessionStorage.getItem('token');
  let decoded: TokenDecode = {
    email: '',
    role: UserType.STUDENT,
  };
  if (token) {
    decoded = jwtDecode(token);
  }
  if (route.routeConfig?.path == 'login') {
    if (token) {
      if (decoded?.role == UserType.STUDENT) {
        router.navigate(['/students']);
        return false;
      } else {
        router.navigate(['/teachers']);
        return false;
      }
    } else {
      return true;
    }
  } else if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
