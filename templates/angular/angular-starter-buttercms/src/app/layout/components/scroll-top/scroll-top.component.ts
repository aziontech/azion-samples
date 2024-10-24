import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html'
})
export class ScrollTopComponent {

  private isVisible = false;

  constructor() {
    this.onScroll();
  }

  getStyle() {
    return {
      display: this.isVisible ? 'flex' : 'none'
    };
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    this.isVisible = document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;
  }

}
