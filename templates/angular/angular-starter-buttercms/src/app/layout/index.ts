import {layoutRouting} from './layout.routing';
import {FooterComponent, HeaderComponent, LayoutComponent, NoApiTokenComponent, ScrollTopComponent} from './components';
import {CommonModule} from '@angular/common';

export const COMPONENTS = [
  LayoutComponent,
  HeaderComponent,
  FooterComponent,
  ScrollTopComponent,
  NoApiTokenComponent
];

export const IMPORTS = [
  layoutRouting,
  CommonModule
];

export const SERVICES = [];

export const EXPORTS = [];
