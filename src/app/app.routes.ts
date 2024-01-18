import { Routes } from '@angular/router';
import { LoginComponent } from './modules/security/components/login/login.component';
import { RegisterComponent } from './modules/security/components/register/register.component';
import { HomeComponent as HomeStudents } from './modules/students/components/home/home.component';
import { HomeComponent as HomeTeachers } from './modules/teachers/components/home/home.component';
import { authGuard } from './modules/shared-modules/guards/auth.guard';
import { MenuComponent } from './modules/shared-modules/shared-components/menu/menu.component';
import { roleGuard } from './modules/shared-modules/guards/role.guard';
import { CoursesComponent } from './modules/teachers/components/courses/courses.component';
import { JoinCourseComponent } from './modules/students/components/join-course/join-course.component';
import { StudentCoursesComponent } from './modules/students/components/student-courses/student-courses.component';
import { ModulesComponent } from './modules/teachers/components/modules/modules.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  {
    path: 'students',
    component: MenuComponent,
    canActivate: [authGuard, roleGuard],
    children: [
      { path: 'home', component: HomeStudents },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'courses',
        children: [
          { path: '', component: StudentCoursesComponent },
          { path: 'join', component: JoinCourseComponent },
        ],
      },
    ],
  },
  {
    path: 'teachers',
    component: MenuComponent,
    canActivate: [authGuard, roleGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeTeachers },
      { path: 'courses', component: CoursesComponent },
      { path: 'modules', component: ModulesComponent },
    ],
  },
];
