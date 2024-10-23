import {NgModule} from '@angular/core';
import {IMPORTS, EXPORTS, SERVICES, COMPONENTS} from './index';

@NgModule({
  imports: [
    ...IMPORTS
  ],
  declarations: [
    ...COMPONENTS
  ],
  providers: [
    ...SERVICES
  ],
  exports: [
    ...EXPORTS
  ]
})
export class LayoutModule {
}
