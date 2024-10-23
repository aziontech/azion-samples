import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from './pages/not-found/components';

const mainRoutes: Routes = [
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

export const appRouting = RouterModule.forRoot(mainRoutes);
