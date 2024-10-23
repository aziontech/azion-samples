import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {appRouting} from './app.routing';
import {LayoutModule} from './layout/layout.module';
import {NotFoundModule} from './pages/not-found/not-found.module';

export const COMPONENTS = [
  AppComponent
];

export const IMPORTS = [
  BrowserModule,
  BrowserAnimationsModule,
  appRouting,
  LayoutModule,
  NotFoundModule
];

export const SERVICES = [];
