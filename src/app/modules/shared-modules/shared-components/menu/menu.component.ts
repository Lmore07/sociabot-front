import { NzLayoutModule, NzSiderComponent } from 'ng-zorro-antd/layout';
import { Component, ViewChild } from '@angular/core';
import { MENU_ICON } from '../../../../../assets/svg/icons-svg';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserType } from '../../../security/enums/user-type.enum';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    NzFlexModule,
    NzAvatarModule,
    NzButtonModule,
    NzDropDownModule,
    AvatarModule,
    ButtonModule,
    PanelMenuModule,
    NzIconModule,
    MatToolbarModule,
    NzMenuModule,
    MatIconModule,
    NzLayoutModule,
    SidebarModule,
    MatSidenavModule,
  ],
  providers: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  //VARIABLES
  items!: MenuItem[];
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menuType!: UserType;
  isCollapsed: boolean = false;

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

  closeSession() {
    sessionStorage.clear();
    location.reload();
  }

  menuStudent() {
    return [
      {
        label: 'Cursos',
        icon: 'file',
        routerLink: '/students/courses',
        items: [
          {
            label: 'Ver',
            icon: 'eye',
            routerLink: '/students/courses',
          },
          {
            label: 'Nuevo',
            icon: 'plus',
            routerLink: '/students/courses/join',
          },
          {
            label: 'Lecciones',
            icon: 'book',
          },
        ],
      },
      {
        label: 'Perfil',
        icon: 'user',
      },
      {
        label: 'Progresos',
        icon: 'bar-chart',
      },
    ];
  }

  menuTeacher() {
    return [
      {
        label: 'Inicio',
        icon: 'home',
        routerLink: '/teachers/home',
      },
      {
        label: 'Mis Cursos',
        icon: 'book',
        routerLink: '/teachers/courses',
      },
      {
        label: 'Mis módulos',
        icon: 'slack',
        routerLink: '/teachers/modules',
      },
    ];
  }
}
