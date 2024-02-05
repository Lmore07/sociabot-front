import { importProvidersFrom } from '@angular/core';
import {
  MenuFoldOutline,
  MenuUnfoldOutline,
  FormOutline,
  DashboardOutline,
  UserOutline,
  SignalFill,
  BookOutline,
  EyeOutline,
  HomeOutline,
  SlackOutline,
  BarChartOutline,
  CloseCircleFill,
  ProfileOutline,
  ProfileFill,
  HomeFill,
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
  MenuFoldOutline,
  MenuUnfoldOutline,
  DashboardOutline,
  SignalFill,
  FormOutline,
  UserOutline,
  CloseCircleFill,
  BookOutline,
  HomeFill,
  SlackOutline,
  BarChartOutline,
  EyeOutline,
  ProfileFill,
];

export function provideNzIcons() {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
