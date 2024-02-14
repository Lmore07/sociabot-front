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
  SlackOutline,
  BarChartOutline,
  CloseCircleFill,
  ProfileFill,
  HomeFill,
  MinusCircleOutline,
  MinusCircleFill,
  PlusCircleOutline,
  PlusOutline,
} from '@ant-design/icons-angular/icons';
import { NzIconModule } from 'ng-zorro-antd/icon';

const icons = [
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
  MinusCircleOutline,
  MinusCircleFill,
  PlusCircleOutline,
  PlusOutline
];

export function provideNzIcons() {
  return importProvidersFrom(NzIconModule.forRoot(icons));
}
