import {
  BlogSectionComponent,
  FeaturesComponent,
  HeroComponent,
  MainPageComponent,
  TestimonialsComponent,
  TwoColumnWithImageComponent
} from './components';
import {MainPageRouting} from './main-page.routing';
import {SharedModule} from '../../shared/shared.module';

export const COMPONENTS = [
  MainPageComponent,
  HeroComponent,
  TwoColumnWithImageComponent,
  FeaturesComponent,
  TestimonialsComponent,
  BlogSectionComponent
];

export const IMPORTS = [
  MainPageRouting,
  SharedModule
];

export const SERVICES = [];

export const EXPORTS = [];
