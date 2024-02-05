import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { MENU_ICON } from '../../../../assets/svg/icons-svg';
import { CommonModule } from '@angular/common';

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
    CommonModule,
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
  encapsulation: ViewEncapsulation.None,
})
export class MenuComponent {
  //VARIABLES
  items!: MenuItem[];
  @ViewChild('sidenav') sidenav!: MatSidenav;
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
      if (routeAux.includes('student')) {
        this.items = this.menuStudent();
      } else {
        this.items = this.menuTeacher();
      }
    });
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
        label: 'Mis Módulos',
        icon: 'slack',
        routerLink: '/teachers/modules',
      },
      {
        label: 'Mis Formularios',
        icon: 'profile',
        routerLink: '/teachers/forms',
      },
    ];
  }
}
