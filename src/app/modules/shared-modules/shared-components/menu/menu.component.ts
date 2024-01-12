import { Component, ViewChild } from '@angular/core';
import { MENU_ICON } from '../../../../../assets/svg/icons-svg';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MenuItem } from 'primeng/api';
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
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Bookmark',
                icon: 'pi pi-fw pi-bookmark',
              },
              {
                label: 'Video',
                icon: 'pi pi-fw pi-video',
              },
            ],
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link',
          },
        ],
      },
      {
        label: 'Users',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-user-plus',
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus',
          },
        ],
      },
      {
        label: 'Events',
        icon: 'pi pi-fw pi-calendar',
        items: [
          {
            label: 'Edit',
            icon: 'pi pi-fw pi-pencil',
            items: [
              {
                label: 'Save',
                icon: 'pi pi-fw pi-calendar-plus',
              },
              {
                label: 'Delete',
                icon: 'pi pi-fw pi-calendar-minus',
              },
            ],
          },
          {
            label: 'Archieve',
            icon: 'pi pi-fw pi-calendar-times',
            items: [
              {
                label: 'Remove',
                icon: 'pi pi-fw pi-calendar-minus',
              },
            ],
          },
        ],
      },
    ];
  }

  menuTeacher() {
    return [];
  }
}
