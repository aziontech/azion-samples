import {Component, Input} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-features',
  templateUrl: './features.component.html'
})
export class FeaturesComponent {
  @Input() fields;

  constructor() {
  }
}
