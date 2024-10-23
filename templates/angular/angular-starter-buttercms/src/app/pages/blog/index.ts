import {SharedModule} from '../../shared/shared.module';
import {BlogRouting} from './blog.routing';
import {BlogComponent, CategoriesComponent, SearchComponent} from './components';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

export const COMPONENTS = [
  BlogComponent,
  CategoriesComponent,
  SearchComponent
];

export const IMPORTS = [
  BlogRouting,
  SharedModule,
  FormsModule,
  ReactiveFormsModule
];

export const SERVICES = [];

export const EXPORTS = [];
