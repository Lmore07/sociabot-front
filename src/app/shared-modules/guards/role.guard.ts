import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserType } from '../../modules/security/enums/user-type.enum';
import { TokenDecode } from '../../modules/security/interfaces/login.interface';

export const roleGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  const token = sessionStorage.getItem('token');
  let decoded: TokenDecode = {
    email: '',
    role: UserType.STUDENT,
  };
  if (token) {
    decoded = jwtDecode(token);
  }

  if (route.url[0].path === 'teachers' && decoded.role == UserType.STUDENT) {
    router.navigate(['students']);
    return false;
  }

  if (route.url[0].path === 'students' && decoded.role == UserType.TEACHER) {
    router.navigate(['teachers']);
    return false;
  }

  return true;
};
