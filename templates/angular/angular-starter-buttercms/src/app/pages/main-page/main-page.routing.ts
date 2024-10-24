import {Routes, RouterModule} from '@angular/router';
import {MainPageComponent} from './components';
import {BlogComponent} from "../blog/components";

/*const mainPageRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'landing-page',
        children: [
          {
            path: ':slug',
            component: MainPageComponent
          }
        ]
      }, {
        path: '',
        component: MainPageComponent
      }
    ]
  }
];*/

const mainPageRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':slug',
        children: [
          {
            path: ':type',
            component: MainPageComponent
          }, {
            path: '',
            component: MainPageComponent
          }
        ]
      }, {
        path: '',
        component: MainPageComponent
      }
    ]
  }
];

export const MainPageRouting = RouterModule.forChild(mainPageRoutes);
