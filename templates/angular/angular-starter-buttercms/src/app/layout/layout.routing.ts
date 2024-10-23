import {Routes, RouterModule} from '@angular/router';
import {LayoutComponent} from './components';
import {MainPageComponent} from "../pages/main-page/components";

const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: MainPageComponent
      },
      {
        path: 'landing-page',
        loadChildren: () => import('../pages/main-page/main-page.module').then(x => x.MainPageModule),
      }, {
        path: 'blog',
        loadChildren: () => import('../pages/blog/blog.module').then(x => x.BlogModule)
      },
    ]
  }
];
export const layoutRouting = RouterModule.forChild(layoutRoutes);
