import {Routes, RouterModule} from '@angular/router';
import {BlogComponent} from './components';

const blogRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':type',
        children: [
          {
            path: ':slug',
            component: BlogComponent
          }, {
            path: '',
            component: BlogComponent
          }
        ]
      }, {
        path: '',
        component: BlogComponent
      }
    ]
  }
];

export const BlogRouting = RouterModule.forChild(blogRoutes);
