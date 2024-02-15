import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TokenDecode } from '../../modules/security/interfaces/login.interface';
import { UserType } from '../../modules/security/enums/user-type.enum';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  let document= inject(DOCUMENT);
  const sessionStorage = document.defaultView?.sessionStorage;
  console.log(sessionStorage);
  let router = inject(Router);
  const token = sessionStorage?.getItem('token');
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
