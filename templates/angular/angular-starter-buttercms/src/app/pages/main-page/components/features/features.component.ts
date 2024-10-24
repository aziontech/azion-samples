import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html'
})
export class FeaturesComponent {
  @Input() fields;

  constructor() {
  }
}
