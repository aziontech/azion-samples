import {NgModule} from '@angular/core';
import {COMPONENTS, IMPORTS, SERVICES, EXPORTS} from '.';

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    ...IMPORTS
  ],
  providers: [
    ...SERVICES
  ],
  exports: [
    ...EXPORTS
  ]
})
export class NotFoundModule {
}
