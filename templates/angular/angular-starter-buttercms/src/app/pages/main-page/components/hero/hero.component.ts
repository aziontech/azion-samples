import {Component, Input} from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-hero',
  templateUrl: './hero.component.html'
})
export class HeroComponent {
  @Input() fields;

  constructor() {
  }

}
