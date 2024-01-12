import { Routes } from '@angular/router';
import { LoginComponent } from './modules/security/components/login/login.component';
import { RegisterComponent } from './modules/security/components/register/register.component';
import { HomeComponent } from './modules/students/components/home/home.component';
import { authGuard } from './modules/shared-modules/shared-guards/auth.guard';
import { MenuComponent } from './modules/students/components/menu/menu.component';

export const routes: Routes = [
  { path: '', redirectTo: 'students', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  {
    path: 'students',
    component: MenuComponent,
    //canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
