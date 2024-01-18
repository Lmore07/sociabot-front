import { Component, ViewChild } from '@angular/core';
import { MENU_ICON } from '../../../../../assets/svg/icons-svg';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { ActivatedRoute, RouterOutlet, UrlSegment } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserType } from '../../../security/enums/user-type.enum';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    AvatarModule,
    ButtonModule,
    PanelMenuModule,
    MatToolbarModule,
    MatIconModule,
    SidebarModule,
    MatSidenavModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  //VARIABLES
  items!: MenuItem[];
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menuType!: UserType;

  constructor(
    public iconRegistry: MatIconRegistry,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
    this.registerIcons();
    this.assignMenuByType();
  }

  assignMenuByType() {
    this.route.url.subscribe((url) => {
      const routeAux = url.map((seg) => seg.path).join('/');
      console.log(routeAux);
      if (routeAux.includes('student')) {
        this.menuType = UserType.STUDENT;
        this.items = this.menuStudent();
      } else {
        this.menuType = UserType.TEACHER;
        this.items = this.menuTeacher();
      }
    });
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }

  registerIcons() {
    this.iconRegistry.addSvgIconLiteral(
      'iconMenu',
      this.sanitizer.bypassSecurityTrustHtml(MENU_ICON)
    );
  }

  menuStudent() {
    return [
      {
        label: 'Cursos',
        icon: 'pi pi-fw pi-file',
        routerLink: '/students/courses',
        items: [
          {
            label: 'Ver',
            icon: 'pi pi-fw pi-eye',
            routerLink: '/students/courses',
          },
          {
            label: 'Nuevo',
            icon: 'pi pi-fw pi-plus',
            routerLink: '/students/courses/join',
          },
          {
            label: 'Lecciones',
            icon: 'pi pi-fw pi-book',
          },
        ],
      },
      {
        label: 'Perfil',
        icon: 'pi pi-fw pi-user',
      },
      {
        label: 'Progresos',
        icon: 'pi pi-fw pi-chart-line',
      },
    ];
  }

  menuTeacher() {
    return [
      {
        label: 'Inicio',
        icon: PrimeIcons.HOME,
        routerLink: '/teachers/home',
      },
      {
        label: 'Mis Cursos',
        icon: PrimeIcons.BOOK,
        routerLink: '/teachers/courses',
      },
      {
        label: 'Mis módulos',
        icon: PrimeIcons.SLACK,
        routerLink: '/teachers/modules',
      },
    ];
  }
}
