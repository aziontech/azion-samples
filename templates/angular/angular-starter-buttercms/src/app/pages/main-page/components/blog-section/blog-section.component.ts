import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-blog-section',
  templateUrl: './blog-section.component.html'
})
export class BlogSectionComponent {

  @Input() posts;

  constructor(private router: Router) {
  }

  onClick(slug) {
    this.router.navigate(['blog', slug]);
  }

}
