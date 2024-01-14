import { Routes } from '@angular/router';
import { LoginComponent } from './modules/security/components/login/login.component';
import { RegisterComponent } from './modules/security/components/register/register.component';
import { HomeComponent } from './modules/students/components/home/home.component';
import { authGuard } from './modules/shared-modules/guards/auth.guard';
import { MenuComponent } from './modules/shared-modules/shared-components/menu/menu.component';
import { roleGuard } from './modules/shared-modules/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  {
    path: 'students',
    component: MenuComponent,
    canActivate: [authGuard, roleGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
  {
    path: 'teachers',
    component: MenuComponent,
    canActivate: [authGuard, roleGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];