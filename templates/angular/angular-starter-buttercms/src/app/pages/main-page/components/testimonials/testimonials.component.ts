import {AfterViewInit, Component, Input} from '@angular/core';
import {tns} from 'tiny-slider';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html'
})
export class TestimonialsComponent implements AfterViewInit {

  @Input() fields;

  constructor() {
  }

  ngAfterViewInit(): void {
    tns({
      container: '.testimonial-active',
      autoplay: true,
      autoplayTimeout: 5000,
      autoplayButtonOutput: false,
      mouseDrag: true,
      gutter: 0,
      nav: false,
      navPosition: 'bottom',
      controls: true,
      controlsText: [
        '<i class="lni lni-chevron-left"></i>',
        '<i class="lni lni-chevron-right"></i>',
      ],
      items: 1,
    });
  }

}
